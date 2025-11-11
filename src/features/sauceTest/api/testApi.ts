import { supabase } from "@/shared/lib/supabase";
import { type Applicant } from "../types/test";

/**
 * 테스트 ID(token)로 지원자 정보를 조회합니다.
 */
export async function getApplicant(testId: string): Promise<Applicant | null> {
  try {
    const { data, error } = await supabase
      .from("applicants")
      .select("id, name, email, group_id, test_status")
      .eq("test_token", testId)
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
