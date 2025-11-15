'use client';

export interface MapAreaProps {
  latitude: number;
  longitude: number;
}

export default function MapArea({ latitude, longitude }: MapAreaProps) {
  // 1. 驗證傳入的座標是否有效
  const isValidCoord = !Number.isNaN(latitude) && !Number.isNaN(longitude); // 2. 如果座標無效，顯示錯誤訊息

  if (!isValidCoord) {
    return (
      <p style={{ color: 'red', textAlign: 'center' }}>
        ⚠️ 地圖資訊無法顯示：住宿座標資料無效。
      </p>
    );
  } // 3. 成功取得座標 (來自 props)

  return (
    // 這裡可以放您的地圖元件 (如 Google Map, Leaflet)
    // 由於您沒有提供地圖元件，我們先顯示純文字座標
    <p style={{ textAlign: 'center', padding: '20px' }}>
      🏠 住宿位置：
      <br />
      緯度 {latitude.toFixed(6)}, 經度 {longitude.toFixed(6)}
    </p>
  );
}
