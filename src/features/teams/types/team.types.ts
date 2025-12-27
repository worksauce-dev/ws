import type { TeamComposition, TestResult, TestRawData } from "@/shared/types/database.types";
import type { WorkTypeCode } from "@/features/groups/types/workType.types";

/**
 * 팀 멤버 테스트 상태
 */
export type TeamMemberTestStatus = "pending" | "in_progress" | "completed" | "expired";

/**
 * 팀 멤버 (team_members 테이블)
 * applicants 테이블과 동일한 구조 유지
 */
export interface TeamMember {
  id: string;
  team_id: string;
  name: string;
  email: string;
  test_token: string;
  test_status: TeamMemberTestStatus;
  test_result: TestResult | null;
  test_raw_data?: TestRawData;
  test_submitted_at?: string;
  email_opened_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * 팀 멤버 요약 정보 (목록 표시용)
 * primary_work_type은 test_result에서 계산하여 사용
 */
export interface TeamMemberSummary {
  id: string;
  name: string;
  email: string;
  test_status: TeamMemberTestStatus;
  test_result: TestResult | null; // primary_work_type 계산을 위해 필요
  created_at: string;
}

/**
 * 팀 (teams 테이블)
 */
export interface Team {
  id: string;
  user_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

/**
 * 팀 상세 정보 (멤버 목록 포함)
 */
export interface TeamDetail extends Team {
  members: TeamMemberSummary[];
  total_members: number;
  completed_tests: number;
  team_composition: TeamComposition | null; // 완료된 테스트 결과로부터 계산
}

/**
 * 팀 생성 폼 데이터
 */
export interface TeamFormData {
  name: string;
  description: string;
  members: {
    name: string;
    email: string;
  }[];
}

/**
 * 팀 생성 요청 (API)
 */
export interface CreateTeamRequest {
  user_id: string;
  name: string;
  description: string;
  members: {
    name: string;
    email: string;
  }[];
}

/**
 * 팀 생성 응답 (API)
 */
export interface CreateTeamResponse {
  team: Team;
  members: TeamMember[];
}

/**
 * 팀 수정 요청 (API)
 */
export interface UpdateTeamRequest {
  name?: string;
  description?: string;
}

/**
 * 팀 선택 옵션 (CreateGroupPage 드롭다운용)
 */
export interface TeamSelectOption {
  value: string; // team_id
  label: string; // team_name
  composition: TeamComposition | null;
  memberCount: number;
  completedTests: number;
}
