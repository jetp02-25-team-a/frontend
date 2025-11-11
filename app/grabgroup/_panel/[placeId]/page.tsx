'use client';
import { useParams, usePathname } from 'next/navigation';
import RagularButton from '../../../../components/ui/regular-button';
import { useFetch } from '../../../../hooks/useFetch';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import dayjs, { Dayjs } from 'dayjs';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface PlaceData {
  placeId: string;
  name: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  photoReference: string;
  createdAt: string;
}

export default function KeyWordPage() {
  const searchParams = useSearchParams();
  const daydata = searchParams.get('daydata'); //日期
  const { placeId } = useParams();
  // const path = usePathname();
  const [url, setUrl] = useState<string>();
  const [placeData, setPlaceData] = useState<PlaceData>();
  const [durationMinutes, setDurationMinutes] = useState<number>(0);

  const { data, loading, error, refetch } = useFetch(url);

  //1. 有placeId setUrl
  useEffect(() => {
    if (placeId) {
      const api = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/api/itineraries/place?placeId=${placeId}`;
      setUrl(api);
    }
  }, [placeId]);

  //2. url 被設置後 執行fetch
  useEffect(() => {
    if (url) refetch();
  }, [url]);

  //3. 有新資料後 setPlaceData
  useEffect(() => {
    if (data) {
      console.log('data_address =>', data);
      setPlaceData(data);
    }
  }, [data]);

  const handelInsertNode = async (
    day: any,
    durationMinutes: any,
    googlePlaceId: any
  ) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/api/itineraries/create-node`;
      const data = {
        day: day,
        durationMinutes: durationMinutes,
        googlePlaceId: googlePlaceId,
      };

      const result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!result) return;
      if (result.ok) {
        console.log('可以關閉視窗了');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {placeData && (
        <>
          {placeData?.photoReference ? (
            <img
              src={placeData.photoReference}
              alt={placeData.name}
              width={400}
              height={400}
              className="w-full h-[244px]"
            />
          ) : (
            <p>這個地點沒有圖片</p>
          )}
          <div>
            <label htmlFor="">停留時間:</label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              min={0}
              step={5} // 每次加減 5 分鐘
              className="border rounded p-2 w-24 text-center"
              placeholder="分鐘"
            />
          </div>
          <div className="m-5">
            <h1 className="text-[24px]">{placeData?.name}</h1>
            <p className="text-5">位置: {placeData?.formattedAddress}</p>
          </div>

          <RagularButton
            content="加入行程"
            onClick={() => {
              if (daydata)
                handelInsertNode(daydata, durationMinutes, placeData.placeId);
            }}
          />
        </>
      )}
    </>
  );
}
