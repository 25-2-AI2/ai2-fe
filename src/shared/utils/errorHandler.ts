import axios from 'axios';
import { ERROR_MESSAGES } from '@/shared/constants/messages';

/**
 * 에러 타입별 사용자 친화적 메시지 반환
 * - 네트워크 에러
 * - 타임아웃
 * - 서버 에러 (4xx, 5xx)
 * - 기타 에러
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // 타임아웃
    if (error.code === 'ECONNABORTED') {
      return ERROR_MESSAGES.TIMEOUT;
    }

    // 네트워크 에러
    if (!error.response) {
      return ERROR_MESSAGES.NETWORK;
    }

    // 서버 에러
    const status = error.response.status;
    if (status >= 500) {
      return ERROR_MESSAGES.SERVER;
    }

    // 4xx 에러는 서버에서 온 메시지 사용
    return error.response.data?.message || ERROR_MESSAGES.GENERIC;
  }

  // Error 객체
  if (error instanceof Error) {
    // 특정 에러 메시지는 그대로 표시
    if (error.message === ERROR_MESSAGES.NO_USER) {
      return error.message;
    }
    return ERROR_MESSAGES.GENERIC;
  }

  return ERROR_MESSAGES.GENERIC;
}

/**
 * 에러 로깅 (추후 Sentry 등 연동 가능)
 */
export function logError(error: unknown, context?: string): void {
  const errorInfo = {
    context,
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  };

  console.error('[Error]', errorInfo);

  // TODO: 프로덕션 환경에서는 Sentry 등으로 전송
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, { extra: errorInfo });
  // }
}
