import { useState, useMemo, useEffect } from "react";
import { MdCheckCircle } from "react-icons/md";
import { Button } from "@/shared/components/ui/Button";
import { Logo } from "@/shared/components/ui/Logo";
import { TestCardHeader } from "../shared/TestCardHeader";
import type { VerbCategory, Verb } from "../../types/verbTest.types";
import type { Applicant } from "../../types/test";
import {
  getVerbsByCategory,
  getVerbsByTypesAndCategory,
  getWorkTypesFromVerbIds,
  getRelatedTypes,
} from "../../utils/verbUtils";
import { PHASE_CONFIG, PHASE_ORDER } from "../../constants/verbTest";

const isDev = import.meta.env.VITE_ENV !== "Production";

const SELECT_COUNT = 2; // 각 단계에서 선택할 동사 개수
const TOTAL_STEPS = PHASE_ORDER.length; // 전체 단계 수 (자동 계산)

// 초기 선택 히스토리 상수
const INITIAL_SELECTION_HISTORY: Record<VerbCategory, string[]> = {
  start: [],
  advance: [],
  utility: [],
  communicate: [],
  expert: [],
};

interface VerbTestProps {
  applicant: Applicant;
  testId: string;
  onComplete?: (result: {
    selectionHistory: Record<VerbCategory, string[]>;
  }) => void;
  onSave?: () => void;
  onReset?: () => void;
  onPerfectScore?: () => void;
}

