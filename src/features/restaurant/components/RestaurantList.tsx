import { RestaurantWithCoords } from '@/shared/types/restaurant';
import { RestaurantCard } from './RestaurantCard';
import { useEffect, useRef } from 'react';
import { useChatStore } from '@/shared/store/chatStore';

interface Props {
  restaurants: RestaurantWithCoords[];
}

export function RestaurantList({ restaurants }: Props) {
  const { selectedRestaurantId } = useChatStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // 새로운 추천 결과가 나올 때마다 맨 왼쪽으로 스크롤
  useEffect(() => {
    if (containerRef.current && restaurants.length > 0) {
      containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [restaurants]);

  // // 선택된 카드로 스크롤
  // useEffect(() => {
  //   if (selectedRestaurantId && containerRef.current) {
  //     const selectedCard = containerRef.current.querySelector(
  //       `[data-restaurant-id="${selectedRestaurantId}"]`
  //     );
  //     selectedCard?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  //   }
  // }, [selectedRestaurantId]);

  // if (restaurants.length === 0) {
  //   return null;
  // }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      
      {/* 헤더 */}
      <div className="px-4 py-3 flex-shrink-0">
        <p className="text-xs font-medium text-gray-500">
          추천 결과 <span className="text-blue-600 font-bold">{restaurants.length}</span>건
        </p>
      </div>
      
      {/* 카드 스크롤 영역 */}
      <div
        ref={containerRef}
        className="
          flex-1
          min-w-0
          flex-col
          gap-3
          px-4 pb-4
          overflow-x-auto
          overflow-y-hidden
          snap-x snap-mandatory
          scroll-smooth
        "
      >
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.place_id}
            data-restaurant-id={restaurant.place_id}
            className="w-[240px] shrink-0 snap-center" 
          >
            <RestaurantCard restaurant={restaurant} />
          </div>
        ))}
        
        {/* 맨 오른쪽 여백용 더미 div*/}
        <div className="w-1 shrink-0" />
      </div>
    </div>
  );
}