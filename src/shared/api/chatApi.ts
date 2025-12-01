import { apiClient } from './client';

// 채팅 검색 요청 타입
export interface ChatSearchRequest {
  user_id: number;
  query: string;
  user_preferences: {
    food: number;
    service: number;
    ambience: number;
    price: number;
    hygiene: number;
    waiting: number;
    accessibility: number;
  };
}

// 채팅 검색 응답 타입
export interface ChatSearchResponse {
  answer: string;
  restaurants: number[]; // 레스토랑 ID 배열
}

/**
 * RAG 기반 채팅 검색
 * POST /chat/search
 */
export const searchChat = async (
  request: ChatSearchRequest
): Promise<ChatSearchResponse> => {
  const response = await apiClient.post<ChatSearchResponse>(
    '/chat/search',
    request
  );
  return response.data;
};
