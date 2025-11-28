import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, DEFAULT_PROFILE } from '@/shared/types/profile';

interface ProfileStore {
  profile: UserProfile;
  hasSetProfile: boolean;
  
  updateProfile: (profile: Partial<UserProfile['aspects']>) => void;
  resetProfile: () => void;
  setProfileCompleted: () => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      hasSetProfile: false,

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
        }),

      setProfileCompleted: () => set({ hasSetProfile: true }),
    }),
    {
      name: 'user-profile-storage',
    }
  )
);
