import { MdOpenInNew } from "react-icons/md";
import { Button } from "@/shared/components/ui/Button";
import { formatKoreanDateTime } from "@/shared/utils/formatters";
import { VerificationStatusBadge } from "./VerificationStatusBadge";
import type { BusinessVerification } from "@/features/settings/types/business.types";

interface VerificationTableRowProps {
  verification: BusinessVerification;
  onApprove: (verification: BusinessVerification) => void;
  onReject: (verification: BusinessVerification) => void;
  onViewDocument: (filePath: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

export const VerificationTableRow = ({
  verification,
  onApprove,
  onReject,
  onViewDocument,
  isApproving,
  isRejecting,
}: VerificationTableRowProps) => {
  return (
    <tr className="hover:bg-neutral-50 transition-colors">
      {/* 회사명 */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-neutral-900">
          {verification.company_name}
        </div>
        <div className="text-xs text-neutral-500">
          대표: {verification.ceo_name}
        </div>
      </td>

      {/* 사업자번호 */}
      <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-700">
        {verification.business_number}
      </td>

      {/* 담당자 */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm text-neutral-900">
          {verification.manager_name}
        </div>
        <div className="text-xs text-neutral-500">
          {verification.manager_email}
        </div>
      </td>

      {/* 상태 */}
      <td className="px-4 py-4 whitespace-nowrap">
        <VerificationStatusBadge status={verification.status} />
      </td>

      {/* 신청일 */}
      <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-700">
        {formatKoreanDateTime(verification.created_at)}
      </td>

      {/* 서류 */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex flex-col gap-1">
          {verification.business_registration_doc_url && (
            <button
              onClick={() =>
                onViewDocument(verification.business_registration_doc_url!)
              }
              className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 hover:underline"
            >
              <MdOpenInNew className="w-3 h-3" />
              사업자등록증
            </button>
          )}
          {verification.employment_certificate_url && (
            <button
              onClick={() =>
                onViewDocument(verification.employment_certificate_url!)
              }
              className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 hover:underline"
            >
              <MdOpenInNew className="w-3 h-3" />
              재직증명서
            </button>
          )}
        </div>
      </td>

      {/* 액션 */}
      <td className="px-4 py-4 whitespace-nowrap">
        {verification.status === "pending" ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onApprove(verification)}
              disabled={isApproving}
              className="bg-green-600 hover:bg-green-700 text-white text-xs"
            >
              승인
            </Button>
            <Button
              size="sm"
              onClick={() => onReject(verification)}
              disabled={isRejecting}
              className="bg-red-600 hover:bg-red-700 text-white text-xs"
            >
              거부
            </Button>
          </div>
        ) : verification.status === "rejected" &&
          verification.rejection_reason ? (
          <button
            onClick={() => {
              alert(`거부 사유:\n${verification.rejection_reason}`);
            }}
            className="text-xs text-neutral-600 hover:text-neutral-900 underline"
          >
            거부 사유 보기
          </button>
        ) : (
          <span className="text-xs text-neutral-400">-</span>
        )}
      </td>
    </tr>
  );
};
