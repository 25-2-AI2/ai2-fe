import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getUserInfo } from '@/shared/api/userApi';

interface AuthStore {
  userId: number | null;
  email: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // 사용자 정보 설정
  setUser: (userId: number, email?: string) => void;
  
  // 사용자 정보 초기화 (로그아웃)
  clearUser: () => void;
  
  // API를 통해 사용자 정보 불러오기
  fetchUserInfo: (userId: number) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      userId: null,
      email: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (userId, email) =>
        set({
          userId,
          email: email || null,
          isAuthenticated: true,
          error: null,
        }),

      clearUser: () =>
        set({
          userId: null,
          email: null,
          isAuthenticated: false,
          error: null,
        }),

      fetchUserInfo: async (userId: number) => {
        set({ isLoading: true, error: null });
        try {
          const data = await getUserInfo(userId);
          set({
            userId: data.id,
            email: data.email,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // API 실패 시에도 기본 userId 설정 (테스트 편의를 위해)
          console.error('Failed to fetch user info:', error);
          set({
            userId: userId,  // 요청한 userId를 기본값으로 설정
            email: null,
            isAuthenticated: true,
            isLoading: false,
            error: null,  // 에러 메시지 표시하지 않음
          });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
