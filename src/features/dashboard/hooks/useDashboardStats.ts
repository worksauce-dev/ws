/**
 * 대시보드 통계 계산 훅
 */

import { useMemo } from "react";
import type { Group } from "@/features/groups/types/group.types";
import {
  getTotalApplicantsCount,
  getCompletedTestsCount,
  getActiveGroups,
} from "../utils/groupStatus";

export interface DashboardStats {
  totalGroups: number;
  activeGroups: number;
  totalApplicants: number;
  completedTests: number;
}

export const useDashboardStats = (groups: Group[]): DashboardStats => {
  return useMemo(() => {
    const totalGroups = groups.length;
    const activeGroups = getActiveGroups(groups).length;
    const totalApplicants = getTotalApplicantsCount(groups);
    const completedTests = getCompletedTestsCount(groups);

    return {
      totalGroups,
      activeGroups,
      totalApplicants,
      completedTests,
    };
  }, [groups]);
};
