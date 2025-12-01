import { useEffect, useRef } from 'react';
import { UI_CONSTANTS } from '@/shared/constants/ui';

/**
 * Textarea 자동 높이 조절 Hook
 * - 입력 내용에 따라 높이 자동 조절
 * - 최소/최대 높이 제한
 * - 성능 최적화 (ResizeObserver 대신 scrollHeight 사용)
 */
export function useAutoResizeTextarea(value: string) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 높이 초기화 후 재계산
    textarea.style.height = 'auto';
    
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(
      Math.max(scrollHeight, UI_CONSTANTS.CHAT_INPUT_MIN_HEIGHT),
      UI_CONSTANTS.CHAT_INPUT_MAX_HEIGHT
    );
    
    textarea.style.height = `${newHeight}px`;
  }, [value]);

  return textareaRef;
}
