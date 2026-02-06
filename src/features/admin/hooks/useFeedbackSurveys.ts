import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/shared/lib/supabase";

// DB 응답 타입 (snake_case)
export interface FeedbackSurveyRow {
  id: string;
  user_id: string;
  ai_satisfaction: number;
  usage_contexts: string[];
  usage_context_other: string | null;
  useful_features: string[];
  useful_feature_other: string | null;
  improvement_areas: string[];
  improvement_area_other: string | null;
  feature_request: string;
  nps_score: number;
  additional_feedback: string | null;
  reward_credited: boolean;
  created_at: string;
  // 별도 조회로 가져올 사용자 정보
  user_profile?: {
    email: string;
    name: string;
  } | null;
}

/**
 * 관리자용: 모든 피드백 설문 데이터 조회
 * feedback_surveys.user_id는 auth.users를 참조하므로 user_profile을 별도 조회
 */
export const getAllFeedbackSurveys = async (): Promise<FeedbackSurveyRow[]> => {
  // 1. 피드백 설문 조회
  const { data: surveys, error: surveysError } = await supabase
    .from("feedback_surveys")
    .select("*")
    .order("created_at", { ascending: false });

  if (surveysError) {
    console.error("피드백 설문 조회 실패:", surveysError);
    throw new Error(surveysError.message);
  }

  if (!surveys || surveys.length === 0) {
    return [];
  }

  // 2. 사용자 프로필 조회 (user_id 목록으로)
  const userIds = surveys.map(s => s.user_id).filter(Boolean);
  const { data: profiles } = await supabase
    .from("user_profile")
    .select("id, email, name")
    .in("id", userIds);

  // 3. 프로필 정보를 설문에 매핑
  const profileMap = new Map(
    (profiles || []).map(p => [p.id, { email: p.email, name: p.name }])
  );

  return surveys.map(survey => ({
    ...survey,
    user_profile: profileMap.get(survey.user_id) || null,
  }));
};

/**
 * 관리자용: 모든 피드백 설문 데이터 조회 훅
 */
export const useFeedbackSurveys = () => {
  return useQuery({
    queryKey: ["admin", "feedback-surveys"],
    queryFn: getAllFeedbackSurveys,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
    refetchOnWindowFocus: true,
  });
};
