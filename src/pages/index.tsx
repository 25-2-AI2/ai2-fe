import { ChatRoom } from '@/features/chat/components/ChatRoom';
import { GoogleMapView } from '@/features/map/components/GoogleMapView';
import { RestaurantList } from '@/features/restaurant/components/RestaurantList';
import { useChatStore } from '@/shared/store/chatStore';
import { useProfileStore } from '@/shared/store/profileStore';
import { DEMO_RESTAURANTS, DEMO_CHAT_RESPONSES } from '@/shared/mock/restaurants';
import { useMemo, useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();
  const { category } = router.query;
  const { currentQuery, recommendedRestaurantIds } = useChatStore();
  const { hasSetProfile } = useProfileStore();
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  // URL 파라미터로 카테고리 필터링이 있으면 해당 카테고리 메시지 추가
  useEffect(() => {
    if (category && typeof category === 'string') {
      const { addMessage, setQuery, setRecommendedRestaurants } = useChatStore.getState();
      const message = `${category} 맛집 추천해주세요`;
      
      // 기존 메시지 초기화
      useChatStore.setState({ messages: [] });
      
      addMessage({
        role: 'user',
        content: message,
      });
      
      addMessage({
        role: 'assistant',
        content: `${category} 카테고리의 맛집들을 찾았어요! 아래 추천 결과를 확인해보세요.`,
      });
      
      setQuery(message);
      
      // 해당 카테고리의 레스토랑 ID 저장
      const categoryRestaurants = DEMO_RESTAURANTS.filter(r => r.category === category);
      setRecommendedRestaurants(categoryRestaurants.map(r => r.id));
      
      // URL 파라미터 제거 (브라우저 히스토리에는 남김)
      router.replace('/', undefined, { shallow: true });
    }
  }, [category, router]);

  // 추천된 레스토랑 목록 (필터링 없이 ID로 직접 조회)
  const filteredRestaurants = useMemo(() => {
    return DEMO_RESTAURANTS.filter(r => 
      recommendedRestaurantIds.includes(r.id)
    );
  }, [currentQuery, recommendedRestaurantIds]);

  return (
    <div className="h-screen flex overflow-hidden bg-[#F3F4F6]">
      {/* 데스크탑: 좌측 챗봇 */}
      <aside className="w-[380px] shrink-0 hidden md:block border-r border-[#E5E7EB]">
        <ChatRoom />
      </aside>

      {/* 모바일: 챗봇 오버레이 */}
      {isMobileChatOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileChatOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl">
            <ChatRoom />
          </div>
        </div>
      )}

      {/* 우측: 지도 + 결과 */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-y-auto">
        {/* 모바일: 챗봇 열기 버튼 */}
        <button
          onClick={() => setIsMobileChatOpen(true)}
          className="md:hidden fixed top-4 left-4 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* 지도 영역 */}
        <div className="flex-1 min-h-[400px] relative bg-white">
          {/* 지도는 항상 렌더링 */}
          <GoogleMapView restaurants={filteredRestaurants} />
          
          {/* 검색어가 없을 때 안내 문구를 지도 위에 표시 */}
          {!currentQuery && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/90 px-4 py-2 rounded-full shadow-lg border border-gray-200 backdrop-blur-sm pointer-events-none">
              <p className="text-sm font-medium text-gray-600">
                👈 채팅창에 원하는 메뉴를 검색해보세요!
              </p>
            </div>
          )}
        </div>

        {/* 하단: 카드 리스트 */}
        {filteredRestaurants.length > 0 && (
          <div className="h-[220px] shrink-0 bg-white border-t border-[#E5E7EB]">
            <RestaurantList restaurants={filteredRestaurants} />
          </div>
        )}
      </main>
    </div>
  );
}