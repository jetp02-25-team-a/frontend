'use client';
import InfoButton from '../_components/InfoButton';
import { useEffect, useState, useRef } from 'react';
import Map from '../../_components/GoogleMap';
import JoinButton from '@/components/ui/join-button';
import { useParams } from 'next/navigation';
import { useFetch } from '@/hooks/useFetch';
import Image from 'next/image';
import { addMinutes } from 'date-fns';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { useAuth } from '@/hooks/use-Auth';

interface Nodes {
  durationMinutes: number;
  GoogleMapPlace: {
    name: string;
    lat: number;
    lng: number;
  };
}
interface Day {
  dayDate: string;
  startTime: string;
  Nodes: Nodes[];
}
interface ImageName {
  imageName: string;
}

interface Comments {
  senderId: number;
  content: string;
  updatedAt: string;
}

interface ItineraryLisInterface {
  fullName: string;
  nickname: string;
  Itineraries: [
    {
      id: number;
      userId: number;
      title: string;
      createdAt: string;
      updatedAt: string;
      area: string;
      status: number;
      figure: number;
      Days: Day[];
      Images: ImageName[];
      ItineraryComments: Comments[];
      Article: {
        title: string;
        content: string;
        publishedAt: string;
      };
    },
  ];
}

interface PhotoProviderRef {
  open: (index?: number) => void;
}

