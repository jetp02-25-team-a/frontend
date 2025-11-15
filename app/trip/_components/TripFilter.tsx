import { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { zhTW } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

registerLocale('zh-TW', zhTW);

interface TripFilterProps {
  onSearch: (filters: {
    area: string;
    startDate?: string;
    endDate?: string;
  }) => void;
}

export default function TripFilter({ onSearch }: TripFilterProps) {
  const [area, setArea] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSearch = () => {
    onSearch({
      area,
      startDate: startDate?.toISOString().split('T')[0],
      endDate: endDate?.toISOString().split('T')[0],
    });
  };

  return (
    <div className="border-2 border-[#D9D9D9] bg-white rounded-full w-[1048px] h-[64px] customize_shadow flex items-center justify-between px-[26px] py-[20px]">
      <div className="flex items-center w-[200px] justify-between">
        <input
          type="text"
          placeholder="目的地"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="focus:outline-none w-full"
        />
      </div>

      <div className="flex items-center w-[200px] gap-[10px]">
        <div className="customize_gray h-[20px] w-[2px]"></div>
        <DatePicker
          locale="zh-TW"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="開始時間"
          dateFormat="yyyy/MM/dd"
          className="focus:outline-none w-[100px]"
        />
      </div>

      <div className="flex items-center w-[200px] gap-[10px]">
        <div className="customize_gray h-[20px] w-[2px]"></div>
        <DatePicker
          locale="zh-TW"
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          minDate={startDate ?? undefined}
          placeholderText="結束時間"
          dateFormat="yyyy/MM/dd"
          className="focus:outline-none w-[100px]"
        />
      </div>

      <button
        onClick={handleSearch}
        className="bg-amber-400 text-white px-[30px] py-[10px] flex justify-center items-center gap-[10px] rounded-full"
      >
        <FontAwesomeIcon icon={faSearch} />
        搜尋
      </button>
    </div>
  );
}
