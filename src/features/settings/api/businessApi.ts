import { supabase } from "@/shared/lib/supabase";
import type {
  BusinessVerification,
  CreateBusinessVerificationPayload,
} from "../types/business.types";

/**
 * 파일을 Supabase Storage에 업로드
 * @param file - 업로드할 파일
 * @param userId - 사용자 ID
 * @param fileType - 파일 타입 (business_registration 또는 employment_certificate)
 * @returns 업로드된 파일 경로 (private bucket에 저장)
 */
export async function uploadBusinessDocument(
  file: File,
  userId: string,
  fileType: "business_registration" | "employment_certificate"
): Promise<{ url: string | null; error: string | null }> {
  try {
    // 파일 확장자 추출
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${fileType}_${Date.now()}.${fileExt}`;

    // Supabase Storage에 업로드 (private bucket)
    const { data, error } = await supabase.storage
      .from("business-documents")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("File upload error:", error);
      return {
        url: null,
        error: "파일 업로드에 실패했습니다.",
      };
    }

    // 파일 경로만 반환 (signed URL은 조회 시 생성)
    return {
      url: data.path,
      error: null,
    };
  } catch (err) {
    console.error("Upload error:", err);
    return {
      url: null,
      error: "파일 업로드 중 오류가 발생했습니다.",
    };
  }
}

/**
 * 파일 경로에서 Signed URL 생성
 * @param filePath - 파일 경로
 * @param expiresIn - 유효 시간 (초 단위, 기본 1시간)
 * @returns Signed URL
 */
export async function getSignedUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<{ url: string | null; error: string | null }> {
  try {
    const { data, error } = await supabase.storage
      .from("business-documents")
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error("Create signed URL error:", error);
      return {
        url: null,
        error: "파일 접근 링크 생성에 실패했습니다.",
      };
    }

    return {
      url: data.signedUrl,
      error: null,
    };
  } catch (err) {
    console.error("Signed URL error:", err);
    return {
      url: null,
      error: "파일 접근 링크 생성 중 오류가 발생했습니다.",
    };
  }
}

/**
 * 기업 인증 신청 생성
 * @param payload - 기업 인증 신청 데이터
 * @returns 생성된 기업 인증 요청
 */
export async function createBusinessVerification(
  payload: CreateBusinessVerificationPayload
): Promise<{
  data: BusinessVerification | null;
  error: string | null;
}> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        data: null,
        error: "로그인이 필요합니다.",
      };
    }

    // 기업 인증 요청 생성
    const { data, error } = await supabase
      .from("business_verifications")
      .insert({
        user_id: user.id,
        company_name: payload.company_name,
        business_number: payload.business_number,
        ceo_name: payload.ceo_name,
        manager_name: payload.manager_name,
        manager_email: payload.manager_email,
        business_registration_doc_url: payload.business_registration_doc_url,
        employment_certificate_url: payload.employment_certificate_url,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Create verification error:", error);

      // 중복 신청 감지
      if (error.code === "23505") {
        return {
          data: null,
          error: "이미 처리 중인 인증 신청이 있습니다.",
        };
      }

      return {
        data: null,
        error: "기업 인증 신청에 실패했습니다.",
      };
    }

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error("Verification error:", err);
    return {
      data: null,
      error: "기업 인증 신청 중 오류가 발생했습니다.",
    };
  }
}

/**
 * 현재 사용자의 기업 인증 상태 조회
 * @returns 기업 인증 요청 목록
 */
export async function getBusinessVerifications(): Promise<{
  data: BusinessVerification[] | null;
  error: string | null;
}> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        data: null,
        error: "로그인이 필요합니다.",
      };
    }

    const { data, error } = await supabase
      .from("business_verifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch verifications error:", error);
      return {
        data: null,
        error: "기업 인증 상태를 불러오는데 실패했습니다.",
      };
    }

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error("Fetch error:", err);
    return {
      data: null,
      error: "기업 인증 상태를 불러오는 중 오류가 발생했습니다.",
    };
  }
}

/**
 * 사용자의 최신 기업 인증 상태 조회
 * @returns 가장 최근 기업 인증 요청
 */
export async function getLatestBusinessVerification(): Promise<{
  data: BusinessVerification | null;
  error: string | null;
}> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        data: null,
        error: "로그인이 필요합니다.",
      };
    }

    const { data, error } = await supabase
      .from("business_verifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Fetch latest verification error:", error);
      return {
        data: null,
        error: "기업 인증 상태를 불러오는데 실패했습니다.",
      };
    }

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error("Fetch error:", err);
    return {
      data: null,
      error: "기업 인증 상태를 불러오는 중 오류가 발생했습니다.",
    };
  }
}

// ============================================
// 관리자용 API 함수
// ============================================

/**
 * [관리자] 모든 기업 인증 신청 조회
 * @returns 모든 기업 인증 요청 목록
 */
export async function getAllBusinessVerifications(): Promise<{
  data: BusinessVerification[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from("business_verifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch all verifications error:", error);
      return {
        data: null,
        error: "기업 인증 목록을 불러오는데 실패했습니다.",
      };
    }

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error("Fetch error:", err);
    return {
      data: null,
      error: "기업 인증 목록을 불러오는 중 오류가 발생했습니다.",
    };
  }
}

/**
 * [관리자] 기업 인증 승인
 * @param verificationId - 승인할 인증 요청 ID
 * @returns 업데이트된 기업 인증 요청
 */
export async function approveBusinessVerification(
  verificationId: string
): Promise<{
  data: BusinessVerification | null;
  error: string | null;
}> {
  try {
    // 1. 기업 인증 요청 승인 처리
    const { data, error } = await supabase
      .from("business_verifications")
      .update({
        status: "approved",
        verified_at: new Date().toISOString(),
        rejection_reason: null,
      })
      .eq("id", verificationId)
      .select()
      .single();

    if (error) {
      console.error("Approve verification error:", error);
      return {
        data: null,
        error: "기업 인증 승인에 실패했습니다.",
      };
    }

    // 2. user_profiles 테이블 업데이트 (business_verified, business_name)
    const { error: profileError } = await supabase
      .from("user_profile")
      .update({
        business_verified: true,
        business_name: data.company_name,
      })
      .eq("id", data.user_id);

    if (profileError) {
      console.error("Update user profile error:", profileError);
      // user_profile 업데이트 실패 시 경고만 로그하고 계속 진행
      // (business_verifications 테이블은 이미 승인 상태로 업데이트됨)
      console.warn("기업 인증은 승인되었으나 프로필 업데이트에 실패했습니다.");
    }

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error("Approve error:", err);
    return {
      data: null,
      error: "기업 인증 승인 중 오류가 발생했습니다.",
    };
  }
}

/**
 * [관리자] 기업 인증 거부
 * @param verificationId - 거부할 인증 요청 ID
 * @param rejectionReason - 거부 사유
 * @returns 업데이트된 기업 인증 요청
 */
export async function rejectBusinessVerification(
  verificationId: string,
  rejectionReason: string
): Promise<{
  data: BusinessVerification | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from("business_verifications")
      .update({
        status: "rejected",
        rejection_reason: rejectionReason,
      })
      .eq("id", verificationId)
      .select()
      .single();

    if (error) {
      console.error("Reject verification error:", error);
      return {
        data: null,
        error: "기업 인증 거부에 실패했습니다.",
      };
    }

    return {
      data,
      error: null,
    };
  } catch (err) {
    console.error("Reject error:", err);
    return {
      data: null,
      error: "기업 인증 거부 중 오류가 발생했습니다.",
    };
  }
}
