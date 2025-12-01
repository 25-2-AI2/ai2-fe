/**
 * UI 관련 상수
 * - 매직 넘버 제거
 * - 디자인 토큰 중앙화
 */

export const UI_CONSTANTS = {
  CARD_WIDTH: 280,
  MAX_PREVIEW_ASPECTS: 2,
  MAP_DEFAULT_ZOOM: 15,
  MAP_MAX_ZOOM: 16,
  CHAT_INPUT_MAX_HEIGHT: 200,
  CHAT_INPUT_MIN_HEIGHT: 44,
} as const;

export const COLORS = {
  PRIMARY: '#5B8DC8',
  PRIMARY_HOVER: '#4A7AB7',
  PRIMARY_LIGHT: '#D9EAFD',
  BORDER: '#E5E7EB',
  BACKGROUND: '#F3F4F6',
  TEXT_SECONDARY: '#9AA6B2',
  TEXT_TERTIARY: '#BCCCDC',
} as const;

export const ASPECT_LABELS = {
  taste: '맛',
  price: '가성비',
  atmosphere: '분위기',
  hygiene: '위생',
  food: '맛',
  service: '서비스',
  ambience: '분위기',
  waiting: '대기시간',
  accessibility: '접근성',
} as const;
