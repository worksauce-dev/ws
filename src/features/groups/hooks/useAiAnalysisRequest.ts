/**
 * AI 분석 요청 커스텀 훅
 * - 크레딧 확인 및 차감
 * - n8n Webhook 호출
 * - 에러 처리
 */

import { useToast } from "@/shared/components/ui/useToast";
import { useAuth } from "@/shared/contexts/useAuth";
import { getUserCredits, deductCredits } from "@/shared/api/creditApi";
import { InsufficientCreditsError } from "@/shared/errors/CreditErrors";
import { logger } from "@/shared/utils/logger";
import { CREDIT_COSTS } from "@/shared/constants/credits";
import type { AnalyzedResult } from "../utils/analyzeTestResult";
import type { Group } from "@/shared/types/database.types";

interface AnalysisRequestParams {
  applicant: {
    id: string;
    name: string;
    email: string;
    test_result: any;
  };
  group: Group;
  positionLabel: string;
  analyzedResult: AnalyzedResult;
  additionalContext?: string;
  onSuccess?: () => void;
}

export const useAiAnalysisRequest = () => {
  const { showToast } = useToast();
  const { user } = useAuth();

  const requestAnalysis = async (params: AnalysisRequestParams) => {
    const {
      applicant,
      group,
      positionLabel,
      analyzedResult,
      additionalContext,
      onSuccess,
    } = params;

    if (!user?.id) {
      logger.error("❌ 사용자 정보가 없습니다.");
      showToast("error", "분석 실패", "로그인이 필요합니다.");
      return;
    }

    try {
      // 1. 크레딧 잔액 확인
      const { balance } = await getUserCredits(user.id);
      const requiredCredits = CREDIT_COSTS.AI_ANALYSIS;

      if (balance < requiredCredits) {
        showToast(
          "warning",
          "크레딧 부족",
          `크레딧이 부족합니다. (필요: ${requiredCredits}, 보유: ${balance})`
        );
        return;
      }

      // 2. 크레딧 차감
      const { transaction, newBalance } = await deductCredits({
        user_id: user.id,
        amount: requiredCredits,
        type: "ai_analysis",
        reason: `AI 직무 분석 - ${applicant.name} (${positionLabel})`,
        metadata: {
          applicantId: applicant.id,
          applicantName: applicant.name,
          groupId: group.id,
        },
      });

      logger.log("✅ 크레딧 차감 완료:", {
        transactionId: transaction.id,
        newBalance,
      });

      showToast(
        "success",
        "분석 시작",
        `크레딧 ${requiredCredits} 차감 (잔여: ${newBalance})`
      );

      // 3. 직무 설명 우선순위 결정
      const finalJobDescription =
        group.description || additionalContext || "일반적인 직무 특성 기준으로 분석";

      // 4. n8n Webhook 요청 데이터 생성
      const requestPayload = {
        userId: user.id,
        jobInput: {
          jobTitle: positionLabel,
          jobDescription: finalJobDescription,
          position: group.position,
        },
        applicant: {
          id: applicant.id,
          name: applicant.name,
          email: applicant.email,
          test_result: applicant.test_result,
        },
        testResult: {
          statementScores: applicant.test_result.statementScores,
          primaryType: analyzedResult.primaryType.code,
          scoreDistribution: analyzedResult.scoreDistribution,
        },
        metadata: {
          groupId: group.id,
          applicantId: applicant.id,
          transactionId: transaction.id,
          timestamp: new Date().toISOString(),
        },
      };

      logger.log("🚀 n8n Agent 요청 데이터:", requestPayload);
      logger.log("📊 직무:", requestPayload.jobInput.jobTitle);
      logger.log("📝 직무 설명:", requestPayload.jobInput.jobDescription);
      logger.log("👤 지원자:", requestPayload.applicant.name);
      logger.log("🔬 주 유형:", requestPayload.testResult.primaryType);

      // 5. n8n Webhook 호출 (Fire-and-forget)
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
      if (!webhookUrl) {
        throw new Error("VITE_N8N_WEBHOOK_URL 환경 변수가 설정되지 않았습니다.");
      }

      // 응답을 기다리지 않고 요청만 전송 (백그라운드 처리)
      fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      }).catch((error) => {
        logger.error("❌ n8n webhook 호출 실패 (백그라운드):", error);
      });

      logger.log("🚀 AI 분석 요청 전송 완료 (백그라운드 처리 중)");

      // 6. 즉시 사용자에게 피드백 제공
      showToast(
        "info",
        "분석 시작",
        "AI 분석을 진행 중입니다. 완료되면 알림으로 안내드립니다."
      );
      onSuccess?.();
    } catch (error) {
      logger.error("❌ AI 분석 요청 실패:", error);

      // 에러 타입별 처리
      if (error instanceof InsufficientCreditsError) {
        showToast(
          "warning",
          "크레딧 부족",
          `크레딧이 부족합니다. (필요: ${error.required}, 보유: ${error.available})`
        );
      } else if (error instanceof Error) {
        showToast("error", "분석 실패", error.message);
      } else {
        showToast("error", "분석 실패", "알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return { requestAnalysis };
};
