/**
 * 이메일 발송 상태 배지 컴포넌트
 * pending, sent, failed 상태를 시각적으로 표시
 */

import { MdCheckCircle, MdError, MdHourglassEmpty } from "react-icons/md";
import type { EmailSentStatus } from "@/shared/types/database.types";

interface EmailStatusBadgeProps {
  status: EmailSentStatus;
  className?: string;
  showLabel?: boolean; // 텍스트 레이블 표시 여부
}

const statusConfig: Record<
  EmailSentStatus,
  {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    bgColor: string;
    textColor: string;
    iconColor: string;
  }
> = {
  pending: {
    icon: MdHourglassEmpty,
    label: "발송 대기",
    bgColor: "bg-neutral-100",
    textColor: "text-neutral-700",
    iconColor: "text-neutral-500",
  },
  sent: {
    icon: MdCheckCircle,
    label: "발송 완료",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    iconColor: "text-green-600",
  },
  failed: {
    icon: MdError,
    label: "발송 실패",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    iconColor: "text-red-600",
  },
};

export const EmailStatusBadge: React.FC<EmailStatusBadgeProps> = ({
  status,
  className = "",
  showLabel = true,
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}
    >
      <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};

/**
 * 이메일 발송 상태 아이콘만 표시하는 컴포넌트
 * 툴팁이나 작은 공간에서 사용
 */
export const EmailStatusIcon: React.FC<{
  status: EmailSentStatus;
  className?: string;
}> = ({ status, className = "" }) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex ${className}`} title={config.label}>
      <Icon className={`w-4 h-4 ${config.iconColor}`} />
    </span>
  );
};
