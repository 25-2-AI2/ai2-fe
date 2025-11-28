import { Restaurant } from '@/shared/types/restaurant';
import { RestaurantCard } from './RestaurantCard';
import { useEffect, useRef } from 'react';
import { useChatStore } from '@/shared/store/chatStore';

interface Props {
  restaurants: Restaurant[];
}

export function RestaurantList({ restaurants }: Props) {
  const { selectedRestaurantId } = useChatStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // 선택된 카드로 스크롤
  useEffect(() => {
    if (selectedRestaurantId && containerRef.current) {
      const selectedCard = containerRef.current.querySelector(
        `[data-restaurant-id="${selectedRestaurantId}"]`
      );
      selectedCard?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedRestaurantId]);

  if (restaurants.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-x-auto overflow-y-hidden p-4 flex gap-4 snap-x snap-mandatory scrollbar-thin"
    >
      {restaurants.map((restaurant) => (
        <div
          key={restaurant.id}
          data-restaurant-id={restaurant.id}
          className="snap-center shrink-0"
        >
          <RestaurantCard restaurant={restaurant} />
        </div>
      ))}
    </div>
  );
}
