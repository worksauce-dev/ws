import { supabase } from "@/shared/lib/supabase";
import { type Applicant } from "../types/test";
import type { TestRawData, TestResult } from "@/shared/types/database.types";

/**
 * 지원자 ID로 지원자 정보를 조회합니다.
 */
export async function getApplicant(
  applicantId: string
): Promise<Applicant | null> {
  try {
    const { data, error } = await supabase
      .from("applicants")
      .select("id, name, email, group_id, test_status")
      .eq("id", applicantId)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Get applicant error:", error);
    return null;
  }
}

/**
 * 지원자의 이메일 열람 시간을 기록합니다.
 */
export async function updateEmailOpenedAt(
  applicantId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("applicants")
      .update({ email_opened_at: new Date().toISOString() })
      .eq("id", applicantId);

    if (error) {
      console.error("Update email_opened_at error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Update email_opened_at error:", error);
    return false;
  }
}

/**
 * 지원자의 테스트 상태를 'in_progress'로 업데이트합니다.
 * 인증 완료 후 테스트를 시작할 때 호출됩니다.
 */
export async function updateTestStatusToInProgress(
  applicantId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("applicants")
      .update({ test_status: "in_progress" })
      .eq("id", applicantId);

    if (error) {
      console.error("Update test_status to in_progress error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Update test_status to in_progress error:", error);
    return false;
  }
}

/**
 * 테스트 결과를 제출하고 저장합니다.
 */
export async function submitTestResults(
  applicantId: string,
  testRawData: TestRawData,
  testResult: TestResult
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("applicants")
      .update({
        test_raw_data: testRawData,
        test_result: testResult,
        test_status: "completed",
        test_submitted_at: new Date().toISOString(),
      })
      .eq("id", applicantId);

    if (error) {
      console.error("Submit test results error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Submit test results error:", error);
    return false;
  }
}
