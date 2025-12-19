/**
 * 대시보드 그룹 상태 관련 유틸리티 함수
 * 그룹의 상태 판단, 완료율 계산 등의 비즈니스 로직
 */

import type { Group } from "@/features/groups/types/group.types";
import { calculatePercentage } from "@/shared/utils/formatters";
import { isPastDate } from "@/shared/utils/validators";

/**
 * 그룹의 실제 상태를 결정 (draft 또는 마감일 기준)
 * @param group 그룹 객체
 * @returns "draft" | "active" | "expired"
 */
export const getActualGroupStatus = (
  group: Group
): "draft" | "active" | "expired" => {
  // draft 상태는 그대로 유지
  if (group.status === "draft") {
    return "draft";
  }

  // 마감일이 지났는지 확인
  if (isPastDate(group.deadline)) {
    return "expired";
  }

  return "active";
};

/**
 * 그룹의 테스트 완료율 계산
 * @param group 그룹 객체
 * @returns 완료율 (0-100)
 */
export const getGroupCompletionRate = (group: Group): number => {
  const totalApplicants = group.applicants?.length ?? 0;
  const completedApplicants =
    group.applicants?.filter(a => a.test_status === "completed").length ?? 0;

  return calculatePercentage(completedApplicants, totalApplicants);
};

/**
 * 그룹의 완료된 지원자 수와 전체 지원자 수를 반환
 * @param group 그룹 객체
 * @returns { completed: number, total: number }
 */
export const getGroupCompletionStats = (
  group: Group
): { completed: number; total: number } => {
  const total = group.applicants?.length ?? 0;
  const completed =
    group.applicants?.filter(a => a.test_status === "completed").length ?? 0;

  return { completed, total };
};

/**
 * 여러 그룹에서 총 지원자 수 계산
 * @param groups 그룹 배열
 * @returns 총 지원자 수
 */
export const getTotalApplicantsCount = (groups: Group[]): number => {
  return groups.reduce(
    (sum, group) => sum + (group.applicants?.length ?? 0),
    0
  );
};

/**
 * 여러 그룹에서 완료된 테스트 수 계산
 * @param groups 그룹 배열
 * @returns 완료된 테스트 수
 */
export const getCompletedTestsCount = (groups: Group[]): number => {
  return groups.reduce(
    (sum, group) =>
      sum +
      (group.applicants?.filter(a => a.test_status === "completed").length ??
        0),
    0
  );
};

/**
 * 활성 상태인 그룹만 필터링
 * @param groups 그룹 배열
 * @returns 활성 그룹 배열
 */
export const getActiveGroups = (groups: Group[]): Group[] => {
  return groups.filter(group => getActualGroupStatus(group) === "active");
};
