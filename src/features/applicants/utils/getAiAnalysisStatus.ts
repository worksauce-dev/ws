/**
 * AI 분석 상태를 결정하는 유틸리티 함수
 *
 * 상태 우선순위:
 * 1. Supabase 조회 중 → pending
 * 2. Supabase 조회 에러 → failed
 * 3. DB 상태가 pending/processing → pending
 * 4. DB 상태가 completed → completed
 * 5. DB 상태가 failed → failed
 * 6. 그 외 → idle (분석 요청 전)
 */

export type AiAnalysisStatus = "idle" | "pending" | "completed" | "failed";

interface GetAiAnalysisStatusParams {
  isLoading: boolean;
  isError: boolean;
  dbStatus: string | null | undefined;
}

export function getAiAnalysisStatus({
  isLoading,
  isError,
  dbStatus,
}: GetAiAnalysisStatusParams): AiAnalysisStatus {
  // Supabase 조회 중
  if (isLoading) {
    return "pending";
  }

  // Supabase 조회 에러
  if (isError) {
    return "failed";
  }

  // DB 상태 기반 판단
  if (dbStatus === "pending" || dbStatus === "processing") {
    return "pending";
  }

  if (dbStatus === "completed") {
    return "completed";
  }

  if (dbStatus === "failed") {
    return "failed";
  }

  // 분석 요청 전 (DB에 레코드 없음)
  return "idle";
}
