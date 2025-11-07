// data.ts (模擬資料獲取檔案)

// -----------------------------------------------------------
// 模擬資料 (MOCK DATA)
// -----------------------------------------------------------

const MOCK_DATA = {
  id: 101,
  name: '圓山超極無敵宇宙大飯店',
  address: '106台北市大安區復興南路一段390號2樓',
  description:
    "See the highlights of London via 2 classic modes of transport on this half-day adventure. First, you will enjoy great views of Westminster Abbey, the House of Parliament, and the London Eye, as you meander through the historic streets on board a vintage double-decker bus. Continue to see St. Paul's Cathedral, Sir Christopher Wren's architectural masterpiece, where Admirals Nelson and Wellington are buried, and Princess Diana and Prince Charles got married. Continue to the Tower of London, built nearly 1,000 years ago during the reign of William the Conqueror. Home to the Crown Jewels, the Tower is protected by the famous Beefeaters, and the imposing palace has been used as a fortress and a prison throughout its history. Your guide will take you to Traitors Gate, where prisoners entered, and the martyred site of Thomas More. Next, take a short trip along the River Thames, passing Shakespeare's Globe, Cleopatra's Needle, and London Bridge, before arriving at Westminster Pier. Rejoin the bus and head for Buckingham Palace. Make your way to the perfect spot to watch the world famous Changing of the Guard ceremony as the soldiers, dressed in their fabulous tunics and busbies, march to military music.",
  checkInTime: '15:00',
  checkOutTime: '11:00',

  // 模擬 AccommodationImage 關聯數據
  Images: [
    {
      url: 'https://picsum.photos/id/684/600/400',
      caption: '主視覺',
      isPrimary: true,
      sortOrder: 1,
    },
    {
      url: 'https://picsum.photos/id/613/400/300',
      caption: '大廳',
      isPrimary: false,
      sortOrder: 2,
    },
    {
      url: 'https://picsum.photos/id/681/200/200',
      caption: '健身房',
      isPrimary: false,
      sortOrder: 3,
    },
    {
      url: 'https://picsum.photos/id/134/200/200',
      caption: '餐廳',
      isPrimary: false,
      sortOrder: 4,
    },
  ],

  // 模擬 Review 關聯數據
  Reviews: [
    {
      id: 901,
      ratingScore: 5,
      comment: '環境優美，服務一流！',
      reviewDate: '2025-10-01',
      userId: 1,
    },
    {
      id: 902,
      ratingScore: 4,
      comment: '房間乾淨，早餐好吃。',
      reviewDate: '2025-09-20',
      userId: 2,
    },
    {
      id: 903,
      ratingScore: 5,
      comment: '景觀太棒了！',
      reviewDate: '2025-09-15',
      userId: 3,
    },
    {
      id: 904,
      ratingScore: 3,
      comment: '入住手續有點慢。',
      reviewDate: '2025-09-10',
      userId: 4,
    },
    {
      id: 905,
      ratingScore: 5,
      comment: '非常棒的體驗！',
      reviewDate: '2025-09-05',
      userId: 5,
    },
  ],

  // 模擬 Amenity 基礎資料
  AMENITY_BASE: [
    { id: 101, name: '免費wifi' },
    { id: 102, name: '停車場' },
    { id: 103, name: '健身房' },
    { id: 104, name: '游泳池' },
    { id: 105, name: '餐廳' },
    { id: 106, name: '洗衣服務' },
    { id: 107, name: '乾洗服務' },
    { id: 108, name: '客房服務' },
    { id: 109, name: '行李寄存' },
  ],

  // 模擬 AccommodationAmenity 關聯數據 (飯店設施)
  ACCOMMODATION_AMENITIES: [
    { accommodationId: 101, amenityId: 101 }, // 免費wifi
    { accommodationId: 101, amenityId: 102 }, // 停車場
    { accommodationId: 101, amenityId: 103 }, // 健身房
    { accommodationId: 101, amenityId: 106 }, // 洗衣服務
    { accommodationId: 101, amenityId: 108 }, // 客房服務
  ],

  // 模擬 RoomType 數據
  ROOM_TYPES: [
    {
      id: 201,
      name: '豪華海景單臥房',
      description: '2 晚雙人床 | 1 張雙人床',
      maxCapacity: 4,
      basePrice: 5000,
      amenityIds: [201, 202, 203], // 浴缸, 迷你吧, 陽台
    },
    {
      id: 202,
      name: '城市景觀雙人房',
      description: '1 張特大床',
      maxCapacity: 2,
      basePrice: 3500,
      amenityIds: [204, 205], // 熨斗, 辦公桌
    },
    {
      id: 203,
      name: '總統套房',
      description: '2 張特大床',
      maxCapacity: 6,
      basePrice: 25000,
      amenityIds: [201, 202, 203, 206], // 浴缸, 迷你吧, 陽台, 私人泳池
    },
  ],

  // 模擬 RoomTypeAmenity 的基礎 Amenity
  ROOM_AMENITY_BASE: [
    { id: 201, name: '浴缸' },
    { id: 202, name: '迷你吧' },
    { id: 203, name: '陽台' },
    { id: 204, name: '熨斗' },
    { id: 205, name: '辦公桌' },
    { id: 206, name: '私人泳池' },
  ],
};

