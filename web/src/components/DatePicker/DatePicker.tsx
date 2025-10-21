'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { parse } from 'date-fns';
import { it } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type DatePickerProps = {
  defaultDate?: Date;
  onSelect?: (date: Date | undefined) => void;
};

function formatDate(date: Date | undefined) {
  if (!date) return '';

  return date.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) return false;
  return !isNaN(date.getTime());
}

export function DatePicker({ defaultDate, onSelect }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(defaultDate);
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim();
    setValue(inputValue);

    // Formati accettati
    const formats = ['d MMMM yyyy', 'dd/MM/yyyy', 'dd-MM-yyyy'];

    let parsedDate: Date | null = null;
    for (const fmt of formats) {
      const d = parse(inputValue, fmt, new Date(), { locale: it });
      if (isValidDate(d)) {
        parsedDate = d;
        break;
      }
    }

    if (parsedDate) {
      setDate(parsedDate);
      setMonth(parsedDate);
      setValue(formatDate(parsedDate));
      onSelect?.(parsedDate);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder="Es. 22 ottobre 2025"
          className="bg-background pr-10"
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                if (date) {
                  setDate(date);
                  setMonth(date);
                  setValue(formatDate(date));
                  setOpen(false);
                  onSelect?.(date);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
