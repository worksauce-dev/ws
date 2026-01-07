/**
 * React Query 캐시 시간 상수
 */

export const CACHE_TIMES = {
  /** 1분 (크레딧, 자주 변경되는 데이터) */
  ONE_MINUTE: 1 * 60 * 1000,

  /** 5분 (일반적인 데이터) */
  FIVE_MINUTES: 5 * 60 * 1000,

  /** 10분 (안정적인 데이터) */
  TEN_MINUTES: 10 * 60 * 1000,

  /** 30분 (거의 변경되지 않는 데이터) */
  THIRTY_MINUTES: 30 * 60 * 1000,
} as const;
