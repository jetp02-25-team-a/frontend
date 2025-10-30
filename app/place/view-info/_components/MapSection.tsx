// components/spot/MapSection.tsx
export default function MapSection() {
  // 先用靜態圖/placeholder，之後再換地圖 SDK
  return (
    <section className="rounded-2xl border p-3 w-full">
      <img
        src="https://maps.googleapis.com/maps/api/staticmap?center=Taipei&zoom=12&size=1000x300&scale=2&key=AIzaSyD-PLACEHOLDER"
        alt="map"
        className="w-full h-72 object-cover rounded-xl"
      />
    </section>
  );
}
