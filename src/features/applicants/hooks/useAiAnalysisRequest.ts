/**
 * AI 분석 요청 커스텀 훅
 * - 크레딧 확인 및 차감
 * - n8n Webhook 호출
 * - 에러 처리
 */

import { useToast } from "@/shared/components/ui/useToast";
import { useAuth } from "@/shared/contexts/useAuth";
import { getUserCredits, deductCredits, refundCredits } from "@/shared/api/creditApi";
import {
  createPendingAiAnalysis,
  updateAiAnalysisStatus,
} from "@/shared/api/aiAnalysisApi";
import { InsufficientCreditsError } from "@/shared/errors/CreditErrors";
import { logger } from "@/shared/utils/logger";
import { CREDIT_COSTS } from "@/shared/constants/credits";
import { nanoid } from "nanoid";
import type { AnalyzedResult } from "@/features/groups/utils/analyzeTestResult";
import type { Group, TestResult } from "@/shared/types/database.types";
import { transformVerbSelectionsForAI } from "../utils/transformVerbSelections";

interface AnalysisRequestParams {
  applicant: {
    id: string;
    name: string;
    email: string;
    test_result: TestResult;
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

    // 크레딧 차감 후 에러 발생 시 환불을 위한 변수
    let deductedTransaction: { id: string } | null = null;
    let deductedAmount = 0;

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

      // 환불을 위해 차감 정보 저장
      deductedTransaction = transaction;
      deductedAmount = requiredCredits;

      logger.log("✅ 크레딧 차감 완료:", {
        transactionId: transaction.id,
        newBalance,
      });

      showToast(
        "success",
        "분석 시작",
        `크레딧 ${requiredCredits} 차감 (잔여: ${newBalance})`
      );

      // 3. 분석 ID 생성 및 pending 레코드 생성
      const analysisId = nanoid();

      await createPendingAiAnalysis({
        user_id: user.id,
        applicant_id: applicant.id,
        group_id: group.id,
        analysis_id: analysisId,
        transaction_id: transaction.id,
      });

      logger.log("✅ Pending 레코드 생성 완료:", { analysisId });

      // 4. 직무 설명 우선순위 결정
      const finalJobDescription =
        group.description || additionalContext || "일반적인 직무 특성 기준으로 분석";

      // 5. Verb Test 선택 데이터 변환 (AI가 이해할 수 있는 형태로)
      const verbSelections = transformVerbSelectionsForAI(
        applicant.test_result.verbTestSelections
      );

      // 6. n8n Webhook 요청 데이터 생성
      const requestPayload = {
        userId: user.id,
        jobInput: {
          jobTitle: positionLabel,
          jobDescription: finalJobDescription,
          position: group.position,
          experienceLevel: group.experience_level, // 경력 수준 추가
        },
        applicant: {
          id: applicant.id,
          name: applicant.name,
          email: applicant.email,
        },
        testResult: {
          statementScores: applicant.test_result.statementScores,
          primaryType: analyzedResult.primaryType.code,
          scoreDistribution: analyzedResult.scoreDistribution,
          verbSelections, // ✅ 변환된 동사 선택 데이터 (AI가 읽을 수 있는 형태)
        },
        metadata: {
          groupId: group.id,
          applicantId: applicant.id,
          analysisId, // pending 레코드와 연결
          transactionId: transaction.id,
          timestamp: new Date().toISOString(),
        },
      };

      logger.log("🚀 n8n Agent 요청 데이터:", requestPayload);
      logger.log("📊 직무:", requestPayload.jobInput.jobTitle);
      logger.log("📝 직무 설명:", requestPayload.jobInput.jobDescription);
      logger.log("👤 지원자:", requestPayload.applicant.name);
      logger.log("🔬 주 유형:", requestPayload.testResult.primaryType);
      logger.log("🔤 동사 선택:", verbSelections.length, "개 단계");

      // 5. n8n Webhook 호출 (Fire-and-forget)
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
      if (!webhookUrl) {
        throw new Error("VITE_N8N_WEBHOOK_URL 환경 변수가 설정되지 않았습니다.");
      }

      // n8n Webhook 호출 (응답 대기)
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        // Webhook 호출 실패 시 상태 업데이트 및 크레딧 환불
        logger.error("❌ n8n webhook 응답 실패:", response.status);

        await updateAiAnalysisStatus(analysisId, "failed");

        await refundCredits({
          user_id: user.id,
          amount: requiredCredits,
          reason: `AI 분석 실패 환불 - ${applicant.name} (${positionLabel})`,
          metadata: {
            originalTransactionId: transaction.id,
            applicantId: applicant.id,
            groupId: group.id,
            failureReason: `Webhook response: ${response.status}`,
          },
        });

        showToast(
          "error",
          "분석 실패",
          "AI 분석 요청에 실패했습니다. 크레딧이 환불되었습니다."
        );
        return;
      }

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

      // 크레딧 차감 후 에러 발생 시 환불 처리
      if (deductedTransaction && deductedAmount > 0) {
        try {
          await refundCredits({
            user_id: user.id,
            amount: deductedAmount,
            reason: `AI 분석 실패 환불 - ${applicant.name} (${positionLabel})`,
            metadata: {
              originalTransactionId: deductedTransaction.id,
              applicantId: applicant.id,
              groupId: group.id,
              failureReason: error instanceof Error ? error.message : "Unknown error",
            },
          });
          logger.log("✅ 크레딧 환불 완료");
        } catch (refundError) {
          logger.error("❌ 크레딧 환불 실패:", refundError);
        }
      }

      // 에러 타입별 처리
      if (error instanceof InsufficientCreditsError) {
        showToast(
          "warning",
          "크레딧 부족",
          `크레딧이 부족합니다. (필요: ${error.required}, 보유: ${error.available})`
        );
      } else if (error instanceof Error) {
        showToast(
          "error",
          "분석 실패",
          `${error.message} 크레딧이 환불되었습니다.`
        );
      } else {
        showToast(
          "error",
          "분석 실패",
          "알 수 없는 오류가 발생했습니다. 크레딧이 환불되었습니다."
        );
      }
    }
  };

  return { requestAnalysis };
};
