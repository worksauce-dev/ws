import { MdStar, MdStarBorder, MdEmail } from "react-icons/md";
import type { Applicant } from "@/shared/types/database.types";
import type { WorkTypeCode } from "@/features/groups/constants/workTypeKeywords";
import {
  getStatusIcon,
  getStatusLabel,
  getStatusColor,
} from "../utils/testStatusHelpers";
import {
  getWorkTypeName,
  getSecondaryWorkType,
  convertToScoreDistribution,
} from "../utils/workTypeHelpers";
import { formatDate, getScoreColorClass } from "../utils/formatHelpers";
import { calculateJobFitScore } from "../utils/analyzeTestResult";
import { EmailStatusBadge } from "@/shared/components/ui/EmailStatusBadge";

interface ApplicantCardProps {
  applicant: Applicant;
  preferredWorkTypes: WorkTypeCode[];
  onToggleStar: (applicantId: string) => void;
  onClick: (applicantId: string) => void;
  onResendEmail?: (applicantId: string) => void;
  isSelected?: boolean;
  onSelectionChange?: (applicantId: string, selected: boolean) => void;
}

export const ApplicantCard = ({
  applicant,
  preferredWorkTypes,
  onToggleStar,
  onClick,
  onResendEmail,
  isSelected = false,
  onSelectionChange,
}: ApplicantCardProps) => {
  return (
    <div
      className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
      onClick={() => onClick(applicant.id)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Header: Checkbox + Star + Name + Status */}
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            {/* Bulk Selection Checkbox */}
            {onSelectionChange && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={e => {
                  e.stopPropagation();
                  onSelectionChange(applicant.id, e.target.checked);
                }}
                className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary cursor-pointer flex-shrink-0"
              />
            )}

            <button
              onClick={e => {
                e.stopPropagation();
                onToggleStar(applicant.id);
              }}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 transition-colors duration-200 flex-shrink-0"
            >
              {applicant.is_starred ? (
                <MdStar className="w-5 h-5 text-warning" />
              ) : (
                <MdStarBorder className="w-5 h-5 text-neutral-500" />
              )}
            </button>
            <h3 className="font-semibold text-base sm:text-lg text-neutral-800 truncate">
              {applicant.name}
            </h3>
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold border flex-shrink-0 ${getStatusColor(applicant.test_status)}`}
            >
              {getStatusIcon(applicant.test_status)}
              <span>{getStatusLabel(applicant.test_status)}</span>
            </span>
            {/* 채용 상태 배지 */}
            <span
              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border flex-shrink-0 ${
                applicant.status === "pending"
                  ? "bg-neutral-50 text-neutral-600 border-neutral-200"
                  : applicant.status === "shortlisted"
                    ? "bg-info-50 text-info-700 border-info-200"
                    : applicant.status === "interview"
                      ? "bg-warning-50 text-warning-700 border-warning-200"
                      : applicant.status === "rejected"
                        ? "bg-error-50 text-error-700 border-error-200"
                        : "bg-success-50 text-success-700 border-success-200"
              }`}
            >
              {applicant.status === "pending"
                ? "검토 대기"
                : applicant.status === "shortlisted"
                  ? "서류 합격"
                  : applicant.status === "interview"
                    ? "면접 예정"
                    : applicant.status === "rejected"
                      ? "불합격"
                      : "최종 합격"}
            </span>
            {/* 이메일 발송 상태 배지 */}
            <EmailStatusBadge
              status={applicant.email_sent_status}
              className="flex-shrink-0"
              showLabel={true}
            />
          </div>

          {/* Email + Dates */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 text-sm text-neutral-600">
            <span className="truncate">{applicant.email}</span>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="hidden sm:inline">•</span>
              <span className="text-xs sm:text-sm">
                지원일: {formatDate(applicant.created_at)}
              </span>
              {applicant.test_submitted_at && (
                <>
                  <span>•</span>
                  <span className="text-xs sm:text-sm">
                    완료일: {formatDate(applicant.test_submitted_at)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Work Type + Matching Score */}
          {applicant.test_result?.statementScores && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              {/* 주/부 유형 */}
              <div className="flex items-center gap-1">
                <span className="text-sm sm:text-base font-bold text-primary">
                  {getWorkTypeName(applicant.test_result.primaryWorkType)}
                </span>
                {(() => {
                  const secondary = getSecondaryWorkType(
                    applicant.test_result.statementScores
                  );
                  return secondary ? (
                    <span className="hidden sm:inline">
                      <span className="text-neutral-400 mx-1">/</span>
                      <span className="text-sm font-medium text-neutral-600">
                        {getWorkTypeName(secondary)}
                      </span>
                    </span>
                  ) : null;
                })()}
              </div>

              <span className="hidden sm:inline text-neutral-300">|</span>

              {/* 유형 매칭도 */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-neutral-700">
                  유형 매칭도
                </span>
                <span
                  className={`text-base sm:text-lg font-bold ${getScoreColorClass(
                    Math.round(
                      calculateJobFitScore(
                        convertToScoreDistribution(
                          applicant.test_result.statementScores
                        ),
                        preferredWorkTypes
                      )
                    )
                  )}`}
                >
                  {Math.round(
                    calculateJobFitScore(
                      convertToScoreDistribution(
                        applicant.test_result.statementScores
                      ),
                      preferredWorkTypes
                    )
                  )}
                  %
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Actions */}
        {onResendEmail && (
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={e => {
                e.stopPropagation();
                onResendEmail(applicant.id);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors duration-200"
              title="이메일 재발송"
            >
              <MdEmail className="w-4 h-4" />
              <span>재발송</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
