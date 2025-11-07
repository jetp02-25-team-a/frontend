'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Place = {
  id: number;
  type: 'food' | 'spot';
  name: string;
  address?: string | null;
  region?: string | null;
  introduce?: string | null;
  latitude: number;
  longitude: number;
  photos?: { url: string }[];
};

// ---- 輔助：讓地圖飛到中心 ----
function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15, { animate: true });
  }, [lat, lng, map]);
  return null;
}

// ---- 地圖置中按鈕 ----
function CenterButton({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  return (
    <button
      onClick={() => map.flyTo([lat, lng], 15, { duration: 0.8 })}
      title="回到地圖中心"
      className="absolute bottom-4 right-4 z-[999] w-10 h-10 rounded-full bg-white border shadow-md hover:bg-neutral-100"
    >
      ⟳
    </button>
  );
}

export default function MapSectionClient({
  placeId = 350,
  apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '',
}: {
  placeId?: number;
  apiBase?: string;
}) {
  const [place, setPlace] = useState<Place | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // ✅ 客製化圖標 — 帶有針尖，針尖準確落在經緯度點上
  const pinIcon = useMemo(() => {
    const w = 28,
      h = 40;
    return L.divIcon({
      className: '',
      html: `
        <div style="position:relative;width:${w}px;height:${h}px;">
          <div style="
            position:absolute;left:50%;top:0;transform:translateX(-50%);
            width:18px;height:18px;border-radius:50%;
            background:#e11d48;border:2px solid #fff;
            box-shadow:0 1px 4px rgba(0,0,0,.3);
          "></div>
          <div style="
            position:absolute;left:50%;bottom:0;transform:translateX(-50%);
            width:0;height:0;
            border-left:6px solid transparent;
            border-right:6px solid transparent;
            border-top:12px solid #e11d48;
            filter:drop-shadow(0 1px 2px rgba(0,0,0,.25));
          "></div>
        </div>
      `,
      iconSize: [w, h],
      iconAnchor: [w / 2, h], // 針尖對準經緯度
      popupAnchor: [0, -h + 10],
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetch(`${apiBase}/api/place/${placeId}`, {
        cache: 'no-store',
      });
      const json = await res.json();
      if (!mounted) return;
      setPlace(json.data);
    })();
    return () => {
      mounted = false;
    };
  }, [placeId, apiBase]);

  useEffect(() => {
    if (place && markerRef.current) markerRef.current.openPopup();
  }, [place]);

  if (!place?.latitude || !place?.longitude) {
    return (
      <div className="w-full h-[360px] rounded-xl bg-neutral-200 animate-pulse" />
    );
  }

  const lat = place.latitude;
  const lng = place.longitude;
  const hero = place.photos?.[0]?.url;

  return (
    <section className="rounded-2xl border p-3 w-full relative">
      <div className="w-full h-[360px] rounded-xl overflow-hidden relative">
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          scrollWheelZoom
          className="w-full h-full"
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FlyTo lat={lat} lng={lng} />

          <Marker
            position={[lat, lng]}
            icon={pinIcon}
            ref={(ref) => {
              // ts-ignore
              markerRef.current = ref?.leafletElement ?? ref ?? null;
            }}
          >
            <Popup maxWidth={320} autoPan padding={L.point(20, 20)}>
              <div className="w-[280px]">
                {hero ? (
                  <div className="w-full h-24 mb-3 overflow-hidden rounded-lg">
                    <img
                      src={hero}
                      alt={place.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          'none';
                      }}
                    />
                  </div>
                ) : null}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold leading-5">
                      {place.name}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1">
                      {place.address || place.region || '—'}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      place.type === 'food'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-sky-50 text-sky-700'
                    }`}
                  >
                    {place.type === 'food' ? '美食' : '景點'}
                  </span>
                </div>
                {place.introduce ? (
                  <p className="text-xs text-neutral-700 mt-2 line-clamp-3">
                    {place.introduce}
                  </p>
                ) : null}
                <div className="mt-3 flex items-center justify-end gap-2">
                  <a
                    href={`https://www.google.com/maps?q=${lat},${lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-2.5 py-1.5 rounded-md bg-neutral-900 text-white hover:bg-neutral-800"
                  >
                    在 Google 地圖開啟
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>

          <CenterButton lat={lat} lng={lng} />
        </MapContainer>
      </div>
    </section>
  );
}
