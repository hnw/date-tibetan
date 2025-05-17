# @hnw/date-tibetan

[![NPM version](https://img.shields.io/npm/v/@hnw/date-tibetan.svg)](https://www.npmjs.com/package/@hnw/date-tibetan)
[![License](https://img.shields.io/npm/l/@hnw/date-tibetan.svg)](https://github.com/hnw/date-tibetan/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/hnw/date-tibetan.svg)](https://github.com/hnw/date-tibetan/issues)
[![GitHub stars](https://img.shields.io/github/stars/hnw/date-tibetan.svg)](https://github.com/hnw/date-tibetan/stargazers)

A JavaScript library for Tibetan calendar (Phugpa system), Mongolian calendar, and Bhutanese calendar calculations, including conversions to and from the Gregorian calendar and Julian Day.

The algorithms and formulas used in this program are primarily based on the work "Tibetan calendar mathematics" by Svante Janson.

**Reference:**

  * Svante Janson, "Tibetan calendar mathematics" (2007, revised 2014)
    * [https://www2.math.uu.se/~svantejs/papers/calendars/tibet.pdf](https://www2.math.uu.se/~svantejs/papers/calendars/tibet.pdf)

This library covers the Phugpa version of the Tibetan calendar as detailed in the paper and includes variations for Mongolian and Bhutanese calendars, which are derived from similar calendrical principles.
Users of this code are encouraged to consult the aforementioned paper for a detailed understanding of the underlying mathematics and astronomical models.

## Features

  * Tibetan calendar (Phugpa system) date calculations
  * Mongolian calendar date calculations
  * Bhutanese calendar date calculations
  * Conversion from Tibetan, Mongolian, and Bhutanese calendars to Gregorian calendar
  * Conversion from Gregorian calendar to Tibetan, Mongolian, and Bhutanese calendars
  * Mutual conversion with Julian Day
  * Handling of leap months and leap days
  * Provided in ES Module and CommonJS formats

## Installation

```bash
npm install @hnw/date-tibetan
```

## Usage

### ES Module

```javascript
import { CalendarTibetan, CalendarMongolian, CalendarBhutanese } from '@hnw/date-tibetan';

// --- Tibetan Calendar Example ---
// Set a Tibetan date: 17th Rabjung cycle, 38th year, 1st month, not a leap month, 15th day, not a leap day
const tibetanDate = new CalendarTibetan(17, 38, 1, false, 15, false);
console.log('Tibetan Date Object:', tibetanDate);
console.log('Tibetan Date (Array):', tibetanDate.get()); // [17, 38, 1, false, 15, false]

// Convert to Gregorian calendar
const gregorianFromTibetan = tibetanDate.toGregorian();
console.log('Gregorian from Tibetan:', gregorianFromTibetan); // Example: { year: 2024, month: 2, day: 24 } (actual values depend on the specific date and calendar rules)

// Convert to JavaScript Date object
const dateFromTibetan = tibetanDate.toDate();
console.log('Date object from Tibetan:', dateFromTibetan);

// Convert to Julian Day Number
const jdnFromTibetan = tibetanDate.toJDN();
console.log('JDN from Tibetan:', jdnFromTibetan);


// Convert from Gregorian to Tibetan
const tibetanFromGregorian = new CalendarTibetan().fromGregorian(2024, 2, 10); // February 10, 2024
console.log('Tibetan from Gregorian (Array):', tibetanFromGregorian.get());

// Convert from JavaScript Date object to Tibetan
const jsDate = new Date(2024, 1, 10); // Month is 0-indexed, so 1 means February
const tibetanFromJsDate = new CalendarTibetan().fromDate(jsDate);
console.log('Tibetan from JS Date (Array):', tibetanFromJsDate.get());

// Convert from Julian Date to Tibetan
const tibetanFromJd = new CalendarTibetan().fromJD(2460350.5); // Example: JD 2460350.5 (corresponds to 2024-02-10 noon UTC)
console.log('Tibetan from JD (Array):', tibetanFromJd.get());


// --- Mongolian Calendar Example ---
const mongolianDate = new CalendarMongolian(17, 38, 1, false, 15, false);
console.log('Mongolian Date (Array):', mongolianDate.get());
const gregorianFromMongolian = mongolianDate.toGregorian();
console.log('Gregorian from Mongolian:', gregorianFromMongolian);

// --- Bhutanese Calendar Example ---
const bhutaneseDate = new CalendarBhutanese(17, 38, 1, false, 15, false);
console.log('Bhutanese Date (Array):', bhutaneseDate.get());
const gregorianFromBhutanese = bhutaneseDate.toGregorian();
console.log('Gregorian from Bhutanese:', gregorianFromBhutanese);
```

### CommonJS

```javascript
const { CalendarTibetan, CalendarMongolian, CalendarBhutanese } = require('@hnw/date-tibetan');

// --- Tibetan Calendar Example ---
// Set a Tibetan date: 17th Rabjung cycle, 38th year, 1st month, not a leap month, 15th day, not a leap day
const tibetanDate = new CalendarTibetan(17, 38, 1, false, 15, false);
console.log('Tibetan Date Object:', tibetanDate);
console.log('Tibetan Date (Array):', tibetanDate.get()); // [17, 38, 1, false, 15, false]

// Convert to Gregorian calendar
const gregorianFromTibetan = tibetanDate.toGregorian();
console.log('Gregorian from Tibetan:', gregorianFromTibetan);

// Convert to JavaScript Date object
const dateFromTibetan = tibetanDate.toDate();
console.log('Date object from Tibetan:', dateFromTibetan);

// Convert to Julian Day Number
const jdnFromTibetan = tibetanDate.toJDN();
console.log('JDN from Tibetan:', jdnFromTibetan);


// Convert from Gregorian to Tibetan
const tibetanFromGregorian = new CalendarTibetan().fromGregorian(2024, 2, 10); // February 10, 2024
console.log('Tibetan from Gregorian (Array):', tibetanFromGregorian.get());

// Convert from JavaScript Date object to Tibetan
const jsDate = new Date(2024, 1, 10); // Month is 0-indexed, so 1 means February
const tibetanFromJsDate = new CalendarTibetan().fromDate(jsDate);
console.log('Tibetan from JS Date (Array):', tibetanFromJsDate.get());

// Convert from Julian Date to Tibetan
const tibetanFromJd = new CalendarTibetan().fromJD(2460350.5); // Example: JD 2460350.5 (corresponds to 2024-02-10 noon UTC)
console.log('Tibetan from JD (Array):', tibetanFromJd.get());


// --- Mongolian Calendar Example ---
const mongolianDate = new CalendarMongolian(17, 38, 1, false, 15, false);
console.log('Mongolian Date (Array):', mongolianDate.get());
const gregorianFromMongolian = mongolianDate.toGregorian();
console.log('Gregorian from Mongolian:', gregorianFromMongolian);

// --- Bhutanese Calendar Example ---
const bhutaneseDate = new CalendarBhutanese(17, 38, 1, false, 15, false);
console.log('Bhutanese Date (Array):', bhutaneseDate.get());
const gregorianFromBhutanese = bhutaneseDate.toGregorian();
console.log('Gregorian from Bhutanese:', gregorianFromBhutanese);
```

## API

### `CalendarTibetan(cycle, year, month, leapMonth, day, leapDay)`

### `CalendarMongolian(cycle, year, month, leapMonth, day, leapDay)`

### `CalendarBhutanese(cycle, year, month, leapMonth, day, leapDay)`

Constructors for each calendar system.
Arguments can be passed individually, as an array `[cycle, year, month, leapMonth, day, leapDay]`, or as a `CalendarTibetan` (or respective) instance.

  * `cycle` (Number): The 60-year Tibetan cycle (Rabjung). The first Rabjung cycle conventionally started in AD 1027. Example: `17` for the 17th Rabjung cycle.
  * `year` (Number): The year within the cycle (1 to 60).
  * `month` (Number): The month (1 to 12).
  * `leapMonth` (Boolean): `true` if it's a leap month.
  * `day` (Number): The day (1 to 30).
  * `leapDay` (Boolean): `true` if it's a leap day (a repeated day).

### `set(cycle, year, month, leapMonth, day, leapDay)`

Sets a new date for the calendar object. Argument format is the same as the constructor.

  * **Returns:** `this` (the calendar object itself).

### `get()`

Returns the currently set date components as an array.

  * **Returns:** `Array<Number|Boolean>` - `[cycle, year, month, leapMonth, day, leapDay]`

### `fromGregorian(year, month, day)`

Sets the calendar object's date from a Gregorian calendar date. The input date is assumed to be for the local civil day.

  * `year` (Number): Gregorian year.
  * `month` (Number): Gregorian month (1 to 12).
  * `day` (Number): Gregorian day.
  * **Returns:** `this` (the calendar object itself).

### `fromDate(date)`

Sets the calendar object's date from a JavaScript `Date` object.

  * `date` (Date): JavaScript `Date` object.
  * **Returns:** `this` (the calendar object itself).

### `fromJD(jd)`

Sets the calendar object's date from a Julian Date. The Julian Date typically represents a specific moment, often UTC noon for a given date, or can include time.

  * `jd` (Number): Julian Date.
  * **Returns:** `this` (the calendar object itself).

### `toGregorian()`

Converts the calendar object's date to a Gregorian calendar date.

  * **Returns:** `Object` - `{ year: Number, month: Number, day: Number }` representing the Gregorian date.

### `toDate()`

Converts the calendar object's date to a JavaScript `Date` object. The resulting `Date` object represents the start of the Tibetan day in the local timezone of the JavaScript runtime.

  * **Returns:** `Date`

### `toJDN()`

Converts the calendar object's date to a Julian Day Number. This JDN typically represents the integer day count for the start of the local Tibetan calendar day.

  * **Returns:** `Number` (Julian Day Number).

## Dependencies

  * [astronomia](https://www.npmjs.com/package/astronomia): Used for conversions between Gregorian calendar and Julian Day.

## License

MIT License - Copyright (c) hnw
Please see the `LICENSE` file for details.
