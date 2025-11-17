import GalleryDisplay from '../client/GalleryDisplay';
import ActionBar from '../client/ActionBar';

interface GalleryAreaProps {
  images: { id: number; url: string; caption?: string }[];
  title: string;
  accommodationId: number;
}

export default function GalleryArea({
  images,
  title,
  accommodationId,
}: GalleryAreaProps) {
  return (
    <div className="px-32 w-full flex flex-col gap-8">
      {/* 照片展示 */}
      <GalleryDisplay
        images={images}
        className="w-full px-4 aspect-5/2 select-none"
      />

      {/* 功能列覆蓋在上方 */}
      <div className="w-full">
        <ActionBar title={title} accommodationId={accommodationId} />
      </div>
    </div>
  );
}
