import TourCard from "../_components/TourCard";
export default function TaipeiCityPage() {
  return (
    <>
      {[...Array(5)].map((v, i) => {
        <TourCard
          key={i}
          title="台北101半日遊"
          description="探索台北地標，品味信義區美食。"
          avatar="https://randomuser.me/api/portraits/women/10.jpg"
          user_name="小美"
          image="https://images.unsplash.com/photo-1583394838336-acd977736f90"
        />;
      })}
    </>
  );
}
