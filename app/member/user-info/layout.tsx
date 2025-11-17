import ProtectedRoute from '@/components/ProtectRoute';

export interface UserInfoLayoutProps {
  children: React.ReactNode;
}

export default async function UserInfoLayout({
  children,
}: UserInfoLayoutProps) {
  return (
    <>
      <ProtectedRoute>{children}</ProtectedRoute>
    </>
  );
}
