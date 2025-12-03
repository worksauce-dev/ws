/**
 * 직무실행유형 정의 타입
 * 각 유형별 특성, 강점, 약점, 면접 가이드 등을 포함
 */

export interface WorkTypeStrength {
  title: string;
  description: string;
}

export interface WorkTypeWeakness {
  title: string;
  description: string;
}

export interface WorkStyleItem {
  title: string;
  description: string;
}

export interface TeamRoleItem {
  title: string;
  titleEn?: string;
  description: string;
}

export interface CollaborationStyle {
  goodSynergyWith: string[];
  needsBalanceWith: string[];
  characteristics: string[];
  tips: string;
}

export interface InterviewQuestion {
  category: string;
  question: string;
}

export interface EvaluationPoint {
  area: string;
  positiveSignals: string[];
  warningSignals: string[];
}

export interface WorkTypeDefinition {
  id: string;
  name: string;
  nameEn: string;
  description: string;

  // 직무실행유형 분석용
  characteristics: string[];
  strengths: WorkTypeStrength[];
  weaknesses: WorkTypeWeakness[];
  motivators: string[];
  stressors: string[];
  workStyle: WorkStyleItem[];
  managementTips: string[];

  // 팀 시너지 분석용
  teamRole: {
    roles: TeamRoleItem[];
  };
  collaborationStyle: CollaborationStyle;

  // 면접 가이드용
  interviewQuestions: InterviewQuestion[];
  evaluationPoints: EvaluationPoint[];
}

/**
 * 모든 직무실행유형을 담는 Map 타입
 */
export type WorkTypeDefinitions = Record<string, WorkTypeDefinition>;
