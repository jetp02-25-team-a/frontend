// // File: ArticleForm.tsx (Contoh, disederhanakan dari kode Anda)
// Di dalam ArticleForm.tsx (atau komponen induk yang melakukan fetching)

// ... imports ...
'use client';

import React, { useState, useEffect } from 'react';
// Sesuaikan path impor ini
import LocationDropdown from './Locationdropdown'; 

// Tipe data Location (nama kota)
type Location = string; 

export default function ArticleForm() {
  // State untuk Data Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null); // State untuk file gambar
  
  // State untuk Fetching Lokasi
  const [availableLocations, setAvailableLocations] = useState<Location[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  
  // State untuk Status Submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. Fetch Data Lokasi dari Backend (GET /api/destinations) ---
  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoadingLocations(true);
      try {
        const response = await fetch('http://localhost:3005/api/destinations'); 
        if (!response.ok) throw new Error('Failed to fetch locations.');
        
        const data = await response.json();
        
        // Ekstrak dan unifikasi nama kota dari data destinasi
        const cities = data.map((item: { city: string }) => item.city);
        const uniqueLocations = Array.from(new Set(cities));

        setAvailableLocations(uniqueLocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
        // Tampilkan pesan error ke user jika perlu
      } finally {
        setIsLoadingLocations(false);
      }
    };
    
    fetchLocations();
  }, []);
  
  // --- 2. Handler Submit Form (POST /api/articles) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedLocation || !content) {
        alert("Mohon isi Judul, Lokasi, dan Konten.");
        return;
    }
    const res = await fetch('http://localhost:4000/api/articles', {
    method: 'POST',
    body: formData, // <-- Mengirim objek FormData
    // Tanpa 'Content-Type: application/json'
    
    // ⚠️ MEMBUAT FORMDATA (Wajib untuk upload file/Multer)
    const formData = new FormData();
    formData.append('title', title);
    formData.append('location', selectedLocation);
    formData.append('content', content);
    
    // PENTING: Nama field 'image' harus sesuai dengan upload.single('image') di backend
    if (imageFile) {
      formData.append('image', imageFile); 
    }
    
    setIsSubmitting(true);
    try {
        const res = await fetch('http://localhost:4000/api/articles', {
            method: 'POST',
            // PENTING: TIDAK PERLU SET HEADER 'Content-Type' untuk FormData, browser akan melakukannya otomatis
            body: formData, 
        });

        if (res.ok) {
            alert('✅ Artikel berhasil dikirim ke backend!');
            // Reset form setelah sukses
            setTitle('');
            setContent('');
            setSelectedLocation(undefined);
            setImageFile(null);
        } else {
            const errorData = await res.json();
            alert('❌ Gagal mengirim artikel: ' + (errorData.message || 'Terjadi kesalahan server.'));
        }
    } catch (error) {
        console.error('Error saat submit:', error);
        alert('❌ Terjadi kesalahan koneksi saat mengirim data.');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-8 border rounded-lg shadow-lg bg-white space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">旅遊文章發佈表單 (Post Article)</h2>

      {/* Field Judul */}
      <div>
        <label htmlFor="title" className="mb-1 text-sm font-medium text-gray-700 block">Judul 文章標題</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
          placeholder="Masukkan judul artikel"
          required
        />
      </div>

      {/* Dropdown Lokasi */}
      {isLoadingLocations ? (
        <p className="text-blue-500">⏳ Memuat lokasi dari server...</p>
      ) : (
        <LocationDropdown 
          locations={availableLocations}
          selected={selectedLocation} 
          onChange={setSelectedLocation} 
        />
      )}
      
      {/* Field Konten */}
      <div>
        <label htmlFor="content" className="mb-1 text-sm font-medium text-gray-700 block">Konten 內容</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 resize-none"
          placeholder="Tuliskan isi artikel Anda..."
          required
        />
      </div>

      {/* Field File Upload */}
      <div>
        <label htmlFor="image" className="mb-1 text-sm font-medium text-gray-700 block">Pilih Foto 選擇照片 (Maks 5MB)</label>
        <input
          id="image"
          type="file"
          accept=".jpg, .jpeg, .png, .webp"
          onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
          className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
        />
        {imageFile && <p className="text-sm mt-1 text-gray-500">File terpilih: {imageFile.name}</p>}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting || isLoadingLocations}
        className={`py-3 px-6 rounded-lg text-white font-semibold w-full transition duration-300 ${
          isSubmitting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-orange-500 hover:bg-orange-600'
        }`}
      >
        {isSubmitting ? 'Mengirim...' : 'Send Article 提出文章'}
      </button>
      
      <p className="mt-2 text-gray-500 text-sm text-center">
        Status: {selectedLocation ? `Lokasi dipilih: ${selectedLocation}` : 'Menunggu pemilihan lokasi'}
      </p>
    </form>
  );




}
// type Location = string; // Tipe data lokasi adalah string (nama kota)

