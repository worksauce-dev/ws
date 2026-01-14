/**
 * Verb Test 선택 데이터를 AI가 해석 가능한 형태로 변환
 */

import { VERB_POOL, PHASE_CONFIG } from "@/features/sauceTest/constants/verbTest";
import type { VerbCategory } from "@/features/sauceTest/types/verbTest.types";

/**
 * AI에게 전달할 동사 선택 정보
 */
export interface VerbSelectionForAI {
  category: VerbCategory;
  categoryLabel: string; // "시작", "발전", "활용", "소통", "전문가"
  question: string; // Phase별 instruction
  selectedVerbs: string[]; // 실제 동사 텍스트 (예: ["기억하다", "분류하다"])
}

/**
 * Verb ID를 실제 동사 텍스트로 변환
 * @example "SA-1" -> "기억하다"
 */
const getVerbText = (verbId: string): string | null => {
  for (const verbs of Object.values(VERB_POOL)) {
    const verb = verbs.find((v) => v.id === verbId);
    if (verb) {
      return verb.text.trim(); // 공백 제거
    }
  }
  return null;
};

/**
 * Verb Test 선택 결과를 AI가 이해할 수 있는 형태로 변환
 *
 * @param verbTestSelections - 원본 선택 데이터 (예: { start: ["SA-1", "SE-1"], ... })
 * @returns AI용 변환 데이터 배열
 *
 * @example
 * Input:
 * {
 *   start: ["SA-1", "SE-1"],
 *   expert: ["SE-9", "SA-8"]
 * }
 *
 * Output:
 * [
 *   {
 *     category: "start",
 *     categoryLabel: "시작",
 *     question: "지원자님은 일 또는 아이디어를 진행할 때 어떤 '동사'를 기반으로 시작하나요?",
 *     selectedVerbs: ["기억하다", "인식하다"]
 *   },
 *   {
 *     category: "expert",
 *     categoryLabel: "전문가",
 *     question: "모든 과정을 지나 '마지막'이 어떤 모습일 때 가장 만족감이 높으실까요?",
 *     selectedVerbs: ["완수하다", "감동시키다"]
 *   }
 * ]
 */
export const transformVerbSelectionsForAI = (
  verbTestSelections: Record<VerbCategory, string[]> | undefined
): VerbSelectionForAI[] => {
  if (!verbTestSelections) {
    return [];
  }

  const result: VerbSelectionForAI[] = [];

  // Phase 순서대로 변환 (start -> advance -> utility -> communicate -> expert)
  const phaseOrder: VerbCategory[] = ["start", "advance", "utility", "communicate", "expert"];

  for (const category of phaseOrder) {
    const selectedIds = verbTestSelections[category];
    if (!selectedIds || selectedIds.length === 0) {
      continue;
    }

    const phaseConfig = PHASE_CONFIG[category];
    const selectedVerbs = selectedIds
      .map(getVerbText)
      .filter((text): text is string => text !== null); // null 제거 + 타입 가드

    if (selectedVerbs.length > 0) {
      result.push({
        category,
        categoryLabel: phaseConfig.title,
        question: phaseConfig.instruction,
        selectedVerbs,
      });
    }
  }

  return result;
};

/**
 * AI 프롬프트에 직접 삽입 가능한 마크다운 형식으로 변환
 *
 * @example
 * "
 * 1. 시작 (Start)
 *    질문: 지원자님은 일 또는 아이디어를 진행할 때 어떤 '동사'를 기반으로 시작하나요?
 *    선택한 동사: 기억하다, 인식하다
 *
 * 2. 전문가 (Expert)
 *    질문: 모든 과정을 지나 '마지막'이 어떤 모습일 때 가장 만족감이 높으실까요?
 *    선택한 동사: 완수하다, 감동시키다
 * "
 */
export const formatVerbSelectionsForPrompt = (
  verbTestSelections: Record<VerbCategory, string[]> | undefined
): string => {
  const transformed = transformVerbSelectionsForAI(verbTestSelections);

  if (transformed.length === 0) {
    return "선택한 동사 정보가 없습니다.";
  }

  return transformed
    .map((item, index) => {
      return `${index + 1}. ${item.categoryLabel} (${item.category})
   질문: ${item.question}
   선택한 동사: ${item.selectedVerbs.join(", ")}`;
    })
    .join("\n\n");
};
