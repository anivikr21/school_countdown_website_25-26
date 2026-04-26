# School Countdown Website

## Overview
This is a simple React-based countdown website that tracks the remaining time until the last day of school.

## Features
- Displays total school days left
- Shows calendar days remaining
- Weekend countdown (time until next Saturday)
- Next day off (Memorial Day)
- Dark/light mode toggle
- Clean, modern UI with animations

## Configuration
You can update the key dates in the CONFIG object:

```js
const CONFIG = {
  lastDay: "2026-06-16",
  nextDayOff: "2026-05-25",
  nextDayOffName: "Memorial Day",
  baselineSchoolDaysLeft: 36,
};
```

## Tech Stack
- React
- Framer Motion (animations)
- Tailwind CSS (styling)

## How It Works
The app calculates:
- Days between today and the last school day
- Days until the next weekend
- Days until the next holiday

All calculations are done using native JavaScript date functions.

## Notes
- School days are manually set (36 days remaining)
- Weekends and holidays are not dynamically excluded
- Designed for simplicity and speed
