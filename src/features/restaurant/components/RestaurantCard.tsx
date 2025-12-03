import { RestaurantWithCoords } from '@/shared/types/restaurant';
import { useChatStore } from '@/shared/store/chatStore';
import { useRouter } from 'next/router';
import { cn } from '@/shared/lib/cn';
import { Star, MapPin } from 'lucide-react';

interface Props {
  restaurant: RestaurantWithCoords;
}

/**
 * 레스토랑 카드 컴포넌트
 * - RAG 검색 결과 표시
 * - 호버 시 지도 마커 하이라이트
 * - 접근성 개선 (키보드 네비게이션)
 */
export function RestaurantCard({ restaurant }: Props) {
  const { selectedRestaurantId, setSelectedRestaurant } = useChatStore();
  const router = useRouter();
  const isSelected = selectedRestaurantId === restaurant.place_id;

  const handleClick = () => {
    router.push(`/restaurant/${restaurant.place_id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setSelectedRestaurant(restaurant.place_id)}
      aria-label={`${restaurant.name} 상세 정보 보기`}
      className={cn(
        'w-[240px] h-[140px] bg-white px-3 py-3 rounded-lg border border-gray-200 transition-all hover:shadow-lg hover:border-blue-500 cursor-pointer flex flex-col overflow-hidden',
        isSelected && 'border-blue-500 shadow-md ring-2 ring-blue-100'
      )}
    >
      {/* 헤더 영역 */}
      <div className="p-2.5 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-bold text-xs text-gray-900 leading-tight flex-1 pr-2 line-clamp-2">
            {restaurant.name}
          </h3>
          {isSelected && (
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-lg flex-shrink-0 mt-1" />
          )}
        </div>

        {/* 평점 */}
        <div className="flex items-center gap-1.5 mb-1">
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="font-medium text-xs text-gray-900">
              {restaurant.rating ?? 'N/A'}
            </span>
          </div>
          {restaurant.user_ratings_total && (
            <span className="text-[10px] text-gray-500">
              ({restaurant.user_ratings_total > 999 
                ? `${(restaurant.user_ratings_total / 1000).toFixed(1)}k` 
                : restaurant.user_ratings_total})
            </span>
          )}
        </div>

        {/* 태그 */}
        {restaurant.generated_tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {restaurant.generated_tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 상세 정보 영역 */}
      <div className="p-2.5 flex-1 overflow-y-auto flex flex-col gap-1.5">
        {/* 주소 */}
        <div className="flex items-start gap-1">
          <MapPin className="w-2.5 h-2.5 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-[10px] text-gray-600 line-clamp-2 leading-relaxed">
            {restaurant.address}
          </p>
        </div>

        {/* 한국인 패턴 요약 */}
        {/* {restaurant.korean_pattern && (
          <div className="bg-gray-50 rounded p-1.5 flex-1 overflow-y-auto">
            <p className="text-[10px] text-gray-700 leading-relaxed whitespace-pre-wrap">
              {restaurant.korean_pattern}
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
}
