'use client';

import ProtectRoute from '@/components/ProtectRoute';

export default function TripLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectRoute>{children}</ProtectRoute>;
}
