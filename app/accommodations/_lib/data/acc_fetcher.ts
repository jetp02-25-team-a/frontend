import { CardData } from '../../_types';

export async function fetchAccommodationData(
  type: 'popular' | 'highRated'
): Promise<CardData[]> {
  console.log(`SC: Fetching ${type} data...`);
  await new Promise((resolve) => setTimeout(resolve, 300));
  const MOCK_DATA: CardData[] = [
    {
      id: 1,
      imageUrl: '/images/trip_sample.jpg',
      imageAlt: '台北精品酒店',
      rating: 4.8,
      name: '台北頂級商務酒店',
      location: '信義區',
      isFavorite: false,
    },
    {
      id: 4,
      imageUrl: '/images/trip_sample.jpg',
      imageAlt: '台南豪華別墅',
      rating: 4.9,
      name: '台南古都私人別墅',
      location: '中西區',
      isFavorite: false,
    },
    {
      id: 7,
      imageUrl: '/images/trip_sample.jpg',
      imageAlt: '台北行政套房',
      rating: 4.9,
      name: '台北市中心行政套房',
      location: '大安區',
      isFavorite: false,
    },
    {
      id: 8,
      imageUrl: '/images/trip_sample.jpg',
      imageAlt: '頂級溫泉水療',
      rating: 5.0,
      name: '北投溫泉私人會館',
      location: '北投區',
      isFavorite: false,
    },
    {
      id: 2,
      imageUrl: '/images/trip_sample.jpg',
      imageAlt: '高雄海景渡假村',
      rating: 4.5,
      name: '高雄港灣渡假村',
      location: '旗津區',
      isFavorite: true,
    },
    {
      id: 6,
      imageUrl: '/images/trip_sample.jpg',
      imageAlt: '花蓮海岸飯店',
      rating: 4.6,
      name: '花蓮太平洋景觀飯店',
      location: '花蓮市',
      isFavorite: false,
    },
    {
      id: 81,
      imageUrl: '/images/trip_sample.jpg',
      imageAlt: '頂級溫泉水療',
      rating: 5.0,
      name: '北投溫泉私人會館',
      location: '北投區',
      isFavorite: false,
    },
    {
      id: 22,
      imageUrl: '/images/trip_sample.jpg',
      imageAlt: '高雄海景渡假村',
      rating: 4.5,
      name: '高雄港灣渡假村',
      location: '旗津區',
      isFavorite: false,
    },
    {
      id: 62,
      imageUrl: '/images/trip_sample.jpg',
      imageAlt: '花蓮海岸飯店',
      rating: 4.6,
      name: '花蓮太平洋景觀飯店',
      location: '花蓮市',
      isFavorite: false,
    },
  ];

  if (type === 'popular') return MOCK_DATA.filter((d) => d.rating >= 4.5);
  if (type === 'highRated') return MOCK_DATA.filter((d) => d.rating >= 4.8);
  return [];
}
