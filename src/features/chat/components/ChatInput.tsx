import { useState } from 'react';
import { useChatStore } from '@/shared/store/chatStore';
import { useChatSubmit } from '@/shared/hooks/useChatSubmit';
import { useAutoResizeTextarea } from '@/shared/hooks/useAutoResizeTextarea';
import { Send, Loader2 } from 'lucide-react';
import { PLACEHOLDER_MESSAGES } from '@/shared/constants/messages';
import { cn } from '@/shared/lib/cn';

/**
 * 채팅 입력 컴포넌트
 * - Textarea 자동 높이 조절
 * - 비즈니스 로직은 Custom Hook으로 분리
 * - Enter 키로 전송, Shift+Enter로 줄바꿈
 */
export function ChatInput() {
  const [input, setInput] = useState('');
  const { isLoading } = useChatStore();
  const { submitMessage } = useChatSubmit();
  const textareaRef = useAutoResizeTextarea(input);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await submitMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter 키로 전송 (Shift+Enter는 줄바꿈)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white">
      <div className="flex items-center gap-2">
       <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="식당 이름이나 종류를 검색하세요"
          disabled={isLoading}
          className="flex-1 px-4 py-3 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#5B8DC8] focus:ring-2 focus:ring-[#D9EAFD] disabled:bg-[#F9FAFB] disabled:text-[#BCCCDC] transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-3 bg-[#5B8DC8] text-white text-sm font-bold rounded-lg hover:bg-[#4A7AB7] hover:shadow-md disabled:bg-[#D9EAFD] disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5"
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
