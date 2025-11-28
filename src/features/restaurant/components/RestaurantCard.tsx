import { Restaurant } from '@/shared/types/restaurant';
import { useChatStore } from '@/shared/store/chatStore';
import { useRouter } from 'next/router';
import { cn } from '@/shared/lib/cn';
import Image from 'next/image';

interface Props {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: Props) {
  const { selectedRestaurantId, setSelectedRestaurant } = useChatStore();
  const router = useRouter();
  const isSelected = selectedRestaurantId === restaurant.id;

  const handleClick = () => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setSelectedRestaurant(restaurant.id)}
      className={cn(
        'w-[280px] bg-white rounded-lg border transition-all cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-[#5B8DC8]',
        isSelected ? 'border-[#5B8DC8] shadow-md ring-2 ring-[#D9EAFD]' : 'border-[#E5E7EB]'
      )}
    >
      {/* 이미지 */}
      <div className="relative h-[160px] w-full bg-[#F9FAFB] rounded-t-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-16 h-16 text-[#BCCCDC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        {isSelected && (
          <div className="absolute top-2 right-2 w-2 h-2 bg-[#5B8DC8] rounded-full shadow-lg" />
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
          <span className="px-2 py-0.5 bg-[#F9FAFB] text-gray-700 text-xs rounded border border-[#E5E7EB]">
            {restaurant.category}
          </span>
          <div className="flex items-center gap-0.5">
            <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium text-sm text-gray-900">{restaurant.rating}</span>
          </div>
        </div>

        <p className="text-xs text-[#9AA6B2] mb-2.5 line-clamp-2 leading-relaxed">
          {restaurant.summary}
        </p>

        {/* Aspect 점수 (간단 버전) */}
        <div className="space-y-1.5">
          {Object.entries(restaurant.scores)
            .filter(([key]) => key !== 'overall')
            .slice(0, 2)
            .map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-[#9AA6B2] w-11">
                  {ASPECT_LABELS[key as keyof typeof ASPECT_LABELS]}
                </span>
                <div className="flex-1 bg-[#F3F4F6] rounded-full h-1">
                  <div
                    className="bg-[#5B8DC8] h-1 rounded-full transition-all"
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

const ASPECT_LABELS = {
  taste: '맛',
  price: '가성비',
  atmosphere: '분위기',
  hygiene: '위생',
};
