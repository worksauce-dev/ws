import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGroup } from "../api/groupApi";

interface UseDeleteGroupOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * 그룹 삭제 mutation hook
 */
export const useDeleteGroup = (options?: UseDeleteGroupOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => deleteGroup(groupId),
    onSuccess: () => {
      // groups 쿼리 무효화하여 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("그룹 삭제 중 오류 발생:", error);
      options?.onError?.(error);
    },
  });
};
