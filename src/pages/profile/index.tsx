import { useState } from 'react';
import { useRouter } from 'next/router';
import { useProfileStore } from '@/shared/store/profileStore';
import { PreferenceSlider } from '@/features/profile/components/PreferenceSlider';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

const ASPECTS = [
  { key: 'taste', label: '맛' },
  { key: 'price', label: '가성비' },
  { key: 'atmosphere', label: '분위기' },
  { key: 'hygiene', label: '위생' },
] as const;

export default function ProfilePage() {
  const router = useRouter();
  const { profile, updateProfile, setProfileCompleted } = useProfileStore();
  const [preferences, setPreferences] = useState(profile.aspects);

  const handleSave = () => {
    updateProfile(preferences);
    setProfileCompleted();
    router.push('/');
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

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-6 py-3 border-2 border-[#E5E7EB] text-[#6B7280] rounded-lg hover:bg-white hover:border-[#5B8DC8] hover:text-[#5B8DC8] transition-all cursor-pointer font-medium"
            >
              건너뛰기
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-[#5B8DC8] text-white rounded-lg hover:bg-[#4A7AB7] hover:shadow-lg transition-all cursor-pointer font-bold flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              저장하고 시작하기
            </button>
          </div>

          {/* 추가 안내 */}
          <p className="text-center text-sm text-gray-500 mt-4">
            설정을 건너뛰어도 서비스를 이용할 수 있어요
          </p>
        </div>
      </main>
    </div>
  );
}
