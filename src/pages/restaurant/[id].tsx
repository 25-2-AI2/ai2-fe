import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getRestaurantDetail, getRecommendedRestaurants, RestaurantDetail, RecommendedRestaurant } from '@/shared/api/restaurantApi';
import { ArrowLeft, MapPin, Star, Loader2, AlertCircle, Users, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { SingleRestaurantMap } from '@/features/map/components/SingleRestaurantMap';

export default function RestaurantDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [recommendedRestaurants, setRecommendedRestaurants] = useState<RecommendedRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRecommended, setShowRecommended] = useState(false);

  // 레스토랑 상세 정보 로드
  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const detailData = await getRestaurantDetail(id);
        setRestaurant(detailData);
      } catch (err) {
        console.error('Failed to fetch restaurant data:', err);
        setError('식당 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 추천 식당 로드
  const handleLoadRecommended = async () => {
    if (!id || typeof id !== 'string' || recommendedRestaurants.length > 0) {
      setShowRecommended(true);
      return;
    }

    setIsLoadingRecommended(true);
    try {
      const recommendData = await getRecommendedRestaurants(id);
      setRecommendedRestaurants(recommendData);
      setShowRecommended(true);
    } catch (err) {
      console.error('Failed to fetch recommended restaurants:', err);
    } finally {
      setIsLoadingRecommended(false);
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#5B8DC8] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">식당 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 또는 데이터 없음
  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {error || '식당을 찾을 수 없습니다'}
          </p>
          <Link href="/" className="text-[#5B8DC8] hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">식당 상세</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 지도 영역 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-200">
          <div className="h-[300px]">
            <SingleRestaurantMap 
              address={restaurant.address}
              name={restaurant.name}
            />
          </div>
        </div>

        {/* 메인 정보 카드 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-200">
          <div className="p-6">
            {/* 식당 이름 */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {restaurant.name}
            </h1>

            {/* 평점 및 리뷰 수 */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-xl font-bold text-gray-900">
                  {restaurant.rating ?? 'N/A'}
                </span>
              </div>
              {restaurant.user_ratings_total && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">
                    리뷰 {restaurant.user_ratings_total.toLocaleString()}개
                  </span>
                </div>
              )}
            </div>

            {/* 주소 */}
            <div className="flex items-start gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">{restaurant.address}</p>
            </div>

            {/* 추가 정보 */}
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-500 mb-1">지역</p>
                <p className="font-medium text-gray-900">{restaurant.district}</p>
              </div>
              {restaurant.grid && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">그리드</p>
                  <p className="font-medium text-gray-900">{restaurant.grid}</p>
                </div>
              )}
              {restaurant.primaryType && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1">카테고리</p>
                  <p className="font-medium text-gray-900">
                    {restaurant.primaryType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
              )}
            </div>

            {/* 태그 */}
            {restaurant.generated_tags.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">특징</p>
                <div className="flex flex-wrap gap-2">
                  {restaurant.generated_tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 한국인 패턴 요약 */}
            {restaurant.korean_pattern && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">한국인 방문 패턴</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {restaurant.korean_pattern}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 비슷한 식당 추천 버튼 */}
        <div className="mb-6">
          <button
            onClick={handleLoadRecommended}
            disabled={isLoadingRecommended}
            className="w-full bg-[#5B8DC8] hover:bg-[#4A7AB7] text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoadingRecommended ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>불러오는 중...</span>
              </>
            ) : (
              <>
                <span>비슷한 식당 추천받기</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* 추천 식당 목록 */}
        {showRecommended && recommendedRestaurants.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">비슷한 식당</h2>
            {recommendedRestaurants.map((rec) => (
              <Link
                key={rec.place_id}
                href={`/restaurant/${rec.place_id}`}
                className="block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md hover:border-[#5B8DC8] transition-all"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{rec.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900">
                        {rec.rating ?? 'N/A'}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {rec.address}
                  </p>

                  {rec.generated_tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {rec.generated_tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {rec.match_reason && (
                    <p className="text-sm text-[#5B8DC8] font-medium">
                      💡 {rec.match_reason}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
