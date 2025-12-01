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
