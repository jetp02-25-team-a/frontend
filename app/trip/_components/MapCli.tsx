'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// 修正 leaflet 預設 icon
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// @ts-ignore：確保 TS 不會噴錯（如果 @types 有裝到可以拿掉）
(L.Marker.prototype as any).options.icon = defaultIcon;

function RoutingMachine({ points }: { points: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length < 2) return;

    const control = (L as any).Routing.control({
      waypoints: points.map(([lat, lng]) => L.latLng(lat, lng)),
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
      lineOptions: {
        styles: [{ color: '#ff7e2f', weight: 5 }],
      },
      createMarker: (_i: number, waypoint: any) =>
        L.marker(waypoint.latLng, { icon: defaultIcon }),
    }).addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [map, points]);

  return null;
}

export default function MapCli() {
  // TODO: 之後改成從 Trip Detail API 拿座標
  const samplePoints: [number, number][] = [
    [25.034, 121.564], // A
    [25.047, 121.517], // B
    [25.033, 121.501], // C
  ];

  return (
    <div className="w-full h-[80vh] rounded-2xl overflow-hidden shadow-md">
      <MapContainer
        center={[25.04, 121.56]}
        zoom={13}
        scrollWheelZoom
        className="w-full h-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RoutingMachine points={samplePoints} />
      </MapContainer>
    </div>
  );
}
