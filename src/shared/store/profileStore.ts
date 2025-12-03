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
                food: data.tags.food ?? 3,
                service: data.tags.service ?? 3,
                ambience: data.tags.ambience ?? 3,
                price: data.tags.price ?? 3,
                hygiene: data.tags.hygiene ?? 3,
                waiting: data.tags.waiting ?? 3,
                accessibility: data.tags.accessibility ?? 3,
              },
              updatedAt: new Date(),
            },
            hasSetProfile: true,
            isLoading: false,
          });
        } catch (error) {
          // API 실패 시 기본값 유지 (에러 표시하지 않음)
          console.error('Failed to fetch user profile:', error);
          set({
            isLoading: false,
            error: null,  // 에러 메시지 숨김
          });
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
          // API 실패해도 로컬 상태는 유지
          console.error('Failed to save user preferences:', error);
          set({
            hasSetProfile: true,  // 로컬에는 저장된 것으로 처리
            isLoading: false,
            error: null,
          });
          // throw하지 않음 - 로컬 저장은 성공으로 처리
        }
      },
    }),
    {
      name: 'user-profile-storage',
    }
  )
);
