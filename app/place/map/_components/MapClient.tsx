// app/map/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Drawer from './Drawer';
import AddPlaceModal from './AddPlaceModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight, faPlus } from '@fortawesome/free-solid-svg-icons';

const API = process.env.NEXT_PUBLIC_API_BASE_URL;
// 預設中心（沒輸入時）
const MAP_HEIGHT = 'calc(100dvh - 100px)';
const DEFAULT_CENTER: [number, number] = [25.0339, 121.5648]; // 資展
const DEFAULT_ZOOM = 13;
const PAGE_SIZE = 50;

// ---- Leaflet marker icon fix (CDN，也可改用 /public 檔案) ----
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
(L.Marker.prototype as any).options.icon = DefaultIcon;

type Place = {
  id: number;
  name: string;
  type: 'food' | 'spot' | string;
  address?: string | null;
  region?: string | null;
  contact?: string | null;
  introduce?: string | null;
  latitude: number;
  longitude: number;
  Photos?: { url: string }[];
  ratingAvg?: number;
  ratingCount?: number;
};

type RawPlace = any;

function normalizePlace(r: RawPlace) {
  // 兼容各種欄位名 + 轉成 number
  const lat = r.latitude;
  const lng = r.longitude;

  const latitude = typeof lat === 'string' ? parseFloat(lat) : lat;
  const longitude = typeof lng === 'string' ? parseFloat(lng) : lng;

  return {
    id: r.id ?? r.place_id,
    name: r.name,
    type: r.type,
    address: r.address ?? null,
    region: r.region ?? null,
    contact: r.contact ?? null,
    introduce: r.introduce ?? null,
    Photos: r.Photos ?? r.photos ?? [],
    ratingAvg: r.rating.avg ?? undefined,
    ratingCount: r.ratingCount ?? r.rating_count ?? r.count ?? undefined,
    latitude,
    longitude,
  } as Place;
}

function ClickCatcher({
  enabled,
  onPicked,
}: {
  enabled: boolean;
  onPicked: (latlng: L.LatLng) => void;
}) {
  useMapEvent('click', (e) => {
    if (enabled) onPicked(e.latlng);
  });
  return null;
}

