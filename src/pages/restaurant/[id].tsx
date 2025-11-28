import { useRouter } from 'next/router';
import { DEMO_RESTAURANTS } from '@/shared/mock/restaurants';
import { ArrowLeft, MapPin, Clock, DollarSign, Star } from 'lucide-react';
import Link from 'next/link';
import { RestaurantCard } from '@/features/restaurant/components/RestaurantCard';

const ASPECT_LABELS = {
  taste: { label: '맛' },
  price: { label: '가성비' },
  atmosphere: { label: '분위기' },
  hygiene: { label: '위생' },
};

export default function RestaurantDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const restaurant = DEMO_RESTAURANTS.find((r) => r.id === id);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
        <div className="text-center">
          <p className="text-[#9AA6B2]">식당을 찾을 수 없습니다</p>
          <Link href="/" className="text-[#5B8DC8] hover:underline mt-2 block">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // 비슷한 가게 (같은 카테고리)
  const similarRestaurants = DEMO_RESTAURANTS.filter(
    (r) => r.category === restaurant.category && r.id !== restaurant.id
  ).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* 헤더 */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-[#E5E7EB] rounded-lg transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-[#9AA6B2]" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">식당 상세</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 메인 정보 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8 border border-[#E5E7EB]">
          {/* 이미지 */}
          <div className="relative h-80 bg-[#F9FAFB] flex items-center justify-center">
            <svg className="w-32 h-32 text-[#BCCCDC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <div className="p-6">
            {/* 헤더 */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {restaurant.name}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#F9FAFB] text-gray-700 font-medium rounded-full border border-[#E5E7EB]">
                    {restaurant.category}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-2xl font-bold text-gray-900">{restaurant.rating}</span>
                </div>
                <p className="text-sm text-[#9AA6B2]">평점</p>
              </div>
            </div>

            {/* 요약 */}
            <p className="text-lg text-gray-700 mb-6">{restaurant.summary}</p>

            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                <MapPin className="w-5 h-5 text-[#9AA6B2]" />
                <div>
                  <p className="text-sm text-[#9AA6B2]">주소</p>
                  <p className="font-medium text-gray-900">{restaurant.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                <Clock className="w-5 h-5 text-[#9AA6B2]" />
                <div>
                  <p className="text-sm text-[#9AA6B2]">영업시간</p>
                  <p className="font-medium text-gray-900">{restaurant.openingHours}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                <div className="w-5 h-5 flex items-center justify-center text-[#9AA6B2] font-bold text-lg">
                  ₩
                </div>
                <div>
                  <p className="text-sm text-[#9AA6B2]">가격대</p>
                </div>
              </div>
            </div>

            {/* Aspect 점수 */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">평가 항목</h2>
              <div className="space-y-4">
                {Object.entries(restaurant.scores)
                  .filter(([key]) => key !== 'overall')
                  .map(([key, value]) => {
                    const aspect = ASPECT_LABELS[key as keyof typeof ASPECT_LABELS];
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-gray-900">{aspect.label}</span>
                          <span className="text-lg font-bold text-gray-900">{value.toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-[#F3F4F6] rounded-full h-3 border border-[#E5E7EB]">
                          <div
                            className="bg-[#5B8DC8] h-3 rounded-full transition-all"
                            style={{ width: `${(value / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* 리뷰 */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">리뷰</h2>
              <div className="space-y-3">
                {restaurant.reviews.map((review, idx) => (
                  <div key={idx} className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-gray-900">
                        {ASPECT_LABELS[review.aspect].label}
                      </span>
                      {review.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium text-gray-900">{review.rating}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 비슷한 가게 */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              이 가게와 비슷한 {restaurant.category} 맛집
            </h2>
            <button
              onClick={() => {
                router.push(`/?category=${encodeURIComponent(restaurant.category)}`);
              }}
              className="px-4 py-2 text-sm font-bold text-[#5B8DC8] bg-[#F9FAFB] border border-[#5B8DC8] rounded-lg hover:bg-[#5B8DC8] hover:text-white hover:shadow-md transition-all cursor-pointer"
            >
              비슷한 분위기 더 보기
            </button>
          </div>
          {similarRestaurants.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-4">
                {similarRestaurants.map((r) => (
                  <div key={r.id} className="shrink-0">
                    <RestaurantCard restaurant={r} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[#9AA6B2] text-center py-8">
              비슷한 카테고리의 다른 맛집을 찾고 있어요. 위 버튼을 눌러 더 많은 {restaurant.category} 맛집을 확인해보세요!
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
