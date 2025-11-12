'use client';

import { FiMapPin, FiCalendar, FiUsers, FiSearch } from 'react-icons/fi';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { addMonths } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/navigation';

interface SearchFieldProps {
  icon: React.ElementType;
  type: 'location' | 'from' | 'end' | 'guest';
  value: string | number | Date | null;
  onChange: (val: any) => void;
  startDate?: Date | null;
  endDate?: Date | null;
}

const SearchField = ({
  icon: Icon,
  type,
  value,
  onChange,
  startDate,
  endDate,
}: SearchFieldProps) => {
  let placeholder = '';
  let inputElement: React.ReactNode;

  switch (type) {
    case 'location':
      placeholder = '你想去哪？';
      inputElement = (
        <input
          type="text"
          placeholder={placeholder}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border-none outline-none font-semibold text-gray-800 placeholder-gray-400 bg-transparent"
        />
      );
      break;
    case 'from':
      placeholder = 'Check-in';
      inputElement = (
        <DatePicker
          selected={value as Date | null}
          onChange={(date) => onChange(date)}
          placeholderText={placeholder}
          selectsStart
          startDate={startDate ?? null}
          endDate={endDate ?? null}
          dateFormat="yyyy/MM/dd"
          minDate={new Date()}
          className="flex-1 border-none outline-none font-semibold text-gray-800 placeholder-gray-400 bg-transparent"
        />
      );
      break;
    case 'end':
      placeholder = 'Check-out';
      inputElement = (
        <DatePicker
          selected={value as Date | null}
          onChange={(date) => onChange(date)}
          placeholderText={placeholder}
          selectsEnd
          startDate={startDate ?? null}
          endDate={endDate ?? null}
          minDate={startDate ?? new Date()}
          maxDate={addMonths(new Date(), 6)}
          dateFormat="yyyy/MM/dd"
          className="flex-1 border-none outline-none font-semibold text-gray-800 placeholder-gray-400 bg-transparent"
        />
      );
      break;
    case 'guest':
      placeholder = 'Guests';
      inputElement = (
        <input
          type="number"
          min={1}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border-none outline-none font-semibold text-gray-800 placeholder-gray-400 bg-transparent"
        />
      );
      break;
  }

  return (
    <div className="flex flex-1 grow items-center gap-2">
      <Icon className="w-6 h-6 text-brand" />
      {inputElement}
    </div>
  );
};

// ---

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className }: SearchBarProps) {
  const [location, setLocation] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState('1');

  const router = useRouter();

  const handleSearch = () => {
    const query = new URLSearchParams({
      keyword: location,
      checkInDate: fromDate ? fromDate.toISOString() : '',
      checkOutDate: endDate ? endDate.toISOString() : '',
      guestCount: guests,
    }).toString();

    router.push(`/accommodations/search?${query}`);
  };

  return (
    <div
      className={`flex items-center justify-between pl-6 pr-3 py-1.5 bg-white rounded-[72px] border border-solid border-gray-300 customize_shadow ${className}`}
    >
      <div className="flex items-center justify-center gap-12">
        <SearchField
          icon={FiMapPin}
          type="location"
          value={location}
          onChange={setLocation}
        />
        <div className="w-px h-[33px] bg-gray-300 mx-2" />
        <SearchField
          icon={FiCalendar}
          type="from"
          value={fromDate}
          onChange={setFromDate}
          startDate={fromDate}
          endDate={endDate}
        />
        <div className="w-px h-[33px] bg-gray-300 mx-2" />
        <SearchField
          icon={FiCalendar}
          type="end"
          value={endDate}
          onChange={setEndDate}
          startDate={fromDate}
          endDate={endDate}
        />
        <div className="w-px h-[33px] bg-gray-300 mx-2" />
        <SearchField
          icon={FiUsers}
          type="guest"
          value={guests}
          onChange={setGuests}
        />
      </div>

      <div
        className="w-12 h-12 flex items-center justify-center bg-brand rounded-full cursor-pointer"
        onClick={handleSearch}
      >
        <FiSearch className="w-6 h-6 text-white" />
      </div>
    </div>
  );
}
