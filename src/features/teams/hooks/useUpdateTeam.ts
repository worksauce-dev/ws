/**
 * 팀 수정 React Query Hook
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTeam } from "../api/teamApi";
import type { UpdateTeamRequest } from "../types/team.types";

interface UseUpdateTeamOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useUpdateTeam = (options?: UseUpdateTeamOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, updates }: { teamId: string; updates: UpdateTeamRequest }) =>
      updateTeam(teamId, updates),
    onSuccess: () => {
      // 팀 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["teamsWithComposition"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};
