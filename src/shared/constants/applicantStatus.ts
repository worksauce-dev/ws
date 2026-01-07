/**
 * 지원자 상태 관련 상수
 */

import type { ApplicantStatus } from "@/shared/types/database.types";

/**
 * 지원자 상태별 한글 라벨
 */
export const STATUS_LABELS: Record<ApplicantStatus, string> = {
  pending: "검토 대기",
  shortlisted: "서류 합격",
  interview: "면접 예정",
  rejected: "불합격",
  passed: "최종 합격",
} as const;

/**
 * 지원자 상태별 뱃지 스타일
 */
export const STATUS_BADGE_STYLES: Record<ApplicantStatus, string> = {
  pending: "bg-neutral-100 text-neutral-700",
  shortlisted: "bg-info-50 text-info-700 border border-info-200",
  interview: "bg-warning-50 text-warning-700 border border-warning-200",
  rejected: "bg-error-50 text-error-700 border border-error-200",
  passed: "bg-success-50 text-success-700 border border-success-200",
} as const;

/**
 * StatusActionButton variant별 스타일
 */
export const STATUS_BUTTON_STYLES = {
  info: "border border-info text-info hover:bg-info-50",
  warning: "border border-warning text-warning hover:bg-warning-50",
  success: "bg-primary-500 text-white hover:bg-primary-600",
  error: "border border-error text-error hover:bg-error-50",
  disabled: "bg-neutral-100 text-neutral-400 cursor-not-allowed",
} as const;
