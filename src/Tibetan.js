/**
 * This program implements Tibetan calendar calculations, including conversions
 * to and from the Gregorian calendar and Julian Day Numbers. The algorithms
 * and formulas used are primarily based on the work "Tibetan calendar mathematics"
 * by Svante Janson.
 *
 * Reference:
 * Svante Janson, "Tibetan calendar mathematics" (2007, revised 2014)
 * Available at: https://www2.math.uu.se/~svantejs/papers/calendars/tibet.pdf
 *
 * The implementation covers the Phugpa version of the Tibetan calendar
 * as detailed in the paper and includes variations for Bhutanese and
 * Mongolian calendars, which are derived from similar calendrical principles.
 *
 * Users of this code are encouraged to consult the aforementioned paper for a
 * detailed understanding of the underlying mathematics and astronomical models.
 */
import { julian } from 'astronomia'

// prevent rounding errors
function toFixed (val, e) {
  return parseFloat(val.toFixed(e), 10)
}

export default class CalendarTibetan {
  /**
   * constructor
   *
   * @param {Number|Array|Object} cycle - tibetan 60 year cicle; if `{Array}` than `[cycle, year, ..., leapDay]`
   * @param {Number} year - tibetan year of cycle
   * @param {Number} month - tibetan month
   * @param {Boolean} leapMonth - `true` if leap month
   * @param {Number} day - tibetan day
   * @param {Boolean} leapDay - `true` if leap day
   */
  constructor (cycle, year, month, leapMonth, day, leapDay) {
    // Epoch constants for Phugpa E806 (Year 806, Month 3)
    this._M0 = 2015501 + 4783 / 5656
    this._M1 = 167025 / 5656
    this._M2 = 11135 / 11312

    this._S0 = 743 / 804
    this._S1 = 65 / 804
    this._S2 = 13 / 4824

    this._A0 = 475 / 3528
    this._A1 = 253 / 3528
    this._A2 = 1 / 28

    this._P0 = 139 / 180

    this._EPOCH_YEAR = 806

    // Timezone offset for Lhasa Mean Time (LMT)
    this._JD_OFFSET_STD_TIME = (6 + 4 / 60) / 24
    // Offset between Julian day start and Tibetan day start
    this._JD_OFFSET_DAY_START = (-5 + 12) / 24

    // Flag for Bhutanese leap month rule variation
    this._IS_BHUTAN_LEAP = false
    
    // start of first rab byung cycle
    this._EPOCH_RAB_BYUNG = 1027

    // Tables for moon and sun equations
    this._moon_tab_values = [0, 5, 10, 15, 19, 22, 24, 25] // for 0..7
    this._sun_tab_values = [0, 6, 10, 11] // for 0..3

    this.set(cycle, year, month, leapMonth, day, leapDay)
  }

  /**
   * set a new tibetan date
   *
   * @param {Number|Array|Object} cycle - tibetan 60 year cicle; if `{Array}` than `[cycle, year, ..., leapDay]`
   * @param {Number} year - tibetan year of cycle
   * @param {Number} month - tibetan month
   * @param {Boolean} leapMonth - `true` if leap month
   * @param {Number} day - tibetan day
   * @param {Boolean} leapDay - `true` if leap day
   */
  set (cycle, year, month, leapMonth, day, leapDay) {
    if (cycle instanceof CalendarTibetan) {
      this.cycle = cycle.cycle
      this.year = cycle.year
      this.month = cycle.month
      this.leapMonth = !!cycle.leapMonth // ensure boolean
      this.day = cycle.day
      this.leapDay = !!cycle.leapDay // ensure boolean
    } else if (Array.isArray(cycle)) {
      this.cycle = cycle[0]
      this.year = cycle[1]
      this.month = cycle[2]
      this.leapMonth = !!cycle[3]
      this.day = cycle[4]
      this.leapDay = !!cycle[5]
    } else {
      this.cycle = cycle
      this.year = year
      this.month = month
      this.leapMonth = !!leapMonth
      this.day = day
      this.leapDay = !!leapDay
    }
    return this
  }

