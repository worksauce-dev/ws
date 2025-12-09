import type { Applicant as ValidatorApplicant } from "../utils/applicantValidator";
import type { Applicant } from "@/shared/types/database.types";

export interface NewApplicantForm {
  name: string;
  email: string;
}

export interface UseApplicantManagerReturn {
  // State
  applicants: ValidatorApplicant[];
  newApplicant: NewApplicantForm;
  searchTerm: string;
  selectedApplicants: string[];
  filteredApplicants: ValidatorApplicant[];

  // Actions
  setNewApplicant: React.Dispatch<React.SetStateAction<NewApplicantForm>>;
  setSearchTerm: (term: string) => void;
  handleApplicantInputChange: (field: "name" | "email", value: string) => void;
  addApplicant: () => { success: boolean; error?: string };
  addApplicants: (applicants: ValidatorApplicant[]) => void;
  removeApplicant: (id: string) => void;
  handleToggleSelect: (id: string) => void;
  handleSelectAllChange: (checked: boolean) => void;
  handleDeleteSelected: () => void;
  clearApplicants: () => void;
  getSelectAllState: () => { checked: boolean; indeterminate: boolean };
}

/**
 * 지원자 관련 타입 정의
 */

// 검사 상태

export interface ApplicantSummary {
  id: string;
  name: string;
  email: string;
  test_status: "pending" | "in_progress" | "completed" | "expired";
}

// 검사 결과 타입
export interface TestResult {
  primary_type: string; // 주 유형 (예: "실행형")
  secondary_type: string | null; // 부 유형 (예: "분석형")
  scores: Record<string, number>; // 각 유형별 점수
  percentile?: number; // 백분위 점수
  strengths: string[]; // 강점
  development_areas: string[]; // 개발 영역
  work_preferences: {
    preferred_environment: string[];
    preferred_tasks: string[];
    collaboration_style: string;
  };
  fit_score?: number; // 포지션 적합도 점수 (0-100)
}

// 지원자 생성 요청 타입 (API 호출 시)
export interface CreateApplicantRequest {
  group_id: string;
  name: string;
  email: string;
}

// 지원자 생성 응답 타입
export interface CreateApplicantResponse {
  id: string;
  name: string;
  email: string;
}

// 검사 제출 요청 타입
export interface SubmitTestRequest {
  applicant_id: string;
  answers: Record<string, unknown>; // 검사 답변 데이터
}

// 검사 제출 응답 타입
export interface SubmitTestResponse {
  applicant: Applicant;
  test_result: TestResult;
}
