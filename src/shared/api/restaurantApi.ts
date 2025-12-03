import { apiClient } from './client';

// 레스토랑 상세 정보 응답 타입
export interface RestaurantDetail {
  place_id: string;
  name: string;
  grid: string | null;
  address: string;
  rating: number | null;
  user_ratings_total: number | null;
  primaryType: string | null;
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
 */
export const getRestaurantDetail = async (
  placeId: string
): Promise<RestaurantDetail> => {
  const response = await apiClient.get<RestaurantDetail>(
    `/restaurants/${placeId}`
  );
  return response.data;
};

/**
 * 여러 레스토랑 상세 정보 일괄 조회
 * 각 place_id에 대해 병렬로 API 호출
 * 
 * @param placeIds - 조회할 place_id 배열
 * @returns 성공한 레스토랑 상세 정보 배열 (실패한 것은 제외)
 */
export const getRestaurantDetails = async (
  placeIds: string[]
): Promise<RestaurantDetail[]> => {
  const results = await Promise.allSettled(
    placeIds.map(placeId => getRestaurantDetail(placeId))
  );
  
  // 성공한 결과만 필터링
  return results
    .filter((result): result is PromiseFulfilledResult<RestaurantDetail> => 
      result.status === 'fulfilled'
    )
    .map(result => result.value);
};

/**
 * 비슷한 레스토랑 추천
 * GET /restaurants/{place_id}/recommend
 */
export const getRecommendedRestaurants = async (
  placeId: string
): Promise<RecommendedRestaurant[]> => {
  const response = await apiClient.get<RecommendedRestaurant[]>(
    `/restaurants/${placeId}/recommend`
  );
  return response.data;
};
