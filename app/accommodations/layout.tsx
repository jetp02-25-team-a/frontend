export const metadata = {
  title: '住宿',
  // ... 其他 metadata
};

export interface AccommodationsLayoutProps {
  children: React.ReactNode;
}

export default async function AccommodationsLayout({
  children,
}: AccommodationsLayoutProps) {
  return <>{children}</>;
}
