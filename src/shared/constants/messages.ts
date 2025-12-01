/**
 * 에러 메시지 상수
 * - 사용자 친화적 메시지
 * - 에러 타입별 분기
 */

export const ERROR_MESSAGES = {
  NETWORK: '인터넷 연결을 확인해주세요.',
  SERVER: '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  TIMEOUT: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
  NO_USER: '사용자 정보가 없습니다. 페이지를 새로고침해주세요.',
  GENERIC: '검색 중 오류가 발생했습니다. 다시 시도해주세요.',
} as const;

export const SUCCESS_MESSAGES = {
  PROFILE_SAVED: '취향이 저장되었습니다!',
  SEARCH_COMPLETE: '검색이 완료되었습니다.',
} as const;

export const PLACEHOLDER_MESSAGES = {
  CHAT_INPUT: '맛집을 검색해보세요!',
  EMPTY_CHAT: '뉴욕의 맛집을 검색해보세요',
  EMPTY_CHAT_EXAMPLE: '예: "타임스퀘어 근처 피자" 또는 "브루클린 최고의 초밥"',
} as const;
