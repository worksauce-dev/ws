/**
 * 캘린더 관련 유틸리티 함수들
 */

/**
 * 그룹 상태별 색상 반환
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "active":
      return "bg-blue-500 border-blue-600";
    case "completed":
      return "bg-green-500 border-green-600";
    case "draft":
      return "bg-gray-400 border-gray-500";
    default:
      return "bg-gray-400 border-gray-500";
  }
};

/**
 * ISO 8601 timestamp에서 날짜 문자열만 추출
 * @example "2025-10-31T23:59:59.000Z" -> "2025-10-31"
 */
export const extractDateString = (isoTimestamp: string): string => {
  return isoTimestamp.split("T")[0];
};

/**
 * Date 객체를 YYYY-MM-DD 형식 문자열로 변환
 */
export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * ISO 8601 timestamp에서 로컬 Date 객체 생성 (타임존 이슈 방지)
 */
export const parseLocalDate = (isoTimestamp: string): Date => {
  const dateStr = extractDateString(isoTimestamp);
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};
