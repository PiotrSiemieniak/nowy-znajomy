"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/Calendar";
import { MIN_AGE } from "@/configs/accountDetails";
import { MAX_AGE } from "@/configs/filters";

interface BirthDatePickerProps {
  value?: string | Date;
  onChange: (monthYear: string | undefined) => void; // Zmiana: wysyłamy string "YYYY-MM"
}

export function BirthDatePicker({ value, onChange }: BirthDatePickerProps) {
  // Parse initial value - może być string "YYYY-MM" lub Date
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    if (!value) return undefined;
    if (typeof value === "string") {
      // Jeśli format "YYYY-MM", dodaj dzień
      if (value.match(/^\d{4}-\d{2}$/)) {
        return new Date(`${value}-01`);
      }
      return new Date(value);
    }
    return new Date(value);
  });

  const currentYear = new Date().getFullYear();
  const maxYear = currentYear - MIN_AGE;
  const minYear = currentYear - MAX_AGE; // Używamy MAX_AGE z konfiguracji

  // Helper do konwersji Date na "YYYY-MM" format
  const dateToMonthYear = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      onChange(dateToMonthYear(date));
    } else {
      onChange(undefined);
    }
  };

  // Handler dla zmiany miesiąca/roku w dropdown
  const handleMonthChange = (month: Date) => {
    // Ustaw pierwszy dzień miesiąca dla internal state
    const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    setSelectedDate(firstDayOfMonth);
    // Ale wyślij tylko "YYYY-MM"
    onChange(dateToMonthYear(firstDayOfMonth));
  };

  return (
    <div>
      <div className="[&_.rdp-month]:pb-2 [&_.rdp-day]:hidden [&_.rdp-weekdays]:hidden [&_.rdp-week]:hidden">
        <Calendar
          mode="single"
          captionLayout="dropdown" // Miesiąc + rok dropdown
          selected={selectedDate}
          onSelect={handleDateSelect}
          onMonthChange={handleMonthChange}
          disabled={(date) => {
            const year = date.getFullYear();
            const today = new Date();

            return (
              date > today || // Przyszłość
              year > maxYear || // Za młody
              year < minYear // Za stary
            );
          }}
          defaultMonth={selectedDate || new Date(maxYear, 0, 1)}
          fromYear={minYear}
          toYear={maxYear}
          className="rounded-lg w-fit mx-auto"
        />
      </div>

      {/* Validation info */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p className="w-full text-center">Minimalny wiek: {MIN_AGE} lat</p>
      </div>
    </div>
  );
}
