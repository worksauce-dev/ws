import { useQuery } from "@tanstack/react-query";
import { getAiAnalysisByApplicant } from "@/shared/api/aiAnalysisApi";
import { transformAiAnalysisData } from "../utils/transformAiAnalysisData";
import { CACHE_TIMES } from "@/shared/constants/cache";
import type { AIComparisonAnalysis } from "../types/aiJobMatching.types";

/**
 * 특정 지원자의 AI 분석 결과를 조회하는 Hook
 *
 * @param applicantId - 지원자 ID
 * @param enabled - 쿼리 활성화 여부 (기본: true)
 * @returns AI 분석 결과, 로딩 상태, 에러 정보
 */
export const useAiAnalysis = (applicantId: string | undefined, enabled = true) => {
  return useQuery<AIComparisonAnalysis | null>({
    queryKey: ["aiAnalysis", applicantId],
    queryFn: async () => {
      if (!applicantId) return null;

      const record = await getAiAnalysisByApplicant(applicantId);

      if (!record) return null;

      return transformAiAnalysisData(record);
    },
    enabled: enabled && !!applicantId,
    staleTime: CACHE_TIMES.FIVE_MINUTES,
    gcTime: CACHE_TIMES.TEN_MINUTES
  });
};
