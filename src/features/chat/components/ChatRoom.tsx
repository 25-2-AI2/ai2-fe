import { useChatStore } from '@/shared/store/chatStore';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { useProfileStore } from '@/shared/store/profileStore';
import { useChatScroll } from '@/shared/hooks/useChatScroll';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { PLACEHOLDER_MESSAGES } from '@/shared/constants/messages';

/**
 * 채팅방 컴포넌트
 * - 메시지 리스트 + 자동 스크롤
 * - 하단 고정 입력창
 * - Custom Hook으로 로직 분리
 */
export function ChatRoom() {
  const { messages } = useChatStore();
  const { hasSetProfile } = useProfileStore();
  const messagesEndRef = useChatScroll(messages);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 헤더 */}
      <div className="px-4 py-4 border-b border-gray-200 bg-gray-50 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">맛집 추천</h1>
            {hasSetProfile && (
              <p className="text-xs text-gray-600 mt-0.5">맞춤형 추천</p>
            )}
          </div>
          <Link
            href="/profile"
            className="p-2 hover:bg-gray-200 rounded-lg transition-all relative"
            aria-label="프로필 설정"
          >
            <Settings className="w-5 h-5 text-gray-600" />
            {!hasSetProfile && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            )}
          </Link>
        </div>
      </div>

      {/* 메시지 리스트 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col h-full justify-center items-center px-4">
            <div className="text-center">
              <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-sm text-gray-600 mb-2">
                {PLACEHOLDER_MESSAGES.EMPTY_CHAT}
              </p>
              <p className="text-xs text-gray-400">
                {PLACEHOLDER_MESSAGES.EMPTY_CHAT_EXAMPLE}
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

      {/* 입력창 - 하단 고정 */}
      <div className="shrink-0">
        <ChatInput />
      </div>
    </div>
  );
}
