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
import { API_SERVER } from '@/config/api-path';
import { IMAGE_PATH } from '@/config/image-path';

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
  // console.log('userId==>', userId);
  // console.log('pid==>', pid);
  const [itineraryList, setItineraryList] = useState<ItineraryLisInterface>();

  const photoProviderRef = useRef<PhotoProviderRef>(null);
  // const [baseTime, setBaseTime] = useState(data.brigade_days[0].start_time);
  const [mapPoint, setMapPoint] = useState({
    latitude: 25.033,
    longitude: 121.5654,
  });

  const url = `${API_SERVER}/itineraries/itinerary-list?itineraryId=${pid}&userId=${userId}`;

  const { data, refetch } = useFetch(url);

  useEffect(() => {
    refetch();
  }, [pid]);

  useEffect(() => {
    if (data?.success) {
      setItineraryList(data.data[0]);
    }
    console.log('data===M>', itineraryList);
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
    return `${IMAGE_PATH}itineraries_photo/${fileName}`;
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
      className="border-2 border-gray-200 "
    >
      {/* image區 */}

      <PhotoProvider>
        <div className="flex gap-4 relative">
          {images && images?.length === 2 && (
            <div className="w-[900px] h-[250px] flex gap-4 m-auto">
              <PhotoView src={toImgUrl(images[0].imageName)}>
                {/* 使用原生 img 並綁定 id，以便用 document.getElementById(...).click() 觸發 PhotoView */}
                <img
                  id="first-photo-trigger"
                  src={toImgUrl(images[0].imageName)}
                  alt=""
                  className="shrink-0 w-full h-full object-cover"
                />
              </PhotoView>
              <PhotoView src={toImgUrl(images[1].imageName)}>
                {/* 使用原生 img 並綁定 id，以便用 document.getElementById(...).click() 觸發 PhotoView */}
                <img
                  src={toImgUrl(images[1].imageName)}
                  alt=""
                  className="shrink-0 w-full h-full object-cover"
                />
              </PhotoView>

              <button
                onClick={openAll}
                className="absolute rounded-full bg-[#05073C] text-white px-10 py-5 right-5 bottom-5 cursor-pointer"
              >
                查看所有照片
              </button>
            </div>
          )}
          {images && images?.length === 3 && (
            <>
              <PhotoView src={toImgUrl(images[0].imageName)}>
                {/* 使用原生 img 並綁定 id，以便用 document.getElementById(...).click() 觸發 PhotoView */}
                <img
                  id="first-photo-trigger"
                  src={toImgUrl(images[0].imageName)}
                  alt=""
                  className="shrink-0 w-[900px] h-full object-cover"
                />
              </PhotoView>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <PhotoView src={toImgUrl(images[1].imageName)}>
                    <div className="relative w-[300px] h-[295px]">
                      <Image
                        fill
                        sizes="300px"
                        src={toImgUrl(images[1].imageName)}
                        alt=""
                        className="object-cover"
                      />
                    </div>
                  </PhotoView>
                  <PhotoView src={toImgUrl(images[2].imageName)}>
                    <div className="relative w-[300px] h-[290px]">
                      <Image
                        fill
                        sizes="300px"
                        src={toImgUrl(images[2].imageName)}
                        alt=""
                        className="object-cover"
                      />
                    </div>
                  </PhotoView>
                </div>
              </div>

              <button
                onClick={openAll}
                className="absolute rounded-full bg-[#05073C] text-white px-10 py-5 right-5 bottom-5 cursor-pointer"
              >
                查看所有照片
              </button>
            </>
          )}
          {images && images?.length >= 4 && (
            <div className="flex h-full">
              <div className="flex gap-4">
                <PhotoView src={toImgUrl(images[0].imageName)}>
                  {/* 使用原生 img 並綁定 id，以便用 document.getElementById(...).click() 觸發 PhotoView */}
                  <div className="h-full w-[770px] shrink-0">
                    <img
                      id="first-photo-trigger"
                      src={toImgUrl(images[0].imageName)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </PhotoView>
                <div className="flex flex-col gap-4">
                  <PhotoView src={toImgUrl(images[1].imageName)}>
                    <div className="relative w-full h-[250px]">
                      <Image
                        fill
                        sizes="510px"
                        src={toImgUrl(images[1].imageName)}
                        alt=""
                        className="object-cover"
                      />
                    </div>
                  </PhotoView>

                  <div className="flex gap-4">
                    <PhotoView src={toImgUrl(images[2].imageName)}>
                      <div className="relative w-[250px] h-[250px]">
                        <Image
                          fill
                          sizes="250px"
                          src={toImgUrl(images[2].imageName)}
                          alt=""
                          className="object-cover"
                        />
                      </div>
                    </PhotoView>
                    <PhotoView src={toImgUrl(images[3].imageName)}>
                      <div className="relative w-[250px] h-[250px]">
                        <Image
                          fill
                          sizes="250px"
                          src={toImgUrl(images[3].imageName)}
                          alt=""
                          className="object-cover"
                        />
                      </div>
                    </PhotoView>
                  </div>
                </div>

                <button
                  onClick={openAll}
                  className="absolute rounded-full bg-[#05073C] text-white px-10 py-5 right-5 bottom-5 cursor-pointer"
                >
                  查看所有照片
                </button>
              </div>
              {/* 隱藏照片 5-6的照片 */}
              <div className="hidden">
                {images.slice(4, images.length).map((img, index) => (
                  <PhotoView key={index} src={toImgUrl(img.imageName)}>
                    <span></span>
                  </PhotoView>
                ))}
              </div>
            </div>
          )}
        </div>
      </PhotoProvider>

      {/* <PhotoProvider
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
      {/* <Image
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
        </div> */}
      {/* </PhotoProvider> */}
      {/* 個人資訊 貼文內容 */}
      <section className="w-full px-[200px]">
        <div className=" flex justify-between mt-10">
          {/* 團主個人訊息 */}
          <div className="flex items-center gap-[20px]">
            <Image width={77} height={77} src={'/avatar.png'} alt="" />
            <h3 className="text-xl">{itineraryList?.nickname}</h3>
            <InfoButton button_name="個人檔案" />
          </div>
          {/* 參與人數 */}
          <div className=" flex items-end gap-[30px]">
            {/* <p className="text-lg">
              合計{itineraryList?.Itineraries?.[0]?.figure ?? 1}人
            </p> */}
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
      <section className="w-full px-[80px] mb-4">
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
      <section className="bg-light-gray w-full h-auto py-6">
        <div className="px-[200px] grid grid-cols-2">
          {/* 行程區 */}
          <div className="overflow-auto">
            <h2 className="text-3xl h-[97px] flex items-center">活動流程</h2>
            <div>
              {/* 有才顯示 */}
              {itineraryList?.Itineraries?.[0]?.Days &&
                itineraryList?.Itineraries?.[0]?.Days.map(
                  (day: Day, dayIndex: number) => {
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
                                      latitude: node.Attraction?.lat,
                                      longitude: node.Attraction?.lng,
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
                                  <p>{node.Attraction?.name}</p>
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
