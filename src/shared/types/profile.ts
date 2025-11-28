export interface UserProfile {
  aspects: {
    taste: number;      // 1-5
    price: number;      // 1-5
    atmosphere: number; // 1-5
    hygiene: number;    // 1-5
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export const DEFAULT_PROFILE: UserProfile = {
  aspects: {
    taste: 3,
    price: 3,
    atmosphere: 3,
    hygiene: 3,
  },
};
