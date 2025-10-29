/**
 * 그룹 관련 API 함수
 * Supabase 데이터베이스와 통신하는 레이어
 */

import { supabase } from "@/shared/lib/supabase";
import type {
  Group,
  CreateGroupRequest,
  UpdateGroupRequest,
} from "../types/group.types";
import { nanoid } from "nanoid";

/**
 * 그룹 생성 API
 *
 * 플로우:
 * 1. groups 테이블에 그룹 정보 INSERT
 * 2. applicants 테이블에 지원자들 일괄 INSERT
 * 3. 각 지원자마다 고유 test_token 생성
 *
 * @param request 그룹 생성 요청 데이터
 * @returns 생성된 그룹 + 지원자 목록
 */

export const createGroup = async (data: CreateGroupRequest) => {
  // Step 1: groups 테이블에 INSERT
  const { data: newGroup, error: groupError } = await supabase
    .from("groups")
    .insert({
      user_id: data.user_id, // 로그인한 사용자 ID
      name: data.name,
      description: data.description,
      position: data.position,
      experience_level: data.experience_level,
      preferred_work_types: data.preferred_work_types,
      deadline: data.deadline,
      auto_reminder: data.auto_reminder,
      status: "active", // 기본값
    })
    .select()
    .single();

  if (groupError) throw groupError;

  // Step 2: applicants 테이블에 각 지원자 INSERT
  const applicantsToInsert = data.applicants.map(applicant => {
    const token = nanoid(32); // 고유 토큰 생성

    return {
      group_id: newGroup.id, // 방금 생성된 그룹 ID
      name: applicant.name,
      email: applicant.email,
      test_token: token,
      test_url: `${import.meta.env.VITE_APP_URL}/test/${token}`,
      test_status: "pending",
      is_starred: false,
    };
  });

  const { error: applicantsError } = await supabase
    .from("applicants")
    .insert(applicantsToInsert);

  if (applicantsError) throw applicantsError;

  // Step 3: 이메일 발송 (auto_reminder가 true인 경우)
  if (data.auto_reminder) {
    // TODO: 이메일 발송 로직
    // await sendTestInviteEmails(applicantsToInsert);
  }

  return newGroup;
};

/**
 * 그룹 목록 조회
 *
 * @returns 사용자의 모든 그룹 목록
 */
export const getGroups = async (): Promise<Group[]> => {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("그룹 목록 조회 실패:", error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * 그룹 수정
 *
 * @param groupId 그룹 ID
 * @param updates 수정할 필드들
 * @returns 수정된 그룹 정보
 */
export const updateGroup = async (
  groupId: string,
  updates: UpdateGroupRequest
): Promise<Group> => {
  const { data, error } = await supabase
    .from("groups")
    .update(updates)
    .eq("id", groupId)
    .select()
    .single();

  if (error) {
    console.error("그룹 수정 실패:", error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * 그룹 삭제
 * CASCADE 설정으로 지원자들도 함께 삭제됨
 *
 * @param groupId 그룹 ID
 */
export const deleteGroup = async (groupId: string): Promise<void> => {
  const { error } = await supabase.from("groups").delete().eq("id", groupId);

  if (error) {
    console.error("그룹 삭제 실패:", error);
    throw new Error(error.message);
  }
};

// 기본 export (객체로 묶어서 export)
export const groupApi = {
  createGroup,
  getGroups,
  updateGroup,
  deleteGroup,
};
