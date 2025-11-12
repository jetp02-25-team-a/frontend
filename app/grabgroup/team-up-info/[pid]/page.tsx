'use client';
import InfoButton from '../_components/InfoButton';
import JoinButton from '@/components/ui/join-button';
import { useAuth } from '@/hooks/use-Auth';
import { useEffect, useState } from 'react';
import Map from '../_components/GoogleMap';
import MessageBox from '../_components/MessageBox';
import ResponseBox from '../_components/ResponseBox';
import { useParams, useSearchParams } from 'next/navigation';
import { useFetch } from '@/hooks/useFetch';
import Image from 'next/image';
import { addMinutes } from 'date-fns';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import Link from 'next/link';
import Toast from '../_components/Toast';
import { AVATAR_PATH, IMAGE_PATH } from '../../../config/image-path';
import { API_SERVER } from '../../../config/api-path';

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
  Sender: {
    nickname: string;
    fullName: string;
    avatar: string;
  };
}

interface ItineraryLisInterface {
  id: number;
  fullName: string;
  nickname: string;
  avatar: string;
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
  const { user, isReady } = useAuth();
  const params = useParams();
  const userId = useSearchParams().get('userId');
  const { pid } = params;
  const [itineraryList, setItineraryList] = useState<ItineraryLisInterface>();
  const [commentLimit, setCommentLimit] = useState<number>(3);
  const [showAllImage, setShowAllImage] = useState<boolean>(false);
  // We'll trigger PhotoView by clicking a native <img> via its DOM id to avoid React ref warnings
  // const [baseTime, setBaseTime] = useState(data.brigade_days[0].start_time);
  const [mapPoint, setMapPoint] = useState({
    latitude: 25.033,
    longitude: 121.5654,
  });
  //吐司
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type?: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success',
  });

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message: msg, type });
  };

  const url = `${API_SERVER}/itineraries/itinerary-list?itineraryId=${pid}&userId=${userId}`;

  const { data, refetch } = useFetch(url);

  useEffect(() => {
    refetch();
  }, [pid, refetch]);

  useEffect(() => {
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
    return `${IMAGE_PATH}/itineraries_photo/${fileName}`;
  };
  const openAll = () => {
    const el = document.getElementById('first-photo-trigger') as HTMLElement | null;
    if (el) {
      // dispatch a sequence of events to better trigger 3rd-party listeners
      ['pointerdown', 'pointerup', 'click'].forEach((type) =>
        el.dispatchEvent(
          new MouseEvent(type, { bubbles: true, cancelable: true, view: window })
        )
      );
    }
  };
  //pid
  const handleInvite = async (userId: number, itineraryId: number) => {
    const url = `${API_SERVER}/itineraries/invite`;
    // const { itineraryId, senderId, receiverId } = req.body;

    if (!user) return;
    const data = {
      itineraryId: itineraryId,
      senderId: userId,
      receiverId: itineraryList?.id,
    };

    try {
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (result.ok) showToast('邀約發送', 'success');
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {/* image區 */}

      <PhotoProvider>
        <div className="flex gap-4 relative">
          {images && images?.length >= 4 && (
            <>
              <PhotoView src={toImgUrl(images[0].imageName)}>
                {/* 使用原生 img 並綁定 id，以便用 document.getElementById(...).click() 觸發 PhotoView */}
                <img
                  id="first-photo-trigger"
                  src={toImgUrl(images[0].imageName)}
                  alt=""
                  className="shrink-0 w-[770px] h-[510px] object-cover"
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
                onClick={openAll}
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
          <div className="flex items-center gap-5">
            <div className="w-[77px] h-[77px] shrink-0 relative">
              <Image
                fill
                src={
                  itineraryList?.avatar
                    ? `${AVATAR_PATH}${itineraryList?.avatar}`
                    : '/avatar_default.png'
                }
                alt=""
                className="rounded-full object-cover"
              />
            </div>
            {/* <Image width={77} height={77} src={'/avatar.png'} alt="" /> */}
            <h3 className="text-xl">{itineraryList?.nickname}</h3>
            <Link
              href={
                user.id === itineraryList?.id
                  ? `/member/user-info`
                  : `/member/${itineraryList?.id}`
              }
            >
              <InfoButton button_name="個人檔案" />
            </Link>
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

        <h2 className="text-xl">
          {itineraryList?.Itineraries?.[0].Article?.title}
        </h2>
        <p className="text-base">
          {itineraryList?.Itineraries?.[0]?.Article?.content}
        </p>
        <JoinButton
          className="mx-auto"
          content="加入我們"
          onClick={() => {
            if (user) handleInvite(user?.id, Number(pid));
          }}
        />
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            duration={2000}
            onClose={() => setToast((prev) => ({ ...prev, show: false }))}
          />
        )}
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
            <Map latitude={mapPoint.latitude} longitude={mapPoint.longitude} />
          </div>
        </div>
      </section>
      {/* </div> */}
      {/* 留言區 */}
      <section className=" flex flex-col py-16 gap-6">
        <h2 className="text-3xl text-left m-auot">留言區</h2>

        <div className="gap-y-6 flex flex-col items-center">
          {comments &&
            comments
              .slice(0, commentLimit)
              .map((comment: Comments, index: number) => {
                return (
                  <MessageBox
                    key={index}
                    avatar={`${AVATAR_PATH}${comment.Sender.avatar}`}
                    user_name={comment.Sender.nickname}
                    create_at={new Date(comment.updatedAt).toLocaleDateString()}
                    content={comment.content}
                  />
                );
              })}
          {comments && commentLimit !== comments?.length ? (
            <button
              className="hover:text-blue-500"
              onClick={() => setCommentLimit(commentLimit + 3)}
            >
              觀看更多留言
            </button>
          ) : (
            ''
          )}
        </div>
        <ResponseBox
          itineraryId={Number(pid)}
          onSuccess={() => {
            refetch(); //立即重新抓資料，留言區會刷新
          }}
        />
      </section>
    </>
  );
}
