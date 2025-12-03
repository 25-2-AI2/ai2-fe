import { ChatRoom } from '@/features/chat/components/ChatRoom';
import { GoogleMapView } from '@/features/map/components/GoogleMapView';
import { RestaurantList } from '@/features/restaurant/components/RestaurantList';
import { useChatStore } from '@/shared/store/chatStore';
import { useProfileStore } from '@/shared/store/profileStore';
import { useAuthStore } from '@/shared/store/authStore';
import { useState, useEffect } from 'react';
import { Menu, Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();
  const { category } = router.query;
  const { 
    currentQuery, 
    restaurantsWithCoords,
    isLoadingCoords,
  } = useChatStore();
  const { hasSetProfile } = useProfileStore();
  const { userId, fetchUserInfo } = useAuthStore();
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const CURRENT_USER_ID = 1; // 하드코딩 유저 1명으로 테스트

  // 페이지 진입 시 사용자 정보 로드
  useEffect(() => {
    if (!userId) {
      fetchUserInfo(CURRENT_USER_ID);
    }
  }, [userId, fetchUserInfo]);

  // URL 파라미터로 카테고리 필터링이 있으면 해당 카테고리 메시지 추가
  useEffect(() => {
    if (category && typeof category === 'string') {
      const { addMessage, setQuery } = useChatStore.getState();
      const message = `${category} restaurants near me`;
      
      // 기존 메시지 초기화
      useChatStore.setState({ messages: [] });
      
      addMessage({
        role: 'user',
        content: message,
      });
      
      addMessage({
        role: 'assistant',
        content: `Looking for ${category} restaurants in your area! Check the results below.`,
      });
      
      setQuery(message);
      
      // URL 파라미터 제거 (브라우저 히스토리에는 남김)
      router.replace('/', undefined, { shallow: true });
    }
  }, [category, router]);

  return (
    <div className="h-screen flex overflow-hidden bg-[#F3F4F6]">
      {/* 데스크탑: 좌측 챗봇 */}
      <aside className="w-[380px] h-screen shrink-0 hidden md:block border-r border-[#E5E7EB]">
        <ChatRoom />
      </aside>

      {/* 모바일: 챗봇 오버레이 */}
      {isMobileChatOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileChatOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl h-screen">
            <ChatRoom />
          </div>
        </div>
      )}

      {/* 우측: 지도 + 결과 */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* 모바일: 챗봇 열기 버튼 */}
        <button
          onClick={() => setIsMobileChatOpen(true)}
          className="md:hidden fixed top-4 left-4 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* 지도 영역 - 고정 높이 */}
        <div className="flex-1 relative bg-white shrink-0 overflow-hidden">
          {/* 지도는 항상 렌더링 */}
          <GoogleMapView restaurants={restaurantsWithCoords} />
          
          {/* 검색어가 없을 때 안내 문구를 지도 위에 표시 */}
          {!currentQuery && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/95 px-6 py-3 rounded-full shadow-lg border border-gray-200 backdrop-blur-sm pointer-events-none">
              <p className="text-sm font-medium text-gray-600">
                👈 검색을 통해 원하는 식당을 찾아보세요!
              </p>
            </div>
          )}

          {/* 좌표 로딩 중 표시 */}
          {isLoadingCoords && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/95 px-6 py-3 rounded-full shadow-lg border border-gray-200 backdrop-blur-sm pointer-events-none flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#5B8DC8]" />
              <p className="text-sm font-medium text-gray-600">
                지도에 레스토랑을 표시하는 중...
              </p>
            </div>
          )}

        </div>

        {/* 하단: 카드 리스트 - 세로 스크롤 */}
        {restaurantsWithCoords.length > 0 && (
          <div className="h-auto max-h-[240px] shrink-0 bg-white border-t border-[#E5E7EB] overflow-y-auto">
            <RestaurantList restaurants={restaurantsWithCoords} />
          </div>
        )}
      </main>
    </div>
  );
}
