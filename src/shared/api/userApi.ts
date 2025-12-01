import { apiClient } from './client';

// API 응답 타입 정의
export interface UserTagsResponse {
  id: number;
  email: string;
  tags: {
    food: number;
    service: number;
    ambience: number;
    price: number;
    hygiene: number;
    waiting: number;
    accessibility: number;
  };
}

// 유저 정보 수정 요청 타입
export interface UpdateUserPreferencesRequest {
  food: number;
  service: number;
  ambience: number;
  price: number;
  hygiene: number;
  waiting: number;
  accessibility: number;
}

/**
 * 유저 정보 조회
 * GET /users/{user_id}
 */
export const getUserInfo = async (userId: number): Promise<UserTagsResponse> => {
  const response = await apiClient.get<UserTagsResponse>(`/users/${userId}`);
  return response.data;
};

/**
 * 유저 선호도 수정
 * PATCH /users/{user_id}/preferences
 */
export const updateUserPreferences = async (
  userId: number,
  preferences: UpdateUserPreferencesRequest
): Promise<string> => {
  const response = await apiClient.patch<string>(
    `/users/${userId}/preferences`,
    preferences
  );
  return response.data;
};
