/**
 * 이메일 재발송 훅
 * 개별/일괄 이메일 재발송 로직을 관리
 */

import { useState, useCallback } from "react";
import { useToast } from "@/shared/components/ui/useToast";
import { useUser } from "@/shared/hooks/useUser";
import { sendSauceTestEmail } from "@/shared/services/sauceTestService";
import type { Applicant } from "@/shared/types/database.types";

interface ResendEmailParams {
  applicant: Applicant;
  groupDeadline: string;
  groupId: string;
  showRealName?: boolean;
}

interface ResendBulkEmailsParams {
  applicants: Applicant[];
  groupDeadline: string;
  groupId: string;
  showRealName?: boolean;
  onProgress?: (progress: { success: number; failed: number }) => void;
}

export const useResendEmail = () => {
  const { showToast } = useToast();
  const { userName, isBusinessVerified, businessName } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 발신자 이름 결정 로직
   */
  const determineSenderName = useCallback(
    (showRealName: boolean): string => {
      if (!showRealName) {
        return "담당자";
      }

      if (isBusinessVerified && businessName) {
        return businessName;
      }

      return userName;
    },
    [isBusinessVerified, businessName, userName]
  );

  /**
   * 개별 이메일 재발송
   */
  const resendEmail = useCallback(
    async ({
      applicant,
      groupDeadline,
      groupId,
      showRealName = true,
    }: ResendEmailParams): Promise<boolean> => {
      setIsLoading(true);

      try {
        const senderName = determineSenderName(showRealName);

        const result = await sendSauceTestEmail({
          applicantEmail: applicant.email,
          userName: senderName,
          applicantName: applicant.name,
          testId: applicant.test_token,
          dashboardId: groupId,
          deadline: groupDeadline,
          applicantId: applicant.id,
        });

        if (result.success) {
          showToast(
            "success",
            "이메일 재발송 완료",
            `${applicant.name}님에게 이메일을 재발송했습니다.`
          );
          return true;
        } else {
          showToast(
            "error",
            "이메일 재발송 실패",
            result.error || "이메일 재발송에 실패했습니다."
          );
          return false;
        }
      } catch (error) {
        console.error("이메일 재발송 중 오류:", error);
        showToast(
          "error",
          "이메일 재발송 실패",
          "이메일 재발송 중 오류가 발생했습니다."
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [determineSenderName, showToast]
  );

  /**
   * 일괄 이메일 재발송
   */
  const resendBulkEmails = useCallback(
    async ({
      applicants,
      groupDeadline,
      groupId,
      showRealName = true,
      onProgress,
    }: ResendBulkEmailsParams): Promise<{
      success: number;
      failed: number;
    }> => {
      setIsLoading(true);

      try {
        const senderName = determineSenderName(showRealName);

        let successCount = 0;
        let failedCount = 0;

        // 각 지원자에게 순차적으로 이메일 발송
        for (const applicant of applicants) {
          try {
            const result = await sendSauceTestEmail({
              applicantEmail: applicant.email,
              userName: senderName,
              applicantName: applicant.name,
              testId: applicant.test_token,
              dashboardId: groupId,
              deadline: groupDeadline,
              applicantId: applicant.id,
            });

            if (result.success) {
              successCount++;
            } else {
              failedCount++;
            }

            // 진행 상황 업데이트 콜백
            onProgress?.({ success: successCount, failed: failedCount });
          } catch (error) {
            console.error(`이메일 발송 중 오류 (${applicant.email}):`, error);
            failedCount++;
            onProgress?.({ success: successCount, failed: failedCount });
          }
        }

        // 결과에 따른 토스트 메시지
        if (failedCount === 0) {
          showToast(
            "success",
            "이메일 재발송 완료",
            `${successCount}명의 지원자에게 이메일을 재발송했습니다.`
          );
        } else if (successCount === 0) {
          showToast(
            "error",
            "이메일 재발송 실패",
            "모든 이메일 재발송에 실패했습니다. 나중에 다시 시도해주세요."
          );
        } else {
          showToast(
            "warning",
            "일부 이메일 재발송 실패",
            `${successCount}명에게 재발송 완료, ${failedCount}명 재발송 실패`
          );
        }

        return {
          success: successCount,
          failed: failedCount,
        };
      } catch (error) {
        console.error("일괄 이메일 재발송 중 오류:", error);
        showToast(
          "error",
          "이메일 재발송 실패",
          "이메일 재발송 중 오류가 발생했습니다."
        );
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [determineSenderName, showToast]
  );

  return {
    resendEmail,
    resendBulkEmails,
    isLoading,
  };
};
