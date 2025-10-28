import TourCard from '../grabgroup/team-up/_components/tour-card';

export default async function AccommodationPage() {
  console.log(process.env.NEXT_PUBLIC_EXPRESS_API_TARGET);
  return (
    <>
      <h1>accommodation page</h1>
      <hr />
      <TourCard
        key={1}
        title="台北101半日遊"
        description="探索台北地標，品味信義區美食。"
        avatar="https://randomuser.me/api/portraits/women/20.jpg"
        user_name="小美"
        image="https://www.travel.taipei/image/216608/?r=1625036397904"
      />
    </>
  );
}
