import { Restaurant } from '@/shared/types/restaurant';
import { useChatStore } from '@/shared/store/chatStore';
import { useRouter } from 'next/router';
import { cn } from '@/shared/lib/cn';
import Image from 'next/image';
import { ASPECT_LABELS, UI_CONSTANTS } from '@/shared/constants/ui';

interface Props {
  restaurant: Restaurant;
}

/**
 * 레스토랑 카드 컴포넌트
 * - 호버 시 지도 마커 하이라이트
 * - 접근성 개선 (키보드 네비게이션)
 * - 상수로 매직 넘버 제거
 */
export function RestaurantCard({ restaurant }: Props) {
  const { selectedRestaurantId, setSelectedRestaurant } = useChatStore();
  const router = useRouter();
  const isSelected = selectedRestaurantId === restaurant.id;

  const handleClick = () => {
    router.push(`/restaurant/${restaurant.id}`);
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
      onMouseEnter={() => setSelectedRestaurant(restaurant.id)}
      aria-label={`${restaurant.name} 상세 정보 보기`}
      className={cn(
        'w-[280px] bg-white rounded-lg border border-gray-200 transition-all hover:shadow-lg hover:scale-[1.02] hover:border-blue-500',
        isSelected && 'border-blue-500 shadow-md ring-2 ring-blue-100'
      )}
    >
      {/* 이미지 */}
      <div className="relative h-[160px] w-full bg-gray-50 rounded-t-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        {isSelected && (
          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full shadow-lg" />
        )}
      </div>

      {/* 정보 */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-1.5">
          <h3 className="font-bold text-base text-gray-900 leading-tight">
            {restaurant.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 bg-gray-50 text-gray-700 text-xs rounded border border-gray-200">
            {restaurant.category}
          </span>
          <div className="flex items-center gap-0.5">
            <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium text-sm text-gray-900">{restaurant.rating}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-2.5 line-clamp-2 leading-relaxed">
          {restaurant.summary}
        </p>

        {/* Aspect 점수 */}
        <div className="space-y-1.5">
          {Object.entries(restaurant.scores)
            .filter(([key]) => key !== 'overall')
            .slice(0, UI_CONSTANTS.MAX_PREVIEW_ASPECTS)
            .map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-11">
                  {ASPECT_LABELS[key as keyof typeof ASPECT_LABELS]}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-1">
                  <div
                    className="bg-blue-500 h-1 rounded-full transition-all"
                    style={{ width: `${(value / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-900 w-5 text-right">
                  {value.toFixed(1)}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
