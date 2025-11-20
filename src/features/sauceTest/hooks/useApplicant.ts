import { useQuery } from "@tanstack/react-query";
import { getApplicant } from "../api/testApi";

/**
 * 지원자 ID로 지원자 정보를 조회하는 React Query hook
 * @param applicantId - 지원자의 ID
 */
export function useApplicant(applicantId: string) {
  return useQuery({
    queryKey: ["applicant", applicantId],
    queryFn: () => getApplicant(applicantId),
    enabled: !!applicantId, // applicantId가 존재할 때만 쿼리 실행
    staleTime: 5 * 60 * 1000, // 5분 - 데이터가 fresh한 상태로 유지되는 시간
    gcTime: 10 * 60 * 1000, // 10분 - 캐시에 데이터가 유지되는 시간
    retry: 2, // 실패시 2회 재시도
  });
}
