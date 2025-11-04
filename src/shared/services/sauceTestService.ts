// src/services/sauceTestService.ts

import { supabase } from "@/shared/lib/supabase";

export interface SendSauceTestParams {
  applicantEmail: string;
  userName: string;
  applicantName: string;
  testId: string;
  dashboardId: string;
  deadline: string; // ISO 8601 format
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
  try {
    const { data, error } = await supabase.functions.invoke(
      "send-saucetest-email",
      {
        body: params,
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

      return {
        success: false,
        error: errorMessage,
      };
    }

    console.log("✅ 소스테스트 이메일 발송 성공:", data);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("❌ Network error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
    };
  }
}

/**
 * 이메일 유효성 검증
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
