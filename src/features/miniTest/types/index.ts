// 테스트 단계
export type TestStep = "intro" | "verb" | "mini";

// 직무 유형 코드
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

// Verb 카테고리 (SAUCE)
export type VerbCategory =
  | "start"
  | "advance"
  | "utility"
  | "communicate"
  | "expert";

// Verb Test 질문
export interface VerbQuestion {
  question: string;
  options: VerbOption[];
}

export interface VerbOption {
  id: string;
  text: string;
  types: WorkTypeCode[];
}

// Verb Test 답변
export type VerbTestAnswers = Record<VerbCategory, string[]>;

// Mini Test 답변
export type MiniTestAnswers = Record<WorkTypeCode, number>;

// 설문 데이터 (결과 제출용)
export interface SurveyData {
  finalType: WorkTypeCode;
  verbAnswers: VerbTestAnswers;
  miniTestAnswers: MiniTestAnswers;
  timestamp: string;
}

// 타입별 점수 분포
export type TypeScores = Record<WorkTypeCode, number>;
