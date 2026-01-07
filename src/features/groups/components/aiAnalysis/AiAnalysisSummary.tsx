/**
 * AI 분석 전체 요약 컴포넌트
 *
 * AI가 생성한 매칭/차이 영역과 전체 해석을 표시합니다.
 */

import type { AIComparisonAnalysis } from "../../types/aiJobMatching.types";
import { MdCheckCircle, MdWarning, MdLightbulb } from "react-icons/md";

interface AiAnalysisSummaryProps {
  analysis: AIComparisonAnalysis;
}

export const AiAnalysisSummary = ({ analysis }: AiAnalysisSummaryProps) => {
  const { overallSummary } = analysis;

  return (
    <div className="space-y-6">
      {/* AI 해석 요약 */}
      <div className="rounded-lg border border-primary-200 bg-primary-50 p-6">
        <div className="mb-3 flex items-center gap-2">
          <MdLightbulb className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-neutral-900">
            AI 분석 요약
          </h3>
        </div>
        <p className="leading-relaxed text-neutral-700">
          {overallSummary.interpretationSummary}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* 매칭 영역 */}
        <div className="rounded-lg border border-success-200 bg-success-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <MdCheckCircle className="h-5 w-5 text-success-600" />
            <h3 className="font-semibold text-neutral-900">
              비슷한 실행 방식
            </h3>
          </div>
          {overallSummary.matchingAreas.length > 0 ? (
            <ul className="space-y-2">
              {overallSummary.matchingAreas.map((area, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-neutral-700"
                >
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-success-500" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-500">
              비슷한 영역이 발견되지 않았습니다.
            </p>
          )}
        </div>

        {/* 차이 영역 */}
        <div className="rounded-lg border border-warning-200 bg-warning-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <MdWarning className="h-5 w-5 text-warning-600" />
            <h3 className="font-semibold text-neutral-900">
              다른 실행 방식
            </h3>
          </div>
          {overallSummary.differingAreas.length > 0 ? (
            <ul className="space-y-2">
              {overallSummary.differingAreas.map((area, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-neutral-700"
                >
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-warning-500" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-500">
              차이가 발견되지 않았습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
