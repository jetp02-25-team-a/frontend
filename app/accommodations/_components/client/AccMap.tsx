'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngTuple } from 'leaflet';

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
};

export default function AccMap({
  items = [],
  coords,
  zoom = 13,
  className,
}: AccMapProps) {
  const validItems = items.filter(
    (item) => item.latitude != null && item.longitude != null
  );

  const center: LatLngTuple = coords
    ? [coords.lat, coords.lng]
    : validItems.length > 0
      ? [validItems[0].latitude!, validItems[0].longitude!]
      : [25.033, 121.565]; // fallback: 台北市中心

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
            <strong>{item.name}</strong>
            <br />
            {item.city}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
