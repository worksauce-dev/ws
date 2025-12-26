/**
 * 지원자 상태 업데이트 React Query 훅
 * API 호출, 로딩 상태, 에러 처리를 담당
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupApi } from "../api/groupApi";
import type { Applicant, ApplicantStatus } from "@/shared/types/database.types";

export interface UpdateApplicantStatusRequest {
  applicantId: string;
  status: ApplicantStatus;
}

export interface UseUpdateApplicantStatusOptions {
  groupId?: string; // 그룹 상세 페이지의 캐시 무효화를 위해 필요
  onSuccess?: (data: Applicant) => void;
  onError?: (error: Error) => void;
}

/**
 * 지원자 채용 상태 업데이트 훅
 *
 * 사용 예시:
 * ```tsx
 * const { mutate, isPending } = useUpdateApplicantStatus({
 *   groupId: '123',
 *   onSuccess: (data) => {
 *     console.log('상태 업데이트 성공:', data);
 *   }
 * });
 *
 * mutate({ applicantId: '456', status: 'shortlisted' });
 * ```
 */
export const useUpdateApplicantStatus = (
  options?: UseUpdateApplicantStatusOptions
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicantId, status }: UpdateApplicantStatusRequest) =>
      groupApi.updateApplicantStatus(applicantId, status),

    onSuccess: data => {
      // 그룹 상세 쿼리 무효화 (지원자 목록 포함)
      if (options?.groupId) {
        queryClient.invalidateQueries({
          queryKey: ["group", options.groupId],
        });
      }

      // 전체 그룹 목록도 무효화 (통계 업데이트)
      queryClient.invalidateQueries({ queryKey: ["groups"] });

      // 커스텀 성공 핸들러 실행
      options?.onSuccess?.(data);
    },

    onError: (error: Error) => {
      console.error("지원자 상태 업데이트 중 오류 발생:", error);

      // 커스텀 에러 핸들러 실행
      options?.onError?.(error);
    },
  });
};
