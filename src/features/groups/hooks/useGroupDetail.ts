import { useQuery } from "@tanstack/react-query";
import { getGroupWithApplicants } from "../api/groupApi";

/**
 * 그룹 상세 정보 조회 hook
 * 그룹 정보와 지원자 목록을 함께 가져옵니다.
 */
export const useGroupDetail = (groupId: string) => {
  return useQuery({
    queryKey: ["group", groupId],
    queryFn: () => getGroupWithApplicants(groupId),
    enabled: !!groupId, // groupId가 있을 때만 실행
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
    refetchOnWindowFocus: true,
    retry: 2,
  });
};
