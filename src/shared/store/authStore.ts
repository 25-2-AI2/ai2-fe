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
          set({
            error: error instanceof Error ? error.message : '사용자 정보를 불러오는데 실패했습니다.',
            isLoading: false,
          });
          console.error('Failed to fetch user info:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
