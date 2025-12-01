export interface UserProfile {
  id?: number;
  email?: string;
  aspects: {
    food: number;        // 맛 (1-5)
    service: number;     // 서비스 (1-5)
    ambience: number;    // 분위기 (1-5)
    price: number;       // 가성비 (1-5)
    hygiene: number;     // 위생 (1-5)
    waiting: number;     // 대기시간 (1-5)
    accessibility: number; // 접근성 (1-5)
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export const DEFAULT_PROFILE: UserProfile = {
  aspects: {
    food: 3,
    service: 3,
    ambience: 3,
    price: 3,
    hygiene: 3,
    waiting: 3,
    accessibility: 3,
  },
};
