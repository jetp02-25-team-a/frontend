'use client';
import { useParams } from 'next/navigation';
import RagularButton from '../../../../components/ui/regular-button';

export default function KeyWordPage() {
  const params = useParams();
  const addressParam = params.address;

  // 如果是 string 就 decode，其他情況給空字串
  const address =
    typeof addressParam === 'string' ? decodeURIComponent(addressParam) : '';

  return (
    <>
      <h1>地點詳細頁面</h1>
      <h2>{address}</h2>
      <RagularButton content="加入行程" />
    </>
  );
}
