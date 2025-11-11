// types/workType.ts

/** 대분류 (SAUCE) */
export type WorkGroup = "S" | "A" | "U" | "C" | "E";

/** 세부 타입 코드 */
export type WorkTypeCode =
  | "SE"
  | "SA" // S계열
  | "AS"
  | "AF" // A계열
  | "UM"
  | "UR" // U계열
  | "CA"
  | "CH" // C계열
  | "EE"
  | "EG"; // E계열

/** 동사 카테고리 (SAUCE 단계) */
export type VerbCategory =
  | "start"
  | "advance"
  | "utility"
  | "communicate"
  | "expert";

/** WorkType 메타데이터 */
export interface WorkTypeInfo {
  code: WorkTypeCode;
  name: string; // 한글 이름
  group: WorkGroup; // 대분류
  pair: WorkTypeCode; // 페어 타입
  description?: string; // 부가 설명 (선택)
}

/** 동사 */
export interface Verb {
  id: string;
  text: string;
  workType: WorkTypeCode;
  category: VerbCategory;
  keywords?: string[]; // 강점 키워드 (MVP 후 추가)
}

export interface VerbTestQuestion {
  id: number;
  phase: VerbCategory;
  context: string;
  instruction: string;
  selectCount: number;
  verbs: Verb[];
}
