import assert from 'assert'
import { julian } from 'astronomia'
import { CalendarMongolian } from '../src/index.js'

function toDate (jde) {
  return new julian.Calendar().fromJDE(jde).toDate()
}

describe('#CalendarMongolian', function () {
  describe('construction', function () {
    let cal
    const exp = [17, 21, 1, false, 2, false]
    it('can construct via new', function () {
      cal = new CalendarMongolian(17, 21, 1, false, 2, false)
      assert.ok(cal instanceof CalendarMongolian)
      assert.deepStrictEqual(cal.get(), exp)
    })

    it('can construct with class instance', function () {
      const cal1 = new CalendarMongolian(cal)
      assert.ok(cal1 instanceof CalendarMongolian)
      assert.ok(cal1 !== cal)
      assert.deepStrictEqual(cal.get(), exp)
    })

    it('can construct with array', function () {
      const cal1 = new CalendarMongolian(exp)
      assert.ok(cal1 !== cal)
      assert.deepStrictEqual(cal.get(), exp)
    })
  })

  describe('Gregorian', function () {
    const tests = [
      // "Tibetan calendar mathematics" Table 9: Gregorian dates for New Year
      { d: [2000,  2,  6], tib: [17, 14, 1, false, 1, false] },
      { d: [2001,  2, 24], tib: [17, 15, 1, false, 1, false] },
      { d: [2002,  2, 13], tib: [17, 16, 1, false, 1, false] },
      { d: [2003,  2,  2], tib: [17, 17, 1, false, 1, false] },
      { d: [2004,  2, 21], tib: [17, 18, 1, false, 1, false] },
      { d: [2005,  2,  9], tib: [17, 19, 1, false, 1, false] },
      { d: [2006,  1, 30], tib: [17, 20, 1, true,  1, false] },
      { d: [2007,  2, 18], tib: [17, 21, 1, false, 1, false] },
      { d: [2008,  2,  8], tib: [17, 22, 1, false, 1, false] },
      { d: [2009,  2, 25], tib: [17, 23, 1, false, 1, false] },
      { d: [2010,  2, 14], tib: [17, 24, 1, false, 1, true] },
      { d: [2011,  2,  3], tib: [17, 25, 1, false, 1, true] },
      { d: [2012,  2, 22], tib: [17, 26, 1, false, 1, false] },
      { d: [2013,  2, 11], tib: [17, 27, 1, false, 1, false] },
      { d: [2014,  1, 31], tib: [17, 28, 1, false, 1, false] },
      { d: [2015,  2, 19], tib: [17, 29, 1, false, 1, false] },
      { d: [2016,  2,  9], tib: [17, 30, 1, false, 1, false] },
      { d: [2017,  2, 27], tib: [17, 31, 1, false, 1, false] },
      { d: [2018,  2, 16], tib: [17, 32, 1, false, 1, false] },
      { d: [2019,  2,  5], tib: [17, 33, 1, false, 1, false] },
      { d: [2020,  2, 24], tib: [17, 34, 1, false, 1, false] },
      { d: [2021,  2, 12], tib: [17, 35, 1, false, 1, false] },
      { d: [2022,  2,  2], tib: [17, 36, 1, false, 1, false] },
      { d: [2023,  2, 21], tib: [17, 37, 1, false, 1, false] },
      { d: [2024,  2, 10], tib: [17, 38, 1, false, 1, false] },
      { d: [2025,  2, 28], tib: [17, 38,12, false,30, false] },
      { d: [2025,  3,  1], tib: [17, 39, 1, false, 2, false] }, // 01-01 is skipped day
      { d: [2026,  2, 18], tib: [17, 40, 1, false, 1, false] },
      { d: [2027,  2,  7], tib: [17, 41, 1, false, 1, false] },
      { d: [2028,  2, 26], tib: [17, 42, 1, false, 1, false] },
      { d: [2029,  2, 14], tib: [17, 43, 1, false, 1, false] },      
      { d: [2030,  2,  3], tib: [17, 44, 1, false, 1, false] },
      // "Tibetan calendar mathematics" Table 7: Leap months
      { d: [2016, 11, 29], tib: [17, 30, 10, false, 30, false] },
      { d: [2016, 11, 30], tib: [17, 30, 11, true,   1, false] },
      { d: [2016, 12, 30], tib: [17, 30, 11, false,  1, false] },
      { d: [2019,  8,  1], tib: [17, 33,  6, false, 30, false] },
      { d: [2019,  8,  2], tib: [17, 33,  7, true,   1, false] },
      { d: [2019,  8, 31], tib: [17, 33,  7, false,  1, false] },
      // "Tibetan calendar mathematics" Table 8: Repeated and skipped days
      { d: [2012,  2, 24], tib: [17, 26, 1, false, 3, false] },
      { d: [2012,  2, 25], tib: [17, 26, 1, false, 4, true] },
      { d: [2012,  2, 26], tib: [17, 26, 1, false, 4, false ] },
      { d: [2012,  2, 27], tib: [17, 26, 1, false, 5, false] },
      { d: [2012,  3, 12], tib: [17, 26, 1, false, 19, false] },
      { d: [2012,  3, 13], tib: [17, 26, 1, false, 21, false] },
      { d: [2012, 12, 23], tib: [17, 26, 11, false, 11, false] },
      { d: [2012, 12, 24], tib: [17, 26, 11, false, 12, true ] },
      { d: [2012, 12, 25], tib: [17, 26, 11, false, 12, false] },
      { d: [2012, 12, 26], tib: [17, 26, 11, false, 13, false] },
      { d: [2013,  1,  9], tib: [17, 26, 11, false, 27, false] },
      { d: [2013,  1, 10], tib: [17, 26, 11, false, 29, false] },
      { d: [2013,  1, 25], tib: [17, 26, 12, false, 14, false] },
      { d: [2013,  1, 26], tib: [17, 26, 12, false, 15, true] },
      { d: [2013,  1, 27], tib: [17, 26, 12, false, 15, false] },
      { d: [2013,  1, 28], tib: [17, 26, 12, false, 16, false] },
      { d: [2013,  2,  2], tib: [17, 26, 12, false, 21, false] },
      { d: [2013,  2,  3], tib: [17, 26, 12, false, 23, false] },
    ]

    describe('fromGregorian', function () {
      const cal = new CalendarMongolian()
      tests.forEach(function (t) {
        const [y, m, d] = t.d
        it(t.d.join('-'), function () {
          cal.fromGregorian(y, m, d)
          assert.deepStrictEqual([cal.cycle, cal.year, cal.month, cal.leapMonth, cal.day, cal.leapDay], t.tib)
        })
      })
    })

    describe('toGregorian', function () {
      tests.forEach(function (t) {
        const [cycle, year, month, leapMonth, day, leapDay] = t.tib
        it(t.d.join('-') + ' ' + [cycle, year, month, leapMonth, day, leapDay].join('-'), function () {
          const cal = new CalendarMongolian(cycle, year, month, leapMonth, day, leapDay)
          const res = cal.toGregorian()
          assert.deepStrictEqual([res.year, res.month, res.day], t.d)
        })
      })
    })
  })
})
