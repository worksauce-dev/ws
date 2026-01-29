import { useMemo } from "react";
import { LandingHeader } from "@/features/landing/components/layout/LandingHeader";
import { IntroSection } from "../components/IntroSection";
import { VerbTestSection } from "../components/VerbTestSection";
import { MiniTestSection } from "../components/MiniTestSection";
import { ResultSection } from "../components/ResultSection";
import { useTestFlow } from "../hooks/useTestFlow";
import { useVerbTest } from "../hooks/useVerbTest";
import { verbQuestions } from "../const/miniTestData";
import {
  useMetadata,
  WORKSAUCE_METADATA_PRESETS,
} from "@/shared/hooks/useMetadata";

export const MiniTestPage = () => {
  useMetadata(WORKSAUCE_METADATA_PRESETS.miniTest);
  const verbTest = useVerbTest();

  // Verb 테스트 점수 계산
  const verbScores = useMemo(() => {
    const scores: Record<string, number> = {};

    // answers 배열을 2개씩 묶어서 각 질문의 선택을 처리
    for (let i = 0; i < verbTest.answers.length; i += 2) {
      const questionIndex = Math.floor(i / 2);
      const questionKey = verbTest.questionKeys[questionIndex];

      if (questionKey) {
        const option1Index = verbTest.answers[i];
        const option2Index = verbTest.answers[i + 1];

        const options = verbQuestions[questionKey].options;

        if (option1Index !== undefined && options[option1Index]) {
          const type = options[option1Index].type;
          scores[type] = (scores[type] || 0) + 1;
        }

        if (option2Index !== undefined && options[option2Index]) {
          const type = options[option2Index].type;
          scores[type] = (scores[type] || 0) + 1;
        }
      }
    }

    return scores;
  }, [verbTest.answers, verbTest.questionKeys]);

  const testFlow = useTestFlow(verbScores);

  // 현재 질문의 key와 데이터
  const currentQuestionKey =
    verbTest.questionKeys[verbTest.currentQuestion - 1];
  const currentQuestionData = currentQuestionKey
    ? verbQuestions[currentQuestionKey]
    : null;

  // VerbTestSection props
  const verbTestProps = useMemo(
    () => ({
      currentQuestion: verbTest.currentQuestion,
      totalQuestions: verbTest.totalQuestions,
      question: currentQuestionData?.question || "",
      options: currentQuestionKey
        ? verbTest.getFilteredOptions(currentQuestionKey)
        : [],
      selectedOptions: verbTest.selectedOptions,
      onSelectOption: verbTest.handleSelectOption,
      onNext: () => verbTest.handleNext(testFlow.completeVerb),
    }),
    [verbTest, currentQuestionData, currentQuestionKey, testFlow.completeVerb]
  );

  // 테스트 재시작 시 verbTest도 리셋
  const handleRestart = () => {
    verbTest.reset();
    testFlow.resultProps.onRestart();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-info-50">
      {/* 인트로와 결과 화면에서 헤더 표시 */}
      {(testFlow.step === "intro" || testFlow.step === "result") && (
        <LandingHeader />
      )}

      {/* IntroSection과 ResultSection은 풀스크린이므로 별도 레이아웃 */}
      {testFlow.step === "intro" && (
        <IntroSection onStart={testFlow.startTest} />
      )}

      {testFlow.step === "result" && (
        <ResultSection {...testFlow.resultProps} onRestart={handleRestart} />
      )}

      {/* 테스트 진행 중에는 기존 레이아웃 사용 */}
      {(testFlow.step === "verb" || testFlow.step === "mini") && (
        <div className="py-8 px-4 flex items-center justify-center min-h-screen">
          <div className="w-full max-w-3xl">
            {testFlow.step === "verb" && <VerbTestSection {...verbTestProps} />}

            {testFlow.step === "mini" && (
              <MiniTestSection {...testFlow.miniTestProps} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
