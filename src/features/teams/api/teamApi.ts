/**
 * 팀 관련 API 함수
 * Supabase 데이터베이스와 통신하는 레이어
 */

import { supabase } from "@/shared/lib/supabase";
import { nanoid } from "nanoid";
import type {
  Team,
  TeamMember,
  CreateTeamRequest,
  UpdateTeamRequest,
  TeamDetail,
  TeamMemberSummary,
} from "../types/team.types";
import type { TeamComposition } from "@/shared/types/database.types";
import { calculateTeamComposition } from "../utils/workTypeUtils";

/**
 * 팀 생성 API
 *
 * 플로우:
 * 1. teams 테이블에 팀 정보 INSERT
 * 2. team_members 테이블에 멤버들 일괄 INSERT (test_token 자동 생성)
 *
 * @param data 팀 생성 요청 데이터
 * @returns 생성된 팀 + 멤버 목록
 */
export const createTeam = async (data: CreateTeamRequest) => {
  // Step 1: teams 테이블에 INSERT
  const { data: newTeam, error: teamError } = await supabase
    .from("teams")
    .insert({
      user_id: data.user_id,
      name: data.name,
      description: data.description,
    })
    .select()
    .single();

  if (teamError) throw teamError;

  // Step 2: team_members 테이블에 각 멤버 INSERT
  const membersToInsert = data.members.map(member => {
    const testToken = nanoid(32);
    return {
      team_id: newTeam.id,
      name: member.name,
      email: member.email,
      test_token: testToken,
      test_status: "pending",
    };
  });

  const { data: insertedMembers, error: membersError } = await supabase
    .from("team_members")
    .insert(membersToInsert)
    .select();

  if (membersError) throw membersError;

  return {
    team: newTeam as Team,
    members: insertedMembers as TeamMember[],
  };
};

/**
 * 팀 목록 조회
 *
 * @param userId 사용자 ID
 * @returns 사용자의 모든 팀 목록
 */
export const getTeams = async (userId: string): Promise<Team[]> => {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("팀 목록 조회 실패:", error);
    throw new Error(error.message);
  }

  return (data || []) as Team[];
};

/**
 * 팀 상세 조회 (멤버 목록 포함)
 *
 * @param teamId 팀 ID
 * @returns 팀 정보 + 멤버 목록 + 팀 구성
 */
export const getTeamWithMembers = async (
  teamId: string
): Promise<TeamDetail> => {
  // 1. 팀 정보 조회
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("*")
    .eq("id", teamId)
    .single();

  if (teamError) throw teamError;

  // 2. 팀 멤버 목록 조회
  const { data: members, error: membersError } = await supabase
    .from("team_members")
    .select("id, name, email, test_status, test_result, created_at")
    .eq("team_id", teamId)
    .order("created_at", { ascending: true });

  if (membersError) throw membersError;

  // 3. 팀 구성 계산 (완료된 테스트 결과로부터)
  const membersSummary: TeamMemberSummary[] = members.map(member => ({
    id: member.id,
    name: member.name,
    email: member.email,
    test_status: member.test_status,
    test_result: member.test_result, // primary_work_type 계산을 위해 필요
    created_at: member.created_at,
  }));

  const completedMembers = members.filter(
    m => m.test_status === "completed" && m.test_result
  );

  const teamComposition: TeamComposition | null =
    completedMembers.length > 0
      ? calculateTeamComposition(completedMembers.map(m => m.test_result))
      : null;

  return {
    ...(team as Team),
    members: membersSummary,
    total_members: members.length,
    completed_tests: completedMembers.length,
    team_composition: teamComposition,
  };
};

/**
 * 팀 수정 API
 *
 * @param teamId 팀 ID
 * @param updates 수정할 필드들
 * @returns 수정된 팀 정보
 */
export const updateTeam = async (
  teamId: string,
  updates: UpdateTeamRequest
): Promise<Team> => {
  const { data, error } = await supabase
    .from("teams")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", teamId)
    .select()
    .single();

  if (error) {
    console.error("팀 수정 실패:", error);
    throw new Error(error.message);
  }

  return data as Team;
};

/**
 * 팀 삭제 API
 * CASCADE로 연결된 team_members도 자동 삭제됨
 *
 * @param teamId 팀 ID
 */
export const deleteTeam = async (teamId: string): Promise<void> => {
  const { error } = await supabase.from("teams").delete().eq("id", teamId);

  if (error) {
    console.error("팀 삭제 실패:", error);
    throw new Error(error.message);
  }
};

/**
 * 팀에 멤버 추가 API
 *
 * @param teamId 팀 ID
 * @param members 추가할 멤버 목록
 * @returns 추가된 멤버 목록
 */
export const addMembersToTeam = async (
  teamId: string,
  members: { name: string; email: string }[]
): Promise<TeamMember[]> => {
  const membersToInsert = members.map(member => {
    const testToken = nanoid(32);
    return {
      team_id: teamId,
      name: member.name,
      email: member.email,
      test_token: testToken,
      test_status: "pending",
    };
  });

  const { data, error } = await supabase
    .from("team_members")
    .insert(membersToInsert)
    .select();

  if (error) {
    console.error("팀 멤버 추가 실패:", error);
    throw new Error(error.message);
  }

  return data as TeamMember[];
};

/**
 * 팀 멤버 삭제 API
 *
 * @param memberId 팀 멤버 ID
 */
export const deleteTeamMember = async (memberId: string): Promise<void> => {
  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", memberId);

  if (error) {
    console.error("팀 멤버 삭제 실패:", error);
    throw new Error(error.message);
  }
};

/**
 * 사용자의 모든 팀을 멤버 수와 함께 조회
 * (CreateGroupPage 드롭다운용)
 *
 * @param userId 사용자 ID
 * @returns 팀 목록 with 요약 정보
 */
export const getTeamsWithComposition = async (
  userId: string
): Promise<TeamDetail[]> => {
  const teams = await getTeams(userId);
  const teamsWithDetails = await Promise.all(
    teams.map(team => getTeamWithMembers(team.id))
  );
  return teamsWithDetails;
};

/**
 * Team API 객체 (외부로 export)
 */
export const teamApi = {
  createTeam,
  getTeams,
  getTeamWithMembers,
  updateTeam,
  deleteTeam,
  addMembersToTeam,
  deleteTeamMember,
  getTeamsWithComposition,
};
