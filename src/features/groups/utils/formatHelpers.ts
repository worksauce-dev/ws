import { POSITION_OPTIONS } from "@/features/groups/constants/positionOptions";

/**
 * 날짜를 한국어 형식으로 포맷 (월 일)
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
};

/**
 * 포지션 값을 라벨로 변환
 */
export const getPositionLabel = (positionValue: string): string => {
  const position = POSITION_OPTIONS.find(p => p.value === positionValue);
  return position?.label || positionValue;
};

/**
 * 경력 수준을 라벨로 변환
 */
export const getExperienceLevelLabel = (level: string): string => {
  const levelMap: Record<string, string> = {
    entry: "신입 (0-1년)",
    junior: "주니어 (1-3년)",
    mid: "중급 (3-5년)",
    senior: "시니어 (5년 이상)",
    lead: "리드/매니저급",
    any: "경력 무관",
  };
  return levelMap[level] || level;
};

/**
 * 점수에 따른 색상 클래스 반환
 */
export const getScoreColorClass = (score: number): string => {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-primary";
  if (score >= 40) return "text-warning";
  return "text-error";
};
