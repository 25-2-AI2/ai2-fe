import { useChatStore } from '@/shared/store/chatStore';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { useEffect, useRef } from 'react';
import { useProfileStore } from '@/shared/store/profileStore';
import { Settings } from 'lucide-react';
import Link from 'next/link';

export function ChatRoom() {
  const { messages } = useChatStore();
  const { hasSetProfile } = useProfileStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-[#E5E7EB] bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">식당 검색</h1>
            {hasSetProfile && (
              <p className="text-xs text-[#9AA6B2] mt-0.5">맞춤 추천</p>
            )}
          </div>
          <Link
            href="/profile"
            className="p-2 hover:bg-[#E5E7EB] rounded-lg transition-all cursor-pointer relative"
            title="설정"
          >
            <Settings className="w-5 h-5 text-[#9AA6B2]" />
            {!hasSetProfile && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#5B8DC8] rounded-full" />
            )}
          </Link>
        </div>
      </div>

      {/* 메시지 리스트 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-[#F3F4F6]">
        {messages.length === 0 ? (
          <div className="flex flex-col h-full justify-center items-center px-4">
            <div className="text-center">
              <svg className="w-20 h-20 mx-auto mb-4 text-[#BCCCDC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-sm text-[#9AA6B2]">
                원하는 식당을 검색해보세요
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 입력창 */}
      <ChatInput />
    </div>
  );
}
