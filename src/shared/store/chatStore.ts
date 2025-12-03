import { create } from 'zustand';
import { Message } from '@/shared/types/chat';
import { RestaurantSearchResult, RestaurantWithCoords } from '@/shared/types/restaurant';

interface ChatStore {
  messages: Message[];
  currentQuery: string;
  // RAG 검색 결과 (백엔드 응답 그대로)
  recommendedRestaurants: RestaurantSearchResult[];
  // 지도 표시용 (상세 정보 + 좌표 포함)
  restaurantsWithCoords: RestaurantWithCoords[];
  selectedRestaurantId: string | null;
  isLoading: boolean;
  isLoadingCoords: boolean;
  
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setQuery: (query: string) => void;
  setRecommendedRestaurants: (restaurants: RestaurantSearchResult[]) => void;
  setRestaurantsWithCoords: (restaurants: RestaurantWithCoords[]) => void;
  setSelectedRestaurant: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setLoadingCoords: (loading: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>()((set) => ({
  messages: [],
  currentQuery: '',
  recommendedRestaurants: [],
  restaurantsWithCoords: [],
  selectedRestaurantId: null,
  isLoading: false,
  isLoadingCoords: false,

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: `msg-${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
        },
      ],
    })),

  setQuery: (query) => set({ currentQuery: query }),
  
  setRecommendedRestaurants: (restaurants) => set({ recommendedRestaurants: restaurants }),
  
  setRestaurantsWithCoords: (restaurants) => set({ restaurantsWithCoords: restaurants }),
  
  setSelectedRestaurant: (id) => set({ selectedRestaurantId: id }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setLoadingCoords: (loading) => set({ isLoadingCoords: loading }),
  
  clearMessages: () => set({ 
    messages: [], 
    currentQuery: '', 
    recommendedRestaurants: [],
    restaurantsWithCoords: [],
  }),
}));
