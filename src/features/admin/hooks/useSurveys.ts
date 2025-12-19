import { useQuery } from "@tanstack/react-query";
import { getAllSurveys } from "@/features/miniTest/api/miniTestApi";

/**
 * 관리자용: 모든 설문조사 데이터 조회 훅
 */
export const useSurveys = () => {
  return useQuery({
    queryKey: ["admin", "surveys"],
    queryFn: async () => {
      const { data, error } = await getAllSurveys();
      if (error) {
        throw new Error(error);
      }
      return data ?? [];
    },
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
    refetchOnWindowFocus: true,
  });
};
