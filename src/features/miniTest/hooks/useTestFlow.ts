import { useState, useCallback, useMemo } from "react";
import { useMiniTest } from "./useMiniTest";
import { useAIResult } from "./useAIResult";
import { submitSurvey as submitSurveyApi } from "../api/miniTestApi";
import type { SurveyData } from "../components/SurveySection";

type TestStep = "intro" | "verb" | "mini" | "result";

export const useTestFlow = (verbScores: Record<string, number>) => {
  const [step, setStep] = useState<TestStep>("intro");

  // Mini Test 관리 - Verb 점수를 기반으로 초기화
  const miniTest = useMiniTest(verbScores);

  // 최종 결과 유형
  const [finalType, setFinalType] = useState<string>("");

  // AI 결과 가져오기
  const {
    data: aiResult,
    isLoading: isLoadingAI,
    error: aiError,
  } = useAIResult(finalType);

  // 단계별 네비게이션
  const startTest = useCallback(() => setStep("verb"), []);

  const completeVerb = useCallback(() => setStep("mini"), []);

  const completeMini = useCallback(() => {
    const type = miniTest.getFinalType();
    setFinalType(type);
    setStep("result");
  }, [miniTest]);

  const restart = useCallback(() => {
    miniTest.reset();
    setFinalType("");
    setStep("intro");
  }, [miniTest]);

  // 설문조사 제출
  const submitSurvey = useCallback(
    async (data: SurveyData): Promise<{ success: boolean }> => {
      try {
        const result = await submitSurveyApi(data);

        if (result.success) {
          console.log("✅ Survey submitted successfully");
        } else {
          console.error("❌ Survey submission failed:", result.error);
        }

        return { success: result.success };
      } catch (error) {
        console.error("❌ Unexpected error during survey submission:", error);
        return { success: false };
      }
    },
    []
  );

  // Mini Test props
  const miniTestProps = useMemo(
    () => ({
      currentTypeIdx: miniTest.currentTypeIndex,
      miniTestAnswers: miniTest.miniTestAnswers,
      onAnswer: miniTest.handleAnswer,
      onNext: miniTest.goToNext,
      onFinish: completeMini,
      isComplete: miniTest.isCurrentTypeComplete,
      isLastType: miniTest.isLastType,
    }),
    [miniTest, completeMini]
  );

  // Result props
  const resultProps = useMemo(
    () => ({
      finalType,
      onRestart: restart,
      submitSurvey,
      requestId: finalType || "",
      isProcessingResult: isLoadingAI,
      aiResult: aiResult || null,
      webhookError: aiError
        ? "AI 결과를 가져오는 중 오류가 발생했습니다."
        : null,
    }),
    [finalType, restart, submitSurvey, isLoadingAI, aiResult, aiError]
  );

  return {
    step,
    startTest,
    completeVerb,
    miniTestProps,
    resultProps,
  };
};
