/**
 * 소스테스트 결과를 5축 실행 프로필로 변환하는 유틸리티
 *
 * 10개의 업무 유형(WorkType)을 5개의 실행 축(ExecutionAxis)으로 매핑합니다.
 *
 * @see /직무 실행 유형 검사 – AI Agent 활용 설계 보고서.md
 */

import type { TestResult } from "@/shared/types/database.types";
import type {
  ExecutionProfile,
  ExecutionAxisScore,
  ApplicantExecutionProfile,
  ExecutionAxisCode,
} from "@/features/applicants/types/aiJobMatching.types";
import { toExecutionAxisScore } from "@/features/applicants/types/aiJobMatching.types";
import type { WorkTypeCode } from "../types/workType.types";

/**
 * 10개 WorkType → 5축 매핑 규칙
 *
 * 각 실행 축은 특정 WorkType들의 점수를 가중 평균하여 계산합니다.
 * 가중치는 각 WorkType의 특성을 고려하여 설정됩니다.
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. 의사결정 속도 (Decision Speed)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 의사결정 속도 축 계산
 *
 * 높음: 빠른 판단과 실행 (EE, EG)
 * 낮음: 신중한 분석과 검토 (UR, SA)
 */
function calculateDecisionSpeed(scores: Record<WorkTypeCode, number>): ExecutionAxisScore {
  const fastTypes = {
    EE: scores.EE || 0, // 도전확장형 - 빠른 실행
    EG: scores.EG || 0, // 도전목표형 - 빠른 결정
  };

  const slowTypes = {
    UR: scores.UR || 0, // 이해연구형 - 신중한 분석
    SA: scores.SA || 0, // 기준심미형 - 세밀한 검토
  };

  const fastScore = (fastTypes.EE + fastTypes.EG) / 2;
  const slowScore = (slowTypes.UR + slowTypes.SA) / 2;

  // 0-100 범위로 정규화
  const normalizedScore = (fastScore - slowScore + 100) / 2;
  return toExecutionAxisScore(Math.max(0, Math.min(100, Math.round(normalizedScore))));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. 불확실성 내성 (Uncertainty Tolerance)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 불확실성 내성 축 계산
 *
 * 높음: 변화와 모호함을 선호 (AS, AF, EE)
 * 낮음: 구조화와 명확함을 선호 (SE, SA)
 */
function calculateUncertaintyTolerance(
  scores: Record<WorkTypeCode, number>
): ExecutionAxisScore {
  const highToleranceTypes = {
    AS: scores.AS || 0, // 예술느낌형 - 열린 사고
    AF: scores.AF || 0, // 예술융합형 - 유연한 접근
    EE: scores.EE || 0, // 도전확장형 - 변화 수용
  };

  const lowToleranceTypes = {
    SE: scores.SE || 0, // 기준윤리형 - 명확한 기준
    SA: scores.SA || 0, // 기준심미형 - 구조화된 환경
  };

  const highScore = (highToleranceTypes.AS + highToleranceTypes.AF + highToleranceTypes.EE) / 3;
  const lowScore = (lowToleranceTypes.SE + lowToleranceTypes.SA) / 2;

  const normalizedScore = (highScore - lowScore + 100) / 2;
  return toExecutionAxisScore(Math.max(0, Math.min(100, Math.round(normalizedScore))));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. 자율성 (Autonomy)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 자율성 축 계산
 *
 * 높음: 독립적 업무 수행 선호 (UR, AF, EE)
 * 낮음: 협업과 조정 선호 (CA, CH, UM)
 */
function calculateAutonomy(scores: Record<WorkTypeCode, number>): ExecutionAxisScore {
  const highAutonomyTypes = {
    UR: scores.UR || 0, // 이해연구형 - 독립적 연구
    AF: scores.AF || 0, // 예술융합형 - 자율적 창작
    EE: scores.EE || 0, // 도전확장형 - 주도적 실행
  };

  const lowAutonomyTypes = {
    CA: scores.CA || 0, // 소통도움형 - 타인 중심
    CH: scores.CH || 0, // 소통조화형 - 조정 역할
    UM: scores.UM || 0, // 이해관리형 - 관계 조율
  };

  const highScore = (highAutonomyTypes.UR + highAutonomyTypes.AF + highAutonomyTypes.EE) / 3;
  const lowScore = (lowAutonomyTypes.CA + lowAutonomyTypes.CH + lowAutonomyTypes.UM) / 3;

  const normalizedScore = (highScore - lowScore + 100) / 2;
  return toExecutionAxisScore(Math.max(0, Math.min(100, Math.round(normalizedScore))));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. 관계 중심성 (Relationship Focus)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 관계 중심성 축 계산
 *
 * 높음: 대인 관계 중시 (CA, CH, UM)
 * 낮음: 과제/결과 중시 (UR, EG, SA)
 */
function calculateRelationshipFocus(
  scores: Record<WorkTypeCode, number>
): ExecutionAxisScore {
  const highRelationshipTypes = {
    CA: scores.CA || 0, // 소통도움형 - 관계 중심
    CH: scores.CH || 0, // 소통조화형 - 조화 추구
    UM: scores.UM || 0, // 이해관리형 - 관계 관리
  };

  const lowRelationshipTypes = {
    UR: scores.UR || 0, // 이해연구형 - 과제 중심
    EG: scores.EG || 0, // 도전목표형 - 결과 중심
    SA: scores.SA || 0, // 기준심미형 - 완성도 중심
  };

  const highScore =
    (highRelationshipTypes.CA + highRelationshipTypes.CH + highRelationshipTypes.UM) / 3;
  const lowScore = (lowRelationshipTypes.UR + lowRelationshipTypes.EG + lowRelationshipTypes.SA) / 3;

  const normalizedScore = (highScore - lowScore + 100) / 2;
  return toExecutionAxisScore(Math.max(0, Math.min(100, Math.round(normalizedScore))));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. 정확성 요구도 (Precision Requirement)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 정확성 요구도 축 계산
 *
 * 높음: 완벽함과 디테일 중시 (SE, SA, UR)
 * 낮음: 속도와 유연성 중시 (EE, AS)
 */
function calculatePrecisionRequirement(
  scores: Record<WorkTypeCode, number>
): ExecutionAxisScore {
  const highPrecisionTypes = {
    SE: scores.SE || 0, // 기준윤리형 - 원칙 준수
    SA: scores.SA || 0, // 기준심미형 - 완벽 추구
    UR: scores.UR || 0, // 이해연구형 - 정확한 분석
  };

  const lowPrecisionTypes = {
    EE: scores.EE || 0, // 도전확장형 - 빠른 시도
    AS: scores.AS || 0, // 예술느낌형 - 직관적 표현
  };

  const highScore = (highPrecisionTypes.SE + highPrecisionTypes.SA + highPrecisionTypes.UR) / 3;
  const lowScore = (lowPrecisionTypes.EE + lowPrecisionTypes.AS) / 2;

  const normalizedScore = (highScore - lowScore + 100) / 2;
  return toExecutionAxisScore(Math.max(0, Math.min(100, Math.round(normalizedScore))));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 메인 변환 함수
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 소스테스트 결과를 5축 실행 프로필로 변환
 *
 * @param testResult 소스테스트 원본 결과
 * @param applicantId 지원자 ID
 * @param primaryWorkType 주 유형 코드
 * @returns ApplicantExecutionProfile
 */
export function transformToExecutionProfile(
  testResult: TestResult,
  applicantId: string,
  primaryWorkType: WorkTypeCode
): ApplicantExecutionProfile {
  const scores = testResult.statementScores as Record<WorkTypeCode, number>;

  const executionProfile: ExecutionProfile = {
    decision_speed: calculateDecisionSpeed(scores),
    uncertainty_tolerance: calculateUncertaintyTolerance(scores),
    autonomy: calculateAutonomy(scores),
    relationship_focus: calculateRelationshipFocus(scores),
    precision_requirement: calculatePrecisionRequirement(scores),
  };

  return {
    applicantId,
    executionProfile,
    sourceData: {
      primaryWorkType,
      workTypeScores: scores,
    },
    transformedAt: new Date().toISOString(),
  };
}

/**
 * 실행 축 점수 레벨 판단
 *
 * @param score 0-100 점수
 * @returns "low" | "medium" | "high"
 */
export function getAxisScoreLevel(score: ExecutionAxisScore): "low" | "medium" | "high" {
  if (score <= 30) return "low";
  if (score <= 70) return "medium";
  return "high";
}

/**
 * 실행 축 이름 (한국어)
 */
export const EXECUTION_AXIS_NAMES: Record<ExecutionAxisCode, string> = {
  decision_speed: "의사결정 속도",
  uncertainty_tolerance: "불확실성 내성",
  autonomy: "자율성",
  relationship_focus: "관계 중심성",
  precision_requirement: "정확성 요구도",
};

/**
 * 실행 축 설명 (한국어)
 */
export const EXECUTION_AXIS_DESCRIPTIONS: Record<
  ExecutionAxisCode,
  { low: string; high: string }
> = {
  decision_speed: {
    low: "신중한 분석과 검토 후 의사결정",
    high: "빠른 판단과 실행 선호",
  },
  uncertainty_tolerance: {
    low: "명확한 구조와 기준 선호",
    high: "변화와 모호함 수용",
  },
  autonomy: {
    low: "협업과 조정 중심 업무 선호",
    high: "독립적이고 자율적인 업무 선호",
  },
  relationship_focus: {
    low: "과제와 결과 중심",
    high: "대인 관계와 조화 중심",
  },
  precision_requirement: {
    low: "속도와 유연성 우선",
    high: "완벽함과 디테일 중시",
  },
};
