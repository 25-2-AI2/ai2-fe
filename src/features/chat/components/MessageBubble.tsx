import { Message } from '@/shared/types/chat';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/cn';

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[85%] px-4 py-3 rounded-lg',
          isUser
            ? 'bg-[#5B8DC8] text-white rounded-br-none'
            : 'bg-white text-gray-900 border border-[#E5E7EB] rounded-bl-none'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <p
          className={cn(
            'text-sm mt-2',
            isUser ? 'text-white/70' : 'text-[#9AA6B2]'
          )}
        >
          {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </motion.div>
  );
}
