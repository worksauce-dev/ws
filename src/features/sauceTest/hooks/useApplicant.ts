import { useQuery } from "@tanstack/react-query";
import { getApplicant } from "../api/testApi";

/**
 * 테스트 ID(token)로 지원자 정보를 조회하는 React Query hook
 * @param testId - 지원자의 test_token
 */
export function useApplicant(testId: string) {
  return useQuery({
    queryKey: ["applicant", testId],
    queryFn: () => getApplicant(testId),
    enabled: !!testId, // testId가 존재할 때만 쿼리 실행
    staleTime: 5 * 60 * 1000, // 5분 - 데이터가 fresh한 상태로 유지되는 시간
    gcTime: 10 * 60 * 1000, // 10분 - 캐시에 데이터가 유지되는 시간
    retry: 2, // 실패시 2회 재시도
  });
}
