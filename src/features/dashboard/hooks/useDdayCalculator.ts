import { useCallback } from "react";
import { parseLocalDate } from "../utils/calendarHelpers";

/**
 * D-day 계산 및 긴급도 색상 관리 훅
 */
export const useDdayCalculator = () => {
  /**
   * D-day 계산
   */
  const calculateDday = useCallback((deadline: string): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 타임존 이슈 방지: ISO 8601 timestamp에서 날짜 부분만 추출
    // "2025-10-31T23:59:59.000Z" -> "2025-10-31"
    const deadlineDate = parseLocalDate(deadline);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `D+${Math.abs(diffDays)}`;
    if (diffDays === 0) return "D-Day";
    return `D-${diffDays}`;
  }, []);

  /**
   * D-day에 따른 긴급도 색상
   */
  const getDdayColor = useCallback(
    (deadline: string, status: string): string => {
      if (status === "completed") return "text-green-600";

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 타임존 이슈 방지: ISO 8601 timestamp에서 날짜 부분만 추출
      const deadlineDate = parseLocalDate(deadline);

      const diffTime = deadlineDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return "text-gray-400"; // 지난 마감일
      if (diffDays === 0) return "text-red-600 font-bold"; // 오늘 마감
      if (diffDays <= 3) return "text-red-500"; // 3일 이내
      if (diffDays <= 7) return "text-orange-500"; // 7일 이내
      return "text-blue-600"; // 여유있음
    },
    []
  );

  return {
    calculateDday,
    getDdayColor,
  };
};
