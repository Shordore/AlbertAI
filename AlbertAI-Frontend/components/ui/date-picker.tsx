"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  className?: string;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export function DatePicker({
  className,
  selectedDate,
  onDateSelect,
}: DatePickerProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const daysInWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPreviousMonthDays = (date: Date) => {
    const firstDay = getFirstDayOfMonth(date);
    const prevMonthDays = [];
    if (firstDay > 0) {
      const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1);
      const daysInPrevMonth = getDaysInMonth(prevMonth);
      for (let i = firstDay - 1; i >= 0; i--) {
        prevMonthDays.push(daysInPrevMonth - i);
      }
    }
    return prevMonthDays;
  };

  const getNextMonthDays = (date: Date, currentMonthDays: number[]) => {
    const totalCurrentDays =
      getPreviousMonthDays(date).length + currentMonthDays.length;
    const nextMonthDays = [];
    const remainingDays = 42 - totalCurrentDays; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push(i);
    }
    return nextMonthDays;
  };

  const getCurrentMonthDays = (date: Date) => {
    const daysInMonth = getDaysInMonth(date);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const prevMonthDays = getPreviousMonthDays(currentDate);
  const currentMonthDays = getCurrentMonthDays(currentDate);
  const nextMonthDays = getNextMonthDays(currentDate, currentMonthDays);

  const isCurrentDay = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelectedDay = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleDayClick = (day: number) => {
    if (onDateSelect) {
      const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      onDateSelect(newDate);
    }
  };

  return (
    <div className={cn("p-4 bg-black rounded-lg", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-medium">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="p-1 hover:bg-zinc-800 rounded-md text-zinc-400"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-zinc-800 rounded-md text-zinc-400"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysInWeek.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-zinc-400 py-1"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {prevMonthDays.map((day, index) => (
          <div
            key={`prev-${day}`}
            className="text-center py-1 text-sm text-zinc-600"
          >
            {day}
          </div>
        ))}
        {currentMonthDays.map((day) => (
          <div
            key={`current-${day}`}
            className={cn(
              "text-center py-1 text-sm rounded-md cursor-pointer",
              isSelectedDay(day)
                ? "bg-[#3B4CCA] text-white"
                : isCurrentDay(day)
                ? "bg-zinc-800 text-white"
                : "text-white hover:bg-zinc-800"
            )}
            onClick={() => handleDayClick(day)}
          >
            {day}
          </div>
        ))}
        {nextMonthDays.map((day, index) => (
          <div
            key={`next-${day}`}
            className="text-center py-1 text-sm text-zinc-600"
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
