/**
 * 크레딧 관련 API 함수
 * 기존 테이블 스키마 기반:
 * - user_profile.credits: 잔여 크레딧
 * - credit_transactions: 크레딧 거래 내역
 */

import { supabase } from "@/shared/lib/supabase";
import type {
  CreditHistory,
  CreditBalance,
  CreditTransaction,
  CreditTransactionMetadata,
  FeedbackSurveyData,
  SurveyStatus,
} from "../types/credit.types";

/**
 * 크레딧 잔액 조회
 * user_profile 테이블의 credits 필드 조회
 */
export const getCreditBalance = async (
  userId: string
): Promise<CreditBalance> => {
  const { data, error } = await supabase
    .from("user_profile")
    .select("credits")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("크레딧 잔액 조회 실패:", error);
    // 프로필이 없으면 기본값 반환
    if (error.code === "PGRST116") {
      return { credits: 0 };
    }
    throw new Error(error.message);
  }

  return {
    credits: data?.credits ?? 0,
  };
};

// DB 응답 타입 (snake_case)
interface CreditTransactionRow {
  id: string;
  user_id: string;
  amount: number;
  balance_after: number;
  type: string;
  reason: string | null;
  metadata: CreditTransactionMetadata | null;
  created_at: string;
}

/**
 * 크레딧 거래 내역 조회
 * credit_transactions 테이블에서 조회 후 UI용 형태로 변환
 */
export const getCreditHistory = async (
  userId: string
): Promise<CreditHistory[]> => {
  const { data, error } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("크레딧 내역 조회 실패:", error);
    throw new Error(error.message);
  }

  // DB 데이터(snake_case)를 UI용 형태(camelCase)로 변환
  return (data || []).map((tx: CreditTransactionRow) => {
    const metadata = tx.metadata as CreditTransactionMetadata | null;
    // amount가 음수면 사용, 양수면 충전/적립
    const isUsage = tx.amount < 0;
    const uiType = isUsage ? "use" : mapTransactionType(tx.type);

    return {
      id: tx.id,
      type: uiType,
      amount: Math.abs(tx.amount), // UI에서는 항상 양수로 표시
      description: tx.reason || getDefaultReason(tx.type),
      createdAt: tx.created_at,
      balanceAfter: tx.balance_after,
      relatedGroupName: metadata?.groupName,
      relatedApplicantName: metadata?.applicantName,
    } as CreditHistory;
  });
};

/**
 * 거래 타입 매핑 (DB → UI)
 */
const mapTransactionType = (
  dbType: string
): "use" | "charge" | "reward" => {
  switch (dbType) {
    case "use":
      return "use";
    case "charge":
      return "charge";
    case "reward":
    case "signup_bonus":
    default:
      return "reward";
  }
};

/**
 * 기본 사유 텍스트
 */
const getDefaultReason = (type: string): string => {
  switch (type) {
    case "use":
      return "크레딧 사용";
    case "charge":
      return "크레딧 충전";
    case "signup_bonus":
      return "회원가입 보너스";
    case "reward":
      return "보상 크레딧";
    default:
      return "크레딧 거래";
  }
};

/**
 * 크레딧 사용 (AI 분석 등)
 * 트랜잭션: user_profile.credits 차감 + credit_transactions 기록
 */
export const useCredit = async (
  userId: string,
  amount: number,
  reason: string,
  metadata?: CreditTransactionMetadata
): Promise<{ success: boolean; newBalance: number }> => {
  // 1. 현재 잔액 확인
  const { data: profile, error: profileError } = await supabase
    .from("user_profile")
    .select("credits")
    .eq("id", userId)
    .single();

  if (profileError) {
    throw new Error("프로필 조회 실패: " + profileError.message);
  }

  const currentCredits = profile?.credits ?? 0;
  if (currentCredits < amount) {
    throw new Error("크레딧이 부족합니다.");
  }

  const newBalance = currentCredits - amount;

  // 2. user_profile 업데이트
  const { error: updateError } = await supabase
    .from("user_profile")
    .update({ credits: newBalance })
    .eq("id", userId);

  if (updateError) {
    throw new Error("크레딧 차감 실패: " + updateError.message);
  }

  // 3. credit_transactions 기록
  const { error: txError } = await supabase
    .from("credit_transactions")
    .insert({
      user_id: userId,
      amount: -amount, // 사용은 음수
      balance_after: newBalance,
      type: "use",
      reason,
      metadata,
    });

  if (txError) {
    // 롤백 시도
    await supabase
      .from("user_profile")
      .update({ credits: currentCredits })
      .eq("id", userId);
    throw new Error("거래 기록 실패: " + txError.message);
  }

  return { success: true, newBalance };
};

