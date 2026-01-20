import { useState } from "react";
import type { AIComparisonAnalysis } from "../types/aiJobMatching.types";

interface AIAnalysisResultProps {
  result: AIComparisonAnalysis;
}

export const AIAnalysisResult = ({ result }: AIAnalysisResultProps) => {
  // 선택된 축 (상세 정보 표시용)
  const [selectedAxis, setSelectedAxis] = useState<string | null>(null);

  // 축 클릭 핸들러
  const handleAxisClick = (axisId: string) => {
    setSelectedAxis(prev => (prev === axisId ? null : axisId));
  };

  return (
    <div className="space-y-6 mt-6">
      {/* 전체 요약 - 시각적 강조 */}
      <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl border-2 border-primary-200 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-md">
            <span className="text-2xl">💡</span>
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-base sm:text-lg font-bold text-neutral-800 mb-3">
              한눈에 보는 핵심 요약
            </h5>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
              {result.overallSummary.interpretationSummary}
            </p>
          </div>
        </div>
      </div>

      {/* 시나리오 분석 */}
      {result.scenarioAnalysis && (
        <div className="space-y-4">
          <div>
            <h6 className="text-base sm:text-lg font-bold text-neutral-800 mb-1 flex items-center gap-2">
              <span>🎬</span>
              <span>상황별 예측 시나리오</span>
            </h6>
            <p className="text-xs sm:text-sm text-neutral-600">
              지원자가 빛날 환경과 주의가 필요한 상황을 미리 파악하세요
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* 최적 환경 */}
            <div className="bg-gradient-to-br from-success-50 to-emerald-50 rounded-xl p-5 border-2 border-success-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🌟</span>
                <span className="text-sm font-bold text-success-800">
                  이런 환경에서 빛납니다
                </span>
              </div>
              <p className="text-sm sm:text-base text-success-900 leading-relaxed">
                {result.scenarioAnalysis.bestScenario}
              </p>
            </div>

            {/* 도전 환경 */}
            <div className="bg-gradient-to-br from-warning-50 to-orange-50 rounded-xl p-5 border-2 border-warning-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">⚡</span>
                <span className="text-sm font-bold text-warning-800">
                  이런 상황은 주의가 필요합니다
                </span>
              </div>
              <p className="text-sm sm:text-base text-warning-900 leading-relaxed">
                {result.scenarioAnalysis.worstScenario}
              </p>
            </div>
          </div>

          {/* 팀 시너지 제안 - 전체 너비 강조 */}
          <div className="bg-gradient-to-br from-primary-50 to-indigo-50 rounded-xl p-5 border-2 border-primary-300 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">🤝</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-primary-800 block mb-2">
                  최고의 시너지를 낼 팀 구성
                </span>
                <p className="text-sm sm:text-base text-primary-900 leading-relaxed">
                  {result.scenarioAnalysis.teamSynergyRecommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 축별 차이 분석 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h6 className="text-base sm:text-lg font-bold text-neutral-800 flex items-center gap-2">
              <span>📊</span>
              <span>5개 실행 축 상세 비교</span>
            </h6>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              각 축을 클릭하면 상세 해석과 Trade-off 분석을 확인할 수 있습니다
            </p>
          </div>
          <span className="text-xs text-neutral-500 hidden sm:block">
            클릭하여 상세 분석 확인
          </span>
        </div>

        {/* 축별 차이 분석 - 가로 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {result.axisDifferences.map(diff => {
            const gapSize = Math.abs(diff.jobScore - diff.applicantScore);
            const isSelected = selectedAxis === diff.axis;

            return (
              <button
                key={diff.axis}
                onClick={() => handleAxisClick(diff.axis)}
                className={`group bg-white rounded-xl p-4 border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  isSelected
                    ? "border-primary-500 shadow-xl ring-4 ring-primary-100"
                    : "border-neutral-200 hover:border-primary-300"
                }`}
              >
                {/* 헤더 - 축 이름과 차이 레벨 */}
                <div className="mb-3">
                  <h6 className="text-sm font-bold text-neutral-800 mb-2 text-left min-h-[2.5rem] line-clamp-2">
                    {diff.axisName}
                  </h6>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold px-2 py-1 rounded-full ${
                        diff.gapLevel === "critical"
                          ? "text-error-700 bg-error-100"
                          : diff.gapLevel === "significant"
                            ? "text-warning-700 bg-warning-100"
                            : diff.gapLevel === "moderate"
                              ? "text-info-700 bg-info-100"
                              : "text-success-700 bg-success-100"
                      }`}
                    >
                      {diff.gapLevel === "critical"
                        ? "큰 차이"
                        : diff.gapLevel === "significant"
                          ? "유의미"
                          : diff.gapLevel === "moderate"
                            ? "보통"
                            : "잘 맞음"}
                    </span>
                    <span
                      className={`text-xl font-bold ${
                        gapSize > 30
                          ? "text-error-600"
                          : gapSize > 20
                            ? "text-warning-600"
                            : "text-success-600"
                      }`}
                    >
                      {gapSize}
                    </span>
                  </div>
                </div>

                {/* 점수 비교 - 시각화 개선 */}
                <div className="space-y-3 mb-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-neutral-600">직무 요구</span>
                      <span className="text-sm font-bold text-primary-700">
                        {diff.jobScore}
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
                        style={{ width: `${diff.jobScore}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-neutral-600">지원자</span>
                      <span className="text-sm font-bold text-purple-700">
                        {diff.applicantScore}
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500"
                        style={{ width: `${diff.applicantScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 호버/선택 상태 피드백 */}
                <div
                  className={`text-center pt-3 border-t transition-opacity ${
                    isSelected ? "border-primary-200" : "border-neutral-100"
                  }`}
                >
                  <span className="text-xs text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {isSelected ? "상세 분석 보는 중 ✓" : "클릭하여 상세보기 →"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 선택된 축의 상세 정보 */}
        {selectedAxis && (
          <div>
            {result.axisDifferences
              .filter(diff => diff.axis === selectedAxis)
              .map(diff => (
                <div
                  key={`detail-${diff.axis}`}
                  className="bg-gradient-to-br from-primary-50 via-purple-50 to-primary-50 rounded-2xl p-6 border-2 border-primary-300 shadow-xl animate-slideDown"
                >
                  {/* 헤더 - 닫기 버튼 개선 */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl font-bold text-neutral-800">
                          {diff.axisName}
                        </span>
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                            diff.gapLevel === "critical"
                              ? "text-error-700 bg-error-100 ring-2 ring-error-200"
                              : diff.gapLevel === "significant"
                                ? "text-warning-700 bg-warning-100 ring-2 ring-warning-200"
                                : diff.gapLevel === "moderate"
                                  ? "text-info-700 bg-info-100 ring-2 ring-info-200"
                                  : "text-success-700 bg-success-100 ring-2 ring-success-200"
                          }`}
                        >
                          직무 {diff.jobScore} vs 지원자 {diff.applicantScore}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        차이값:{" "}
                        <span className="font-bold">
                          {Math.abs(diff.jobScore - diff.applicantScore)}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedAxis(null)}
                      className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/80 hover:bg-white border border-neutral-200 hover:border-neutral-300 transition-all flex items-center justify-center group"
                      aria-label="상세 분석 닫기"
                    >
                      <span className="text-neutral-400 group-hover:text-neutral-600 transition-colors">
                        ✕
                      </span>
                    </button>
                  </div>

                  {/* 해석 - 시각적 강조 */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 mb-4 border border-primary-200 shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">💡</span>
                      <div>
                        <h6 className="text-xs font-semibold text-primary-800 mb-2 uppercase tracking-wide">
                          AI 해석
                        </h6>
                        <p className="text-sm text-neutral-700 leading-relaxed">
                          {diff.interpretation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trade-off 분석 - 레이아웃 개선 */}
                  {diff.trade_off && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-4 border-2 border-success-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-success-100 flex items-center justify-center">
                            <span className="text-success-700 font-bold text-sm">
                              ✓
                            </span>
                          </div>
                          <span className="text-sm font-bold text-success-800">
                            긍정적 측면
                          </span>
                        </div>
                        <p className="text-sm text-neutral-700 leading-relaxed pl-8">
                          {diff.trade_off.positive}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border-2 border-warning-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-warning-100 flex items-center justify-center">
                            <span className="text-warning-700 font-bold text-sm">
                              ⚠
                            </span>
                          </div>
                          <span className="text-sm font-bold text-warning-800">
                            주의할 측면
                          </span>
                        </div>
                        <p className="text-sm text-neutral-700 leading-relaxed pl-8">
                          {diff.trade_off.negative}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* 협업/관리 포인트 - 우선순위별 그룹핑 */}
      {result.managementPoints.length > 0 && (
        <div className="space-y-6">
          <div>
            <h6 className="text-base sm:text-lg font-bold text-neutral-800 flex items-center gap-2 mb-1">
              <span>🎯</span>
              <span>실무 적용 가이드</span>
            </h6>
            <p className="text-xs sm:text-sm text-neutral-600">
              우선순위가 높은 항목부터 적용해보세요
            </p>
          </div>

          {["high", "medium", "low"].map(priority => {
            const points = result.managementPoints.filter(
              p => p.priority === priority
            );
            if (points.length === 0) return null;

            return (
              <div key={priority}>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      priority === "high"
                        ? "text-error-700 bg-error-100"
                        : priority === "medium"
                          ? "text-warning-700 bg-warning-100"
                          : "text-neutral-600 bg-neutral-100"
                    }`}
                  >
                    {priority === "high"
                      ? "높은 우선순위"
                      : priority === "medium"
                        ? "보통 우선순위"
                        : "참고사항"}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {points.length}개 항목
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {points.map((point, index) => (
                    <div
                      key={index}
                      className={`rounded-xl p-4 border-2 transition-all hover:shadow-md ${
                        point.priority === "high"
                          ? "bg-gradient-to-br from-success-50 to-emerald-50 border-success-200"
                          : point.priority === "medium"
                            ? "bg-gradient-to-br from-info-50 to-blue-50 border-info-200"
                            : "bg-white border-neutral-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">
                          {point.priority === "high"
                            ? "✅"
                            : point.priority === "medium"
                              ? "💡"
                              : "📝"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span
                            className={`text-xs font-bold block mb-2 ${
                              point.priority === "high"
                                ? "text-success-800"
                                : point.priority === "medium"
                                  ? "text-info-800"
                                  : "text-neutral-700"
                            }`}
                          >
                            {point.categoryLabel}
                          </span>
                          <p className="text-sm text-neutral-700 leading-relaxed">
                            {point.point}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 크레딧 정보 */}
      <div className="mt-4 pt-4 border-t border-neutral-200">
        <p className="text-xs text-neutral-500">
          이 분석은 크레딧 {result.creditsUsed}개를 소모했습니다. 재조회는
          무료입니다.
        </p>
      </div>
    </div>
  );
};
