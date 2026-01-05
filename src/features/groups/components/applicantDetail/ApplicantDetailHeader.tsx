import {
  MdEmail,
  MdCalendarToday,
  MdStar,
  MdStarBorder,
  MdTrendingUp,
  MdWork,
} from "react-icons/md";
import type {
  Applicant,
  Group,
  TestStatus,
} from "@/shared/types/database.types";
import type { WorkTypeCode } from "@/features/groups/constants/workTypeKeywords";
import type { WorkTypeData } from "@/features/groups/types/workType.types";
import WORK_TYPE_DATA from "@/features/groups/constants/workTypes";
import { getScoreColorClass } from "../../utils/formatHelpers";
import {
  getStatusIcon,
  getStatusLabel,
  getStatusColor,
} from "../../utils/testStatusHelpers";

interface ApplicantDetailHeaderProps {
  applicant: Applicant;
  group: Group;
  workTypeData: WorkTypeData;
  matchScore: number;
  positionLabel: string;
  isStarred: boolean;
  onToggleStar: () => void;
}

export const ApplicantDetailHeader = ({
  applicant,
  group,
  workTypeData,
  matchScore,
  positionLabel,
  isStarred,
  onToggleStar,
}: ApplicantDetailHeaderProps) => {
  const getStatusBadge = (status: TestStatus) => {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(status)}`}
      >
        {getStatusIcon(status)}
        {getStatusLabel(status)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-8">
      {/* 기본 정보 */}
      <div className="flex items-center gap-2 sm:gap-3 mb-3 flex-wrap">
        <h2 className="text-xl sm:text-3xl font-bold text-neutral-800">
          {applicant.name}
        </h2>
        <button
          onClick={onToggleStar}
          className="p-1 rounded hover:bg-gray-200 transition-colors duration-200 no-pdf"
          aria-label={isStarred ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        >
          {isStarred ? (
            <MdStar className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
          ) : (
            <MdStarBorder className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-500" />
          )}
        </button>
        {getStatusBadge(applicant.test_status)}
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-sm sm:text-base text-neutral-600 mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <MdEmail className="w-4 h-4" />
          <span className="truncate">{applicant.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <MdCalendarToday className="w-4 h-4" />
          <span className="text-xs sm:text-base">
            {applicant.test_submitted_at
              ? `검사 완료일: ${new Date(applicant.test_submitted_at).toLocaleDateString()}`
              : `지원일: ${new Date(applicant.created_at).toLocaleDateString()}`}
          </span>
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-neutral-200 mb-4 sm:mb-6"></div>

      {/* 유형 정보 */}
      <div className="mb-4 sm:mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
          <span className="text-lg sm:text-2xl font-bold text-primary">
            {workTypeData.name}
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 sm:px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary text-xs sm:text-sm font-medium">
              {workTypeData.keywords.join(" · ")}
            </span>
            {matchScore >= 90 && (
              <span className="px-2 sm:px-3 py-1 rounded-full bg-success-100 text-success text-xs sm:text-sm font-semibold">
                높은 매칭도
              </span>
            )}
          </div>
        </div>
        <p className="text-neutral-700 text-sm sm:text-base leading-relaxed">
          {workTypeData.shortDescription}
        </p>
      </div>

      {/* 매칭도 & 포지션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
        {/* 유형 매칭도 */}
        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-primary-50 to-info-50 rounded-lg border border-primary-100">
          <MdTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-1">
              유형 매칭도
            </p>
            <div className="flex items-baseline gap-1 sm:gap-2 mb-1 sm:mb-2">
              <span
                className={`text-xl sm:text-3xl font-bold ${getScoreColorClass(matchScore)}`}
                aria-label={`유형 매칭도 ${matchScore}퍼센트`}
              >
                {matchScore}%
              </span>
              <span className="text-xs sm:text-sm text-neutral-600">
                {matchScore >= 90
                  ? "매우 일치"
                  : matchScore >= 70
                    ? "일치"
                    : "보통"}
              </span>
            </div>
            <p className="text-xs text-neutral-500 truncate">
              선호 유형:{" "}
              {group.preferred_work_types
                .map((code: WorkTypeCode) => WORK_TYPE_DATA[code].name)
                .join(", ")}
            </p>
          </div>
        </div>

        {/* 모집 포지션 */}
        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <MdWork className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-1">
              모집 포지션
            </p>
            <p className="text-base sm:text-lg font-bold text-neutral-800 truncate">
              {positionLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