/**
 * 크레딧 충전/적립
 */
export const addCredit = async (
  userId: string,
  amount: number,
  type: "charge" | "reward",
  reason: string,
  metadata?: CreditTransactionMetadata
): Promise<{ success: boolean; newBalance: number }> => {
  // 1. 현재 잔액 확인
  const { data: profile, error: profileError } = await supabase
    .from("user_profile")
    .select("credits")
    .eq("id", userId)
    .single();

  if (profileError) {
    throw new Error("프로필 조회 실패: " + profileError.message);
  }

  const currentCredits = profile?.credits ?? 0;
  const newBalance = currentCredits + amount;

  // 2. user_profile 업데이트
  const { error: updateError } = await supabase
    .from("user_profile")
    .update({ credits: newBalance })
    .eq("id", userId);

  if (updateError) {
    throw new Error("크레딧 충전 실패: " + updateError.message);
  }

  // 3. credit_transactions 기록
  const { error: txError } = await supabase
    .from("credit_transactions")
    .insert({
      user_id: userId,
      amount: amount, // 충전/적립은 양수
      balance_after: newBalance,
      type,
      reason,
      metadata,
    });

  if (txError) {
    // 롤백 시도
    await supabase
      .from("user_profile")
      .update({ credits: currentCredits })
      .eq("id", userId);
    throw new Error("거래 기록 실패: " + txError.message);
  }

  return { success: true, newBalance };
};

/**
 * 피드백 설문 상태 조회
 */
export const getSurveyStatus = async (userId: string): Promise<SurveyStatus> => {
  const { data, error } = await supabase
    .from("feedback_surveys")
    .select("id, created_at, reward_credited")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("설문 상태 조회 실패:", error);
    throw new Error(error.message);
  }

  return {
    hasCompleted: !!data,
    completedAt: data?.created_at,
    rewardCredited: data?.reward_credited,
  };
};

/**
 * 피드백 설문 제출 및 크레딧 지급
 */
export const submitFeedbackSurvey = async (
  userId: string,
  surveyData: FeedbackSurveyData
): Promise<void> => {
  // 1. 이미 제출했는지 확인
  const { data: existing } = await supabase
    .from("feedback_surveys")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    throw new Error("이미 설문에 참여하셨습니다.");
  }

  // 2. 설문 데이터 저장
  const { data: survey, error: surveyError } = await supabase
    .from("feedback_surveys")
    .insert({
      user_id: userId,
      ai_satisfaction: surveyData.aiSatisfaction,
      usage_contexts: surveyData.usageContexts,
      usage_context_other: surveyData.usageContextOther,
      useful_features: surveyData.usefulFeatures,
      useful_feature_other: surveyData.usefulFeatureOther,
      improvement_areas: surveyData.improvementAreas,
      improvement_area_other: surveyData.improvementAreaOther,
      feature_request: surveyData.featureRequest,
      nps_score: surveyData.npsScore,
      additional_feedback: surveyData.additionalFeedback,
      reward_credited: true,
    })
    .select("id")
    .single();

  if (surveyError) {
    console.error("설문 저장 실패:", surveyError);
    throw new Error(surveyError.message);
  }

  // 3. 크레딧 10 지급
  await addCredit(userId, 10, "reward", "피드백 설문 참여 보상", {
    surveyId: survey.id,
  });
};

export const creditApi = {
  getCreditBalance,
  getCreditHistory,
  useCredit,
  addCredit,
  getSurveyStatus,
  submitFeedbackSurvey,
};
