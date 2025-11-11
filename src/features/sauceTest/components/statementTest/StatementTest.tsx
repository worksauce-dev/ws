import { useState, useEffect } from "react";
import { MdCheckCircle, MdLightbulb, MdRefresh, MdSave } from "react-icons/md";
import { Button } from "@/shared/components/ui/Button";
import { Logo } from "@/shared/components/ui/Logo";
import {
  ALL_QUESTIONS,
  ANSWER_OPTIONS,
  TOTAL_QUESTIONS,
} from "../../constants/testQuestions";
import type { AnswerValue } from "../../constants/testQuestions";

const isDev = import.meta.env.VITE_ENV !== "Production";

interface StatementTestProps {
  onReset?: () => void;
}

const StatementTest = ({ onReset }: StatementTestProps = {}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerValue | null>(
    null
  );
  const [autoAdvance, setAutoAdvance] = useState(true); // 자동 진행 기본값: true
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({}); // 전체 답변 기록
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [isRestoredFromSave, setIsRestoredFromSave] = useState(false);

  const currentQuestion = ALL_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100;

  // 컴포넌트 마운트 시 로컬스토리지에서 복원
  useEffect(() => {
    const saved = localStorage.getItem("statementTest_progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
        setAnswers(parsed.answers || {});
        setAutoAdvance(parsed.autoAdvance ?? true);
        setSelectedAnswer(parsed.answers?.[parsed.currentQuestionIndex] ?? null);
        setIsRestoredFromSave(true);
        console.log("저장된 진행 상황 복원됨:", parsed);
      } catch (error) {
        console.error("저장된 데이터 복원 실패:", error);
      }
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
      }, 300); // 0.3초 후 자동 진행
    }
  };

  // 다음 질문 핸들러
  const handleNext = () => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(answers[nextIndex] ?? null);
    } else {
      console.log("Test completed!");
    }
  };

  // 이전 질문 핸들러
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setSelectedAnswer(answers[prevIndex] ?? null);
    }
  };

  // 로컬스토리지에 저장
  const handleSaveToLocalStorage = () => {
    const saveData = {
      currentQuestionIndex,
      answers,
      autoAdvance,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("statementTest_progress", JSON.stringify(saveData));
    console.log("StatementTest 진행 상황 저장됨:", saveData);

    // 저장 메시지 표시
    setShowSaveMessage(true);
    setTimeout(() => {
      setShowSaveMessage(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 px-4 py-12 relative">
      {/* 저장 완료 메시지 */}
      {showSaveMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-success-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <MdCheckCircle className="w-5 h-5" />
            <span className="font-medium">진행 상황이 저장되었습니다</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl">
        {/* 상단 로고 및 제목 */}
        <div className="text-center mb-8">
          <Logo className="mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">
            직무 적합도 검사
          </h1>
          <p className="text-neutral-600">
            총 {TOTAL_QUESTIONS}문항의 질문에 답변해주세요
          </p>
        </div>

        {/* 진행률 표시 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-700">
                진행률: {currentQuestionIndex + 1}/{TOTAL_QUESTIONS} 문항
              </span>
              {isRestoredFromSave && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                  이어하기
                </span>
              )}
            </div>
            <span className="text-sm text-neutral-600">
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
        <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
          {/* 카드 헤더 - 2단 구조 */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600">
            {/* 상단: 메타 정보 */}
            <div className="px-8 pt-6 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <MdLightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-base">
                      문항 {currentQuestionIndex + 1}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* 자동 진행 토글 */}
                  <button
                    onClick={() => setAutoAdvance(!autoAdvance)}
                    className="text-sm text-white/90 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-white/10 border border-white/30"
                  >
                    {autoAdvance ? "✓ 자동 진행" : "수동 진행"}
                  </button>

                  {/* 임시저장 버튼 */}
                  <button
                    onClick={handleSaveToLocalStorage}
                    className="flex items-center gap-1 text-sm text-white/90 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-white/10 border border-white/30"
                    title="현재까지의 진행 상황을 임시 저장합니다"
                  >
                    <MdSave className="w-4 h-4" />
                    <span>임시저장</span>
                  </button>

                  {/* 개발 모드 전용: 리셋 버튼 */}
                  {isDev && onReset && (
                    <button
                      onClick={onReset}
                      className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-white/10 border border-white/20"
                      title="전체 테스트 리셋 (개발 모드)"
                    >
                      <MdRefresh className="w-4 h-4" />
                      <span>리셋 (DEV)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 하단: 질문 텍스트 */}
            <div className="px-8 py-6">
              <p className="text-white text-2xl font-medium leading-relaxed">
                {currentQuestion.text}
              </p>
            </div>
          </div>

          {/* 카드 내용 */}
          <div className="p-8">
            {/* 답변 선택 영역 */}
            <div className="space-y-4 mb-8">
              {/* 양끝 라벨 */}
              <div className="flex justify-between text-xs text-neutral-500 px-2">
                <span>전혀 아니다</span>
                <span>매우 그렇다</span>
              </div>

              {/* 답변 버튼 그리드 */}
              <div className="grid grid-cols-5 gap-3">
                {ANSWER_OPTIONS.map(option => {
                  const isSelected = selectedAnswer === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleAnswerClick(option.value)}
                      className={`
                        relative p-6 rounded-xl border-2 transition-all
                        flex flex-col items-center justify-center gap-2
                        min-h-[120px]
                        ${
                          isSelected
                            ? "border-primary-500 bg-primary-50 shadow-md scale-105"
                            : "border-neutral-200 bg-white hover:border-primary-300 hover:bg-primary-50/50"
                        }
                      `}
                    >
                      {/* 선택 표시 */}
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <MdCheckCircle className="w-6 h-6 text-primary-600" />
                        </div>
                      )}

                      {/* 숫자 */}
                      <span
                        className={`text-3xl font-bold ${
                          isSelected ? "text-primary-600" : "text-neutral-400"
                        }`}
                      >
                        {option.value}
                      </span>

                      {/* 라벨 */}
                      <span
                        className={`text-xs text-center font-medium ${
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
            <div className="flex items-center justify-between">
              {/* 이전 문항 버튼 */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="min-w-[150px]"
              >
                이전 문항
              </Button>

              {/* 선택 상태 메시지 */}
              <div className="text-sm text-neutral-600">
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
                  className="min-w-[200px]"
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
                    onClick={() => console.log("Test completed!")}
                    className="min-w-[200px]"
                  >
                    테스트 완료
                  </Button>
                )}
            </div>
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="mt-8 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg px-6 py-4 border border-neutral-200">
            <p className="text-sm text-neutral-600">
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
