import { VerificationTableRow } from "./VerificationTableRow";
import type { BusinessVerification } from "@/features/settings/types/business.types";

interface VerificationTableProps {
  verifications: BusinessVerification[];
  onApprove: (verification: BusinessVerification) => void;
  onReject: (verification: BusinessVerification) => void;
  onViewDocument: (filePath: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

const TABLE_HEADERS = [
  "회사명",
  "사업자번호",
  "담당자",
  "상태",
  "신청일",
  "서류",
  "액션",
] as const;

export const VerificationTable = ({
  verifications,
  onApprove,
  onReject,
  onViewDocument,
  isApproving,
  isRejecting,
}: VerificationTableProps) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              {TABLE_HEADERS.map(header => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {verifications.length === 0 ? (
              <tr>
                <td
                  colSpan={TABLE_HEADERS.length}
                  className="px-4 py-8 text-center text-neutral-500"
                >
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              verifications.map(verification => (
                <VerificationTableRow
                  key={verification.id}
                  verification={verification}
                  onApprove={onApprove}
                  onReject={onReject}
                  onViewDocument={onViewDocument}
                  isApproving={isApproving}
                  isRejecting={isRejecting}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
