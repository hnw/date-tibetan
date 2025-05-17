import CalendarTibetan from './Tibetan.js'

export default class CalendarBhutanese extends CalendarTibetan {
  constructor (cycle, year, month, leapMonth, day, leapDay) {
    super(cycle, year, month, leapMonth, day, leapDay)

    this._M0 = 2361807 + 52 / 707
    this._S0 = 1 + 1 / 67
    this._A0 = 17 / 147
    this._P0 = 31 / 40
    this._EPOCH_YEAR = 1754
    this._IS_BHUTAN_LEAP = true

    // Timezone offset for Bhutan Time (BTT)
    this._JD_OFFSET_STD_TIME = 6 / 24
  }
}
