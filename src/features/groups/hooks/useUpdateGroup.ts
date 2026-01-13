/**
 * 그룹 업데이트 훅
 * 그룹 정보(이름, 설명, 마감일 등) 수정 기능
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGroup } from "../api/groupApi";
import type { UpdateGroupRequest } from "../types/group.types";

interface UseUpdateGroupOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useUpdateGroup = (options?: UseUpdateGroupOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      updates,
    }: {
      groupId: string;
      updates: UpdateGroupRequest;
    }) => updateGroup(groupId, updates),
    onSuccess: () => {
      // 그룹 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["groupsWithApplicants"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};
