import { supabase } from "@/shared/lib/supabase";
import { type Applicant } from "../types/test";
import type { TestRawData, TestResult } from "@/shared/types/database.types";

/**
 * test_token으로 지원자 또는 팀원 정보를 조회합니다.
 * 익명 사용자도 test_token만 있으면 조회 가능 (RLS 정책 필요)
 *
 * 1. applicants 테이블에서 조회 시도
 * 2. 없으면 team_members 테이블에서 조회 시도
 */
export async function getApplicantByToken(
  testToken: string
): Promise<Applicant | null> {
  try {
    // 1. applicants 테이블에서 조회 시도
    const { data: applicant } = await supabase
      .from("applicants")
      .select("id, name, email, group_id, test_token, test_status")
      .eq("test_token", testToken)
      .maybeSingle();

    if (applicant) {
      return {
        ...applicant,
        context: "recruitment", // 채용 컨텍스트
      };
    }

    // 2. team_members 테이블에서 조회 시도
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("id, name, email, team_id, test_token, test_status")
      .eq("test_token", testToken)
      .maybeSingle();

    if (teamMember) {
      // team_members를 applicants 형식으로 변환
      return {
        id: teamMember.id,
        name: teamMember.name,
        email: teamMember.email,
        group_id: teamMember.team_id, // team_id를 group_id로 매핑
        test_token: teamMember.test_token,
        test_status: teamMember.test_status,
        context: "team", // 팀 컨텍스트
      };
    }

    // 둘 다 없으면 null 반환
    return null;
  } catch (error) {
    console.error("Get applicant by token error:", error);
    return null;
  }
}

/**
 * 지원자 또는 팀원의 이메일 열람 시간을 기록합니다.
 * applicants 테이블 업데이트 실패 시 team_members 테이블 업데이트 시도
 */
export async function updateEmailOpenedAt(
  applicantId: string
): Promise<boolean> {
  try {
    const timestamp = new Date().toISOString();
    console.log("📧 이메일 열람 시간 업데이트 시작:", { applicantId, timestamp });

    // 1. applicants 테이블 업데이트 시도
    const { data: applicantData, error: applicantError } = await supabase
      .from("applicants")
      .update({ email_opened_at: timestamp })
      .eq("id", applicantId)
      .select();

    if (!applicantError && applicantData && applicantData.length > 0) {
      console.log("✅ applicants 테이블 email_opened_at 업데이트 성공:", applicantData);
      return true;
    }

    if (applicantError) {
      console.log("⚠️ applicants 테이블 업데이트 실패, team_members 시도:", applicantError);
    } else {
      console.log("⚠️ applicants 테이블에서 해당 ID를 찾을 수 없음, team_members 시도");
    }

    // 2. team_members 테이블 업데이트 시도
    const { data: teamMemberData, error: teamMemberError } = await supabase
      .from("team_members")
      .update({ email_opened_at: timestamp })
      .eq("id", applicantId)
      .select();

    if (teamMemberError) {
      console.error("❌ team_members 테이블 email_opened_at 업데이트 실패:", teamMemberError);
      return false;
    }

    if (!teamMemberData || teamMemberData.length === 0) {
      console.error("❌ team_members 테이블에서 해당 ID를 찾을 수 없음");
      return false;
    }

    console.log("✅ team_members 테이블 email_opened_at 업데이트 성공:", teamMemberData);
    return true;
  } catch (error) {
    console.error("❌ 이메일 열람 시간 업데이트 중 예외 발생:", error);
    return false;
  }
}

/**
 * 지원자 또는 팀원의 테스트 상태를 'in_progress'로 업데이트합니다.
 * 인증 완료 후 테스트를 시작할 때 호출됩니다.
 */
export async function updateTestStatusToInProgress(
  applicantId: string
): Promise<boolean> {
  try {
    console.log("🚀 테스트 상태 업데이트 시작 (in_progress):", { applicantId });

    // 1. applicants 테이블 업데이트 시도
    const { data: applicantData, error: applicantError } = await supabase
      .from("applicants")
      .update({ test_status: "in_progress" })
      .eq("id", applicantId)
      .select();

    if (!applicantError && applicantData && applicantData.length > 0) {
      console.log("✅ applicants 테이블 test_status 업데이트 성공:", applicantData);
      return true;
    }

    if (applicantError) {
      console.log("⚠️ applicants 테이블 업데이트 실패, team_members 시도:", applicantError);
    } else {
      console.log("⚠️ applicants 테이블에서 해당 ID를 찾을 수 없음, team_members 시도");
    }

    // 2. team_members 테이블 업데이트 시도
    const { data: teamMemberData, error: teamMemberError } = await supabase
      .from("team_members")
      .update({ test_status: "in_progress" })
      .eq("id", applicantId)
      .select();

    if (teamMemberError) {
      console.error("❌ team_members 테이블 test_status 업데이트 실패:", teamMemberError);
      return false;
    }

    if (!teamMemberData || teamMemberData.length === 0) {
      console.error("❌ team_members 테이블에서 해당 ID를 찾을 수 없음");
      return false;
    }

    console.log("✅ team_members 테이블 test_status 업데이트 성공:", teamMemberData);
    return true;
  } catch (error) {
    console.error("❌ 테스트 상태 업데이트 중 예외 발생:", error);
    return false;
  }
}

/**
 * 테스트 결과를 제출하고 저장합니다.
 * applicants 또는 team_members 테이블에 결과를 저장합니다.
 */
export async function submitTestResults(
  applicantId: string,
  testRawData: TestRawData,
  testResult: TestResult
): Promise<boolean> {
  try {
    const updateData = {
      test_raw_data: testRawData,
      test_result: testResult,
      test_status: "completed",
      test_submitted_at: new Date().toISOString(),
    };

    console.log("📤 테스트 결과 제출 시작:", { applicantId, updateData });

    // 1. applicants 테이블 업데이트 시도
    const { data: applicantData, error: applicantError } = await supabase
      .from("applicants")
      .update(updateData)
      .eq("id", applicantId)
      .select();

    if (!applicantError && applicantData && applicantData.length > 0) {
      console.log("✅ applicants 테이블 업데이트 성공:", applicantData);
      return true;
    }

    if (applicantError) {
      console.log("⚠️ applicants 테이블 업데이트 실패, team_members 시도:", applicantError);
    } else {
      console.log("⚠️ applicants 테이블에서 해당 ID를 찾을 수 없음, team_members 시도");
    }

    // 2. team_members 테이블 업데이트 시도
    const { data: teamMemberData, error: teamMemberError } = await supabase
      .from("team_members")
      .update(updateData)
      .eq("id", applicantId)
      .select();

    if (teamMemberError) {
      console.error("❌ team_members 테이블 업데이트 실패:", teamMemberError);
      return false;
    }

    if (!teamMemberData || teamMemberData.length === 0) {
      console.error("❌ team_members 테이블에서 해당 ID를 찾을 수 없음");
      return false;
    }

    console.log("✅ team_members 테이블 업데이트 성공:", teamMemberData);
    return true;
  } catch (error) {
    console.error("❌ 테스트 결과 제출 중 예외 발생:", error);
    return false;
  }
}
