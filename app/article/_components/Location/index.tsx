'use client';
import React from 'react';
import { locations, Location } from './types';

interface Props {
  selected?: Location;
  onChange: (location: Location) => void;
}

function LocationDropdown({ selected, onChange }: Props) {
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
        {locations.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LocationDropdown; // ✅ hanya satu default export

// 'use client';

// import React, { useState } from 'react';
// import LocationDropdown from '@/app/(site)/_components/Locationdropdown';
// import { Location } from '@/app/components/Location/types';

// export default function ArticleForm() {
//   const [location, setLocation] = useState<Location | undefined>(undefined);

//   return (
//     <form className="max-w-md mx-auto p-6 border rounded-lg shadow-sm bg-white">
//       <h2 className="text-lg font-semibold mb-4">旅遊文章發佈表單</h2>

//       <LocationDropdown selected={location} onChange={setLocation} />

//       <p className="mt-2 text-gray-500 text-sm">
//         當前選擇地點：{location ? location : '尚未選擇'}
//       </p>

//       {/* 其他欄位放這裡 */}
//     </form>
//   );
//   // export default LocationDropdown;
// }

// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import { locations, Location } from './types';

// interface Props {
//   selected?: Location;
//   onChange: (location: Location) => void;
// }

// const LocationDropdown: React.FC<Props> = ({ selected, onChange }) => {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // ✅ Tutup dropdown kalau klik di luar area
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <div ref={dropdownRef} className="relative inline-block w-64">
//       {/* Tombol utama */}
//       <button
//         type="button"
//         onClick={() => setOpen((prev) => !prev)}
//         className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-left shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//         aria-haspopup="listbox"
//         aria-expanded={open}
//       >
//         {selected ? selected.name : 'Select Location 選擇地點'}
//       </button>

//       {/* Daftar dropdown */}
//       {open && (
//         <ul
//           className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto"
//           role="listbox"
//         >
//           {locations.map((loc) => (
//             <li
//               key={loc.id}
//               role="option"
//               aria-selected={selected?.id === loc.id}
//               className={`cursor-pointer px-4 py-2 hover:bg-blue-100 ${
//                 selected?.id === loc.id ? 'bg-blue-200 font-semibold' : ''
//               }`}
//               onClick={() => {
//                 onChange(loc);
//                 setOpen(false);
//               }}
//             >
//               {loc.name}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

/* // 'use client';

// import React, { useState } from "react";
// import { locations, Location } from "./types";

// interface Props {
//   selected?: Location;
//   onChange: (location: Location) => void;
// }

// const LocationDropdown: React.FC<Props> = ({ selected, onChange }) => {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="relative inline-block w-64">
//       <button
//         onClick={() => setOpen(!open)}
//         className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-left shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
//         aria-haspopup="listbox"
//         aria-expanded={open}
//       >
//         {selected || "Pilih Lokasi"}
//       </button>

//       {open && (
//         <ul
//           className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto"
//           role="listbox"
//         >
//           {locations.map((loc) => (
//             <li
//               key={loc}
//               role="option"
//               aria-selected={selected === loc}
//               className={`cursor-pointer px-4 py-2 hover:bg-blue-100 ${
//                 selected === loc ? "bg-blue-200 font-semibold" : ""
//               }`}
//               onClick={() => {
//                 onChange(loc);
//                 setOpen(false);
//               }}
//             >
//               {loc}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default LocationDropdown; */
