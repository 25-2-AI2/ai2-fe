import { apiClient } from './client';
import { SAMPLE_RESTAURANT_DETAIL, SAMPLE_RECOMMENDED_RESTAURANTS } from '@/shared/mock/restaurantDetail';

// 레스토랑 상세 정보 응답 타입
export interface RestaurantDetail {
  place_id: string;
  name: string;
  grid: string;
  address: string;
  rating: number;
  user_ratings_total: number;
  primaryType: string;
  district: string;
  generated_tags: string[];
}

// 추천 레스토랑 타입 (match_reason 추가)
export interface RecommendedRestaurant extends RestaurantDetail {
  match_reason: string;
}

/**
 * 레스토랑 상세 정보 조회
 * GET /restaurants/{place_id}
 * 
 * 샘플 데이터 모드: API 서버 없이 테스트 가능
 */
export const getRestaurantDetail = async (
  placeId: string
): Promise<RestaurantDetail> => {
  // 샘플 데이터 모드 (API 서버 없을 때)
  const useSampleData = true; // 실제 API 사용 시 false로 변경
  
  if (useSampleData) {
    // 샘플 데이터에서 찾기
    const sampleData = SAMPLE_RESTAURANT_DETAIL[placeId as keyof typeof SAMPLE_RESTAURANT_DETAIL];
    if (sampleData) {
      // API 응답 시뮬레이션 (약간의 지연)
      await new Promise(resolve => setTimeout(resolve, 300));
      return sampleData;
    }
    console.error('Available sample place_ids:', Object.keys(SAMPLE_RESTAURANT_DETAIL));
    throw new Error(`Restaurant not found in sample data. Try one of: ${Object.keys(SAMPLE_RESTAURANT_DETAIL).join(', ')}`);
  }

  // 실제 API 호출
  const response = await apiClient.get<RestaurantDetail>(
    `/restaurants/${placeId}`
  );
  return response.data;
};

/**
 * 비슷한 레스토랑 추천
 * GET /restaurants/{place_id}/recommend
 * 
 * 샘플 데이터 모드: API 서버 없이 테스트 가능
 */
export const getRecommendedRestaurants = async (
  placeId: string
): Promise<RecommendedRestaurant[]> => {
  // 샘플 데이터 모드 (API 서버 없을 때)
  const useSampleData = true; // 실제 API 사용 시 false로 변경
  
  if (useSampleData) {
    // 샘플 데이터에서 찾기
    const sampleData = SAMPLE_RECOMMENDED_RESTAURANTS[placeId as keyof typeof SAMPLE_RECOMMENDED_RESTAURANTS];
    if (sampleData) {
      // API 응답 시뮬레이션 (약간의 지연)
      await new Promise(resolve => setTimeout(resolve, 500));
      return sampleData;
    }
    return []; // 추천 데이터 없으면 빈 배열
  }

  // 실제 API 호출
  const response = await apiClient.get<RecommendedRestaurant[]>(
    `/restaurants/${placeId}/recommend`
  );
  return response.data;
};