  /**
   * Returns Tibetan date components as an array.
   * @returns {Array<Number|Boolean>} [cycle, year, month, leapMonth, day, leapDay]
   */
  get () {
    return [this.cycle, this.year, this.month, this.leapMonth, this.day, this.leapDay]
  }

  _jdToJdLocal (jd) {
    return jd + this._JD_OFFSET_STD_TIME + this._JD_OFFSET_DAY_START
  }
  _jdLocalToJd (jdLocal) {
    return jdLocal - this._JD_OFFSET_STD_TIME - this._JD_OFFSET_DAY_START
  }

  /**
   * Calculate Alpha, an intermediate value for leap month calculations. (Eq C.12)
   * @private
   * @returns {Number}
   */
  _getAlpha() {
    return 12 * (this._S0 - this._P0);
  }

  /**
   * Calculate Beta, another intermediate value for leap month calculations.
   * The adjustment `(this._IS_BHUTAN_LEAP ? 2 : 0)`
   * handles the specific Bhutanese leap month rule. (Eq C.19, C.58)
   * @private
   * @returns {Number}
   */
  _getBeta() {
    const alpha = this._getAlpha();
    return Math.ceil(67 * alpha) - (this._IS_BHUTAN_LEAP ? 2 : 0);
  }

  /**
   * get Gregorian year from tibetan cycle / year
   * @return {Number} year
   */
  _getGregorianYear () {
    return this._EPOCH_RAB_BYUNG + (this.cycle - 1) * 60 + (this.year - 1);
  }

  /**
   * get tibetan cycle / year from Gregorian year
   * @returns {Object} { cycle, year }
   */
  epochCycleFromYear (gyear) {
    const cycle = Math.floor((gyear - this._EPOCH_RAB_BYUNG) / 60) + 1
    const year = ((gyear - this._EPOCH_RAB_BYUNG) % 60) + 1
    return {cycle, year}
  }

  /**
   * Get true month count (n) from Tibetan Year, Month, and LeapMonth status.
   */
  _getTrueMonthCount (gyear) {
    const Y = (gyear ? gyear : this._getGregorianYear());
    const M = this.month
    const leapMonth = this.leapMonth
    const alpha = this._getAlpha()
    const M_prime = 12 * (Y - this._EPOCH_YEAR) + M
    const n = Math.floor((67 * (M_prime - alpha)) / 65) // Eq C.25
    if (this._isLeapMonthFromYearAndMonth(Y, M) && leapMonth) {
      return n + (this._IS_BHUTAN_LEAP ? 1 : -1)
    }
    return n
  }

  /**
   * Checks if the month corresponding to a trueMonthCount is a leap month.
   *
   * @return {Boolean} true if it's a leap month
   */
  _isLeapMonthFromYearAndMonth (year, month) {
    const Y = year
    const M = month
    const beta = this._getBeta()
    const M_prime = 12 * (Y - this._EPOCH_YEAR) + M
    const mod_65_val = (M_prime * 2 - beta) % 65
    return (mod_65_val == 0 || mod_65_val == 1) // Eq C.27
  }

  /**
   * Get Tibetan Year, Month, and LeapMonth status from true month count (n).
   *
   * @param {Number} n - true month count
   * @returns {Object} { year, month, isLeap }
   */
  _getTibetanMonthFromTrueMonthCount (trueMonthCount) {
    const n = trueMonthCount
    const beta = this._getBeta()
    const x = Math.ceil((65 * n + beta) / 67) // Eq. C.59
    let M = x % 12
    if (M == 0) M = 12
    const Y = (x - M) / 12 + this._EPOCH_YEAR
    let L = false
    let leapX = Math.ceil((65 * (this._IS_BHUTAN_LEAP ? n-1 : n+1) + beta) / 67)
    if (x == leapX) {
      L = true
    }
    const { cycle, year } = this.epochCycleFromYear(Y);
    return {cycle, year, month: M, leapMonth: L};
  }

