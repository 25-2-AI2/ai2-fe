export interface AspectScores {
  taste: number;       // 1-5
  price: number;       // 1-5 (가성비)
  atmosphere: number;  // 1-5
  hygiene: number;     // 1-5
  overall: number;     // 평균
}

export interface Review {
  text: string;
  aspect: keyof Omit<AspectScores, 'overall'>;
  rating?: number;
}

/**
 * RAG 검색 결과로 반환되는 레스토랑 정보
 * POST /chat/search 응답에서 사용
 */
export interface RestaurantSearchResult {
  place_id: string;
  name: string;
  rating: number | null;
  generated_tags: string[];
  score: number | null;
  korean_pattern: string | null;
}

/**
 * 지도 표시용 레스토랑 정보
 * RestaurantSearchResult + 상세 정보(address, 좌표 등) 조합
 */
export interface RestaurantWithCoords extends RestaurantSearchResult {
  address: string;
  lat: number;
  lng: number;
  grid?: string;
  user_ratings_total?: number;
  primaryType?: string;
  district?: string;
}

/**
 * 기존 Restaurant 인터페이스 (레거시 호환용)
 */
export interface Restaurant {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating: number;
  address: string;
  category: string;
  imageUrl: string;
  scores: AspectScores;
  summary: string;
  reviews: Review[];
  openingHours?: string;
  // API 응답 필드 추가
  place_id?: string;
  grid?: string;
  user_ratings_total?: number;
  primaryType?: string;
  district?: string;
  generated_tags?: string[];
}

export interface SearchResponse {
  query: string;
  extractedAspects: string[];
  restaurants: Restaurant[];
  appliedProfile: boolean;
}
