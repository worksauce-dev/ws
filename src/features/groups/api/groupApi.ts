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
import { sendSauceTestEmail } from "@/shared/services/sauceTestService";

/**
 * 그룹 생성 API
 *
 * 플로우:
 * 1. groups 테이블에 그룹 정보 INSERT
 * 2. applicants 테이블에 지원자들 일괄 INSERT
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
      status: data.status || "active", // 기본값
      current_team_composition: data.current_team_composition, // 현재 팀 구성 (선택 사항)
      applicants: data.applicants, // JSONB 필드에 지원자 배열 저장
    })
    .select()
    .single();

  if (groupError) throw groupError;

  // Step 2: applicants 테이블에 각 지원자 INSERT
  const applicantsToInsert = data.applicants.map(applicant => ({
    group_id: newGroup.id, // 방금 생성된 그룹 ID
    name: applicant.name,
    email: applicant.email,
    test_status: "pending",
    is_starred: false,
  }));

  const { data: insertedApplicants, error: applicantsError } = await supabase
    .from("applicants")
    .insert(applicantsToInsert)
    .select("id, name, email, test_token, test_status");

  if (applicantsError) throw applicantsError;

  return {
    group: newGroup,
    applicants: insertedApplicants || [],
  };
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
 * 그룹 상세 조회 (지원자 목록 포함)
 *
 * @param groupId 그룹 ID
 * @returns 그룹 정보 + 지원자 목록
 */
export const getGroupWithApplicants = async (groupId: string) => {
  // 1. 그룹 정보 조회
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();

  if (groupError) {
    console.error("그룹 조회 실패:", groupError);
    throw new Error(groupError.message);
  }

  // 2. 해당 그룹의 지원자 목록 조회
  const { data: applicants, error: applicantsError } = await supabase
    .from("applicants")
    .select("*")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });

  if (applicantsError) {
    console.error("지원자 조회 실패:", applicantsError);
    throw new Error(applicantsError.message);
  }

  return {
    group,
    applicants: applicants || [],
  };
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

/**
 * 그룹에 지원자 추가
 *
 * 플로우:
 * 1. 그룹 정보 조회 (deadline 확인)
 * 2. 현재 사용자 정보 조회 (이메일 발송에 필요)
 * 3. 기존 지원자 이메일 조회 (중복 체크)
 * 4. 중복되지 않은 지원자만 필터링
 * 5. applicants 테이블에 일괄 INSERT
 * 6. 각 지원자에게 테스트 이메일 발송
 *
 * @param groupId 그룹 ID
 * @param applicants 추가할 지원자 목록 (이름, 이메일)
 * @param userName 이메일 발송자명 (옵션, 미제공 시 "담당자")
 * @returns 추가된 지원자 수 및 중복 수
 */
