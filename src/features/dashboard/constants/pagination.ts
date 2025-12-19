/**
 * 대시보드 페이지네이션 상수
 */

/**
 * 대시보드 그리드 뷰의 페이지당 아이템 수
 */
export const ITEMS_PER_PAGE = 6;

/**
 * 페이지네이션 기본 설정
 */
export const PAGINATION_CONFIG = {
  itemsPerPage: ITEMS_PER_PAGE,
  defaultPage: 1,
} as const;
