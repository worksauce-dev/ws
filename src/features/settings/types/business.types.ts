/**
 * 기업 인증 요청 상태
 */
export type BusinessVerificationStatus = "pending" | "approved" | "rejected";

/**
 * 기업 인증 요청 데이터베이스 레코드
 */
export interface BusinessVerification {
  id: string;
  user_id: string;
  company_name: string;
  business_number: string;
  ceo_name: string;
  manager_name: string;
  manager_email: string;
  business_registration_doc_url: string | null;
  employment_certificate_url: string | null;
  status: BusinessVerificationStatus;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  verified_at: string | null;
}

/**
 * 기업 인증 신청 폼 데이터
 */
export interface BusinessVerificationFormData {
  company_name: string;
  business_number: string;
  ceo_name: string;
  manager_name: string;
  manager_email: string;
  business_registration_doc: File | null;
  employment_certificate: File | null;
}

/**
 * 기업 인증 신청 요청 페이로드
 */
export interface CreateBusinessVerificationPayload {
  company_name: string;
  business_number: string;
  ceo_name: string;
  manager_name: string;
  manager_email: string;
  business_registration_doc_url: string;
  employment_certificate_url: string;
}
