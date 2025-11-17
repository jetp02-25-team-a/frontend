// components/RoutingMachine.tsx

'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

interface RoutingMachineProps {
  start: [number, number]; // [lat, lng] 住宿點
  end: [number, number] | null; // [lat, lng] 目的地
}

export default function RoutingMachine({ start, end }: RoutingMachineProps) {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    // 檢查 L.Routing 是否可用
    if (typeof window === 'undefined' || !L.Routing) return;

    // 首次掛載：創建路由控制實例
    if (!routingControlRef.current) {
      const waypoints = [
        L.latLng(start[0], start[1]),
        ...(end ? [L.latLng(end[0], end[1])] : []),
      ];

      routingControlRef.current = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: false, // 🚨 新增：隱藏標記

        createMarker: function (i: any, waypoint: any, n: any) {
          return null; // 返回 null，不創建任何標記
        },
        draggableWaypoints: false,
        // 🚨 關鍵配置：禁用路線文字顯示
        show: false, // 不顯示路線細節
        collapsible: false, // 禁用折疊按鈕

        fitSelectedRoutes: true,
        lineOptions: {
          styles: [{ color: 'blue', weight: 6, opacity: 0.7 }],
          extendToWaypoints: false,
          missingRouteTolerance: 1,
        },
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1',
          profile: 'driving',
          routingOptions: {
            alternatives: false, // 只請求一條路線
            steps: false, // 不需要詳細步驟
            geometries: 'polyline',
          },
        }),
      } as any).addTo(map);

      // 🚨 額外修正：移除顯示路線結果的容器
      // 這是 Leaflet-Routing-Machine 創建的 HTML 元素
      const container = routingControlRef.current.getContainer();
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }
  }, [map, start, end]);

  useEffect(() => {
    if (routingControlRef.current) {
      if (end) {
        // 目的地變更：更新 Waypoints
        routingControlRef.current.setWaypoints([
          L.latLng(start[0], start[1]),
          L.latLng(end[0], end[1]),
        ]);
      } else {
        // 清除路線：只留起點
        routingControlRef.current.setWaypoints([L.latLng(start[0], start[1])]);
      }
    }
  }, [start, end]);

  // 卸載時移除控制項
  useEffect(() => {
    return () => {
      if (routingControlRef.current) {
        // 🚨 修正：調用 L.Routing.Control 實例的 .remove() 方法
        // 這樣能確保所有相關的路線圖層和標記都被安全地移除。
        routingControlRef.current.remove();

        // 移除這個通常就不需要 map.removeControl() 了，因為 .remove() 已經處理了。
        // 如果您仍看到 HTML 元素殘留，請檢查是否在首次渲染時移除了其 HTML 容器。
      }
    };
  }, [map]); // 依賴項 [map] 正確無誤

  return null;
}
