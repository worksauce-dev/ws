import { supabase } from "@/shared/lib/supabase";
import type { SurveyData } from "../components/SurveySection";

/**
 * 설문조사 데이터를 Supabase에 저장
 */
export async function submitSurvey(
  data: SurveyData
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("minitest_surveys").insert({
      email: data.email,
      age_range: data.ageRange,
      q1: data.q1,
      q2: data.q2,
      q3: data.q3,
      feedback: data.feedback || null,
      // created_at은 DB에서 DEFAULT NOW()로 자동 설정됨
    });

    if (error) {
      console.error("Error submitting survey:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error submitting survey:", error);
    return {
      success: false,
      error: "설문 제출 중 오류가 발생했습니다.",
    };
  }
}

/**
 * minitest_answers 테이블에서 한글 유형명으로 AI 결과 조회
 */
export async function getAIResultByTypeName(typeName: string) {
  try {
    const { data, error } = await supabase
      .from("minitest_answers")
      .select("*", { count: "exact" })
      .eq("type_name", typeName)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      return null;
    }

    // data는 배열로 반환되므로 첫 번째 요소 반환
    // 데이터가 없으면 null 반환 (에러 없이)
    const result = data && data.length > 0 ? data[0] : null;
    return result;
  } catch (error) {
    console.error("❌ Unexpected error fetching AI result:", error);
    return null;
  }
}

/**
 * AI 결과가 존재하는지 확인
 */
export async function checkAIResultExists(typeName: string): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from("minitest_answers")
      .select("*", { count: "exact", head: true })
      .eq("type_name", typeName);

    if (error) {
      console.error("Error checking AI result:", error);
      return false;
    }

    return (count ?? 0) > 0;
  } catch (error) {
    console.error("Unexpected error checking AI result:", error);
    return false;
  }
}
