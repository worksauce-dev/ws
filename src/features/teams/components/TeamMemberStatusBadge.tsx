/**
 * 팀원 테스트 상태 배지 컴포넌트
 * 테스트 진행 상태를 표시하는 배지
 */

import { MdCheckCircle, MdPending, MdEmail } from "react-icons/md";
import type { TeamMemberTestStatus } from "../types/team.types";

interface TeamMemberStatusBadgeProps {
  status: TeamMemberTestStatus;
}

interface StatusConfig {
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  textColor: string;
}

const STATUS_CONFIG: Record<TeamMemberTestStatus, StatusConfig> = {
  completed: {
    icon: <MdCheckCircle />,
    label: "완료",
    bgColor: "bg-success-100",
    textColor: "text-success-800",
  },
  pending: {
    icon: <MdPending />,
    label: "대기",
    bgColor: "bg-neutral-100",
    textColor: "text-neutral-800",
  },
  in_progress: {
    icon: <MdEmail />,
    label: "진행 중",
    bgColor: "bg-info-100",
    textColor: "text-info-800",
  },
  expired: {
    icon: <MdPending />,
    label: "만료",
    bgColor: "bg-error-100",
    textColor: "text-error-800",
  },
};

export const TeamMemberStatusBadge = ({ status }: TeamMemberStatusBadgeProps) => {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${config.bgColor} ${config.textColor}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};
