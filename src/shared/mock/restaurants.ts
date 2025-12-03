import { Restaurant } from '@/shared/types/restaurant';


export const DEMO_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: '더플레이스 영등포타임스퀘어점',
    lat: 37.516997,
    lng: 126.904147,
    rating: 4.5,
    address: '서울 영등포구 영중로 15',
    category: '피자',
    imageUrl: '/images/pizza-1.jpg',
    openingHours: '11:00 - 22:00',
    scores: {
      taste: 4,
      price: 5,
      atmosphere: 3,
      hygiene: 4,
      overall: 4.0,
    },
    summary: '가성비 좋고 양이 푸짐한 피자집',
    reviews: [
      { text: '양이 정말 많아요!', aspect: 'price', rating: 5 },
      { text: '치즈가 진짜 맛있어요', aspect: 'taste', rating: 4 },
    ],
  },
  {
    id: 'rest-2',
    name: '노티드 타임스퀘어점',
    lat: 37.5165,
    lng: 126.9025,
    rating: 4.3,
    address: '서울 영등포구 영중로 9',
    category: '브런치',
    imageUrl: '/images/brunch-1.jpg',
    openingHours: '09:00 - 21:00',
    scores: {
      taste: 4,
      price: 3,
      atmosphere: 5,
      hygiene: 5,
      overall: 4.25,
    },
    summary: '감성 넘치는 브런치 카페',
    reviews: [
      { text: '인스타감성 뿜뿜', aspect: 'atmosphere', rating: 5 },
      { text: '청결도 좋아요', aspect: 'hygiene', rating: 5 },
    ],
  },
  {
    id: 'rest-3',
    name: '스시마루 영등포점',
    lat: 37.5180,
    lng: 126.9040,
    rating: 4.6,
    address: '서울 영등포구 당산로 123',
    category: '일식',
    imageUrl: '/images/sushi-1.jpg',
    openingHours: '12:00 - 23:00',
    scores: {
      taste: 5,
      price: 3,
      atmosphere: 4,
      hygiene: 5,
      overall: 4.25,
    },
    summary: '신선한 재료의 고급 스시',
    reviews: [
      { text: '진짜 맛있어요!', aspect: 'taste', rating: 5 },
      { text: '깨끗하고 좋습니다', aspect: 'hygiene', rating: 5 },
    ],
  },
  {
    id: 'rest-4',
    name: '더리버커피',
    lat: 37.5160,
    lng: 126.9020,
    rating: 4.2,
    address: '서울 영등포구 여의대로 45',
    category: '카페',
    imageUrl: '/images/cafe-1.jpg',
    openingHours: '08:00 - 22:00',
    scores: {
      taste: 4,
      price: 4,
      atmosphere: 5,
      hygiene: 4,
      overall: 4.25,
    },
    summary: '조용하고 아늑한 카페',
    reviews: [
      { text: '공부하기 좋아요', aspect: 'atmosphere', rating: 5 },
      { text: '커피 맛도 괜찮습니다', aspect: 'taste', rating: 4 },
    ],
  },
  {
    id: 'rest-5',
    name: '마라탕후이',
    lat: 37.5175,
    lng: 126.9028,
    rating: 4.4,
    address: '서울 영등포구 영등포로 234',
    category: '중식',
    imageUrl: '/images/chinese-1.jpg',
    openingHours: '11:30 - 22:30',
    scores: {
      taste: 5,
      price: 5,
      atmosphere: 2,
      hygiene: 3,
      overall: 3.75,
    },
    summary: '가성비 좋은 마라탕 맛집',
    reviews: [
      { text: '양이 엄청 많아요', aspect: 'price', rating: 5 },
      { text: '맛은 확실해요', aspect: 'taste', rating: 5 },
    ],
  },
];

// 챗봇 데모 응답
export const DEMO_CHAT_RESPONSES: Record<string, {
  message: string;
  restaurantIds: string[];
  extractedAspects: string[];
}> = {
  '가성비': {
    message: '타임스퀘어 근처 가성비 좋은 곳 3곳을 찾았어요! 양이 많고 가격 대비 만족도가 높은 곳들이에요.',
    restaurantIds: ['rest-1', 'rest-5', 'rest-4'],
    extractedAspects: ['price', 'taste'],
  },
  '피자': {
    message: '피자 맛집 찾으셨군요! 추천드립니다.',
    restaurantIds: ['rest-1'],
    extractedAspects: ['taste'],
  },
  '일식': {
    message: '신선한 일식 맛집을 추천해드려요!',
    restaurantIds: ['rest-3'],
    extractedAspects: ['taste', 'hygiene'],
  },
  '중식': {
    message: '가성비 좋은 중식 맛집 찾았어요!',
    restaurantIds: ['rest-5'],
    extractedAspects: ['taste', 'price'],
  },
  '브런치': {
    message: '브런치 맛집 찾았어요!',
    restaurantIds: ['rest-2'],
    extractedAspects: ['taste', 'atmosphere'],
  },
  '카페': {
    message: '조용하고 아늑한 카페 추천해드려요!',
    restaurantIds: ['rest-4'],
    extractedAspects: ['atmosphere'],
  },
  '분위기': {
    message: '감성 넘치는 곳들 추천해드려요!',
    restaurantIds: ['rest-2', 'rest-4'],
    extractedAspects: ['atmosphere'],
  },
  '조용한': {
    message: '조용하고 아늑한 카페 추천해드려요.',
    restaurantIds: ['rest-4'],
    extractedAspects: ['atmosphere'],
  },
  '타임스퀘어': {
    message: '타임스퀘어 근처 맛집 5곳을 찾았어요!',
    restaurantIds: ['rest-1', 'rest-2', 'rest-3', 'rest-4', 'rest-5'],
    extractedAspects: ['taste'],
  },
  '영등포': {
    message: '영등포 근처 맛집 5곳을 찾았어요!',
    restaurantIds: ['rest-1', 'rest-2', 'rest-3', 'rest-4', 'rest-5'],
    extractedAspects: ['taste'],
  },
  default: {
    message: '타임스퀘어 근처 맛집 5곳을 찾았어요!',
    restaurantIds: ['rest-1', 'rest-2', 'rest-3', 'rest-4', 'rest-5'],
    extractedAspects: ['taste'],
  },
};
