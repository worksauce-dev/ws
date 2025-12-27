import { useQuery } from "@tanstack/react-query";
import { teamApi } from "../api/teamApi";

/**
 * 팀 목록 조회 hook (팀 구성 포함)
 * CreateGroupPage 드롭다운에서 사용
 *
 * @param userId 사용자 ID
 */
export const useTeamsWithComposition = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["teamsWithComposition", userId],
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return teamApi.getTeamsWithComposition(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60, // 1분 (5분에서 단축: 팀원 테스트 완료 시 빠른 반영)
    gcTime: 1000 * 60 * 10, // 10분
    refetchInterval: 1000 * 30, // 30초마다 자동 갱신 (팀원 테스트 완료 시 실시간 반영)
    retry: 2,
  });
};
