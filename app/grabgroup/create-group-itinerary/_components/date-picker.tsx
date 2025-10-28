'use client';

import { useState } from 'react';
import moment from 'moment';

interface DatePickerProps {
  initialDates?: string[];
}

export default function DatePicker({ initialDates = [] }: DatePickerProps) {
  const [selectedDates, setSelectedDates] = useState<string[]>(initialDates);
  const today = moment();

  // 產生這個月和下個月的日期陣列
  const getMonthDays = (monthOffset: number) => {
    const start = today.clone().add(monthOffset, 'months').startOf('month');
    const daysInMonth = start.daysInMonth();
    return Array.from({ length: daysInMonth }, (_, i) =>
      start
        .clone()
        .date(i + 1)
        .format('YYYY-MM-DD')
    );
  };

  const toggleDate = (date: string) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  return (
    <div className="flex gap-4">
      {[0, 1].map((monthOffset) => (
        <div key={monthOffset} className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <button className="px-2 py-1 border rounded hover:bg-gray-200">
              {'<'}
            </button>
            <span className="font-semibold">
              {today.clone().add(monthOffset, 'months').format('MMMM YYYY')}
            </span>
            <button className="px-2 py-1 border rounded hover:bg-gray-200">
              {'>'}
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-center font-medium text-gray-500">
                {d}
              </div>
            ))}
            {getMonthDays(monthOffset).map((date) => {
              const isSelected = selectedDates.includes(date);
              return (
                <button
                  key={date}
                  onClick={() => toggleDate(date)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    isSelected
                      ? 'yellow-orange text-white'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  {moment(date).date()}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
