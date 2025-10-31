// app/trip/layout.tsx
export default function TripLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
