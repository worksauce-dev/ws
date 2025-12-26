import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teamApi } from "../api/teamApi";
import type { CreateTeamRequest } from "../types/team.types";

interface UseCreateTeamOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * 팀 생성 mutation hook
 */
export const useCreateTeam = (options?: UseCreateTeamOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeamRequest) => teamApi.createTeam(data),
    onSuccess: () => {
      // 팀 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};
