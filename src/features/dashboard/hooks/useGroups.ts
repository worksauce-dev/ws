/**
 * useGroups - 그룹 목록 조회 커스텀 훅
 * TanStack Query를 사용하여 그룹 데이터를 관리합니다.
 */

import { useQuery } from "@tanstack/react-query";
import { getGroupsWithApplicants } from "../api/dashboardApi";
import type { Group } from "@/features/groups/types/group.types";

export const useGroups = () => {
  const {
    data: groups,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: getGroupsWithApplicants,
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    refetchOnWindowFocus: true, // 창 포커스 시 자동 새로고침
    retry: 2, // 실패 시 2번 재시도
  });

  return {
    groups: groups || [],
    isLoading,
    error,
    refetch,
    isRefetching,
  };
};
