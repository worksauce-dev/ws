/**
 * 직무 매칭 분석 섹션
 *
 * 직무 프로필 기반 상세 매칭도 분석 UI
 */

import { MdCheckCircle, MdWarning, MdLightbulb, MdTrendingUp } from "react-icons/md";
import type { JobFitAnalysis } from "../../types/jobProfile.types";

interface JobMatchAnalysisSectionProps {
  analysis: JobFitAnalysis;
  jobTitle: string;
}

export const JobMatchAnalysisSection = ({
  analysis,
  jobTitle,
}: JobMatchAnalysisSectionProps) => {
  const { overallScore, fitLevelLabel, strengths, weaknesses, hiringRecommendation } = analysis;

  // 적합도 수준별 색상
  const getFitLevelColor = () => {
    if (analysis.fitLevel === "excellent") return "text-success-700 bg-success-50 border-success-200";
    if (analysis.fitLevel === "good") return "text-primary-700 bg-primary-50 border-primary-200";
    if (analysis.fitLevel === "moderate") return "text-warning-700 bg-warning-50 border-warning-200";
    return "text-error-700 bg-error-50 border-error-200";
  };

  // 추천 수준별 아이콘
  const getRecommendationIcon = () => {
    if (hiringRecommendation.level === "strongly_recommended" || hiringRecommendation.level === "recommended") {
      return <MdCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-success" />;
    }
    if (hiringRecommendation.level === "conditional") {
      return <MdLightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />;
    }
    return <MdWarning className="w-5 h-5 sm:w-6 sm:h-6 text-error" />;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 종합 점수 */}
      <div className={`p-4 sm:p-6 rounded-xl border-2 ${getFitLevelColor()}`}>
        <div className="flex items-center gap-3 sm:gap-4 mb-3">
          <MdTrendingUp className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold mb-1">
              {jobTitle} 직무 매칭도
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold">{overallScore}점</span>
              <span className="text-sm sm:text-base font-semibold">{fitLevelLabel}</span>
            </div>
          </div>
        </div>

        {/* 프로그레스 바 */}
        <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              analysis.fitLevel === "excellent"
                ? "bg-success"
                : analysis.fitLevel === "good"
                  ? "bg-primary"
                  : analysis.fitLevel === "moderate"
                    ? "bg-warning"
                    : "bg-error"
            }`}
            style={{ width: `${overallScore}%` }}
          />
        </div>
      </div>

      {/* 강점 영역 */}
      {strengths.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6">
          <h4 className="text-base sm:text-lg font-semibold text-neutral-800 mb-3 sm:mb-4 flex items-center gap-2">
            <MdCheckCircle className="w-5 h-5 text-success" />
            이 직무에 강한 점
          </h4>
          <div className="space-y-2 sm:space-y-3">
            {strengths.map((strength, index) => (
              <div
                key={index}
                className="flex items-start gap-2 sm:gap-3 p-3 bg-success-50 rounded-lg border border-success-100"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success-100 flex items-center justify-center mt-0.5">
                  <span className="text-success font-bold text-sm">✓</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-semibold text-neutral-800 text-sm sm:text-base">
                      {strength.description}
                    </span>
                    <span className="text-success font-bold text-sm">
                      ({strength.workTypeName} {strength.score}점)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 보완 필요 영역 */}
      {weaknesses.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6">
          <h4 className="text-base sm:text-lg font-semibold text-neutral-800 mb-3 sm:mb-4 flex items-center gap-2">
            <MdLightbulb className="w-5 h-5 text-warning" />
            면접에서 확인할 점
          </h4>
          <div className="space-y-2 sm:space-y-3">
            {weaknesses.map((weakness, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 bg-warning-50 rounded-lg border border-warning-100"
              >
                <div className="flex items-baseline gap-2 flex-wrap mb-2">
                  <span className="font-semibold text-neutral-800 text-sm sm:text-base">
                    {weakness.description}
                  </span>
                  <span className="text-warning-700 font-bold text-sm">
                    ({weakness.workTypeName} {weakness.score}점)
                  </span>
                </div>
                <ul className="space-y-1 ml-4">
                  {weakness.interviewCheckpoints.map((checkpoint, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-neutral-700 list-disc">
                      {checkpoint}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 채용 의사결정 가이드 */}
      <div className="bg-gradient-to-r from-neutral-50 to-primary-50 rounded-xl border-2 border-neutral-200 p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
            {getRecommendationIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-base sm:text-lg font-bold text-neutral-800">
                종합 분석
              </h4>
              <span
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                  hiringRecommendation.level === "strongly_recommended"
                    ? "bg-success-100 text-success-700"
                    : hiringRecommendation.level === "recommended"
                      ? "bg-primary-100 text-primary-700"
                      : hiringRecommendation.level === "conditional"
                        ? "bg-warning-100 text-warning-700"
                        : "bg-error-100 text-error-700"
                }`}
              >
                {hiringRecommendation.levelLabel}
              </span>
            </div>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-3">
              {hiringRecommendation.reasoning}
            </p>

            {/* 면접 체크포인트 */}
            {hiringRecommendation.criticalCheckpoints.length > 0 && (
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <p className="text-xs sm:text-sm font-semibold text-neutral-700 mb-2">
                  면접에서 반드시 확인할 사항:
                </p>
                <ul className="space-y-1 ml-4">
                  {hiringRecommendation.criticalCheckpoints.slice(0, 5).map((checkpoint, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-neutral-600 list-disc">
                      {checkpoint}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
