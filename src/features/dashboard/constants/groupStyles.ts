/**
 * 대시보드 그룹 스타일 상수
 * 그룹 상태별 색상, 라벨 등의 UI 관련 상수
 */

/**
 * 그룹 상태별 스타일 매핑
 */
export const GROUP_STATUS_STYLES = {
  draft: "bg-gray-100 text-gray-800 border-gray-200",
  active: "bg-blue-100 text-blue-800 border-blue-200",
  expired: "bg-red-100 text-red-800 border-red-200",
} as const;

/**
 * 그룹 상태별 텍스트 라벨
 */
export const GROUP_STATUS_LABELS = {
  draft: "준비중",
  active: "진행중",
  expired: "마감",
} as const;

/**
 * 필터 옵션 (SelectDropdown에서 사용)
 */
export const GROUP_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행중" },
  { value: "draft", label: "준비중" },
  { value: "expired", label: "마감" },
] as const;
