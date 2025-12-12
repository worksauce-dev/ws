import { supabase } from "@/shared/lib/supabase";

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
