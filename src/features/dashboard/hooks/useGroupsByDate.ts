import { useCallback } from "react";
import type { Group } from "@/features/groups/types/group.types";
import { formatDateToString, extractDateString } from "../utils/calendarHelpers";

/**
 * 날짜별 그룹 필터링 훅
 */
export const useGroupsByDate = (groups: Group[]) => {
  /**
   * 특정 날짜에 해당하는 그룹들 찾기
   */
  const getGroupsForDate = useCallback(
    (date: Date): Group[] => {
      // 타임존 이슈 방지: 로컬 날짜를 직접 문자열로 변환
      const dateStr = formatDateToString(date);

      return groups.filter(group => {
        // ISO 8601 timestamp에서 날짜 부분만 문자열로 추출 (타임존 변환 없이)
        // "2025-10-31T23:59:59.000Z" -> "2025-10-31"
        const deadlineDate = extractDateString(group.deadline);
        return deadlineDate === dateStr;
      });
    },
    [groups]
  );

  return {
    getGroupsForDate,
  };
};