export default function PlacePage() {
  const params = useParams();
  const { user, isReady } = useAuth();
  // const userId = useSearchParams().get('userId');
  const userId = user?.id;
  const { pid } = params;
  console.log('userId==>', userId);
  console.log('pid==>', pid);
  const [itineraryList, setItineraryList] = useState<ItineraryLisInterface>();

  const photoProviderRef = useRef<PhotoProviderRef>(null);
  // const [baseTime, setBaseTime] = useState(data.brigade_days[0].start_time);
  const [mapPoint, setMapPoint] = useState({
    latitude: 25.033,
    longitude: 121.5654,
  });

  const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/api/itineraries/itinerary-list?itineraryId=${pid}&userId=${userId}`;

  const { data, refetch } = useFetch(url);

  useEffect(() => {
    refetch();
  }, [pid]);

  useEffect(() => {
    console.log('data change=>', data);
    if (data?.success) {
      setItineraryList(data.data[0]);
    }
  }, [data]);

  function changeTime(time: string) {
    return new Date(time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
  const images = itineraryList?.Itineraries?.[0].Images;
  const comments = itineraryList?.Itineraries?.[0].ItineraryComments;
  const toImgUrl = (fileName: string) => {
    return `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/images/${fileName}`;
  };
  const [showAll, setShowAll] = useState(false);
  const btnRef = useRef<HTMLImageElement>(null); //抓img
  const openAll = () => {
    photoProviderRef.current?.open(0); // 從第一張開始開啟
  };
  useEffect(() => {
    if (showAll) btnRef.current?.click(); // 為真自動觸發
  }, [showAll]);
  return (
    <div
      style={{ pointerEvents: 'none' }}
      className="py-10 border-2 border-gray-200 m-20"
    >
      {/* image區 */}

      <PhotoProvider
        //按下叉叉切換為假隱藏
        onVisibleChange={(visible: boolean) => {
          if (!visible) {
            setShowAll(false);
          }
        }}
      >
        <div className="flex gap-4 relative relative">
          {images && images?.length >= 4 && (
            <>
              <PhotoView src={toImgUrl(images[0].imageName)}>
                {/* ref觸發照片輪播用 */}
                <Image
                  width={1000}
                  height={1000}
                  src={toImgUrl(images[0].imageName)}
                  alt=""
                  className="shrink-0 w-[770px] h-[510px]"
                  ref={btnRef}
                />
              </PhotoView>
              <div className="flex flex-col gap-4">
                <PhotoView src={toImgUrl(images[1].imageName)}>
                  <Image
                    width={1000}
                    height={1000}
                    src={toImgUrl(images[1].imageName)}
                    alt=""
                    className="w-[510] h-[250px]"
                  />
                </PhotoView>

                <div className="flex gap-4">
                  <PhotoView src={toImgUrl(images[2].imageName)}>
                    <Image
                      width={1000}
                      height={1000}
                      src={toImgUrl(images[2].imageName)}
                      alt=""
                      className="w-[250px] h-[250px]"
                    />
                  </PhotoView>
                  <PhotoView src={toImgUrl(images[3].imageName)}>
                    <Image
                      width={1000}
                      height={1000}
                      src={toImgUrl(images[3].imageName)}
                      alt=""
                      className="w-[250px] h-[250px]"
                    />
                  </PhotoView>
                </div>
              </div>

              <button
                onClick={() => setShowAll(true)}
                className="absolute rounded-full bg-[#05073C] text-white px-10 py-5 right-5 bottom-5 cursor-pointer"
              >
                查看所有照片
              </button>
            </>
          )}
        </div>
      </PhotoProvider>
      {/* 個人資訊 貼文內容 */}
      <section className="w-full px-[200px]">
        <div className=" flex justify-between">
          {/* 團主個人訊息 */}
          <div className="flex items-center gap-[20px]">
            <Image width={77} height={77} src={'/avatar.png'} alt="" />
            <h3 className="text-xl">{itineraryList?.nickname}</h3>
            <InfoButton button_name="個人檔案" />
          </div>
          {/* 參與人數 */}
          <div className=" flex items-end gap-[30px]">
            <p className="text-lg">
              合計{itineraryList?.Itineraries?.[0]?.figure ?? 1}人
            </p>
            <div className="flex">
              {/* {data.join_persons.map((v, i) => {
                return (
                  <img
                    key={i}
                    src={v.avatar}
                    className="w-[50px] h-[50px] object-cover border-2 border-white rounded-full -ml-5"
                  />
                );
              })} */}
            </div>
          </div>
        </div>
      </section>
      {/* 揪團標題 文章 */}
      <section className="w-full px-[200px]">
        <h2 className="text-2xl">{itineraryList?.Itineraries?.[0].title}</h2>
        {/* 副標題 */}
        <h2 className="text-xl">
          {itineraryList?.Itineraries?.[0].Article.title}
        </h2>
        <p className="text-base">
          {itineraryList?.Itineraries?.[0]?.Article?.content}
        </p>
        <JoinButton className="mx-auto" content="加入我們" />
      </section>
      {/* 行程 */}
      <section className="bg-light-gray w-full h-auto py-16">
        <div className="px-[200px] grid grid-cols-2">
          {/* 行程區 */}
          <div className="overflow-auto">
            <h2 className="text-3xl h-[97px] flex items-center">活動流程</h2>

            <div>
              {/* 有才顯示 */}
              {itineraryList?.Itineraries?.[0]?.Days &&
                itineraryList?.Itineraries?.[0]?.Days.map(
                  (day: Day, dayIndex: number) => {
                    const baseTime = day.startTime;
                    return (
                      <div key={dayIndex}>
                        {/* 天數開頭 */}
                        <div className="flex items-center gap-[15px]">
                          <div className="bg-orange-700 rounded-full w-[30px] h-[30px]"></div>
                          <h2>{`第${dayIndex + 1}天行程`}</h2>
                        </div>
                        <div className="ml-3.5 h-[30px] border-l-2 border-dashed border-amber-700"></div>
                        {/* nodes */}
                        <div>
                          {day.Nodes.map((node: any, nodeIndex: number) => {
                            return (
                              <div key={nodeIndex}>
                                <div
                                  className="flex gap-[15px] ml-1.5 items-center cursor-pointer"
                                  onClick={() => {
                                    setMapPoint({
                                      latitude: node.GoogleMapPlace?.lat,
                                      longitude: node.GoogleMapPlace?.lng,
                                    });
                                  }}
                                >
                                  <div className="border-3 border-amber-700 rounded-full w-[18px] h-[18px]"></div>
                                  <p>
                                    {nodeIndex === 0
                                      ? changeTime(day.startTime)
                                      : changeTime(
                                          addMinutes(
                                            day.startTime,
                                            day.Nodes?.[nodeIndex - 1]
                                              ?.durationMinutes
                                          ).toISOString()
                                        )}
                                  </p>
                                  <p>{node.GoogleMapPlace?.name}</p>
                                </div>

                                {nodeIndex === day.Nodes.length - 1 ? (
                                  <div className="h-[30px]"></div>
                                ) : (
                                  <div className="ml-3.5 h-[30px] border-l-2 border-dashed border-amber-700"></div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
          </div>
          {/* map區 */}
          <div className="w-full mx-auto my-auto ">
            <Map
              latitude={mapPoint.latitude}
              longitude={mapPoint.longitude}
              width={400}
              height={400}
            />
          </div>
        </div>
      </section>
      {/* </div> */}
    </div>
  );
}