export const addApplicantsToGroup = async (
  groupId: string,
  applicants: Array<{ name: string; email: string }>,
  userName?: string
): Promise<{
  added: number;
  duplicates: number;
  emailsSent?: number;
  emailsFailed?: number;
}> => {
  console.log("🔵 [addApplicantsToGroup] 시작:", { groupId, applicants });

  // Step 1: 그룹 정보 조회
  console.log("📋 [Step 1] 그룹 정보 조회 중...");
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("deadline, name")
    .eq("id", groupId)
    .single();

  if (groupError) {
    console.error("❌ 그룹 조회 실패:", groupError);
    throw new Error(groupError.message);
  }
  console.log("✅ [Step 1] 그룹 정보:", group);

  // Step 2: 이메일 발송자명 결정
  console.log("👤 [Step 2] 이메일 발송자명 결정 중...");
  let finalUserName = userName || "담당자";

  // userName이 제공되지 않은 경우, 사용자 정보에서 가져오기
  if (!userName) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!userError && user) {
      finalUserName = (user.user_metadata?.name as string) || "담당자";
    }
  }

  console.log("✅ [Step 2] 이메일 발송자명:", finalUserName);

  // Step 3: 기존 지원자 이메일 조회
  console.log("📧 [Step 3] 기존 지원자 조회 중...");
  const { data: existingApplicants, error: fetchError } = await supabase
    .from("applicants")
    .select("email")
    .eq("group_id", groupId);

  if (fetchError) {
    console.error("❌ 기존 지원자 조회 실패:", fetchError);
    throw new Error(fetchError.message);
  }
  console.log("✅ [Step 3] 기존 지원자 수:", existingApplicants?.length || 0);
  console.log(
    "📧 [Step 3] 기존 지원자 이메일:",
    existingApplicants?.map(a => a.email) || []
  );

  // Step 4: 중복 이메일 필터링
  console.log("🔍 [Step 4] 중복 체크 중...");
  console.log(
    "📥 [Step 4] 추가하려는 이메일:",
    applicants.map(a => a.email)
  );

  const existingEmails = new Set(
    (existingApplicants || []).map(a => a.email.toLowerCase())
  );

  const newApplicants = applicants.filter(
    a => !existingEmails.has(a.email.toLowerCase())
  );

  console.log(
    `✅ [Step 4] 필터링 결과: 신규 ${newApplicants.length}명, 중복 ${applicants.length - newApplicants.length}명`
  );

  if (applicants.length - newApplicants.length > 0) {
    console.warn(
      "⚠️ [Step 4] 중복된 이메일:",
      applicants
        .filter(a => existingEmails.has(a.email.toLowerCase()))
        .map(a => a.email)
    );
  }

  if (newApplicants.length === 0) {
    console.error("❌ [Step 4] 추가할 지원자 없음 - 모두 중복");
    throw new Error("모든 지원자가 이미 등록되어 있습니다.");
  }

  // Step 5: 새로운 지원자 INSERT (ID 받아오기)
  console.log("💾 [Step 5] 데이터베이스에 삽입 중...");
  const applicantsToInsert = newApplicants.map(applicant => ({
    group_id: groupId,
    name: applicant.name,
    email: applicant.email,
    test_status: "pending" as const,
    is_starred: false,
  }));

  const { data: insertedApplicants, error: insertError } = await supabase
    .from("applicants")
    .insert(applicantsToInsert)
    .select("id, name, email");

  if (insertError) {
    console.error("❌ 지원자 추가 실패:", insertError);
    throw new Error(insertError.message);
  }

  console.log(
    "✅ [Step 5] 데이터베이스 삽입 완료:",
    insertedApplicants?.length || 0,
    "명"
  );

  // Step 5.5: groups 테이블의 applicants JSONB 필드 업데이트
  console.log("📝 [Step 5.5] groups.applicants JSONB 필드 업데이트 중...");

  // 현재 그룹의 applicants 배열 조회
  const { data: currentGroupData, error: fetchGroupError } = await supabase
    .from("groups")
    .select("applicants")
    .eq("id", groupId)
    .single();

  if (fetchGroupError) {
    console.error("❌ 그룹 applicants 필드 조회 실패:", fetchGroupError);
    throw new Error(fetchGroupError.message);
  }

  // 기존 applicants 배열에 새 지원자 추가
  const currentApplicants = (currentGroupData?.applicants || []) as Array<{
    name: string;
    email: string;
  }>;

  const newApplicantsData = newApplicants.map(a => ({
    name: a.name,
    email: a.email,
  }));

  const updatedApplicants = [...currentApplicants, ...newApplicantsData];

  // groups 테이블 업데이트
  const { error: updateGroupError } = await supabase
    .from("groups")
    .update({ applicants: updatedApplicants })
    .eq("id", groupId);

  if (updateGroupError) {
    console.error("❌ 그룹 applicants 필드 업데이트 실패:", updateGroupError);
    throw new Error(updateGroupError.message);
  }

  console.log(
    `✅ [Step 5.5] groups.applicants 업데이트 완료: ${currentApplicants.length}명 → ${updatedApplicants.length}명`
  );

  // Step 6: 각 지원자에게 이메일 발송
  console.log("📧 [Step 6] 이메일 발송 시작...");
  const emailPromises = (insertedApplicants || []).map(async applicant => {
    try {
      const result = await sendSauceTestEmail({
        applicantEmail: applicant.email,
        userName: finalUserName,
        applicantName: applicant.name,
        testId: applicant.id,
        dashboardId: groupId,
        deadline: group.deadline,
      });

      if (!result.success) {
        console.error(
          `이메일 발송 실패 (${applicant.email}):`,
          result.error
        );
      } else {
        console.log(`이메일 발송 성공: ${applicant.email}`);
      }

      return result;
    } catch (error) {
      console.error(`이메일 발송 오류 (${applicant.email}):`, error);
      return { success: false, error: String(error) };
    }
  });

  // 모든 이메일 발송 완료 대기 (실패해도 지원자 추가는 성공)
  const emailResults = await Promise.allSettled(emailPromises);

  // 이메일 발송 성공 카운트
  const emailsSent = emailResults.filter(
    result => result.status === "fulfilled" && result.value.success
  ).length;

  console.log(
    `✅ [Step 6] 이메일 발송 완료: ${emailsSent}/${newApplicants.length}건 성공`
  );

  const finalResult = {
    added: newApplicants.length,
    duplicates: applicants.length - newApplicants.length,
    emailsSent,
    emailsFailed: newApplicants.length - emailsSent,
  };

  console.log("🎉 [addApplicantsToGroup] 최종 결과:", finalResult);

  return finalResult;
};

/**
 * 지원자 채용 상태 업데이트
 *
 * @param applicantId 지원자 ID
 * @param status 새로운 채용 상태
 * @returns 업데이트된 지원자 정보
 */
export const updateApplicantStatus = async (
  applicantId: string,
  status: "pending" | "shortlisted" | "interview" | "rejected" | "passed"
) => {
  const { data, error } = await supabase
    .from("applicants")
    .update({ status })
    .eq("id", applicantId)
    .select()
    .single();

  if (error) {
    console.error("지원자 상태 업데이트 실패:", error);
    throw new Error(error.message);
  }

  return data;
};

// 기본 export (객체로 묶어서 export)
export const groupApi = {
  createGroup,
  getGroups,
  getGroupWithApplicants,
  updateGroup,
  deleteGroup,
  addApplicantsToGroup,
  updateApplicantStatus,
};
