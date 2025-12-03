// types/workType.ts

export type WorkTypeCode =
  | "SE"
  | "SA"
  | "AS"
  | "AF"
  | "UM"
  | "UR"
  | "CA"
  | "CH"
  | "EE"
  | "EG";

export type VerbCategory =
  | "start"
  | "advance"
  | "utility"
  | "communicate"
  | "expert";

export type ScoreLevel = "high" | "mediumHigh" | "mediumLow" | "low";

// 검사 결과 타입
export interface TestResult {
  primaryWorkType: WorkTypeCode;
  statementScores: Record<WorkTypeCode, number>;
  verbTestSelections: Record<VerbCategory, string[]>;
}

// 점수 레벨 판정 유틸리티
export const getScoreLevel = (score: number): ScoreLevel => {
  if (score >= 80) return "high";
  if (score >= 60) return "mediumHigh";
  if (score >= 40) return "mediumLow";
  return "low";
};

export const SCORE_LEVEL_CONFIG: Record<
  ScoreLevel,
  { label: string; color: string; description: string }
> = {
  high: {
    label: "우수",
    color: "success",
    description: "해당 유형에 매우 적합",
  },
  mediumHigh: {
    label: "양호",
    color: "primary",
    description: "해당 유형에 적합",
  },
  mediumLow: {
    label: "보통",
    color: "warning",
    description: "부분적으로 적합",
  },
  low: { label: "미흡", color: "error", description: "해당 유형에 부적합" },
};

// 유형별 정적 데이터 타입
export interface WorkTypeData {
  // 기본 정보
  code: WorkTypeCode;
  name: string;
  nameEn: string;
  category: "S" | "A" | "U" | "C" | "E"; // 계열
  keywords: string[];
  shortDescription: string;
  fullDescription: string;

  // 주요 특성
  characteristics: string[];

  // 강점
  strengths: {
    title: string;
    description: string;
  }[];

  // 약점/주의사항
  weaknesses: {
    title: string;
    description: string;
  }[];

  // 동기부여 요소
  motivators: string[];

  // 스트레스 요인
  stressors: string[];

  // 업무 스타일
  workStyle: {
    title: string;
    description: string;
  }[];

  // 관리 팁
  managementTips: string[];

  // SAUCE 단계별 특성 (verbTestSelections 해석용)
  sauceStageTraits: Record<
    VerbCategory,
    {
      strength: string; // 이 단계에서의 강점
      focus: string; // 주로 집중하는 것
      approach: string; // 접근 방식
    }
  >;

  // 면접 가이드
  interview: {
    questions: {
      category: string;
      question: string;
      lookFor: string; // 이 질문에서 확인하려는 것
    }[];
    greenFlags: string[]; // 긍정 신호
    redFlags: string[]; // 주의 신호
  };

  // 성숙도별 특성
  maturityLevels: {
    developing: {
      // 발전 중 (주로 주니어)
      typical: string;
      challenges: string[];
      developmentFocus: string;
    };
    proficient: {
      // 숙련 (주로 미들)
      typical: string;
      capabilities: string[];
      nextLevel: string;
    };
    advanced: {
      // 고급 (주로 시니어)
      typical: string;
      impact: string[];
      leadershipStyle: string;
    };
  };

  // 점수 레벨별 해석 (statementScores 해석용)
  scoreInterpretation: Record<
    ScoreLevel,
    {
      summary: string;
      implications: string[];
      considerations: string[];
    }
  >;
}
