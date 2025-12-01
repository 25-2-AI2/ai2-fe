import { useCallback } from 'react';
import { useChatStore } from '@/shared/store/chatStore';
import { useAuthStore } from '@/shared/store/authStore';
import { useProfileStore } from '@/shared/store/profileStore';
import { searchChat } from '@/shared/api/chatApi';
import { getErrorMessage } from '@/shared/utils/errorHandler';
import { ERROR_MESSAGES } from '@/shared/constants/messages';

/**
 * 채팅 제출 로직을 담당하는 Custom Hook
 * - 비즈니스 로직과 UI 분리
 * - 에러 처리 중앙화
 * - 재사용 가능한 로직
 */
export function useChatSubmit() {
  const { addMessage, setLoading } = useChatStore();
  const { userId } = useAuthStore();
  const { profile } = useProfileStore();

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

        // API 호출
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

        // 상태 업데이트
        useChatStore.setState({
          currentQuery: userMessage,
          recommendedRestaurantIds: response.restaurants.map(String),
          isLoading: false,
        });
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
          recommendedRestaurantIds: [],
          isLoading: false,
        });
      }
    },
    [userId, profile.aspects, addMessage, setLoading]
  );

  return { submitMessage };
}
