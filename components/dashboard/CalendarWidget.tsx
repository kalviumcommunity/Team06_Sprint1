"use client";

import { useMemo } from "react";

interface CalendarWidgetProps {
  highlightDates?: string[];
  year?: number;
  month?: number;
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function CalendarWidget({ highlightDates = [], year, month }: CalendarWidgetProps) {
  const now = new Date();
  const currentYear = year ?? now.getFullYear();
  const currentMonth = month ?? now.getMonth();
  const today = (currentYear === now.getFullYear() && currentMonth === now.getMonth()) ? now.getDate() : -1;

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const initialDays: number[] = [];
    for (let i = 0; i < firstDay; i++) {
      initialDays.push(0);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      initialDays.push(i);
    }
    return initialDays;
  }, [currentYear, currentMonth]);

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white py-4 px-5 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#00b386]">Delivery Calendar</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
            {monthNames[currentMonth]} {currentYear}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#00b386]" />
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Upcoming delivery</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
        {days.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {calendarDays.map((date, index) => {
          if (date === 0) {
            return <div key={index} className="flex h-8 items-center justify-center" />;
          }

          const isToday = date === today;
          const isHighlighted = highlightDates.includes(String(date));

          return (
            <div
              key={index}
              className={`flex h-8 items-center justify-center rounded-full text-sm font-medium ${
                isToday
                  ? "bg-[#e6f7f3] text-[#00b386]"
                  : isHighlighted
                    ? "bg-[#00b386] text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800/70 dark:text-slate-300"
              }`}
            >
              {date}
            </div>
          );
        })}
      </div>
    </section>
  );
}