export default function MapClient() {
  const sp = useSearchParams();
  const router = useRouter();

  // ✅ 改：分別從 URL 取 address / region（保留 q 作為相容備援）
  const type = sp.get('type')?.trim() || '';
  const address = sp.get('address')?.trim() || '';
  const region = sp.get('region')?.trim() || '';
  const legacyQ = sp.get('q')?.trim() || '';

  const hasQuery = !!(address || region || legacyQ);

  const [places, setPlaces] = useState<Place[]>([]);
  const [drawers, setDrawers] = useState<Place[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<L.Map | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [pickMode, setPickMode] = useState(false);
  const [picked, setPicked] = useState<L.LatLng | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  // ✅ 新增：目前地圖中心，給 Modal「用地圖中心」
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);

  // 當任一查詢參數變動時重置列表
  useEffect(() => {
    setPlaces([]);
    setDrawers([]);
    setPage(1);
    setHasMore(false);
    setErr(null);
  }, [type, address, region, legacyQ]);

  // 抓一頁
  async function fetchPage(nextPage: number) {
    if (!hasQuery) return;
    try {
      if (nextPage === 1) setLoading(true);
      else setLoadingMore(true);

      const params = new URLSearchParams();
      // ✅ 依照實際輸入帶參數；若只有舊版 q，就帶 q（相容模式）
      if (type) params.set('type', type);
      if (address) params.set('address', address);
      if (region) params.set('region', region);
      if (!address && !region && legacyQ) params.set('q', legacyQ);

      params.set('limit', String(PAGE_SIZE));
      params.set('page', String(nextPage));

      const url = `${API}/api/place/search?${params.toString()}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('讀取搜尋結果失敗');
      const json = await res.json();

      const all: Place[] = (Array.isArray(json?.data) ? json.data : []).map(
        normalizePlace
      );
      const data: Place[] = (Array.isArray(json?.data) ? json.data : [])
        .map(normalizePlace)
        .filter(
          (p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude)
        );
      setPlaces((prev) => (nextPage === 1 ? data : [...prev, ...data]));
      setDrawers((prev) => (nextPage === 1 ? all : [...prev, ...all]));
      setHasMore(data.length === PAGE_SIZE);
      setPage(nextPage);

      if (nextPage === 1 && data.length > 0 && mapRef.current) {
        const pts = data.map((p) => [p.latitude, p.longitude]) as [
          number,
          number,
        ][];
        const bounds = L.latLngBounds(
          pts.map(([lat, lng]) => L.latLng(lat, lng))
        );
        mapRef.current.fitBounds(bounds.pad(0.2));
        const c = mapRef.current.getCenter(); // ✅ 同步 center
        setCenter([c.lat, c.lng]);
      }
    } catch (e: any) {
      setErr(e?.message || '搜尋失敗');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  // 首次或查詢變動時載入第 1 頁
  useEffect(() => {
    if (!hasQuery) return; // 無條件就顯示預設中心
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, hasQuery, address, region, legacyQ]);

  // infinite scroll：觀察尾端 sentinel
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (!hasQuery) return;
    const el = sentinelRef.current;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
          fetchPage(page + 1);
        }
      },
      { root: null, rootMargin: '0px', threshold: 1 }
    );

    io.observe(el);
    return () => io.unobserve(el);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasQuery, hasMore, loading, loadingMore, page]);

  // 元件掛載時若是小螢幕就預設收合
  useEffect(() => {
    if (window.innerWidth < 640) setDrawerOpen(false);
  }, []);

  // Toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  // 點小卡 / Marker → 詳情
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Place | null>(null);
  function openDetail(p: Place) {
    setSelected(p);
    setDetailOpen(true);
  }

  // 置中按鈕
  function recenter() {
    const map = mapRef.current;
    if (!map) return;

    const pts = places
      .map((p) => {
        const lat =
          typeof p.latitude === 'string' ? parseFloat(p.latitude) : p.latitude;
        const lng =
          typeof p.longitude === 'string'
            ? parseFloat(p.longitude)
            : p.longitude;
        return Number.isFinite(lat) && Number.isFinite(lng)
          ? [lat as number, lng as number]
          : null;
      })
      .filter(Boolean) as [number, number][];

    if (hasQuery && pts.length > 0) {
      const bounds = L.latLngBounds(
        pts.map(([lat, lng]) => L.latLng(lat, lng))
      );
      map.fitBounds(bounds.pad(0.2));
    } else {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    }
  }

  function handleOpenModal() {
    setModalOpen(true);
  }

  function handlePickCoordOnce() {
    setPickMode(true);
    setToast('請在地圖上點一下要新增的座標');
  }

  function handlePicked(latlng: L.LatLng) {
    setPickMode(false);
    setPicked(latlng);
    setCenter([latlng.lat, latlng.lng]); // ✅ 取點後同步中心，Modal 可直接點「用地圖中心」
    setToast(`已選座標：${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`);
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-amber-50"
      style={{ height: MAP_HEIGHT }}
    >
      {/* 小提醒 */}
      {toast && (
        <div className="pointer-events-none absolute left-1/2 top-3 z-[500] -translate-x-1/2 rounded-md bg-black/70 px-3 py-1 text-sm text-white">
          {toast}
        </div>
      )}
      <MapContainer
        ref={mapRef as any} // ✅ 用 ref 取代 whenCreated
        center={hasQuery ? [25.04, 121.55] : DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ✅ 一次性取座標 */}
        <ClickCatcher enabled={pickMode} onPicked={handlePicked} />

        {places.map((p) => (
          <Marker
            key={`${p.id}-${p.latitude}-${p.longitude}`}
            position={[p.latitude, p.longitude]}
            eventHandlers={{ click: () => openDetail(p) }}
          >
            <Popup>
              <div className="min-w-[180px]">
                <div
                  className="font-semibold text-sm mb-1 hover:underline cursor-pointer"
                  onClick={() => router.push(`/place/${p.id}`)}
                >
                  {p.name}
                </div>
                {p.address && (
                  <div className="text-xs text-gray-600 mb-2">{p.address}</div>
                )}
                <button
                  onClick={() => openDetail(p)}
                  className="rounded bg-black text-white text-xs px-3 py-1"
                >
                  查看詳情
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Modal */}
      <AddPlaceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onPickCoord={handlePickCoordOnce}
        mapCenter={center}
        apiBase={API}
        onCreated={(p) => {
          setToast('已建立地標！');
          setPicked(null);

          const normalized = normalizePlace(p);

          // 抽屜：一定加入
          setDrawers((prev) => [normalized, ...prev]);

          // 地圖：有座標才加入
          if (
            Number.isFinite(normalized.latitude) &&
            Number.isFinite(normalized.longitude)
          ) {
            setPlaces((prev) => [normalized, ...prev]);
            if (mapRef.current) {
              mapRef.current.setView(
                [normalized.latitude, normalized.longitude],
                16
              );
            }
          } else {
          }
        }}
      />

      <Drawer
        open={drawerOpen}
        onToggle={() => setDrawerOpen((v) => !v)}
        places={drawers}
        onCardClick={(p) => openDetail(p)}
      />
      {/* 新增地標按鈕 */}
      <div className="pointer-events-auto absolute bottom-20 right-4 z-[5000] flex gap-2">
        <button
          onClick={handleOpenModal}
          className="pointer-events-auto w-11 h-11 rounded-full bg-white border border-gray-300
               shadow-lg flex items-center justify-center hover:bg-gray-100 transition mb-[16px] hover:cursor-pointer"
          title="新增地標"
        >
          <FontAwesomeIcon icon={faPlus} className="hover:cursor-pointer" />
        </button>
      </div>
      {/* 回到置中按鈕 */}
      <div
        className="absolute bottom-4 right-4 z-[5000] pointer-events-none" // ⬅️ 這層防止被地圖吃掉
      >
        <button
          onClick={() => {
            recenter();
          }}
          className="pointer-events-auto w-11 h-11 rounded-full bg-white border border-gray-300
               shadow-lg flex items-center justify-center hover:bg-gray-100 transition mb-[16px] hover:cursor-pointer"
          title={hasQuery ? '回到搜尋範圍' : '回到預設中心'}
        >
          <FontAwesomeIcon
            icon={faRotateRight}
            className="hover:cursor-pointer"
          />
        </button>
      </div>
    </div>
  );
}
