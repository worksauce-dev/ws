// src/services/sauceTestService.ts

import { supabase } from "@/shared/lib/supabase";

export interface SendSauceTestParams {
  applicantEmail: string;
  userName: string;
  applicantName: string;
  testId: string;
  dashboardId: string;
  deadline: string; // ISO 8601 format
  applicantId?: string; // 이메일 발송 상태 업데이트를 위한 지원자 ID (선택)
}

export interface SendSauceTestResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

/**
 * 소스테스트 이메일 발송
 * @param params 발송에 필요한 파라미터
 * @returns 발송 결과
 */
export async function sendSauceTestEmail(
  params: SendSauceTestParams
): Promise<SendSauceTestResult> {
  const { applicantId, ...emailParams } = params;

  try {
    const { data, error } = await supabase.functions.invoke(
      "send-saucetest-email",
      {
        body: emailParams,
      }
    );

    if (error) {
      console.error("❌ Error sending sauce test email:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
      });

      // 상세 에러 메시지 추출
      let errorMessage = "소스테스트 이메일 발송에 실패했습니다.";

      if (data && typeof data === "object" && "error" in data) {
        errorMessage = data.error as string;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // 이메일 발송 실패 상태 DB 업데이트
      if (applicantId) {
        await updateEmailStatus(applicantId, "failed", errorMessage);
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    console.log("✅ 소스테스트 이메일 발송 성공:", data);

    // 이메일 발송 성공 상태 DB 업데이트
    if (applicantId) {
      await updateEmailStatus(applicantId, "sent");
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("❌ Network error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "네트워크 오류가 발생했습니다. 다시 시도해주세요.";

    // 이메일 발송 실패 상태 DB 업데이트
    if (applicantId) {
      await updateEmailStatus(applicantId, "failed", errorMessage);
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * 이메일 발송 상태 DB 업데이트
 * @param applicantId 지원자 ID
 * @param status 발송 상태
 * @param errorMessage 에러 메시지 (실패 시)
 */
async function updateEmailStatus(
  applicantId: string,
  status: "sent" | "failed",
  errorMessage?: string
): Promise<void> {
  try {
    const updateData: {
      email_sent_status: "sent" | "failed";
      email_sent_at?: string;
      email_last_error?: string;
    } = {
      email_sent_status: status,
    };

    if (status === "sent") {
      updateData.email_sent_at = new Date().toISOString();
      updateData.email_last_error = undefined;
    } else if (status === "failed" && errorMessage) {
      updateData.email_last_error = errorMessage;
    }

    const { error } = await supabase
      .from("applicants")
      .update(updateData)
      .eq("id", applicantId);

    if (error) {
      console.error("❌ 이메일 상태 업데이트 실패:", error);
    } else {
      console.log(`✅ 이메일 상태 업데이트 성공: ${applicantId} → ${status}`);
    }
  } catch (error) {
    console.error("❌ 이메일 상태 업데이트 중 오류:", error);
  }
}

/**
 * 이메일 유효성 검증
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