  /**
   * Helper to interpolate values from a table with symmetry.
   * tableValues: array of values for indices [0, ..., tableValues.length-1]
   * x_in: input value
   * halfSymmetryLen: e.g., 7 for moon (table covers 0-7, symmetric up to 14)
   * e.g., 3 for sun (table covers 0-3, symmetric up to 6)
   * periodLen: full period, e.g., 28 for moon, 12 for sun
   */
  _linearInterpolate (x_in, tableValues, halfSymmetryLen, periodLen) {
    let x = x_in % periodLen
    if (x < 0) {
      x += periodLen
    }

    let sign = 1
    const symmetryPoint = halfSymmetryLen * 2 // e.g., 14 for moon, 6 for sun

    if (x >= symmetryPoint) { // Antisymmetric part
      sign = -1
      x -= symmetryPoint
    }

    // Now x is in [0, symmetryPoint)
    if (x > halfSymmetryLen) { // Use symmetry: table(SymmetryPoint - x) = table(x)
      x = symmetryPoint - x
    }

    // Now x is in [0, halfSymmetryLen]
    const i = Math.floor(x)
    const frac = x - i

    let val
    if (i < 0) { // Should not happen if x was positive
      val = tableValues[0]
    } else if (i >= tableValues.length - 1) { // At or beyond the last defined point in the base table
      val = tableValues[tableValues.length - 1]
    } else {
      val = tableValues[i] * (1 - frac) + tableValues[i + 1] * frac
    }
    return sign * val
  }

  /**
   * Calculate True Date (gza' dag) for a given true month count and lunar day (tithi).
   * (Section 7)
   * @param {Number} trueMonthCount (n)
   * @param {Number} lunarDay (d, 1-30)
   * @return {Number} true_date
   */
  getTrueDate (trueMonthCount, lunarDay) {
    const n = trueMonthCount
    const d = lunarDay // Note: Doc formulas use d for tithi number. For day 0 of month, d=0. Here, day 1-30.
                     // The formulas in Section 7 are for "end of lunar day d".
                     // If lunarDay is 1-30, we use it directly.

    // Mean Date (gza' bar pa) (Eq. 7.1)
    const mean_date = n * this._M1 + d * this._M2 + this._M0

    // Mean Longitude of the Sun (nyi ma bar pa) (Eq. 7.5)
    let mean_sun = n * this._S1 + d * this._S2 + this._S0
    mean_sun = mean_sun - Math.floor(mean_sun) // modulo 1

    // Anomaly of the Moon (ril-po dang cha-shas) (Eq. 7.11)
    let anomaly_moon = n * this._A1 + d * this._A2 + this._A0
    anomaly_moon = anomaly_moon - Math.floor(anomaly_moon) // modulo 1

    // Equation of the Moon (zla rkang) (Eq. 7.17, 7.18)
    // Argument to moon_tab is 28 * anomaly_moon
    const moon_equ_arg = 28 * anomaly_moon
    const moon_equ = this._linearInterpolate(moon_equ_arg, this._moon_tab_values, 7, 28)

    // Anomaly of the Sun (Eq. 7.19)
    let anomaly_sun = mean_sun - 1 / 4
    anomaly_sun = anomaly_sun - Math.floor(anomaly_sun) // modulo 1

    // Equation of the Sun (nyi rkang) (Eq. 7.20, 7.21)
    // Argument to sun_tab is 12 * anomaly_sun
    const sun_equ_arg = 12 * anomaly_sun
    const sun_equ = this._linearInterpolate(sun_equ_arg, this._sun_tab_values, 3, 12)

    // True Date (gza' dag) (Eq. 7.22)
    // moon_equ and sun_equ are in "units" that need to be divided by 60 for days.
    const true_date = mean_date + moon_equ / 60 - sun_equ / 60

    return true_date
  }

  /**
   * common conversion from JDN to tibetan date
   *
   * @private
   * @param {Number} j - date in JD
   */
  _from (jd) {
    const jdn = Math.trunc(toFixed(jd, 7)) // rounding 0.00000005day = 0.0043sec
    const solarDaysFromEpoch = jdn - this._M0
    let n = Math.floor(solarDaysFromEpoch / this._M1) // approximation for true month count
    let day = Math.floor((solarDaysFromEpoch - n * this._M1) / this._M2)  // approximation for lunar day
    let leapDay = false
    for (let i = 0; i < 3; i++) {
      const trueDate = this.getTrueDate(n, day)
      //console.log(trueDate, n, day, jdn)
      if (trueDate > jdn + 1) {
        // (Section 6, "When a date is repeated, the first of the two days ... is regarded as a leap day")
        // (Section 8, "...if the Tibetan date is repeated, this gives the JD of the second day;
        // for the first we thus have to subtract 1.")
        leapDay = true
        break;
      } else if (trueDate > jdn) {
        break;
      }
      day++
    }
    if (day == 0) {
      n--
      day = 30
    }
    if (day > 30) {
      n++
      day -= 30
    }
    const {cycle, year, month, leapMonth} = this._getTibetanMonthFromTrueMonthCount(n)
    this.set(cycle, year, month, leapMonth, day, leapDay)
  }

