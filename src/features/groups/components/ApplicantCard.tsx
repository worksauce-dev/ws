import { MdStar, MdStarBorder } from "react-icons/md";
import type { ApplicantSummary } from "@/shared/types/database.types";
import type { WorkTypeCode } from "@/features/groups/constants/workTypeKeywords";
import { getStatusIcon, getStatusLabel, getStatusColor } from "../utils/testStatusHelpers";
import { getWorkTypeName, getSecondaryWorkType, convertToScoreDistribution } from "../utils/workTypeHelpers";
import { formatDate, getScoreColorClass } from "../utils/formatHelpers";
import { calculateJobFitScore } from "../utils/analyzeTestResult";

interface ApplicantCardProps {
  applicant: ApplicantSummary;
  preferredWorkTypes: WorkTypeCode[];
  onToggleStar: (applicantId: string) => void;
  onClick: (applicantId: string) => void;
}

export const ApplicantCard = ({
  applicant,
  preferredWorkTypes,
  onToggleStar,
  onClick,
}: ApplicantCardProps) => {
  return (
    <div
      className="p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
      onClick={() => onClick(applicant.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header: Star + Name + Status */}
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={e => {
                e.stopPropagation();
                onToggleStar(applicant.id);
              }}
              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded hover:bg-gray-200 transition-colors duration-200"
            >
              {applicant.is_starred ? (
                <MdStar className="w-5 h-5 sm:w-4 sm:h-4 text-warning" />
              ) : (
                <MdStarBorder className="w-5 h-5 sm:w-4 sm:h-4 text-neutral-500" />
              )}
            </button>
            <h3 className="font-semibold text-lg text-neutral-800">
              {applicant.name}
            </h3>
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold border ${getStatusColor(applicant.test_status)}`}
            >
              {getStatusIcon(applicant.test_status)}
              <span className="hidden sm:inline">
                {getStatusLabel(applicant.test_status)}
              </span>
            </span>
          </div>

          {/* Email + Dates */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-3 text-sm text-neutral-600">
            <span className="truncate">{applicant.email}</span>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">•</span>
              <span>지원일: {formatDate(applicant.created_at)}</span>
              {applicant.test_submitted_at && (
                <>
                  <span>•</span>
                  <span>완료일: {formatDate(applicant.test_submitted_at)}</span>
                </>
              )}
            </div>
          </div>

          {/* Work Type + Matching Score */}
          {applicant.test_result?.statementScores && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-3">
              {/* 주/부 유형 */}
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-primary">
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
                <span className="text-sm font-medium text-neutral-700">
                  유형 매칭도
                </span>
                <span
                  className={`text-lg font-bold ${getScoreColorClass(
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
      </div>
    </div>
  );
};
