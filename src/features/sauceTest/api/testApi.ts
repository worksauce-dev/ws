import { supabase } from "@/shared/lib/supabase";
import { type Applicant } from "../types/test";

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
