// // File: LocationDropdown.tsx (Versi yang sudah disesuaikan)
// File: _components/LocationDropdown.tsx (Versi Final)

'use client';
import React from 'react';

// Pastikan tipe Location didefinisikan atau diimpor jika diperlukan
// Kita asumsikan Location adalah string (nama kota)
type Location = string; 

interface Props {
  // ✅ Properti ini akan menerima array lokasi dari fetch API di komponen induk
  locations: Location[]; 
  selected?: Location;
  onChange: (location: Location) => void;
}

function LocationDropdown({ selected, onChange, locations }: Props) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor="location"
        className="mb-1 text-sm font-medium text-gray-700"
      >
        Select Location 選擇地點
      </label>
      <select
        id="location"
        value={selected ?? ''}
        onChange={(e) => onChange(e.target.value as Location)}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
      >
        <option value="">請選擇地點</option>
        {locations.map(
          (loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          )
        )}
      </select>
    </div>
  );
}

export default LocationDropdown;
// 'use client';
// import React from 'react';

// // Hapus import { locations } karena sekarang akan diterima via props

// type Location = string; // Sesuaikan dengan tipe data Anda

// interface Props {
//   locations: Location[]; // ✅ Tambahkan props untuk daftar lokasi
//   selected?: Location;
//   onChange: (location: Location) => void;
// }

// function LocationDropdown({ selected, onChange, locations }: Props) {
//   return (
//     <div className="flex flex-col">
//       {' '}
//       <label
//         htmlFor="location"
//         className="mb-1 text-sm font-medium text-gray-700"
//       >
//                 Select Location 選擇地點      {' '}
//       </label>
//            {' '}
//       <select
//         id="location"
//         value={selected ?? ''}
//         onChange={(e) => onChange(e.target.value as Location)}
//         className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
//       >
//                 <option value="">請選擇地點</option>       {' '}
//         {locations.map(
//           (
//             loc // Menggunakan locations dari props
//           ) => (
//             <option key={loc} value={loc}>
//                           {loc}         {' '}
//             </option>
//           )
//         )}
//              {' '}
//       </select>
//          {' '}
//       // Di dalam LocationDropdown.tsx

// interface Props {
//   locations: Location[]; // ✅ Menerima array lokasi yang unik
//   // ...
// }
// // ...
// // ... di dalam <select>
// {locations.map((loc) => ( 
//   <option key={loc} value={loc}>
//     {loc}
//   </option>
// ))}
//     </div>
//   );
// }

// export default LocationDropdown;

// 'use client';

// import React from 'react';
// import { locations, Location } from '@/app/components/Location/types'; // pastikan path sesuai

// interface Props {
//   selected?: Location;
//   onChange: (location: Location) => void;
// }

// export default function LocationDropdown({ selected, onChange }: Props) {
//   return (
//     <div className="flex flex-col">
//       <label htmlFor="location" className="mb-1 text-sm font-medium text-gray-700">
//         Select Location 選擇地點
//       </label>
//       <select
//         id="location"
//         value={selected ?? ''}
//         onChange={(e) => onChange(e.target.value as Location)}
//         className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
//       >
//         <option value="">請選擇地點</option>
//         {locations.map((loc) => (
//           <option key={loc} value={loc}>
//             {loc}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }
