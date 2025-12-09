import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addApplicantsToGroup } from "../api/groupApi";

interface UseAddApplicantsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * 그룹에 지원자 추가 mutation hook
 *
 * 기능:
 * - 지원자 목록을 그룹에 추가
 * - 중복 이메일 자동 필터링
 * - 성공/실패 Toast 알림
 * - React Query 캐시 자동 무효화
 *
 * @param groupId 그룹 ID
 * @param options 성공/실패 콜백 옵션
 */
export const useAddApplicants = (
  groupId: string,
  options?: UseAddApplicantsOptions
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicants: Array<{ name: string; email: string }>) => {
      console.log("🔵 [useAddApplicants] 시작:", { groupId, applicants });
      try {
        const result = await addApplicantsToGroup(groupId, applicants);
        console.log("✅ [useAddApplicants] 성공:", result);
        return result;
      } catch (error) {
        console.error("❌ [useAddApplicants] 에러:", error);
        throw error;
      }
    },

    onSuccess: result => {
      console.log("🎉 [useAddApplicants] onSuccess 호출:", result);

      // 성공 메시지 구성
      let message = `${result.added}명의 지원자가 추가되었습니다.`;

      // 중복 정보 추가
      if (result.duplicates > 0) {
        message += ` (중복 ${result.duplicates}명 제외)`;
      }

      // 이메일 발송 결과 추가
      if (result.emailsSent !== undefined) {
        if (result.emailsSent === result.added) {
          message += `\n테스트 이메일이 발송되었습니다.`;
        } else if (result.emailsSent > 0) {
          message += `\n테스트 이메일 ${result.emailsSent}/${result.added}건 발송됨`;
        } else {
          message += `\n⚠️ 이메일 발송에 실패했습니다.`;
        }
      }

      console.log("📝 [useAddApplicants] Toast 메시지:", message);
      toast.success(message);

      // React Query 캐시 무효화 (그룹 상세 정보 리프레시)
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });

      // 사용자 정의 성공 콜백
      options?.onSuccess?.();
    },

    onError: (error: Error) => {
      console.error("💥 [useAddApplicants] onError 호출:", error);

      // 에러 메시지
      const errorMessage = error.message || "지원자 추가에 실패했습니다.";
      console.log("📝 [useAddApplicants] 에러 Toast 메시지:", errorMessage);
      toast.error(errorMessage);

      // 사용자 정의 에러 콜백
      options?.onError?.(error);
    },
  });
};
