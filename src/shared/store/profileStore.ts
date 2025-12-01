import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, DEFAULT_PROFILE } from '@/shared/types/profile';
import { getUserInfo, updateUserPreferences, UpdateUserPreferencesRequest } from '@/shared/api/userApi';

interface ProfileStore {
  profile: UserProfile;
  hasSetProfile: boolean;
  isLoading: boolean;
  error: string | null;
  
  // 로컬 상태 업데이트
  updateProfile: (profile: Partial<UserProfile['aspects']>) => void;
  resetProfile: () => void;
  setProfileCompleted: () => void;
  
  // API 호출 함수들
  fetchUserProfile: (userId: number) => Promise<void>;
  saveUserPreferences: (userId: number) => Promise<void>;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      hasSetProfile: false,
      isLoading: false,
      error: null,

      updateProfile: (aspects) =>
        set((state) => ({
          profile: {
            ...state.profile,
            aspects: {
              ...state.profile.aspects,
              ...aspects,
            },
            updatedAt: new Date(),
          },
        })),

      resetProfile: () =>
        set({
          profile: DEFAULT_PROFILE,
          hasSetProfile: false,
          error: null,
        }),

      setProfileCompleted: () => set({ hasSetProfile: true }),

      // 유저 정보 조회
      fetchUserProfile: async (userId: number) => {
        set({ isLoading: true, error: null });
        try {
          const data = await getUserInfo(userId);
          set({
            profile: {
              id: data.id,
              email: data.email,
              aspects: {
                food: data.tags.food,
                service: data.tags.service,
                ambience: data.tags.ambience,
                price: data.tags.price,
                hygiene: data.tags.hygiene,
                waiting: data.tags.waiting,
                accessibility: data.tags.accessibility,
              },
              updatedAt: new Date(),
            },
            hasSetProfile: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '프로필을 불러오는데 실패했습니다.',
            isLoading: false,
          });
          console.error('Failed to fetch user profile:', error);
        }
      },

      // 유저 선호도 저장
      saveUserPreferences: async (userId: number) => {
        set({ isLoading: true, error: null });
        try {
          const { profile } = get();
          const preferences: UpdateUserPreferencesRequest = {
            food: profile.aspects.food,
            service: profile.aspects.service,
            ambience: profile.aspects.ambience,
            price: profile.aspects.price,
            hygiene: profile.aspects.hygiene,
            waiting: profile.aspects.waiting,
            accessibility: profile.aspects.accessibility,
          };
          
          await updateUserPreferences(userId, preferences);
          
          set({
            hasSetProfile: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '프로필 저장에 실패했습니다.',
            isLoading: false,
          });
          console.error('Failed to save user preferences:', error);
          throw error; // 에러를 다시 throw하여 컴포넌트에서 처리 가능하게 함
        }
      },
    }),
    {
      name: 'user-profile-storage',
    }
  )
);
