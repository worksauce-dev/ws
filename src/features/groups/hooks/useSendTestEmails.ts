/**
 * 소스테스트 이메일 발송 훅
 * 그룹 생성 및 지원자 추가 시 사용되는 이메일 발송 로직을 관리
 */

import { useState, useCallback } from "react";
import { useToast } from "@/shared/components/ui/useToast";
import { useUser } from "@/shared/hooks/useUser";
import { sendSauceTestEmail } from "@/shared/services/sauceTestService";
import type { Group } from "../types/group.types";

interface SendEmailsParams {
  applicants: Array<{
    id: string;
    name: string;
    email: string;
    test_token: string;
  }>;
  group: Pick<Group, "id" | "deadline">;
  showRealName?: boolean;
  onProgress?: (progress: { success: number; failed: number }) => void;
  recipientLabel?: "지원자" | "팀원"; // 수신자 레이블 (기본값: "지원자")
}

interface SendEmailsResult {
  success: number;
  failed: number;
  totalSent: boolean;
}

export const useSendTestEmails = () => {
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
        console.log("📧 발신자 이름 (기업):", businessName);
        return businessName;
      }

      console.log("📧 발신자 이름 (개인):", userName);
      return userName;
    },
    [isBusinessVerified, businessName, userName]
  );

  /**
   * 지원자 또는 팀원에게 소스테스트 이메일 발송
   */
  const sendEmails = useCallback(
    async ({
      applicants,
      group,
      showRealName = true,
      onProgress,
      recipientLabel = "지원자",
    }: SendEmailsParams): Promise<SendEmailsResult> => {
      setIsLoading(true);

      try {
        const senderName = determineSenderName(showRealName);

        console.log("📧 사용자 정보:", {
          business_verified: isBusinessVerified,
          business_name: businessName,
          showRealName,
          finalUserName: senderName,
          recipientLabel,
        });

        let successCount = 0;
        let failedCount = 0;

        // 각 수신자에게 순차적으로 이메일 발송
        for (const applicant of applicants) {
          try {
            const result = await sendSauceTestEmail({
              applicantEmail: applicant.email,
              userName: senderName,
              applicantName: applicant.name,
              testId: applicant.test_token,
              dashboardId: group.id,
              deadline: group.deadline,
              applicantId: applicant.id, // 이메일 발송 상태 DB 업데이트를 위해 추가
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
            "이메일 발송 완료",
            `${successCount}명의 ${recipientLabel}에게 소스테스트 이메일을 발송했습니다.`
          );
        } else if (successCount === 0) {
          showToast(
            "error",
            "이메일 발송 실패",
            "모든 이메일 발송에 실패했습니다. 나중에 다시 시도해주세요."
          );
        } else {
          showToast(
            "warning",
            "일부 이메일 발송 실패",
            `${successCount}명에게 발송 완료, ${failedCount}명 발송 실패`
          );
        }

        return {
          success: successCount,
          failed: failedCount,
          totalSent: failedCount === 0,
        };
      } catch (error) {
        console.error("이메일 발송 중 오류:", error);
        showToast(
          "error",
          "이메일 발송 실패",
          "이메일 발송 중 오류가 발생했습니다."
        );
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [
      determineSenderName,
      isBusinessVerified,
      businessName,
      showToast,
    ]
  );

  return {
    sendEmails,
    isLoading,
  };
};
