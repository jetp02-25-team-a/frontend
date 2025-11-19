'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngTuple } from 'leaflet';
import RoutingMachine from './RoutingMachine';
import Link from 'next/link';

const defaultIcon = L.icon({
  iconUrl: '/leaflet/marker-icon.png',
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type AccMapProps = {
  items?: {
    id: number;
    name: string;
    city: string;
    latitude: number | null;
    longitude: number | null;
  }[];
  coords?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  destination?: { lat: number; lng: number } | null;
};

export default function AccMap({
  items = [],
  coords,
  zoom = 13,
  className,
  destination = null,
}: AccMapProps) {
  const validItems = items.filter(
    (item) => item.latitude != null && item.longitude != null
  );

  const center: LatLngTuple = coords
    ? [coords.lat, coords.lng]
    : validItems.length > 0
      ? [validItems[0].latitude!, validItems[0].longitude!]
      : [25.033, 121.565]; // fallback: 台北市中心

  const startCoords: [number, number] = [center[0], center[1]];
  const endCoords: [number, number] | null = destination
    ? [destination.lat, destination.lng]
    : null;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: '100%', height: '100%' }}
      className={className}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validItems.map((item) => (
        <Marker
          key={item.id}
          position={[item.latitude!, item.longitude!]}
          icon={defaultIcon}
        >
          <Popup>
            <div className="p-2">
              <strong className="block text-gray-900">{item.name}</strong>
              <span className="text-sm text-gray-600">{item.city}</span>
              <br />
              <Link
                href={`/accommodations/${item.id}`}
                className="text-blue-600 underline text-sm"
              >
                查看詳細頁
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
      <RoutingMachine start={startCoords} end={endCoords} />
    </MapContainer>
  );
}
