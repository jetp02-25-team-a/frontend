'use client';

import PanelCard from './_components/panel-card';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useFetch } from '../../../hooks/useFetch';
import { number } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

interface NodeData {
  id: number;
  placeId: string;
  name: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  photoReference: string;
  createdAt: string;
}

export default function PanelPage() {
  const searchParams = useSearchParams();
  const daydata = searchParams.get('daydata'); //點選的節點日期
  // console.log('daydata', daydata);
  const [inputContent, setInputContent] = useState<string | null>();
  const [url, setUrl] = useState<string | undefined>(undefined);
  const { data, loading, error, refetch } = useFetch(url);

  const [nodes, setNodes] = useState<NodeData[] | undefined>(undefined);

  const handleSearch = (keyword: string) => {
    const finUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/api/itineraries/search?place=${keyword}`;
    // console.log('url=>', finUrl);
    setUrl(finUrl);
  };

  useEffect(() => {
    console.log('data=>', data);
    if (data && !loading) setNodes(data.data);
  }, [data]);
  // useEffect(() => {
  //   console.log('nodes=>', nodes);
  // }, [nodes]);
  return (
    <>
      <div className="w-full flex items-center border-2 border-gray-300 rounded-full w-full space-x-[15px] px-5 py-2.5">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <input
          type="text"
          className="w-full"
          placeholder="搜尋景點"
          value={inputContent || ''}
          onChange={(e) => setInputContent(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              inputContent &&
              inputContent.trim().length > 0
            )
              handleSearch(inputContent);
          }}
        />
      </div>
      <div className="w-full flex flex-col gap-2.5 my-2.5">
        {/* <p>{typeof nodes}</p>
        <p>Array{Array.isArray(nodes) ? 'isArray' : 'not Array'}</p> */}

        {Array.isArray(nodes)
          ? nodes.map((node, index) => {
              return (
                <Link
                  key={index}
                  href={`./panel/${node.placeId}?daydata=${daydata}`}
                >
                  <PanelCard
                    image={node.photoReference}
                    title={node.name}
                    address={node.formattedAddress}
                  />
                </Link>
              );
            })
          : ''}
      </div>
    </>
  );
}
