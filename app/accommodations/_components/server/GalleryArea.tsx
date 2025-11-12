import GalleryDisplay from '../client/GalleryDisplay';
import ActionBar from '../client/ActionBar';

interface GalleryAreaProps {
  images: { id: number; url: string; caption?: string }[];
  title: string;
  isFavorited: boolean;
  accommodationId: number;
}

export default function GalleryArea({
  images,
  title,
  isFavorited,
  accommodationId,
}: GalleryAreaProps) {
  return (
    <div className="w-full flex flex-col gap-8">
      {/* 照片展示 */}
      <GalleryDisplay images={images} className="w-full px-4  aspect-5/2" />

      {/* 功能列覆蓋在上方 */}
      <div className="w-full">
        <ActionBar
          title={title}
          isFavorited={isFavorited}
          accommodationId={accommodationId}
        />
      </div>
    </div>
  );
}
