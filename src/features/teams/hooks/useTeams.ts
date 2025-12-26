import { useQuery } from "@tanstack/react-query";
import { teamApi } from "../api/teamApi";

/**
 * 팀 목록 조회 hook
 *
 * @param userId 사용자 ID
 */
export const useTeams = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["teams", userId],
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return teamApi.getTeams(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
    refetchOnWindowFocus: true,
    retry: 2,
  });
};
