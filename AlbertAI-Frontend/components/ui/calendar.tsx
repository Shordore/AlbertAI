"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("", className)}
      classNames={{
        root: "w-full bg-black",
        caption: "flex justify-between px-4 py-2 items-center",
        caption_label: "text-white font-normal",
        nav: "flex gap-1",
        nav_button: "text-white/70 hover:text-white/100",
        table: "w-full border-collapse",
        head_row: "grid grid-cols-7",
        head_cell: "text-white/70 text-center text-xs py-1.5",
        row: "grid grid-cols-7",
        cell: "text-center relative p-0 focus-within:z-20",
        day: "h-10 w-10 p-0 mx-auto flex items-center justify-center text-sm text-white",
        day_selected: "bg-[#3B4CCA] text-white rounded-sm",
        day_today: "font-bold",
        day_outside: "text-white/30",
        day_disabled: "text-white/30",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-5 w-5" />,
        IconRight: () => <ChevronRight className="h-5 w-5" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
