/**
 * 피드백 설문 관련 React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/shared/contexts/useAuth";
import { creditApi } from "../api/creditApi";
import type { FeedbackSurveyData } from "../types/credit.types";

const SURVEY_QUERY_KEYS = {
  status: (userId: string) => ["survey", "status", userId] as const,
};

const CREDIT_QUERY_KEYS = {
  balance: (userId: string) => ["credits", "balance", userId] as const,
  history: (userId: string) => ["credits", "history", userId] as const,
};

/**
 * 설문 상태 조회 hook
 */
export const useSurveyStatus = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: SURVEY_QUERY_KEYS.status(user?.id || ""),
    queryFn: () => creditApi.getSurveyStatus(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 10, // 10분
  });
};

/**
 * 설문 제출 mutation hook
 */
export const useSubmitSurvey = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (surveyData: FeedbackSurveyData) =>
      creditApi.submitFeedbackSurvey(user!.id, surveyData),
    onSuccess: () => {
      // 설문 상태 및 크레딧 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: SURVEY_QUERY_KEYS.status(user?.id || ""),
      });
      queryClient.invalidateQueries({
        queryKey: CREDIT_QUERY_KEYS.balance(user?.id || ""),
      });
      queryClient.invalidateQueries({
        queryKey: CREDIT_QUERY_KEYS.history(user?.id || ""),
      });
    },
  });
};
