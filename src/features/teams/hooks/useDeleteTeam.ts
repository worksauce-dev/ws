/**
 * 팀 삭제 React Query Hook
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTeam } from "../api/teamApi";

interface UseDeleteTeamOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useDeleteTeam = (options?: UseDeleteTeamOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: string) => deleteTeam(teamId),
    onSuccess: (_, teamId) => {
      // 팀 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["teamsWithComposition"] });
      // 삭제된 팀의 상세 정보 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};
