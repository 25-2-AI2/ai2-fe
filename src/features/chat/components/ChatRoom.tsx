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
    <div className="flex flex-col h-screen bg-white">
      {/* 헤더 */}
      <div className="px-4 py-4 border-b border-[#E5E7EB] bg-gradient-to-r from-[#5B8DC8] to-[#4A7AB7] shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-[#5B8DC8]">맛집 추천</h1>
            {hasSetProfile && (
              <p className="text-xs text-black-200 mt-0.5">맞춤형 추천</p>
            )}
          </div>
          <Link
            href="/profile"
            className="p2 hover:bg-black-200 rounded-lg transition-all cursor-pointer relative"
            title="프로필 설정"
          >
            <Settings className="w-10 h-10 text-[#9AA6B2]" />
            {!hasSetProfile && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
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
              <p className="text-sm text-[#9AA6B2] mb-2">
                뉴욕의 맛집을 검색해보세요
              </p>
              <p className="text-xs text-[#BCCCDC]">
                예: "타임스퀘어 근처 피자" 또는 "브루클린 최고의 초밥"
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
