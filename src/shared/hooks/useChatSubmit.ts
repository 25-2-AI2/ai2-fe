import { useCallback } from 'react';
import { useChatStore } from '@/shared/store/chatStore';
import { useAuthStore } from '@/shared/store/authStore';
import { useProfileStore } from '@/shared/store/profileStore';
import { searchChat } from '@/shared/api/chatApi';
import { getRestaurantDetails } from '@/shared/api/restaurantApi';
import { geocodeAddress } from '@/shared/utils/geocoding';
import { getErrorMessage } from '@/shared/utils/errorHandler';
import { ERROR_MESSAGES } from '@/shared/constants/messages';
import { RestaurantSearchResult, RestaurantWithCoords } from '@/shared/types/restaurant';

/**
 * 채팅 제출 로직을 담당하는 Custom Hook
 * - RAG 검색 → 상세 정보 조회 → Geocoding 순차 처리
 * - 비즈니스 로직과 UI 분리
 * - 에러 처리 중앙화
 */
export function useChatSubmit() {
  const { addMessage, setLoading, setLoadingCoords } = useChatStore();
  const { userId } = useAuthStore();
  const { profile } = useProfileStore();

  /**
   * 레스토랑 검색 결과에 상세 정보와 좌표를 추가
   */
  const enrichRestaurantsWithCoords = useCallback(
    async (restaurants: RestaurantSearchResult[]): Promise<RestaurantWithCoords[]> => {
      if (restaurants.length === 0) return [];

      // 1. place_id로 상세 정보 조회
      const placeIds = restaurants.map(r => r.place_id);
      const details = await getRestaurantDetails(placeIds);
      
      // place_id로 빠른 검색을 위한 Map 생성
      const detailMap = new Map(details.map(d => [d.place_id, d]));

      // 2. 각 레스토랑에 대해 Geocoding 수행
      const enrichedRestaurants: RestaurantWithCoords[] = [];
      
      for (const restaurant of restaurants) {
        const detail = detailMap.get(restaurant.place_id);
        if (!detail) continue;

        try {
          // Geocoding으로 좌표 얻기
          const coords = await geocodeAddress(detail.address);
          
          enrichedRestaurants.push({
            ...restaurant,
            address: detail.address,
            lat: coords.lat,
            lng: coords.lng,
            grid: detail.grid ?? undefined,
            user_ratings_total: detail.user_ratings_total ?? undefined,
            primaryType: detail.primaryType ?? undefined,
            district: detail.district,
          });
        } catch (error) {
          console.error(`Geocoding failed for ${restaurant.name}:`, error);
          // Geocoding 실패 시 해당 레스토랑은 제외 (지도에 표시 불가)
        }
      }

      return enrichedRestaurants;
    },
    []
  );

  const submitMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      const userMessage = message.trim();
      setLoading(true);

      // 유저 메시지 추가
      addMessage({
        role: 'user',
        content: userMessage,
      });

      try {
        if (!userId) {
          throw new Error(ERROR_MESSAGES.NO_USER);
        }

        // Step 1: RAG 검색 API 호출
        const response = await searchChat({
          user_id: userId,
          query: userMessage,
          user_preferences: profile.aspects,
        });

        // AI 응답 추가
        addMessage({
          role: 'assistant',
          content: response.answer,
        });

        // RAG 검색 결과 저장
        useChatStore.setState({
          currentQuery: userMessage,
          recommendedRestaurants: response.restaurants,
          isLoading: false,
        });

        // Step 2: 상세 정보 + Geocoding (비동기로 진행)
        if (response.restaurants.length > 0) {
          setLoadingCoords(true);
          
          try {
            const restaurantsWithCoords = await enrichRestaurantsWithCoords(response.restaurants);
            
            useChatStore.setState({
              restaurantsWithCoords,
              isLoadingCoords: false,
            });
          } catch (error) {
            console.error('Failed to enrich restaurants with coords:', error);
            useChatStore.setState({
              restaurantsWithCoords: [],
              isLoadingCoords: false,
            });
          }
        }

      } catch (error) {
        console.error('Chat API error:', error);

        // 사용자 친화적 에러 메시지
        const errorMessage = getErrorMessage(error);
        
        addMessage({
          role: 'assistant',
          content: errorMessage,
        });

        useChatStore.setState({
          currentQuery: userMessage,
          recommendedRestaurants: [],
          restaurantsWithCoords: [],
          isLoading: false,
          isLoadingCoords: false,
        });
      }
    },
    [userId, profile.aspects, addMessage, setLoading, setLoadingCoords, enrichRestaurantsWithCoords]
  );

  return { submitMessage };
}
