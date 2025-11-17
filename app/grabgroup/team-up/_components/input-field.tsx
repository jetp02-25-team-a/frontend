import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faMapMarkerAlt,
  faClock,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function InputField() {
  const [destination, setDestination] = useState(''); //地點
  const [showDropdown, setShowDropdown] = useState(false);
  const areaOptions = ['台北市', '新北市', '桃園市', '台中市', '高雄市'];
  const [startDate, setStartDate] = useState<Date | null>(null); //時間
  const [people, setPeople] = useState<number>(0); // 人數
  return (
    <>
      <div className="border-2 border-[#D9D9D9] bg-white rounded-full w-[1048px] h-[64px] customize_shadow flex items-center justify-between px-[26px] py-[20px] ">
        <div className="flex-1 flex items-center min-w-0">
          <label
            className="text-gray-500 mb-1 font-medium flex items-center"
            htmlFor="destination-input"
          >
            <span className="inline-flex items-center gap-1">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-amber-400"
              />
              目的地
            </span>
          </label>
          <div className="relative flex-1 mx-3">
            <input
              id="destination-input"
              type="text"
              placeholder="＃台北市"
              value={destination}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              onChange={(e) => setDestination(e.target.value)}
              autoComplete="off"
              className="rounded-full border border-gray-300 px-4 py-2 shadow-inner focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition text-gray-700 bg-gray-50 placeholder-gray-400 w-full"
            />
            {showDropdown && (
              <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-10">
                {areaOptions.map((option) => (
                  <button
                    type="button"
                    key={option}
                    className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 transition ${destination === option ? 'bg-amber-100 font-bold' : ''}`}
                    onMouseDown={() => {
                      setDestination(option);
                      setShowDropdown(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/*  */}
        <div className="flex-1 flex items-center min-w-0 mr-6 gap-2.5">
          <div className="customize_gray h-5 w-0.5 shrink-0"></div>
          <span className="inline-flex items-center gap-1 text-gray-500 shrink-0">
            <FontAwesomeIcon icon={faClock} className="text-amber-400" />
            出發時間:
          </span>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy/MM/dd HH:mm"
            minDate={new Date()}
            // className="border border-gray-400 rounded-lg px-2 py-1"
            placeholderText="選擇開始日期與時間"
          />
        </div>
        {/*  */}
        <div className="flex-1 flex items-center min-w-0 mr-6 gap-2.5">
          <div className="customize_gray h-5 w-0.5 min-w-[2px] bg-gray-300"></div>
          <div className="flex  w-full items-center">
            <div className="flex items-center">
              <span className="inline-flex items-center gap-1 text-gray-500 mb-1 w-14 shrink-0 text-center">
                <FontAwesomeIcon
                  icon={faUserFriends}
                  className="text-amber-400"
                />
                人數：
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 shadow-inner border border-gray-300 flex-1 max-w-[150px]">
              <button
                type="button"
                className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-500 hover:bg-amber-100 transition text-base"
                onClick={() => setPeople(people > 0 ? people - 1 : 0)}
                disabled={people <= 0}
              >
                -
              </button>
              <input
                type="number"
                className="w-12 text-center bg-transparent outline-none text-gray-700 font-semibold"
                min={0}
                value={people}
                onChange={(e) => {
                  const val = +e.target.value;
                  setPeople(val < 0 ? 0 : val);
                }}
                style={{ MozAppearance: 'textfield' }}
              />
              <button
                type="button"
                className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-500 hover:bg-amber-100 transition text-base"
                onClick={() => setPeople(people + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <Link
          href={{
            pathname: './create-group-itinerary',
            query: {
              destination,
              startDate: startDate ? startDate.toISOString() : '',
              people,
            },
          }}
        >
          <button className="bg-amber-400 text-white px-[30px] py-2.5 flex justify-center items-center gap-2.5 rounded-full cursor-pointer">
            <FontAwesomeIcon icon={faPlus} />
            新增行程
          </button>
        </Link>
      </div>
    </>
  );
}
