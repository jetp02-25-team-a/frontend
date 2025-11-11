'use client';

import { useState, useEffect } from 'react';
import moment from 'moment';

interface DatePickerProps {
  initialDates?: string[];
  onChange?: (data: {
    startDate: string | null;
    endDate: string | null;
  }) => void;
}

export default function DatePicker({
  initialDates = [],
  onChange,
}: DatePickerProps) {
  const today = moment();

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  // console.log('===>', startDate);

  //日期變化 出發回傳
  useEffect(() => {
    if (onChange) onChange({ startDate, endDate });
  }, [startDate, endDate]);

  useEffect(() => {
    if (initialDates.length > 0) {
      setStartDate(initialDates[0]);
      if (initialDates.length > 1) setEndDate(initialDates[1]);
    }
  }, [initialDates]);

  const handleSelect = (date: string) => {
    // 如果目前只有開始日期，且再點同一天 → 清除
    if (startDate === date && !endDate) {
      setStartDate(null);
      setEndDate(null);
      return;
    }

    if (!startDate || (startDate && endDate)) {
      // 沒選過或已完成一組 → 重新開始
      setStartDate(date);
      setEndDate(null);
    } else if (moment(date).isBefore(startDate)) {
      // 如果點到比 start 早的日期 → 反轉
      setStartDate(date);
      setEndDate(startDate);
    } else {
      //  新增這段：檢查是否超過 7 天
      const diffDays = moment(date).diff(moment(startDate), 'days');
      if (diffDays >= 7) {
        console.log('最多只能選擇 7 天內的範圍');
        return;
      }

      // 正常第二次選擇結束日
      setEndDate(date);
    }
  };

  // // 點選日期的邏輯
  // const handleSelect = (date: string) => {
  //   if (!startDate || (startDate && endDate)) {
  //     // 沒選過或已完成一組 → 重新開始
  //     setStartDate(date);
  //     setEndDate(null);
  //   } else if (moment(date).isBefore(startDate)) {
  //     // 如果點到比 start 早的日期 → 反轉
  //     setStartDate(date);
  //     setEndDate(startDate);
  //   } else {
  //     // 正常第二次選擇結束日
  //     setEndDate(date);
  //   }
  // };

  // 判斷日期是否在選擇範圍內
  const isInRange = (date: string) => {
    if (!startDate || !endDate) return false;
    return moment(date).isBetween(startDate, endDate, 'day', '[]');
  };

  // 產生這個月與下個月的所有日期
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

  return (
    <div className="flex gap-4">
      {[0, 1].map((monthOffset) => (
        <div key={monthOffset} className="border rounded-lg p-4">
          {/* 標題區 */}
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

          {/* 星期 */}
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-center font-medium text-gray-500">
                {d}
              </div>
            ))}

            {/* 日期按鈕 */}
            {getMonthDays(monthOffset).map((date) => {
              const isSelected = date === startDate || date === endDate;
              const inRange = isInRange(date);

              return (
                <button
                  key={date}
                  onClick={() => handleSelect(date)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full 
                    ${
                      isSelected
                        ? 'bg-orange-500 text-white'
                        : inRange
                          ? 'bg-orange-200'
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
