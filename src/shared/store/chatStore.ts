import { create } from 'zustand';
import { Message } from '@/shared/types/chat';

interface ChatStore {
  messages: Message[];
  currentQuery: string;
  recommendedRestaurantIds: string[];
  selectedRestaurantId: string | null;
  isLoading: boolean;
  
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setQuery: (query: string) => void;
  setRecommendedRestaurants: (ids: string[]) => void;
  setSelectedRestaurant: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>()((set) => ({
  messages: [],
  currentQuery: '',
  recommendedRestaurantIds: [],
  selectedRestaurantId: null,
  isLoading: false,

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
  
  setRecommendedRestaurants: (ids) => set({ recommendedRestaurantIds: ids }),
  
  setSelectedRestaurant: (id) => set({ selectedRestaurantId: id }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  clearMessages: () => set({ messages: [], currentQuery: '', recommendedRestaurantIds: [] }),
}));
