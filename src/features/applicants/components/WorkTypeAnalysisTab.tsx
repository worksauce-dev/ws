import { useState } from "react";
import {
  MdTrendingUp,
  MdWarning,
  MdThumbUp,
  MdThumbDown,
  MdLightbulb,
  MdCheckCircle,
} from "react-icons/md";
import type { WorkTypeData } from "@/features/groups/types/workType.types";

interface WorkTypeAnalysisTabProps {
  workTypeData: WorkTypeData;
}

export const WorkTypeAnalysisTab = ({
  workTypeData,
}: WorkTypeAnalysisTabProps) => {
  const [potentialView, setPotentialView] = useState<"career" | "capability">(
    "career"
  );

  return (
    <div
      role="tabpanel"
      id="analysis-panel"
      aria-labelledby="analysis-tab"
      className="space-y-4 sm:space-y-6"
    >
      {/* 강점 & 약점 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <h4 className="text-sm sm:text-base font-semibold text-success mb-2 sm:mb-3 flex items-center gap-2">
            <MdTrendingUp className="w-4 h-4" />
            주요 강점
          </h4>
          <div className="space-y-2 sm:space-y-3">
            {workTypeData.strengths.map((strength, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 bg-success-50 rounded-xl border border-success-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-success-100 flex items-center justify-center flex-shrink-0">
                    <MdTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-success-700 mb-1 sm:mb-1.5">
                      {strength.title}
                    </p>
                    <p className="text-xs sm:text-sm text-success-600 leading-relaxed">
                      {strength.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm sm:text-base font-semibold text-warning mb-2 sm:mb-3 flex items-center gap-2">
            <MdWarning className="w-4 h-4" />
            주의 사항
          </h4>
          <div className="space-y-2 sm:space-y-3">
            {workTypeData.weaknesses.map((weakness, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 bg-warning-50 rounded-xl border border-warning-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-warning-100 flex items-center justify-center flex-shrink-0">
                    <MdWarning className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-warning-700 mb-1 sm:mb-1.5">
                      {weakness.title}
                    </p>
                    <p className="text-xs sm:text-sm text-warning-600 leading-relaxed">
                      {weakness.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 동기 요소 & 스트레스 요인 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <h4 className="text-sm sm:text-base font-semibold text-primary mb-3 sm:mb-4 flex items-center gap-2">
            <MdThumbUp className="w-4 h-4 sm:w-5 sm:h-5" />
            동기 부여 요소
          </h4>
          <div className="space-y-2">
            {workTypeData.motivators.map((motivator, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 sm:p-3 bg-primary-50 rounded-lg border border-primary-100"
              >
                <MdThumbUp className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-primary-700">{motivator}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm sm:text-base font-semibold text-error mb-3 sm:mb-4 flex items-center gap-2">
            <MdThumbDown className="w-4 h-4 sm:w-5 sm:h-5" />
            스트레스 요인
          </h4>
          <div className="space-y-2">
            {workTypeData.stressors.map((stressor, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 sm:p-3 bg-error-50 rounded-lg border border-error-100"
              >
                <MdThumbDown className="w-4 h-4 text-error flex-shrink-0" />
                <span className="text-xs sm:text-sm text-error-700">{stressor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 업무 스타일 */}
      <div>
        <h4 className="text-sm sm:text-base font-semibold text-neutral-800 mb-3 sm:mb-4 flex items-center gap-2">
          <MdLightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-info" />
          업무 스타일
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {workTypeData.workStyle.map((style, index) => (
            <div
              key={index}
              className="p-3 sm:p-4 bg-info-50 rounded-xl border border-info-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-info-100 flex items-center justify-center flex-shrink-0">
                  <MdLightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-info" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-semibold text-info-700 mb-1 sm:mb-1.5">
                    {style.title}
                  </p>
                  <p className="text-xs sm:text-sm text-info-600 leading-relaxed">
                    {style.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 관리 팁 */}
      <div>
        <h4 className="text-sm sm:text-base font-semibold text-neutral-800 mb-3 sm:mb-4 flex items-center gap-2">
          <MdCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          효과적인 관리 방법
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
          {workTypeData.managementTips.map((tip, index) => (
            <div
              key={index}
              className="p-2 sm:p-3 bg-neutral-50 rounded-lg border border-neutral-200"
            >
              <span className="text-xs sm:text-sm text-neutral-700">{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 발전 가능성 */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
          <h4 className="text-sm sm:text-base font-semibold text-neutral-800 flex items-center gap-2">
            <MdTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
            발전 가능성
          </h4>
          {/* 토글 버튼 */}
          <div className="flex rounded-lg p-1 bg-neutral-100 w-full sm:w-auto">
            <button
              onClick={() => setPotentialView("career")}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all duration-200 ${
                potentialView === "career"
                  ? "bg-white text-success shadow-sm"
                  : "text-neutral-600 hover:text-neutral-800"
              }`}
            >
              직무/포지션 중심
            </button>
            <button
              onClick={() => setPotentialView("capability")}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all duration-200 ${
                potentialView === "capability"
                  ? "bg-white text-success shadow-sm"
                  : "text-neutral-600 hover:text-neutral-800"
              }`}
            >
              역량 중심
            </button>
          </div>
        </div>

        {/* 설명 텍스트 */}
        <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-success-50 rounded-lg border border-success-100">
          <p className="text-xs sm:text-sm text-success-700 leading-relaxed">
            {potentialView === "career" ? (
              <>
                <strong className="font-semibold">
                  직무/포지션 중심 관점:
                </strong>{" "}
                이 유형이 성장할 수 있는 구체적인 직무와 포지션 경로를
                제시합니다.
              </>
            ) : (
              <>
                <strong className="font-semibold">역량 중심 관점:</strong> 이
                유형이 개발할 수 있는 핵심 역량과 성장 방향을 제시합니다.
              </>
            )}
          </p>
        </div>

        {/* 발전 가능성 3가지 */}
        <div className="space-y-2 sm:space-y-3">
          {workTypeData.developmentPotential[potentialView].map(
            (potential, index) => (
              <div
                key={index}
                className="p-3 sm:p-5 bg-gradient-to-r from-success-50 to-info-50 rounded-xl border border-success-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-2 sm:gap-4">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-success-100 flex items-center justify-center">
                    <span className="text-success font-bold text-base sm:text-lg">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-base text-neutral-800 leading-relaxed">
                      {potential}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
