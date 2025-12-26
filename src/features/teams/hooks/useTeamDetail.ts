import { useQuery } from "@tanstack/react-query";
import { teamApi } from "../api/teamApi";

/**
 * 팀 상세 정보 조회 hook
 * 팀 정보와 멤버 목록, 팀 구성을 함께 가져옵니다.
 *
 * @param teamId 팀 ID
 */
export const useTeamDetail = (teamId: string | undefined) => {
  return useQuery({
    queryKey: ["team", teamId],
    queryFn: () => {
      if (!teamId) throw new Error("Team ID is required");
      return teamApi.getTeamWithMembers(teamId);
    },
    enabled: !!teamId,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
    refetchOnWindowFocus: true,
    retry: 2,
  });
};
