import { useState, useEffect } from "react";
import { MdCheckCircle } from "react-icons/md";
import { Button } from "@/shared/components/ui/Button";
import { Logo } from "@/shared/components/ui/Logo";
import { TestCardHeader } from "../shared/TestCardHeader";
import {
  ANSWER_OPTIONS,
  TOTAL_QUESTIONS,
  shuffleQuestions,
} from "../../constants/testQuestions";
import type { AnswerValue, Question } from "../../constants/testQuestions";

const AUTO_ADVANCE_DELAY = 600; // 자동 진행 딜레이 (ms)

// StatementTest 결과 타입 - 각 질문에 답변 포함
export interface QuestionWithAnswer extends Question {
  applicant_answer: AnswerValue;
}

export interface StatementTestResult {
  results: QuestionWithAnswer[];
}

interface StatementTestProps {
  onSave?: () => void;
  onReset?: () => void;
  onComplete?: (result: StatementTestResult) => void;
}

const StatementTest = ({ onSave, onReset, onComplete }: StatementTestProps = {}) => {
  // 랜덤화된 질문 배열 (로컬스토리지에서 복원 또는 새로 생성)
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerValue | null>(
    null
  );
  const [autoAdvance, setAutoAdvance] = useState(true); // 자동 진행 기본값: true
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({}); // 전체 답변 기록
  const [isRestoredFromSave, setIsRestoredFromSave] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100;

  // 컴포넌트 마운트 시 로컬스토리지에서 복원 또는 질문 랜덤화
  useEffect(() => {
    const saved = localStorage.getItem("statementTest_progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 저장된 질문 순서 복원 (없으면 새로 랜덤화)
        setQuestions(parsed.questions || shuffleQuestions());
        setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
        setAnswers(parsed.answers || {});
        setAutoAdvance(parsed.autoAdvance ?? true);
        setSelectedAnswer(
          parsed.answers?.[parsed.currentQuestionIndex] ?? null
        );
        setIsRestoredFromSave(true);
        console.log("저장된 진행 상황 복원됨:", parsed);
      } catch (error) {
        console.error("저장된 데이터 복원 실패:", error);
        // 복원 실패 시 새로 랜덤화
        setQuestions(shuffleQuestions());
      }
    } else {
      // 저장된 데이터가 없으면 새로 랜덤화
      setQuestions(shuffleQuestions());
      console.log("질문 순서가 랜덤화되었습니다");
    }
  }, []);

  // 답변 선택 핸들러
  const handleAnswerClick = (value: AnswerValue) => {
    setSelectedAnswer(value);
    // 답변 기록 저장
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: value,
    }));

    // 자동 진행이 활성화되어 있고 마지막 문항이 아니면 자동으로 다음으로
    if (autoAdvance && currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      }, AUTO_ADVANCE_DELAY);
    }
  };

  // 다음 질문 핸들러
  const handleNext = () => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(answers[nextIndex] ?? null);
    } else {
      handleComplete();
    }
  };

  // 테스트 완료 핸들러
  const handleComplete = () => {
    console.log("StatementTest completed!");

    // 각 질문에 답변을 포함한 결과 생성
    const results: QuestionWithAnswer[] = questions.map((question, index) => ({
      ...question,
      applicant_answer: answers[index],
    }));

    onComplete?.({ results });
  };

  // 이전 질문 핸들러
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setSelectedAnswer(answers[prevIndex] ?? null);
    }
  };

  // 로컬스토리지에 저장 (임시저장 버튼용)
  const handleSaveToLocalStorage = () => {
    const saveData = {
      questions, // 랜덤화된 질문 순서 저장 (중요!)
      currentQuestionIndex,
      answers,
      autoAdvance,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("statementTest_progress", JSON.stringify(saveData));
    console.log("StatementTest 진행 상황 저장됨:", saveData);

    // 부모 컴포넌트의 onSave 콜백도 실행 (저장 메시지 표시용)
    onSave?.();
  };

  // 질문이 로드되기 전 로딩 상태
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-neutral-600 text-lg">질문을 준비하는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 px-4 py-6 md:py-12 relative">
      <div className="w-full max-w-4xl">
        {/* 상단 로고 및 제목 */}
        <div className="text-center mb-6 md:mb-8">
          <Logo className="mx-auto mb-4 md:mb-6" />
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-2">
            직무 실행 유형 검사
          </h1>
          <p className="text-sm md:text-base text-neutral-600">
            총 {TOTAL_QUESTIONS}문항의 질문에 답변해주세요
          </p>
        </div>

        {/* 진행률 표시 */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm font-medium text-neutral-700">
                진행률: {currentQuestionIndex + 1}/{TOTAL_QUESTIONS} 문항
              </span>
              {isRestoredFromSave && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                  이어하기
                </span>
              )}
            </div>
            <span className="text-xs md:text-sm text-neutral-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 메인 테스트 카드 */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
          <TestCardHeader
            title={`문항 ${currentQuestionIndex + 1}`}
            questionText={currentQuestion.text}
            onSave={handleSaveToLocalStorage}
            onReset={onReset}
            extraButtons={
              <button
                onClick={() => setAutoAdvance(!autoAdvance)}
                className="text-xs md:text-sm text-white/90 hover:text-white transition-colors px-2 md:px-3 py-1 rounded-md hover:bg-white/10 border border-white/30"
              >
                <span className="hidden sm:inline">
                  {autoAdvance ? "✓ 자동 진행" : "수동 진행"}
                </span>
                <span className="sm:hidden">{autoAdvance ? "✓" : "수동"}</span>
              </button>
            }
          />

          {/* 카드 내용 */}
          <div className="p-4 md:p-8">
            {/* 답변 선택 영역 */}
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {/* 양끝 라벨 */}
              <div className="flex justify-between text-xs text-neutral-500 px-1 md:px-2">
                <span>전혀 아니다</span>
                <span>매우 그렇다</span>
              </div>

              {/* 답변 버튼 그리드 */}
              <div className="grid grid-cols-5 gap-2 md:gap-3">
                {ANSWER_OPTIONS.map(option => {
                  const isSelected = selectedAnswer === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleAnswerClick(option.value)}
                      className={`
                        relative p-3 md:p-6 rounded-lg md:rounded-xl border-2 transition-all
                        flex flex-col items-center justify-center gap-1 md:gap-2
                        min-h-[90px] md:min-h-[120px]
                        ${
                          isSelected
                            ? "border-primary-500 bg-primary-50 shadow-md scale-105"
                            : "border-neutral-200 bg-white hover:border-primary-300 hover:bg-primary-50/50"
                        }
                      `}
                    >
                      {/* 선택 표시 */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 md:top-3 md:right-3">
                          <MdCheckCircle className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                        </div>
                      )}

                      {/* 숫자 */}
                      <span
                        className={`text-2xl md:text-3xl font-bold ${
                          isSelected ? "text-primary-600" : "text-neutral-400"
                        }`}
                      >
                        {option.value}
                      </span>

                      {/* 라벨 */}
                      <span
                        className={`hidden md:block text-xs text-center font-medium ${
                          isSelected ? "text-primary-700" : "text-neutral-600"
                        }`}
                      >
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 하단 버튼 영역 */}
            <div className="flex items-center justify-between gap-4">
              {/* 이전 문항 버튼 */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="min-w-[100px] md:min-w-[120px]"
              >
                이전 문항
              </Button>

              {/* 선택 상태 메시지 */}
              <div className="hidden md:block text-sm text-neutral-600">
                {selectedAnswer !== null ? (
                  <span className="flex items-center gap-2 text-primary-600 font-medium">
                    <MdCheckCircle className="w-5 h-5" />
                    {autoAdvance
                      ? "자동으로 다음 문항으로"
                      : "답변 완료! 다음 문항으로 진행하세요"}
                  </span>
                ) : (
                  <span>답변을 선택해주세요</span>
                )}
              </div>

              {/* 다음 문항/완료 버튼 */}
              {!autoAdvance && (
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  className="min-w-[100px] md:min-w-[150px]"
                >
                  {currentQuestionIndex === TOTAL_QUESTIONS - 1
                    ? "테스트 완료"
                    : "다음 문항"}
                </Button>
              )}

              {/* 완료 버튼 (자동 모드 + 마지막 문항) */}
              {autoAdvance &&
                currentQuestionIndex === TOTAL_QUESTIONS - 1 &&
                selectedAnswer !== null && (
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={handleComplete}
                    className="min-w-[100px] md:min-w-[150px]"
                  >
                    테스트 완료
                  </Button>
                )}
            </div>
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="mt-6 md:mt-8 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg md:rounded-xl px-4 md:px-6 py-3 md:py-4 border border-neutral-200">
            <p className="text-xs md:text-sm text-neutral-600">
              질문이 있으신가요?{" "}
              <a
                href="mailto:support@worksauce.kr"
                className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center gap-1 transition-colors"
              >
                support@worksauce.kr
                <span className="text-xs">↗</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatementTest;
