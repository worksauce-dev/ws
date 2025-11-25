import type { WorkTypeCode } from "../constants/testQuestions";
import type { VerbCategory } from "../types/verbTest.types";
import type {
  AnswersByWorkType,
  VerbTestResult,
} from "../components/TestSession";

export interface TestScores {
  primaryWorkType: WorkTypeCode;
  verbTestSelections: Record<VerbCategory, string[]>;
  statementScores: Record<WorkTypeCode, number>;
}

/**
 * VerbTest와 StatementTest 결과를 50:50 비중으로 반영하여
 * 주 업무 유형(Primary WorkType)과 전체 점수를 계산합니다.
 */
export const calculatePrimaryWorkType = (
  answersByWorkType: AnswersByWorkType,
  verbTestResult: VerbTestResult
): TestScores => {
  // 1. StatementTest 점수 계산 (50% 비중)
  const statementScores: Record<WorkTypeCode, number> = {} as Record<
    WorkTypeCode,
    number
  >;

  Object.entries(answersByWorkType).forEach(([workType, questions]) => {
    const sum = questions.reduce(
      (acc, question) => acc + question.applicant_answer,
      0
    );
    // 평균 점수를 100점 만점으로 변환 (1-5 → 0-100)
    const average = (sum / questions.length / 5) * 100;
    statementScores[workType as WorkTypeCode] = average;
  });

  // 2. VerbTest 점수 계산 (50% 비중)
  const verbScores: Record<WorkTypeCode, number> = {
    SE: 0,
    SA: 0,
    AS: 0,
    AF: 0,
    UM: 0,
    UR: 0,
    CA: 0,
    CH: 0,
    EE: 0,
    EG: 0,
  };

  // 전체 동사 선택 개수
  const totalVerbSelections = Object.values(
    verbTestResult.selectionHistory
  ).reduce((sum, verbs) => sum + verbs.length, 0);

  // 각 선택된 동사의 ID에서 WorkType 추출 (예: "AS-1" → "AS")
  Object.values(verbTestResult.selectionHistory).forEach(verbIds => {
    verbIds.forEach(verbId => {
      // "AS-1" → "AS"
      const workType = verbId.split("-")[0] as WorkTypeCode;
      verbScores[workType] += 1;
    });
  });

  // VerbTest 점수를 100점 만점으로 정규화
  Object.keys(verbScores).forEach(workType => {
    const wt = workType as WorkTypeCode;
    verbScores[wt] = (verbScores[wt] / totalVerbSelections) * 100;
  });

  // 3. 최종 점수 계산 (50:50 비중)
  const finalScores: Record<WorkTypeCode, number> = {} as Record<
    WorkTypeCode,
    number
  >;

  Object.keys(statementScores).forEach(workType => {
    const wt = workType as WorkTypeCode;
    finalScores[wt] = statementScores[wt] * 0.5 + verbScores[wt] * 0.5;
  });

  // 4. 가장 높은 점수를 가진 WorkType 찾기
  let primaryWorkType: WorkTypeCode = "SE"; // 기본값
  let highestScore = 0;

  Object.entries(finalScores).forEach(([workType, score]) => {
    if (score > highestScore) {
      highestScore = score;
      primaryWorkType = workType as WorkTypeCode;
    }
  });

  return {
    primaryWorkType,
    verbTestSelections: verbTestResult.selectionHistory,
    statementScores,
  };
};
