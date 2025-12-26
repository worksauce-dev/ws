import type { ApplicantSummary } from "./applicant.types";
import type { TeamComposition } from "@/shared/types/database.types";

export interface GroupFormData {
  name: string;
  description: string;
  position: string;
  experienceLevel: string;
  preferredWorkTypes: string[];
  deadline: string;
  autoReminder: string;
}

export interface UseGroupFormReturn {
  // State
  formData: GroupFormData;

  // Actions
  handleInputChange: (field: string, value: string) => void;
  handleWorkTypeChange: (type: string, checked: boolean) => void;
  validateForm: (applicantsCount: number) => {
    isValid: boolean;
    error?: string;
  };
  resetForm: () => void;
}

export interface PositionOption {
  value: string;
  label: string;
}

export interface UseCustomPositionReturn {
  customPositionList: PositionOption[];
  customPosition: string;
  isCustomPositionModalOpen: boolean;
  setCustomPosition: (value: string) => void;
  openModal: () => void;
  closeModal: () => void;
  addCustomPosition: (position: string) => void;
  handlePositionSelection: (value: string, onSelect: (value: string) => void) => void;
  addPositionWithValidation: (position: string, onSelect: (value: string) => void) => boolean;
}

/**
 * 그룹 관련 타입 정의
 */

// 그룹 상태
export type GroupStatus = "active" | "completed" | "draft";

// 데이터베이스 그룹 타입 (Supabase에서 반환되는 타입)
export interface Group {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  position: string;
  experience_level: string | null;
  preferred_work_types: string[];
  deadline: string; // ISO 8601 timestamp
  auto_reminder: boolean;
  status: GroupStatus;
  created_at: string;
  updated_at: string;
  applicants: ApplicantSummary[];
}

// 그룹 생성 요청 타입 (API 호출 시 사용)
export interface CreateGroupRequest {
  user_id: string;
  name: string;
  description: string;
  position: string;
  experience_level: string;
  preferred_work_types: string[];
  deadline: string;
  auto_reminder: boolean;
  status?: GroupStatus; // 선택적 필드 (기본값: 'active')
  current_team_composition?: TeamComposition | null; // 현재 팀 구성 (선택 사항)
  applicants: {
    name: string;
    email: string;
  }[];
}

// 그룹 생성 응답 타입
export interface CreateGroupResponse {
  group: Group;
  applicants: Array<{
    id: string;
    name: string;
    email: string;
    test_token: string;
  }>;
}

// 그룹 통계 타입
export interface GroupStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  completion_rate: number;
}

// 지원자 정보를 포함한 그룹 타입 (상세 조회용)
// export interface GroupWithApplicants extends Group {
//   applicants: Array<{
//     id: string;
//     name: string;
//     email: string;
//     test_status: string;
//     test_result: unknown | null;
//   }>;
//   stats: GroupStats;
// }

// 그룹 수정 요청 타입
export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  deadline?: string;
  auto_reminder?: boolean;
  status?: GroupStatus;
}
