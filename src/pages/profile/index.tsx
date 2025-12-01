import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useProfileStore } from '@/shared/store/profileStore';
import { useAuthStore } from '@/shared/store/authStore';
import { PreferenceSlider } from '@/features/profile/components/PreferenceSlider';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const ASPECTS = [
  { key: 'food', label: '맛' },
  { key: 'service', label: '서비스' },
  { key: 'ambience', label: '분위기' },
  { key: 'price', label: '가성비' },
  { key: 'hygiene', label: '위생' },
  { key: 'waiting', label: '대기시간' },
  { key: 'accessibility', label: '접근성' },
] as const;

export default function ProfilePage() {
  const router = useRouter();
  const { profile, updateProfile, setProfileCompleted, saveUserPreferences, fetchUserProfile, isLoading, error } = useProfileStore();
  const { userId } = useAuthStore();
  const [preferences, setPreferences] = useState(profile.aspects);
  const [saveError, setSaveError] = useState<string | null>(null);

  // 페이지 진입 시 서버에서 유저 데이터 불러오기
  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId);
    }
  }, [userId, fetchUserProfile]);

  // 프로필이 로드되면 로컬 상태 업데이트
  useEffect(() => {
    setPreferences(profile.aspects);
  }, [profile.aspects]);

  const handleSave = async () => {
    if (!userId) {
      setSaveError('사용자 정보가 없습니다. 페이지를 새로고침해주세요.');
      return;
    }
    
    setSaveError(null);
    
    // 로컬 상태 먼저 업데이트
    updateProfile(preferences);
    setProfileCompleted();

    try {
      // API 호출하여 서버에 저장
      await saveUserPreferences(userId);
      router.push('/');
    } catch (error) {
      // 에러 발생 시 사용자에게 알림
      setSaveError('저장에 실패했습니다. 다시 시도해주세요.');
      console.error('Save failed:', error);
    }
  };

  const handleSkip = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* 헤더 */}
      <header className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="p-2 hover:bg-[#E5E7EB] rounded-lg transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-[#9AA6B2]" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">취향 설정</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-md p-8 border border-[#E5E7EB]">
          {/* 로딩 중 */}
          {isLoading && !preferences.food ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-[#5B8DC8] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-600">프로필을 불러오는 중...</p>
            </div>
          ) : error && !isLoading ? (
            /* 에러 상태 */
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={() => userId && fetchUserProfile(userId)}
                className="px-6 py-2 bg-[#5B8DC8] text-white rounded-lg hover:bg-[#4A7AB7] transition-all"
              >
                다시 시도
              </button>
            </div>
          ) : (
            /* 정상 상태 - 프로필 폼 */
            <>
          {/* 소개 */}
          <div className="text-center mb-8">
            <svg className="w-20 h-20 mx-auto mb-4 text-[#5B8DC8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              나의 취향을 알려주세요
            </h1>
            <p className="text-[#9AA6B2]">
              각 항목이 얼마나 중요한지 선택해주세요
              <br />
              <span className="text-sm">
                (나중에 언제든 변경할 수 있어요)
              </span>
            </p>
          </div>

          {/* 슬라이더들 */}
          <div className="space-y-8 mb-8">
            {ASPECTS.map((aspect) => (
              <PreferenceSlider
                key={aspect.key}
                label={aspect.label}
                value={preferences[aspect.key]}
                onChange={(value) =>
                  setPreferences((prev) => ({
                    ...prev,
                    [aspect.key]: value,
                  }))
                }
              />
            ))}
          </div>

          {/* 설명 */}
          <div className="bg-[#F9FAFB] rounded-lg p-4 mb-6 border border-[#E5E7EB]">
            <p className="text-sm text-[#9AA6B2]">
              <span className="font-bold text-gray-900">이 설정은 어떻게 사용되나요?</span>
              <br />
              검색 결과에 자동으로 반영되어 나에게 맞는 식당을 우선적으로 보여줍니다.
              예를 들어 "가성비"를 높게 설정하면 같은 검색에서도 가성비 좋은 곳이 상위에 표시돼요.
            </p>
          </div>

          {/* 에러 메시지 */}
          {(error || saveError) && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{saveError || error}</p>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              disabled={isLoading}
              className="flex-1 px-6 py-3 border-2 border-[#E5E7EB] text-[#6B7280] rounded-lg hover:bg-white hover:border-[#5B8DC8] hover:text-[#5B8DC8] transition-all cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              건너뛰기
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-[#5B8DC8] text-white rounded-lg hover:bg-[#4A7AB7] hover:shadow-lg transition-all cursor-pointer font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  저장하고 시작하기
                </>
              )}
            </button>
          </div>

          {/* 추가 안내 */}
          <p className="text-center text-sm text-gray-500 mt-4">
            설정을 건너뛰어도 서비스를 이용할 수 있어요
          </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
