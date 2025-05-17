import CalendarTibetan from './Tibetan.js'

export default class CalendarMongolian extends CalendarTibetan {
  constructor (cycle, year, month, leapMonth, day, leapDay) {
    super(cycle, year, month, leapMonth, day, leapDay)

    this._M0 = 2359237 + 2603 / 2828
    this._S0 = 397 / 402
    this._A0 = 1523 / 1764
    this._P0 = 209 / 270
    this._EPOCH_YEAR = 1747

    // Timezone offset for Ulaanbaatar Time (ULAT)
    this._JD_OFFSET_STD_TIME = 8 / 24
  }
}
