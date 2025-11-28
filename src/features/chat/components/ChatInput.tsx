import { useState } from 'react';
import { useChatStore } from '@/shared/store/chatStore';
import { DEMO_CHAT_RESPONSES, DEMO_RESTAURANTS } from '@/shared/mock/restaurants';
import { Send, Loader2 } from 'lucide-react';

export function ChatInput() {
  const [input, setInput] = useState('');
  const { addMessage, setQuery, setRecommendedRestaurants, isLoading, setLoading } = useChatStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // 유저 메시지 추가
    addMessage({
      role: 'user',
      content: userMessage,
    });

    // 데모 응답 시뮬레이션 (0.5초 딜레이)
    setTimeout(() => {
      // 키워드 매칭
      let response = DEMO_CHAT_RESPONSES.default;
      
      // default를 제외하고 키워드 매칭
      const keywords = Object.keys(DEMO_CHAT_RESPONSES).filter(k => k !== 'default');
      for (const keyword of keywords) {
        if (userMessage.includes(keyword)) {
          response = DEMO_CHAT_RESPONSES[keyword];
          break;
        }
      }

      // AI 응답 추가
      addMessage({
        role: 'assistant',
        content: response.message,
      });

      // 상태를 한 번에 업데이트 (배치 처리)
      const store = useChatStore.getState();
      useChatStore.setState({
        currentQuery: userMessage,
        recommendedRestaurantIds: response.restaurantIds,
        isLoading: false,
      });
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-[#E5E7EB] bg-white">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="식당 이름이나 종류를 검색하세요"
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#5B8DC8] focus:ring-2 focus:ring-[#D9EAFD] disabled:bg-[#F9FAFB] disabled:text-[#BCCCDC] transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-2.5 bg-[#5B8DC8] text-white text-sm font-bold rounded-lg hover:bg-[#4A7AB7] hover:shadow-md disabled:bg-[#D9EAFD] disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">검색</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