  /**
   * convert JD to tibetan calendar date
   *
   * @param {Number} j - date in JD
   * @return {Object} this
   */
  fromJD (jd) {
    this._from(this._jdToJdLocal(jd))
    return this
  }
  
  /**
   * convert gregorian date to tibetan calendar date
   *
   * @param {Number} year - (int) year in Gregorian or Julian Calendar
   * @param {Number} month - (int)
   * @param {Number} day - needs to be in correct (tibetan) timezone
   * @return {Object} this
   */
  fromGregorian (year, month, day) {
    const jdn = new julian.CalendarGregorian(year, month, day).toJD() + 0.5 // 12:00
    this._from(jdn)
    return this
  }

  /**
   * convert date to tibetan calendar date
   *
   * @param {Date} date - javascript date object
   * @return {Object} this
   */
  fromDate (date) {
    const jd = new julian.CalendarGregorian().fromDate(date).toJD()
    this._from(this._jdToJdLocal(jd))
    return this
  }

  /**
   * convert tibetan date to JD
   * @param {Number} [gyear] - (int) gregorian year
   * @return {Number} date in JDN
   */
  toJDN (gyear) {
    // gyear is not strictly needed if this.year, this.month etc. are already set.
    // It might be a hint for which Gregorian year the Tibetan New Year falls into,
    // but the core conversion uses the Tibetan date parts directly.
    const n = this._getTrueMonthCount(gyear)
    
    // Get the JDN of the calendar day where this.day (lunar day) ends. (Section 8, Eq. 8.1)
    const true_date = this.getTrueDate(n, this.day)
    let jdn = Math.floor(true_date)
    //console.log(n, this.day, true_date, jdn)
    
    const prevTrueDate = this.getTrueDate(n, this.day - 1)
    const prevJdn = Math.floor(prevTrueDate)
    const isSkippedDay = (jdn == prevJdn)
    const isRepeatedDay = (jdn == prevJdn + 2)

    // Adjust if it's a leap day (first of two days with the same date number)
    // (Section 6, "When a date is repeated, the first of the two days ... is regarded as a leap day")
    // (Section 8, "...if the Tibetan date is repeated, this gives the JD of the second day;
    // for the first we thus have to subtract 1.")
    if (isRepeatedDay && this.leapDay) {
      jdn = jdn - 1
    }

    // Adjust if it's a skipped day
    // ("A calendar day is labelled by the lunar day that is current at the beginning of the calendar day.")
    if (isSkippedDay) {
      jdn = jdn + 1
    }
    return jdn
  }

  /**
   * convert tibetan date to gregorian date
   *
   * @param {Number} [gyear] - (int) gregorian year
   * @return {Object} date in gregorian (preleptic) calendar; Timezone is Standard local Time
   * {Number} year - (int)
   * {Number} month - (int)
   * {Number} day - (int)
   */
  toGregorian (gyear) {
    const jdn = this.toJDN(gyear)
    const jd = jdn - 0.5 // midnight
    const cal = new julian.JDToCalendarGregorian(jd)
    return {
      year: cal.year,
      month: cal.month,
      day: cal.day
    }
  }

  /**
   * convert tibetan date to Date
   *
   * @param {Number} [gyear] - (int) gregorian year
   * @return {Date} javascript date object in gregorian (preleptic) calendar
   */
  toDate (gyear) {
    const jdn = this.toJDN(gyear)
    const jd = this._jdLocalToJd(jdn)
    return new julian.CalendarGregorian().fromJD(jd).toDate()
  }
}
