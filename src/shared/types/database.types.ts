import type { WorkTypeCode } from "@/features/groups/constants/workTypeKeywords";
import type { VerbCategory } from "@/features/sauceTest/types/verbTest.types";
import type { AnswerValue } from "@/features/sauceTest/constants/testQuestions";

export type TestStatus = "pending" | "in_progress" | "completed" | "expired";

// 지원자 채용 상태 (채용 결정 프로세스)
export type ApplicantStatus =
  | "pending" // 대기 중 (테스트 제출 후 검토 대기)
  | "shortlisted" // 서류 합격 (1차 통과)
  | "interview" // 면접 예정/진행 중
  | "rejected" // 불합격
  | "passed"; // 최종 합격

// VerbTest 원본 데이터 타입
export interface VerbTestRawData {
  selectionHistory: Record<VerbCategory, string[]>;
}

// StatementTest 원본 데이터 타입
export interface StatementTestRawData {
  answers: Array<{
    questionId: string;
    workType: WorkTypeCode;
    question: string;
    answer: AnswerValue;
  }>;
}

// 전체 테스트 원본 데이터 타입
export interface TestRawData {
  verbTest: VerbTestRawData;
  statementTest: StatementTestRawData;
}

// 계산된 테스트 결과 타입
export interface TestResult {
  primaryWorkType: WorkTypeCode;
  verbTestSelections: Record<VerbCategory, string[]>;
  statementScores: Record<WorkTypeCode, number>;
}

export interface Applicant {
  id: string;
  group_id: string;
  name: string;
  email: string;
  test_status: TestStatus; // 테스트 진행 상태
  status: ApplicantStatus; // 채용 결정 상태
  test_raw_data: TestRawData | null;
  test_result: TestResult | null;
  email_opened_at: string | null;
  test_submitted_at: string | null;
  created_at: string;
  updated_at: string;
  is_starred: boolean;
}

export interface Group {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  position: string;
  experience_level: string | null;
  preferred_work_types: WorkTypeCode[];
  deadline: string;
  auto_reminder: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}
