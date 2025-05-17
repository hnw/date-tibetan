import assert from 'assert'
import { julian } from 'astronomia'
import { CalendarTibetan } from '../src/index.js'

function toDate (jde) {
  return new julian.Calendar().fromJDE(jde).toDate()
}

describe('#CalendarTibetan', function () {
  describe('construction', function () {
    let cal
    const exp = [17, 21, 1, false, 2, false]
    it('can construct via new', function () {
      cal = new CalendarTibetan(17, 21, 1, false, 2, false)
      assert.ok(cal instanceof CalendarTibetan)
      assert.deepStrictEqual(cal.get(), exp)
    })

    it('can construct with class instance', function () {
      const cal1 = new CalendarTibetan(cal)
      assert.ok(cal1 instanceof CalendarTibetan)
      assert.ok(cal1 !== cal)
      assert.deepStrictEqual(cal.get(), exp)
    })

    it('can construct with array', function () {
      const cal1 = new CalendarTibetan(exp)
      assert.ok(cal1 !== cal)
      assert.deepStrictEqual(cal.get(), exp)
    })
  })


  describe('conversions', function () {
    const tests = [
      { date: new Date('2025-05-16T05:00:00+0604'), tibetan: [17, 39, 3, false, 19, false] },
      { date: new Date('2007-02-19T05:00:00+0604'), tibetan: [17, 21, 1, false, 2, false] },
      { date: new Date('1980-12-03T05:00:00+0604'), tibetan: [16, 54, 10, false, 26, false] },
      { date: new Date('2017-01-28T05:00:00+0604'), tibetan: [17, 30, 12, false, 1, false] },
    ]

    describe('from Date to tibetan', function () {
      tests.forEach((test) => {
        it(test.date.toISOString(), function () {
          const cal = new CalendarTibetan().fromDate(test.date)
          assert.deepStrictEqual(cal.get(), test.tibetan)
        })
      })
    })

    describe('from tibetan to Date', function () {
      tests.forEach((test) => {
        it(test.date.toISOString(), function () {
          const cal = new CalendarTibetan()
          cal.set.apply(cal, test.tibetan)
          assert.deepStrictEqual(cal.toDate(), test.date)
        })
      })
    })
  })

  describe('Gregorian', function () {
    const tests = [
      { d: [2007,  2, 19], tib: [17, 21, 1, false, 2, false] },
      // "Tibetan calendar mathematics" Table 9: Gregorian dates for New Year
      { d: [2000,  2,  6], tib: [17, 14, 1, true,  1, false] },
      { d: [2001,  2, 24], tib: [17, 15, 1, false, 1, false] },
      { d: [2002,  2, 13], tib: [17, 16, 1, false, 1, false] },
      { d: [2003,  3,  3], tib: [17, 17, 1, false, 1, false] },
      { d: [2004,  2, 21], tib: [17, 18, 1, false, 1, false] },
      { d: [2005,  2,  9], tib: [17, 19, 1, false, 1, false] },
      { d: [2006,  2, 28], tib: [17, 20, 1, false, 1, false] },
      { d: [2007,  2, 18], tib: [17, 21, 1, false, 1, false] },
      { d: [2008,  2,  7], tib: [17, 22, 1, false, 1, false] },
      { d: [2009,  2, 25], tib: [17, 23, 1, false, 1, false] },
      { d: [2010,  2, 14], tib: [17, 24, 1, false, 1, false] },
      { d: [2011,  3,  5], tib: [17, 25, 1, false, 1, false] },
      { d: [2012,  2, 22], tib: [17, 26, 1, false, 1, false] },
      { d: [2013,  2, 11], tib: [17, 27, 1, false, 1, false] },
      { d: [2014,  3,  2], tib: [17, 28, 1, false, 1, false] },
      { d: [2015,  2, 19], tib: [17, 29, 1, false, 1, false] },
      { d: [2016,  2,  9], tib: [17, 30, 1, false, 1, false] },
      { d: [2017,  2, 27], tib: [17, 31, 1, false, 1, false] },
      { d: [2018,  2, 16], tib: [17, 32, 1, false, 1, false] },
      { d: [2019,  2,  5], tib: [17, 33, 1, true,  1, false] },
      { d: [2020,  2, 24], tib: [17, 34, 1, false, 1, false] },
      { d: [2021,  2, 12], tib: [17, 35, 1, false, 1, false] },
      { d: [2022,  3,  3], tib: [17, 36, 1, false, 1, false] },
      { d: [2023,  2, 21], tib: [17, 37, 1, false, 1, false] },
      { d: [2024,  2, 10], tib: [17, 38, 1, false, 1, false] },
      { d: [2025,  2, 28], tib: [17, 39, 1, false, 1, false] },
      { d: [2026,  2, 18], tib: [17, 40, 1, false, 1, false] },
      { d: [2027,  2,  7], tib: [17, 41, 1, false, 1, false] },
      { d: [2028,  2, 26], tib: [17, 42, 1, false, 1, false] },
      { d: [2029,  2, 14], tib: [17, 43, 1, false, 1, false] },      
      { d: [2030,  3,  5], tib: [17, 44, 1, false, 1, false] },
      // "Tibetan calendar mathematics" Table 7: Leap months
      { d: [2016,  5,  6], tib: [17, 30,  3, false, 30, false] },
      { d: [2016,  5,  7], tib: [17, 30,  4, true,   1, false] },
      { d: [2016,  6,  6], tib: [17, 30,  4, false,  1, false] },
      { d: [2019,  2,  4], tib: [17, 32, 12, false, 30, false] },
      { d: [2019,  2,  5], tib: [17, 33,  1, true,   1, false] },
      { d: [2019,  3,  7], tib: [17, 33,  1, false,  1, false] },
      // "Tibetan calendar mathematics" Table 8: Repeated and skipped days
      { d: [2012,  2, 25], tib: [17, 26, 1, false, 4, false] },
      { d: [2012,  2, 26], tib: [17, 26, 1, false, 5, true ] },
      { d: [2012,  2, 27], tib: [17, 26, 1, false, 5, false] },
      { d: [2012,  2, 28], tib: [17, 26, 1, false, 6, false] },
      { d: [2012,  3, 11], tib: [17, 26, 1, false, 18, false] },
      { d: [2012,  3, 12], tib: [17, 26, 1, false, 20, false] },

      { d: [2012, 12, 24], tib: [17, 26, 11, false, 12, false] },
      { d: [2012, 12, 25], tib: [17, 26, 11, false, 13, true ] },
      { d: [2012, 12, 26], tib: [17, 26, 11, false, 13, false] },
      { d: [2012, 12, 27], tib: [17, 26, 11, false, 14, false] },
      { d: [2013,  1,  8], tib: [17, 26, 11, false, 26, false] },
      { d: [2013,  1,  9], tib: [17, 26, 11, false, 28, false] },

      { d: [2013,  1, 27], tib: [17, 26, 12, false, 16, false] },
      { d: [2013,  1, 28], tib: [17, 26, 12, false, 17, true] },
      { d: [2013,  1, 29], tib: [17, 26, 12, false, 17, false] },
      { d: [2013,  1, 30], tib: [17, 26, 12, false, 18, false] },
      { d: [2013,  2,  1], tib: [17, 26, 12, false, 20, false] },
      { d: [2013,  2,  2], tib: [17, 26, 12, false, 22, false] }
    ]

    describe('fromGregorian', function () {
      const cal = new CalendarTibetan()
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
          const cal = new CalendarTibetan(cycle, year, month, leapMonth, day, leapDay)
          const res = cal.toGregorian()
          assert.deepStrictEqual([res.year, res.month, res.day], t.d)
        })
      })
    })
  })

})