// export default function ArticleForm() {
//   // ... state lainnya ...
//   const [selectedLocation, setSelectedLocation] = useState<Location | undefined>(undefined);
//   const [availableLocations, setAvailableLocations] = useState<Location[]>([]);
// //   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const fetchLocations = async () => {
//       setIsLoading(true);
//       try {
//         // 1. Melakukan fetch ke backend Express
//         const response = await fetch('http://localhost:4000/api/destinations'); 
//         
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         
//         const data = await response.json(); // Data: [{ id: 1, name: '...', city: '台北' }, ...]
//         
//         // 2. Memproses data: Ekstraksi dan Unifikasi Nama Kota (City)
//         const cities = data.map((item: { city: string }) => item.city);
        
//         // 3. Menghilangkan duplikat (misalnya jika ada 2 destinasi di '台北')
//         const uniqueLocations = Array.from(new Set(cities));

//         setAvailableLocations(uniqueLocations); // Simpan array unik kota
//       } catch (error) {
//         console.error("Error fetching locations:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     
//     fetchLocations();
//   }, []);

//   // ... return JSX ...

//   return (
//     // ...
//     {isLoading ? (
//       <p>🚀 Loading available locations from API...</p>
//     ) : (
//       <LocationDropdown 
//         locations={availableLocations} // Menggunakan data unik kota dari state
//         selected={selectedLocation} 
//         onChange={setSelectedLocation} 
//       />
//     )}
//     // ...
//   );
// }



























// 'use client';

// import React, { useState, useEffect } from 'react';
// // Asumsikan path impor ini benar untuk LocationDropdown Anda
// import LocationDropdown from './Locationdropdown'; 

// // Asumsikan Location (string) diimpor dari './types' 
// type Location = string; 

// export default function ArticleForm() {
//   // State untuk lokasi yang dipilih oleh pengguna
//   const [selectedLocation, setSelectedLocation] = useState<Location | undefined>(undefined);
//   // State untuk menyimpan daftar lokasi yang di-fetch dari API
//   const [availableLocations, setAvailableLocations] = useState<Location[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // 1. Logika Fetch Data dari Backend
//   useEffect(() => {
//     const fetchLocations = async () => {
//       setIsLoading(true);
//       try {
//         // --- INI ADALAH TITIK INTEGRASI API ---
//         const response = await fetch('http://localhost:4000/api/destinations'); 
        
//         if (!response.ok) {
//           throw new Error('Gagal mengambil data lokasi dari server.');
//         }
        
//         const data = await response.json();
        
//         // Asumsi: API Anda mengembalikan array objek/string lokasi. 
//         // Anda mungkin perlu menyesuaikan pemetaan di bawah ini
//         const locationNames = data.map((item: any) => item.name || item); 

//         setAvailableLocations(locationNames); // Simpan data ke state
//       } catch (error) {
//         console.error("Error fetching locations:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     // fetchLocations(); 
    
//     // Sementara menunggu endpoint /api/destinations diisi data, 
//     // kita gunakan data lokal untuk demonstrasi:
//     setAvailableLocations(["台北", "台中", "高雄"]); // Data Dummy Cepat
    
//   }, []);

//   // 2. Logika Submit (Mengirim data ke /api/articles)
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedLocation) {
//         alert("Mohon pilih lokasi.");
//         return;
//     }

//     const postData = {
//         title: "Contoh Judul", // Anda perlu membuat state untuk field lain
//         location: selectedLocation,
//         content: "Contoh konten",
//         // ... field lainnya
//     };

//     try {
//         const res = await fetch('http://localhost:4000/api/articles', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(postData),
//         });

//         if (res.ok) {
//             alert('Artikel berhasil dikirim ke backend!');
//         } else {
//             const errorData = await res.json();
//             alert('Gagal mengirim artikel: ' + errorData.message);
//         }
//     } catch (error) {
//         console.error('Error saat submit:', error);
//         alert('Terjadi kesalahan saat koneksi ke server.');
//     }
//   };


//   return (
//     <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 border rounded-lg shadow-sm bg-white">
//       <h2 className="text-lg font-semibold mb-4">旅遊文章發佈表單 (Form Terintegrasi)</h2>

//       {/* 3. Penggunaan LocationDropdown */}
//       {isLoading ? (
//         <p>Memuat lokasi...</p>
//       ) : (
//         <LocationDropdown 
//           // Menggunakan daftar lokasi yang sudah di-fetch
//           locations={availableLocations} // Anda harus mengubah prop di LocationDropdown
//           selected={selectedLocation} 
//           onChange={setSelectedLocation} 
//         />
//       )}
      

//       <p className="mt-2 text-gray-500 text-sm">
//         **當前選擇地點 (Location yang dipilih):** {selectedLocation ? selectedLocation : '尚未選擇'}
//       </p>

//       <button type="submit" className="mt-4 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 w-full">
//         Kirim Data ke API (POST)
//       </button>
//     </form>
//   );
// }