import { useEffect, useRef } from 'react';

/**
 * 채팅 자동 스크롤 Hook
 * - 새 메시지 추가 시 하단으로 스크롤
 * - 부드러운 애니메이션
 * - 단일 책임 원칙 준수
 */
export function useChatScroll<T>(dependency: T[]) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dependency]);

  return scrollRef;
}
