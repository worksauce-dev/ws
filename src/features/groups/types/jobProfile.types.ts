/**
 * 직무별 이상적 유형 프로필
 *
 * 소스테스트의 핵심 가치인 "개인 ↔ 직무" 매칭에 집중하여
 * 각 직무가 요구하는 역량과 최적 점수 범위를 정의합니다.
 */

import type { WorkTypeCode } from "../constants/workTypeKeywords";

/**
 * 역량의 중요도 수준
 * - critical: 필수 역량 (최소 점수 미달 시 큰 감점)
 * - important: 중요 역량 (점수가 높을수록 가산점)
 * - preferred: 우대 역량 (있으면 좋음)
 */
export type CompetencyWeight = "critical" | "important" | "preferred";

/**
 * 직무별 필수 역량 정의
 */
export interface JobCompetency {
  /** 역량 유형 코드 */
  workType: WorkTypeCode;

  /** 역량 중요도 */
  weight: CompetencyWeight;

  /** 최소 요구 점수 (이 점수 미만 시 경고) */
  minScore: number;

  /** 최적 점수 (이 점수 이상이면 우수) */
  optimalScore: number;

  /** 이 역량이 해당 직무에서 왜 중요한지 설명 */
  description: string;

  /** 면접에서 확인할 구체적 질문/포인트 */
  interviewCheckpoints: string[];
}

/**
 * 직무 프로필
 */
export interface JobProfile {
  /** 직무 ID (position value와 매칭) */
  jobId: string;

  /** 직무명 */
  jobTitle: string;

  /** 직무 설명 */
  description: string;

  /** 이 직무에 필요한 역량들 */
  competencies: JobCompetency[];

  /** 전반적인 채용 가이드 (면접관에게 주는 팁) */
  hiringGuidance: string;
}

/**
 * 직무 적합도 분석 결과
 */
export interface JobFitAnalysis {
  /** 종합 점수 (0-100) */
  overallScore: number;

  /** 적합도 수준 */
  fitLevel: "excellent" | "good" | "moderate" | "low";

  /** 적합도 수준 라벨 */
  fitLevelLabel: string;

  /** 강점 역량들 (optimal 이상) */
  strengths: {
    workType: WorkTypeCode;
    workTypeName: string;
    score: number;
    weight: CompetencyWeight;
    description: string;
  }[];

  /** 보완 필요 역량들 (min 미만) */
  weaknesses: {
    workType: WorkTypeCode;
    workTypeName: string;
    score: number;
    weight: CompetencyWeight;
    minScore: number;
    description: string;
    interviewCheckpoints: string[];
  }[];

  /** 적정 수준 역량들 (min 이상 optimal 미만) */
  adequateCompetencies: {
    workType: WorkTypeCode;
    workTypeName: string;
    score: number;
    weight: CompetencyWeight;
  }[];

  /** 채용 의사결정 가이드 */
  hiringRecommendation: {
    /** 추천 수준 */
    level: "strongly_recommended" | "recommended" | "conditional" | "not_recommended";

    /** 추천 수준 라벨 */
    levelLabel: string;

    /** 추천 이유/근거 */
    reasoning: string;

    /** 면접에서 반드시 확인할 사항들 */
    criticalCheckpoints: string[];
  };
}
