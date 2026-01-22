import { useQuery } from "@tanstack/react-query";
import {
  getAiAnalysisByApplicant,
  type AiAnalysisStatus,
} from "@/shared/api/aiAnalysisApi";
import { transformAiAnalysisData } from "../utils/transformAiAnalysisData";
import { CACHE_TIMES } from "@/shared/constants/cache";
import type { AIComparisonAnalysis } from "../types/aiJobMatching.types";

/**
 * AI 분석 조회 결과 타입
 */
interface AiAnalysisResult {
  status: AiAnalysisStatus | "idle";
  data: AIComparisonAnalysis | null;
}

/**
 * 특정 지원자의 AI 분석 결과를 조회하는 Hook
 *
 * @param applicantId - 지원자 ID
 * @param enabled - 쿼리 활성화 여부 (기본: true)
 * @returns AI 분석 결과, 상태, 로딩 상태, 에러 정보
 */
export const useAiAnalysis = (
  applicantId: string | undefined,
  enabled = true
) => {
  const query = useQuery<AiAnalysisResult>({
    queryKey: ["aiAnalysis", applicantId],
    queryFn: async () => {
      if (!applicantId) return { status: "idle", data: null };

      const record = await getAiAnalysisByApplicant(applicantId);

      if (!record) return { status: "idle", data: null };

      // pending 또는 processing 상태면 데이터 없이 상태만 반환
      if (record.status === "pending" || record.status === "processing") {
        return { status: record.status, data: null };
      }

      // failed 상태
      if (record.status === "failed") {
        return { status: "failed", data: null };
      }

      // completed 상태 - 데이터 변환 후 반환
      return {
        status: "completed",
        data: transformAiAnalysisData(record),
      };
    },
    enabled: enabled && !!applicantId,
    staleTime: CACHE_TIMES.FIVE_MINUTES,
    gcTime: CACHE_TIMES.TEN_MINUTES,
    // pending/processing 상태일 때 더 자주 refetch
    refetchInterval: query => {
      const data = query.state.data;
      if (data?.status === "pending" || data?.status === "processing") {
        return 5000; // 5초마다 재조회
      }
      return false;
    },
  });

  return {
    ...query,
    // 편의를 위한 추가 반환값
    analysisStatus: query.data?.status ?? "idle",
    analysisData: query.data?.data ?? null,
  };
};
