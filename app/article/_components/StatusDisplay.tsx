// StatusDisplay untuk menangani dan menampilkan status sementara (baik itu loading atau error) dari sebuah halaman atau komponen.

// _components/StatusDisplay.tsx
// 📁 /app/article/_components/StatusDisplay.tsx
'use client';

import React from 'react';

interface StatusDisplayProps {
  message: string;
}

/**
 * Komponen untuk menampilkan status loading atau pesan error halaman.
 * Dipindahkan ke sini untuk memastikan hanya ada satu default export di page.tsx.
 */
export default function StatusDisplay({ message }: StatusDisplayProps) {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <h1 className="text-xl font-semibold text-gray-700">{message}</h1>
    </div>
  );
}



// import React from 'react';

// export default function StatusDisplay({ message }: { message: string }) {
//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-50">
//       <h1 className="text-xl font-semibold text-gray-700">{message}</h1>
//     </div>
//   );
// }