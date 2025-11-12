import type { Metadata } from 'next';
import BackButtons from '../../../components/ui/BackButtons';

export const metadata: Metadata = {
  title: '地圖探索',
  description: '瀏覽美食與景點地圖。',
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-[calc(100dvh-64px)] bg-amber-50">
      <div className="mx-auto max-w-[1600px] px-4 py-4">
        {children}
        <BackButtons />
      </div>
    </section>
  );
}