const MOCK_USER_ID = 999;
const MOCK_FAVORITE_RECORDS = [{ userId: MOCK_USER_ID, accommodationId: 101 }];

// -----------------------------------------------------------
// FETCHERS
// -----------------------------------------------------------

// 類型定義 (請在您的 _types.ts 中使用這些)
export interface AccommodationCoreDetails {
  id: number;
  name: string;
  address: string;
  description: string;
  checkInTime: string;
  checkOutTime: string;
}

export interface GalleryImage {
  url: string;
  caption: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface AccommodationReviewsData {
  stats: { count: number; average: number };
  initialReviews: Array<any>; // 簡化
}

export interface RoomTypeData {
  id: number;
  name: string;
  description: string;
  maxCapacity: number;
  basePrice: number;
  amenities: string[]; // 房型獨有設施名稱
}

/**
 * 1. 模擬獲取住宿點的核心基本資料
 */
export async function accDetail_fetcher(
  AID: number
): Promise<AccommodationCoreDetails | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  if (AID !== MOCK_DATA.id) return null;
  return {
    id: MOCK_DATA.id,
    name: MOCK_DATA.name,
    address: MOCK_DATA.address,
    description: MOCK_DATA.description,
    checkInTime: MOCK_DATA.checkInTime,
    checkOutTime: MOCK_DATA.checkOutTime,
  };
}

/**
 * 2. 模擬獲取圖片集資料
 */
export async function accGallery_fetcher(AID: number): Promise<GalleryImage[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  if (AID !== MOCK_DATA.id) return [];
  return MOCK_DATA.Images.map((img) => ({
    url: img.url,
    caption: img.caption,
    isPrimary: img.isPrimary,
    sortOrder: img.sortOrder,
  })).sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * 3. 模擬獲取評論統計與首頁列表
 */
export async function accReview_fetcher(
  AID: number
): Promise<AccommodationReviewsData> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  if (AID !== MOCK_DATA.id)
    return { stats: { count: 0, average: 0 }, initialReviews: [] };

  const reviews = MOCK_DATA.Reviews;
  const totalScore = reviews.reduce((sum, r) => sum + r.ratingScore, 0);
  const totalCount = reviews.length;
  const averageScore =
    totalCount > 0 ? parseFloat((totalScore / totalCount).toFixed(1)) : 0;

  return {
    stats: { count: totalCount, average: averageScore },
    initialReviews: reviews.slice(0, 3).map((r) => ({
      id: r.id,
      ratingScore: r.ratingScore,
      comment: r.comment,
      reviewDate: r.reviewDate,
    })),
  };
}

/**
 * 4. 模擬獲取收藏狀態
 */
export async function accFavorite_fetcher(
  AID: number,
  userId: number
): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 80));
  if (userId !== MOCK_USER_ID) return false;

  return MOCK_FAVORITE_RECORDS.some(
    (record) => record.accommodationId === AID && record.userId === userId
  );
}

/**
 * 5. 🚨 模擬獲取飯店設施列表
 */
export async function accAmenity_fetcher(AID: number): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (AID !== MOCK_DATA.id) return [];

  const amenityIds = MOCK_DATA.ACCOMMODATION_AMENITIES.filter(
    (record) => record.accommodationId === AID
  ).map((record) => record.amenityId);

  const amenityNames = MOCK_DATA.AMENITY_BASE.filter((amenity) =>
    amenityIds.includes(amenity.id)
  ).map((amenity) => amenity.name);

  return amenityNames;
}

/**
 * 6. 🚨 模擬獲取房型總覽及設施
 */
export async function roomTypes_fetcher(AID: number): Promise<RoomTypeData[]> {
  await new Promise((resolve) => setTimeout(resolve, 120));

  if (AID !== MOCK_DATA.id) return [];

  // 建立設施ID到名稱的映射表
  const roomAmenityMap = new Map(
    MOCK_DATA.ROOM_AMENITY_BASE.map((a) => [a.id, a.name])
  );

  return MOCK_DATA.ROOM_TYPES.map((room) => ({
    id: room.id,
    name: room.name,
    description: room.description,
    maxCapacity: room.maxCapacity,
    basePrice: room.basePrice, // 雖然頁面上沒用，但數據應包含

    // 轉換 amenityIds 為實際名稱
    amenities: room.amenityIds.map(
      (id) => roomAmenityMap.get(id) || '未知設施'
    ),
  }));
}
