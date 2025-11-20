import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function InputField() {
  const [destination, setDestination] = useState(''); //地點
  const [startDate, setStartDate] = useState<Date | null>(null); //時間
  const [people, setPeople] = useState<number>(0); // 人數
  return (
    <>
      <div className="border-2 border-[#D9D9D9] bg-white rounded-full w-full max-w-[600px] h-[64px] customize_shadow flex items-center justify-between px-[26px] py-[20px] ">
        <div className="flex items-center w-[200px] justify-between">
          <p className="text-gray-500 shrink-0">目的地:</p>
          <input
            list="area"
            type="text"
            placeholder="＃台北市"
            value={destination}
            className="text-sm text-gray-700"
            onChange={(e) => setDestination(e.target.value)}
          />
          <datalist id="area">
            <option value="台北市"></option>
            <option value="新北市"></option>
            <option value="桃園市"></option>
            <option value="台中市"></option>
            <option value="高雄市"></option>
          </datalist>
        </div>
        {/*  */}
        <div className="flex items-center w-[200px] gap-2.5">
          <div className="customize_gray h-5 w-0.5 shrink-0"></div>
          <p className="text-gray-500 shrink-0">出發時間:</p>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy/MM/dd HH:mm"
            minDate={new Date()}
            // className="border border-gray-400 rounded-lg px-2 py-1"
            placeholderText="出發時間"
          />
        </div>
        {/*  */}
        <div className="flex items-center w-[200px] gap-2.5">
          <div className="customize_gray h-5 w-0.5 shrink-0"></div>
          <p className="text-gray-500 shrink-0">人數：</p>
          <input
            type="number"
            className="w-[72px] text-gray-700 shrink-0"
            value={people}
            onChange={(e) => setPeople(+e.target.value)}
          />
        </div>
        <Link
          href={{
            pathname: '/grabgroup/team-up',
            query: {
              destination,
              startDate: startDate ? startDate.toISOString() : '',
              people,
            },
          }}
        >
          <button className="bg-amber-400 text-white px-3 py-3 flex justify-center items-center gap-2.5 rounded-full cursor-pointer">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </Link>
      </div>
    </>
  );
}
