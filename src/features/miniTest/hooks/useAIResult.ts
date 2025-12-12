import { useQuery } from "@tanstack/react-query";
import { getAIResultByTypeName } from "../api/miniTestApi";

/**
 * 한글 유형명으로 AI 결과를 가져오는 hook
 */
export function useAIResult(typeName: string) {
  return useQuery({
    queryKey: ["ai-result", typeName],
    queryFn: () => getAIResultByTypeName(typeName),
    enabled: !!typeName, // typeName이 있을 때만 실행
    staleTime: 1000 * 60 * 30, // 30분 동안 캐시 유지
    gcTime: 1000 * 60 * 60, // 1시간 동안 캐시 보관
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
