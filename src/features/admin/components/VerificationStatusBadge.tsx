import { MdPending, MdCheckCircle, MdCancel } from "react-icons/md";
import type { BusinessVerification } from "@/features/settings/types/business.types";

interface VerificationStatusBadgeProps {
  status: BusinessVerification["status"];
}

const statusConfig = {
  pending: {
    icon: MdPending,
    label: "대기 중",
    className: "bg-yellow-100 text-yellow-700",
  },
  approved: {
    icon: MdCheckCircle,
    label: "승인",
    className: "bg-green-100 text-green-700",
  },
  rejected: {
    icon: MdCancel,
    label: "거부",
    className: "bg-red-100 text-red-700",
  },
} as const;

export const VerificationStatusBadge = ({
  status,
}: VerificationStatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${config.className}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};
