import {
  MdEmail,
  MdCalendarToday,
  MdStar,
  MdStarBorder,
  MdTrendingUp,
  MdWork,
} from "react-icons/md";
import type { ApplicantSummary, Group } from "@/shared/types/database.types";
import type { WorkTypeCode } from "@/features/groups/constants/workTypeKeywords";
import type { WorkTypeDefinition } from "@/features/groups/constants/workTypeDefinitions.types";
import WORK_TYPE_DATA from "@/features/groups/constants/workTypes";
import { getScoreColorClass } from "../../utils/formatHelpers";
import { getStatusIcon, getStatusLabel, getStatusColor } from "../../utils/testStatusHelpers";

interface ApplicantDetailHeaderProps {
  applicant: ApplicantSummary;
  group: Group;
  workTypeData: WorkTypeDefinition;
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
  const getStatusBadge = (status: string) => {
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status as any)}`}
      >
        {getStatusIcon(status as any)}
        {getStatusLabel(status as any)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-8">
      {/* 기본 정보 */}
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-3xl font-bold text-neutral-800">
          {applicant.name}
        </h2>
        <button
          onClick={onToggleStar}
          className="p-1 rounded hover:bg-gray-200 transition-colors duration-200 no-pdf"
          aria-label={isStarred ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        >
          {isStarred ? (
            <MdStar className="w-6 h-6 text-warning" />
          ) : (
            <MdStarBorder className="w-6 h-6 text-neutral-500" />
          )}
        </button>
        {getStatusBadge(applicant.test_status)}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-neutral-600 mb-6">
        <div className="flex items-center gap-2">
          <MdEmail className="w-4 h-4" />
          <span>{applicant.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <MdCalendarToday className="w-4 h-4" />
          <span>
            {applicant.test_submitted_at
              ? `검사 완료일: ${new Date(applicant.test_submitted_at).toLocaleDateString()}`
              : `지원일: ${new Date(applicant.created_at).toLocaleDateString()}`}
          </span>
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-neutral-200 mb-6"></div>

      {/* 유형 정보 */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-2xl font-bold text-primary">
            {workTypeData.name}
          </span>
          <span className="px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary text-sm font-medium">
            {workTypeData.keywords.join(" · ")}
          </span>
          {matchScore >= 90 && (
            <span className="px-3 py-1 rounded-full bg-success-100 text-success text-sm font-semibold">
              높은 매칭도
            </span>
          )}
        </div>
        <p className="text-neutral-700 text-base leading-relaxed">
          {workTypeData.shortDescription}
        </p>
      </div>

      {/* 매칭도 & 포지션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* 유형 매칭도 */}
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary-50 to-info-50 rounded-lg border border-primary-100">
          <MdTrendingUp className="w-6 h-6 text-primary flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-600 mb-1">
              유형 매칭도
            </p>
            <div className="flex items-baseline gap-2 mb-2">
              <span
                className={`text-3xl font-bold ${getScoreColorClass(matchScore)}`}
                aria-label={`유형 매칭도 ${matchScore}퍼센트`}
              >
                {matchScore}%
              </span>
              <span className="text-sm text-neutral-600">
                {matchScore >= 90
                  ? "매우 일치"
                  : matchScore >= 70
                    ? "일치"
                    : "보통"}
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              선호 유형:{" "}
              {group.preferred_work_types
                .map((code: WorkTypeCode) => WORK_TYPE_DATA[code].name)
                .join(", ")}
            </p>
          </div>
        </div>

        {/* 모집 포지션 */}
        <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <MdWork className="w-6 h-6 text-neutral-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-600 mb-1">
              모집 포지션
            </p>
            <p className="text-lg font-bold text-neutral-800">
              {positionLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
