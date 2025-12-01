# User API 사용 가이드

## 📁 파일 구조

```
src/
├── shared/
│   ├── api/
│   │   ├── client.ts          # Axios 인스턴스 (공통)
│   │   └── userApi.ts         # User API 함수들
│   ├── store/
│   │   └── profileStore.ts    # Zustand 스토어 (API 연동)
│   └── types/
│       └── profile.ts         # 타입 정의
└── pages/
    └── profile/
        └── index.tsx          # 프로필 페이지 (API 사용 예시)
.env.local                     # 환경 변수
```

---

## 🔧 설정

### 1. 환경 변수 (.env.local)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 2. Axios 인스턴스 (src/shared/api/client.ts)
- 모든 API 호출에 사용되는 공통 설정
- 요청/응답 인터셉터로 토큰 추가 및 에러 핸들링
- timeout: 10초

---

## 📡 API 함수 사용법

### 직접 API 함수 호출

```typescript
import { getUserInfo, updateUserPreferences } from '@/shared/api/userApi';

// 유저 정보 조회
const fetchUser = async () => {
  try {
    const userInfo = await getUserInfo(1);
    console.log(userInfo);
    // {
    //   id: 1,
    //   email: "user@example.com",
    //   tags: { food: 5, service: 4, ... }
    // }
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }
};

// 유저 선호도 수정
const updatePreferences = async () => {
  try {
    const result = await updateUserPreferences(1, {
      food: 5,
      service: 4,
      ambience: 3,
      price: 5,
      hygiene: 4,
      waiting: 3,
      accessibility: 4,
    });
    console.log(result); // "string" (서버 응답)
  } catch (error) {
    console.error('Failed to update preferences:', error);
  }
};
```

---

## 🗂️ Zustand 스토어 사용법 (권장)

스토어를 통해 API를 호출하면 로딩 상태와 에러를 자동으로 관리할 수 있습니다.

### 컴포넌트에서 사용

```typescript
import { useProfileStore } from '@/shared/store/profileStore';

function MyComponent() {
  const { 
    profile,           // 현재 프로필 데이터
    isLoading,         // 로딩 상태
    error,             // 에러 메시지
    fetchUserProfile,  // 조회 함수
    saveUserPreferences // 저장 함수
  } = useProfileStore();

  const userId = 1; // 실제로는 인증 시스템에서 가져옴

  // 프로필 불러오기
  useEffect(() => {
    fetchUserProfile(userId);
  }, [fetchUserProfile, userId]);

  // 프로필 저장
  const handleSave = async () => {
    try {
      await saveUserPreferences(userId);
      alert('저장 완료!');
    } catch (error) {
      alert('저장 실패');
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      <p>맛: {profile.aspects.food}</p>
      <button onClick={handleSave}>저장</button>
    </div>
  );
}
```

---

## 🎯 실제 사용 예시

### profile/index.tsx (프로필 페이지)

```typescript
const { profile, updateProfile, saveUserPreferences, isLoading, error } = useProfileStore();
const [preferences, setPreferences] = useState(profile.aspects);

// 저장 버튼 클릭 시
const handleSave = async () => {
  // 1. 로컬 상태 업데이트 (즉시 반영)
  updateProfile(preferences);
  
  // 2. API 호출 (서버에 저장)
  try {
    await saveUserPreferences(CURRENT_USER_ID);
    router.push('/');
  } catch (error) {
    alert('저장 실패');
  }
};
```

---

## 🔐 인증 토큰 추가 (추후)

`client.ts`의 요청 인터셉터에서 토큰을 추가할 수 있습니다:

```typescript
// src/shared/api/client.ts
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 📝 타입 정의

### UserProfile (프론트엔드)
```typescript
{
  id?: number;
  email?: string;
  aspects: {
    food: number;        // 맛
    service: number;     // 서비스
    ambience: number;    // 분위기
    price: number;       // 가성비
    hygiene: number;     // 위생
    waiting: number;     // 대기시간
    accessibility: number; // 접근성
  };
}
```

### UserTagsResponse (API 응답)
```typescript
{
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
```

---

## ✅ 장점

1. **유지보수성**: API 함수를 한 곳에서 관리
2. **재사용성**: 여러 컴포넌트에서 동일한 API 함수 사용
3. **타입 안전성**: TypeScript로 타입 체크
4. **에러 핸들링**: 인터셉터에서 공통 에러 처리
5. **상태 관리**: Zustand로 로딩/에러 상태 자동 관리

---

## 🚀 다음 단계

1. **실제 사용자 ID 연동**: 인증 시스템과 연결
2. **토큰 관리**: JWT 토큰 추가
3. **에러 UI**: 토스트 알림 등 추가
4. **API 확장**: 다른 엔드포인트 추가 (예: `/restaurants`, `/reviews`)
