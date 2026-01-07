/**
 * 지원자 상태 변경 버튼 컴포넌트
 */

import { STATUS_BUTTON_STYLES } from "@/shared/constants/applicantStatus";
import type { ApplicantStatus } from "@/shared/types/database.types";

interface StatusActionButtonProps {
  status: ApplicantStatus;
  label: string;
  currentStatus: ApplicantStatus;
  isUpdating: boolean;
  onClick: () => void;
  variant: "info" | "warning" | "success" | "error";
}

export const StatusActionButton = ({
  status,
  label,
  currentStatus,
  isUpdating,
  onClick,
  variant,
}: StatusActionButtonProps) => {
  const isDisabled = currentStatus === status || isUpdating;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        isDisabled ? STATUS_BUTTON_STYLES.disabled : STATUS_BUTTON_STYLES[variant]
      }`}
    >
      {isUpdating ? "처리 중..." : label}
    </button>
  );
};