export const VerbTest = ({
  applicant,
  testId,
  onComplete,
  onSave,
  onReset,
  onPerfectScore,
}: VerbTestProps) => {
  // 현재 단계
  const [currentPhase, setCurrentPhase] = useState<VerbCategory>("start");

  // 각 단계별 선택 히스토리
  const [selectionHistory, setSelectionHistory] = useState<
    Record<VerbCategory, string[]>
  >(INITIAL_SELECTION_HISTORY);

  // 현재 선택 중인 동사들
  const [selectedVerbs, setSelectedVerbs] = useState<string[]>([]);

  const phaseConfig = PHASE_CONFIG[currentPhase];

  // 로컬스토리지 키
  const storageKey = `verbTest_${testId}`;

  // 컴포넌트 마운트 시 로컬스토리지에서 상태 복원 (개발 모드 전용)
  useEffect(() => {
    if (isDev) {
      const savedData = localStorage.getItem(storageKey);

      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          console.log("✅ VerbTest 저장된 상태 복원:", parsed);

          // testId 검증
          if (parsed.testId === testId) {
            setCurrentPhase(parsed.currentPhase || "start");
            setSelectionHistory(parsed.selectionHistory || INITIAL_SELECTION_HISTORY);
            setSelectedVerbs(parsed.selectedVerbs || []);
          } else {
            console.log("⚠️ 다른 테스트의 VerbTest 데이터이므로 무시");
            localStorage.removeItem(storageKey);
          }
        } catch (error) {
          console.error("VerbTest 상태 복원 실패:", error);
        }
      }
    }
  }, [testId, storageKey]);

  /**
   * 현재 단계에서 보여줄 동사들을 계산
   * - Start: 모든 start 동사 (10개)
   * - 이후 단계: Start 단계 선택 → 대분류 추출 → 관련 타입들의 현재 phase 동사
   *
   * 중요: Advance부터 Expert까지는 항상 Start에서 선택한 대분류의 동사들만 표시
   */
  const availableVerbs = useMemo((): Verb[] => {
    if (currentPhase === "start") {
      // Start 단계: 모든 start 동사
      return getVerbsByCategory("start");
    }

    // Start 단계의 선택을 기준으로 대분류 결정
    const startSelections = selectionHistory["start"];
    if (!startSelections || startSelections.length === 0) {
      return [];
    }

    // Start에서 선택한 동사들의 WorkType 추출
    const selectedTypes = getWorkTypesFromVerbIds(startSelections);

    // 관련 타입들 (대분류 기반)
    const relatedTypes = getRelatedTypes(selectedTypes);

    // 해당 타입들의 현재 phase 동사들
    return getVerbsByTypesAndCategory(relatedTypes, currentPhase);
  }, [currentPhase, selectionHistory]);

  // 동사 선택 핸들러
  const handleVerbClick = (verbId: string) => {
    setSelectedVerbs(prev => {
      if (prev.includes(verbId)) {
        // 이미 선택됨 - 선택 해제
        return prev.filter(id => id !== verbId);
      } else if (prev.length < SELECT_COUNT) {
        // SELECT_COUNT 미만 - 선택 추가
        return [...prev, verbId];
      }
      // SELECT_COUNT 이미 선택됨 - 무시
      return prev;
    });
  };

  // 이전 단계 핸들러
  const handlePrevious = () => {
    const currentIndex = PHASE_ORDER.indexOf(currentPhase);
    if (currentIndex > 0) {
      // 현재 선택 저장
      setSelectionHistory(prev => ({
        ...prev,
        [currentPhase]: selectedVerbs,
      }));

      // 이전 단계로 이동
      const prevPhase = PHASE_ORDER[currentIndex - 1];
      setCurrentPhase(prevPhase);

      // 이전 단계의 선택 복원
      setSelectedVerbs(selectionHistory[prevPhase] || []);
    }
  };

  // 다음 단계 핸들러
  const handleNext = () => {
    // 현재 선택을 포함한 최종 결과
    const finalSelectionHistory = {
      ...selectionHistory,
      [currentPhase]: selectedVerbs,
    };

    // 다음 단계로 이동
    const currentIndex = PHASE_ORDER.indexOf(currentPhase);
    if (currentIndex < PHASE_ORDER.length - 1) {
      // 현재 선택 저장
      setSelectionHistory(finalSelectionHistory);
      const nextPhase = PHASE_ORDER[currentIndex + 1];
      setCurrentPhase(nextPhase);

      // 다음 단계의 이전 선택이 있으면 복원, 없으면 빈 배열
      setSelectedVerbs(finalSelectionHistory[nextPhase] || []);
    } else {
      // 마지막 단계 - 테스트 완료
      console.log("VerbTest completed!");
      console.log("Selection history:", finalSelectionHistory);

      // 완료 콜백 호출
      if (onComplete) {
        onComplete({ selectionHistory: finalSelectionHistory });
      }
    }
  };

  // 랜덤 완성 핸들러 (DEV 전용)
  const handleRandomComplete = () => {
    console.log("🎲 랜덤 완성 시작...");

    const randomHistory: Record<VerbCategory, string[]> = {
      start: [],
      advance: [],
      utility: [],
      communicate: [],
      expert: [],
    };

    // Start 단계: 모든 start 동사 중 랜덤 2개 선택
    const startVerbs = getVerbsByCategory("start");
    const shuffledStart = [...startVerbs].sort(() => Math.random() - 0.5);
    randomHistory.start = shuffledStart.slice(0, SELECT_COUNT).map(v => v.id);

    // Start에서 선택한 동사들의 WorkType 추출
    const selectedTypes = getWorkTypesFromVerbIds(randomHistory.start);
    const relatedTypes = getRelatedTypes(selectedTypes);

    // 나머지 단계들도 랜덤 선택
    PHASE_ORDER.forEach(phase => {
      if (phase === "start") return; // start는 이미 처리함

      const phaseVerbs = getVerbsByTypesAndCategory(relatedTypes, phase);
      const shuffled = [...phaseVerbs].sort(() => Math.random() - 0.5);
      randomHistory[phase] = shuffled.slice(0, SELECT_COUNT).map(v => v.id);
    });

    console.log("✅ 랜덤 선택 완료:", randomHistory);

    // 완료 콜백 호출
    if (onComplete) {
      onComplete({ selectionHistory: randomHistory });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 px-4 py-6 md:py-12">
      <div className="w-full max-w-4xl">
        {/* 상단 로고 및 제목 */}
        <div className="text-center mb-6 md:mb-8">
          <Logo className="mx-auto mb-4 md:mb-6" />
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-2">
            직무 실행 유형 검사
          </h1>
          <p className="text-sm md:text-base text-neutral-600">
            {applicant.name}님의 직무 실행 유형을 파악합니다
          </p>
        </div>

        {/* 진행률 표시 */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs md:text-sm font-medium text-neutral-700">
              진행률: {phaseConfig.step}/{TOTAL_STEPS} 단계
            </span>
            <span className="text-xs md:text-sm text-neutral-600">
              {Math.round((phaseConfig.step / TOTAL_STEPS) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
              style={{ width: `${(phaseConfig.step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* 메인 테스트 카드 */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
          <TestCardHeader
            title={`${phaseConfig.step}/${TOTAL_STEPS} 단계`}
            questionText={phaseConfig.instruction}
            questionClassName="whitespace-pre-line"
            onSave={onSave}
            onReset={onReset}
            onRandomComplete={isDev ? handleRandomComplete : undefined}
            onPerfectScore={onPerfectScore}
          />

          {/* 카드 내용 */}
          <div className="p-4 md:p-8">
            {/* 선택 안내 */}
            <div className="mb-4 md:mb-6 flex items-center justify-between text-xs md:text-sm">
              <span className="text-neutral-600">
                정확히{" "}
                <strong className="text-primary-600">{SELECT_COUNT}개</strong>를
                선택해주세요
              </span>
              <span className="text-neutral-600">
                선택됨:{" "}
                <strong className="text-primary-600">
                  {selectedVerbs.length}/{SELECT_COUNT}
                </strong>
              </span>
            </div>

            {/* 동사 선택 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
              {availableVerbs.map(verb => {
                const isSelected = selectedVerbs.includes(verb.id);
                return (
                  <button
                    key={verb.id}
                    type="button"
                    onClick={() => handleVerbClick(verb.id)}
                    className={`
                      relative p-4 md:p-6 rounded-lg md:rounded-xl border-2 transition-all
                      flex flex-col items-center justify-center gap-2 md:gap-3
                      min-h-[100px] md:min-h-[120px]
                      ${
                        isSelected
                          ? "border-primary-500 bg-primary-50 shadow-md"
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

                    {/* 동사 텍스트 */}
                    <span
                      className={`text-base md:text-lg font-semibold ${
                        isSelected ? "text-primary-700" : "text-neutral-700"
                      }`}
                    >
                      {verb.text}
                    </span>

                    {/* 타입 코드 (디버깅용 - 나중에 제거 가능) */}
                    {isDev && (
                      <span className="text-xs text-neutral-400">
                        {verb.workType}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 하단 버튼 영역 */}
            <div className="flex items-center justify-between gap-4">
              {/* 이전 단계로 버튼 */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handlePrevious}
                disabled={currentPhase === "start"}
                className="min-w-[120px]"
              >
                이전 단계로
              </Button>

              {/* 선택 상태 메시지 */}
              <div className="hidden md:block text-sm text-neutral-600">
                {selectedVerbs.length === SELECT_COUNT ? (
                  <span className="flex items-center gap-2 text-primary-600 font-medium">
                    <MdCheckCircle className="w-5 h-5" />
                    선택 완료! 다음 단계로 진행하세요
                  </span>
                ) : (
                  <span>
                    {SELECT_COUNT - selectedVerbs.length}개 더 선택해주세요
                  </span>
                )}
              </div>

              {/* 다음 단계로 버튼 */}
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleNext}
                disabled={selectedVerbs.length !== SELECT_COUNT}
                className="min-w-[120px]"
              >
                {currentPhase === "expert" ? "테스트 완료" : "다음 단계로"}
              </Button>
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
