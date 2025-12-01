import { Message } from '@/shared/types/chat';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/cn';

interface Props {
  message: Message;
}

/**
 * 채팅 메시지 버블 컴포넌트
 * - 애니메이션 적용
 * - 사용자/AI 메시지 구분
 * - 접근성 고려 (시맨틱 마크업)
 */
export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
      role="article"
      aria-label={`${isUser ? '사용자' : 'AI'} 메시지`}
    >
      <div
        className={cn(
          'max-w-[85%] px-4 py-3 rounded-lg',
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <time
          className={cn(
            'text-xs mt-2 block',
            isUser ? 'text-white/70' : 'text-gray-500'
          )}
          dateTime={new Date(message.timestamp).toISOString()}
        >
          {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </time>
      </div>
    </motion.div>
  );
}
