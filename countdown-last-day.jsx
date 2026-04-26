import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CONFIG = {
  lastDay: "2026-06-16",
  nextDayOff: "2026-05-25",
  nextDayOffName: "Memorial Day",
  baselineSchoolDaysLeft: 36,
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysBetween(startDate, endDate) {
  return Math.max(0, Math.ceil((startOfLocalDay(endDate) - startOfLocalDay(startDate)) / MS_PER_DAY));
}

function getNextWeekendDate(today = new Date()) {
  const start = startOfLocalDay(today);
  const day = start.getDay();
  const daysUntilSaturday = day === 6 ? 0 : (6 - day + 7) % 7;
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + daysUntilSaturday);
}

function formatDate(dateStringOrDate) {
  const date = typeof dateStringOrDate === "string" ? parseLocalDate(dateStringOrDate) : dateStringOrDate;

  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function calculateCountdown(today = new Date(), config = CONFIG) {
  const start = startOfLocalDay(today);
  const lastDay = parseLocalDate(config.lastDay);
  const nextDayOff = parseLocalDate(config.nextDayOff);
  const nextWeekend = getNextWeekendDate(start);

  return {
    calendarDaysLeft: daysBetween(start, lastDay),
    daysUntilOff: daysBetween(start, nextDayOff),
    daysUntilWeekend: daysBetween(start, nextWeekend),
    nextWeekendDate: nextWeekend,
    schoolDaysLeft: config.baselineSchoolDaysLeft,
  };
}

function runTests() {
  const testDate = new Date(2026, 3, 26); // April 26, 2026
  const result = calculateCountdown(testDate);

  console.assert(result.schoolDaysLeft === 36, "Expected 36 school days left");
  console.assert(result.daysUntilOff === 29, "Expected 29 calendar days until Memorial Day from Apr 26, 2026");
  console.assert(result.calendarDaysLeft === 51, "Expected 51 calendar days until Jun 16, 2026 from Apr 26, 2026");
  console.assert(result.daysUntilWeekend === 6, "Expected 6 days until Saturday from Sunday, Apr 26, 2026");
  console.assert(formatDate("2026-05-25") === "Monday, May 25, 2026", "Expected Memorial Day formatted date");
}

runTests();

export default function SchoolCountdown() {
  const [config] = useState(CONFIG);
  const [isDark, setIsDark] = useState(false);

  const data = useMemo(() => calculateCountdown(new Date(), config), [config]);

  const pageClass = isDark
    ? "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white"
    : "min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 text-slate-900";

  return (
    <main className={pageClass}>
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex justify-end items-center gap-3">
          <span className={isDark ? "text-slate-300 text-sm" : "text-slate-600 text-sm"}>
            {isDark ? "Dark" : "Light"} mode
          </span>
          <button
            onClick={() => setIsDark((value) => !value)}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition ${
              isDark ? "bg-blue-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                isDark ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={isDark ? "rounded-3xl bg-slate-900/80 p-8 shadow-xl ring-1 ring-slate-700 backdrop-blur" : "rounded-3xl bg-white/80 p-8 shadow-xl ring-1 ring-slate-200 backdrop-blur"}
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-500">
                <Icon label="School" symbol="🏫" /> School Countdown
              </p>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">Almost Summer.</h1>
              <p className={isDark ? "mt-3 max-w-2xl text-lg text-slate-300" : "mt-3 max-w-2xl text-lg text-slate-600"}>
                Counting down to the last school day: <span className={isDark ? "font-semibold text-white" : "font-semibold text-slate-900"}>{formatDate(config.lastDay)}</span>.
              </p>
            </div>
            <div className="rounded-3xl bg-blue-600 px-7 py-6 text-center text-white shadow-lg">
              <div className="text-6xl font-black leading-none">{data.schoolDaysLeft}</div>
              <div className="mt-2 text-sm font-semibold uppercase tracking-wider opacity-90">school days left</div>
            </div>
          </div>
        </motion.section>

        <section className="grid gap-5 md:grid-cols-4">
          <CountdownCard
            isDark={isDark}
            icon={<Icon label="Calendar" symbol="📅" />}
            label="Calendar days left"
            value={data.calendarDaysLeft}
            detail={`Until ${formatDate(config.lastDay)}`}
          />
          <CountdownCard
            isDark={isDark}
            icon={<Icon label="Weekend" symbol="🛋️" />}
            label="Weekend countdown"
            value={data.daysUntilWeekend}
            detail={`Next weekend starts ${formatDate(data.nextWeekendDate)}`}
          />
          <CountdownCard
            isDark={isDark}
            icon={<Icon label="Party" symbol="🎉" />}
            label="Next day off"
            value={config.nextDayOffName}
            detail={formatDate(config.nextDayOff)}
          />
          <CountdownCard
            isDark={isDark}
            icon={<Icon label="Clock" symbol="⏰" />}
            label="Days until next day off"
            value={data.daysUntilOff}
            detail={`No school on ${config.nextDayOffName}`}
          />
        </section>

        <div className="flex justify-center">
          <Button className="rounded-2xl px-6 py-5 text-base shadow-md" onClick={() => window.location.reload()}>
            Refresh Countdown
          </Button>
        </div>
      </div>
    </main>
  );
}

function CountdownCard({ icon, label, value, detail, isDark }) {
  const cardClass = isDark
    ? "h-full rounded-3xl border-slate-700 bg-slate-900 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
    : "h-full rounded-3xl border-slate-200 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Card className={cardClass}>
        <CardContent className="flex h-full flex-col gap-4 p-6">
          <div className={isDark ? "w-fit rounded-2xl bg-blue-950 p-3 text-blue-300" : "w-fit rounded-2xl bg-blue-50 p-3 text-blue-600"}>{icon}</div>
          <div>
            <p className={isDark ? "text-sm font-semibold uppercase tracking-wide text-slate-400" : "text-sm font-semibold uppercase tracking-wide text-slate-500"}>{label}</p>
            <p className={isDark ? "mt-2 text-3xl font-black text-white" : "mt-2 text-3xl font-black text-slate-900"}>{value}</p>
            <p className={isDark ? "mt-2 text-slate-300" : "mt-2 text-slate-600"}>{detail}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Icon({ symbol, label }) {
  return (
    <span aria-label={label} role="img" className="inline-flex h-6 w-6 items-center justify-center text-xl leading-none">
      {symbol}
    </span>
  );
}
