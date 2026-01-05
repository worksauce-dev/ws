import { MdWorkOutline, MdAutoAwesome } from "react-icons/md";
import type { JobFitAnalysis } from "../../utils/analyzeTestResult";
import type { AIComparisonAnalysis } from "../../types/aiJobMatching.types";
import { JobMatchAnalysisSection } from "./JobMatchAnalysisSection";

/**
 * AI 분석 상태
 * - idle: 분석 전 (버튼 활성화)
 * - pending: API 호출 중 (로딩 스피너)
 * - completed: 성공 (결과 렌더링)
 * - failed: 실패 (에러 메시지 + 재시도)
 */
export type AIAnalysisStatus = "idle" | "pending" | "completed" | "failed";

interface JobMatchTabProps {
  jobFitAnalysis: JobFitAnalysis | null;
  positionLabel: string;
  aiAnalysisStatus: AIAnalysisStatus;
  aiAnalysisResult?: AIComparisonAnalysis;
  onRequestAnalysis: () => void;
  onRetry?: () => void;
}

export const JobMatchTab = ({
  jobFitAnalysis,
  positionLabel,
  aiAnalysisStatus,
  aiAnalysisResult,
  onRequestAnalysis,
  onRetry,
}: JobMatchTabProps) => {
  // TODO: n8n Agent 연동 시 onRequestAnalysis를 버튼에 연결
  // 현재는 버튼이 disabled 상태이므로 임시로 void 처리
  void onRequestAnalysis;

  return (
    <div className="space-y-6">
      {/* 기본 직무 매칭 분석 */}
      {jobFitAnalysis && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MdWorkOutline className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h3 className="text-lg sm:text-xl font-bold text-neutral-800">
              기본 직무 매칭 분석
            </h3>
          </div>
          <JobMatchAnalysisSection
            analysis={jobFitAnalysis}
            jobTitle={positionLabel}
          />
        </div>
      )}

      {/* 구분선 - 기본 직무 매칭 분석이 있을 때만 표시 */}
      {jobFitAnalysis && (
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-sm text-neutral-500 font-medium">
              고급 분석
            </span>
          </div>
        </div>
      )}

      {/* AI 심층 분석 */}
      <div>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <MdAutoAwesome className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            <h3 className="text-lg sm:text-xl font-bold text-neutral-800">
              AI 실행 스타일 비교 분석
            </h3>
          </div>
          <div className="flex items-center gap-2 pl-7 sm:pl-8">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-full px-2.5 py-0.5">
              <MdAutoAwesome className="w-3 h-3" />
              AI 해석 기반
            </span>
            <p className="text-xs sm:text-sm text-neutral-600">
              AI가 직무 요구 특성과 지원자 유형을 비교·해석한 결과입니다
            </p>
          </div>
        </div>

        {/* AI 분석 트리거 카드 */}
        <div className="bg-gradient-to-br from-primary-50 via-white to-purple-50 rounded-2xl border-2 border-primary-200 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg">
              <MdAutoAwesome className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base sm:text-lg font-bold text-neutral-800 mb-2">
                5개 실행 축으로 심층 분석
              </h4>
              <p className="text-sm sm:text-base text-neutral-700 mb-4 leading-relaxed">
                직무 실행 요구사항과 지원자의 업무 스타일 차이를 해석하고,
                관리 시 고려할 점을 제공합니다.
              </p>

              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-4 border border-neutral-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-primary-700 uppercase tracking-wide">
                    분석 항목
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>의사결정 속도:</strong> 빠른 판단 vs 신중한 검토
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>불확실성 내성:</strong> 애매한 상황 수용도
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>자율성:</strong> 독립적 업무 선호도
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>관계 중심성:</strong> 협업 vs 개인 작업
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>정확성 요구도:</strong> 디테일 집중도
                    </span>
                  </li>
                </ul>
              </div>

              {/* 분석 안내 및 버튼 섹션 - 통합 디자인 */}
              <div className="space-y-3">
                {/* 크레딧 안내 */}
                <div className="flex items-start gap-3 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                  <span className="text-xl flex-shrink-0 mt-0.5">💳</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-warning-900 leading-relaxed">
                      <span className="font-semibold">크레딧 1 소모</span>
                      <span className="text-neutral-700 ml-1">
                        (분석 후 재조회는 무료)
                      </span>
                    </p>
                  </div>
                </div>

                {/* 중요 안내 */}
                <div className="flex items-start gap-3 p-3 bg-info-50 border border-info-200 rounded-lg">
                  <span className="text-xl flex-shrink-0 mt-0.5">ℹ️</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-info-900 leading-relaxed">
                      <span className="font-semibold">중요:</span> AI는
                      "적합/부적합"을 판단하지 않습니다. 실행 방식의 차이를
                      객관적으로 해석하고, 관리 시 고려할 점을 제공합니다.
                    </p>
                  </div>
                </div>

                {/* 분석 버튼 - 상태에 따라 다르게 표시 */}
                {aiAnalysisStatus === "idle" && (
                  <div className="space-y-2">
                    <button
                      disabled
                      className="w-full px-6 py-3 bg-neutral-200 text-neutral-500 rounded-lg font-semibold text-sm sm:text-base cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                    >
                      <MdAutoAwesome className="w-5 h-5" />
                      <span>분석 시작 (준비 중)</span>
                    </button>
                    <p className="text-xs text-center text-neutral-500">
                      AI Agent 구현 예정 기능입니다
                    </p>
                  </div>
                )}

                {aiAnalysisStatus === "pending" && (
                  <div className="flex items-start gap-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-primary-900 leading-relaxed">
                      <span className="font-semibold">AI가 분석 중입니다</span>
                      <span className="text-primary-700 ml-1">
                        (약 10-15초 소요)
                      </span>
                    </p>
                  </div>
                )}

                {aiAnalysisStatus === "completed" && (
                  <div className="flex items-start gap-3 p-3 bg-success-50 border border-success-200 rounded-lg">
                    <span className="text-xl flex-shrink-0 mt-0.5">✓</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-success-900 leading-relaxed">
                        <span className="font-semibold">분석 완료</span>
                        <span className="text-success-700 ml-1">
                          아래에서 결과를 확인하세요
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {aiAnalysisStatus === "failed" && onRetry && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-error-50 border border-error-200 rounded-lg">
                      <span className="text-xl flex-shrink-0 mt-0.5">⚠️</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-error-900 leading-relaxed">
                          <span className="font-semibold">분석 실패</span>
                          <span className="text-error-700 ml-1">
                            크레딧은 차감되지 않았습니다
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onRetry}
                      className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
                    >
                      <MdAutoAwesome className="w-5 h-5" />
                      <span>다시 시도</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 분석 전: 개념적 미리보기 */}
        {(aiAnalysisStatus === "idle" || aiAnalysisStatus === "pending") && (
          <div className="bg-gradient-to-br from-purple-50 to-primary-50 rounded-xl border border-purple-200 p-6 mt-6">
            <h5 className="text-base sm:text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <span>🔍</span>
              <span>이런 정보가 제공됩니다</span>
            </h5>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <div>
                  <h6 className="text-sm font-semibold text-neutral-800 mb-1">
                    5개 실행 축별 차이 분석
                  </h6>
                  <p className="text-xs sm:text-sm text-neutral-600">
                    의사결정 속도, 불확실성 내성, 자율성, 관계 중심성, 정확성
                    요구도를 직무와 지원자 간 비교하여 해석합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <div>
                  <h6 className="text-sm font-semibold text-neutral-800 mb-1">
                    온보딩 및 일상 업무 관리 포인트
                  </h6>
                  <p className="text-xs sm:text-sm text-neutral-600">
                    실행 방식 차이를 고려한 구체적인 관리 가이드와
                    주의사항을 제공합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <div>
                  <h6 className="text-sm font-semibold text-neutral-800 mb-1">
                    성장 지원 및 커뮤니케이션 가이드
                  </h6>
                  <p className="text-xs sm:text-sm text-neutral-600">
                    지원자의 성장을 돕고 효과적인 소통을 위한 맞춤형 조언을
                    제공합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-purple-200">
              <p className="text-xs text-neutral-600 flex items-center gap-2">
                <span>💡</span>
                <span>
                  분석 후에는 실제 데이터 기반의 상세한 해석 결과를 확인하실
                  수 있습니다.
                </span>
              </p>
            </div>
          </div>
        )}

        {/* 분석 후: 상세 결과 (실제 데이터) */}
        {aiAnalysisStatus === "completed" && aiAnalysisResult && (
          <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 mt-6">
            <h5 className="text-base sm:text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <span>📊</span>
              <span>AI 분석 결과</span>
            </h5>

            {/* 전체 요약 */}
            <div className="bg-white rounded-lg p-4 border border-neutral-200 mb-4">
              <h6 className="text-sm font-semibold text-neutral-800 mb-2">
                전체 요약
              </h6>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {aiAnalysisResult.overallSummary.interpretationSummary}
              </p>
            </div>

            {/* 축별 차이 분석 */}
            <div className="space-y-4">
              {aiAnalysisResult.axisDifferences.map((diff) => (
                <div
                  key={diff.axis}
                  className="bg-white rounded-lg p-4 border border-neutral-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-neutral-700">
                      {diff.axisName}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        diff.gapLevel === "critical"
                          ? "text-error-700 bg-error-50"
                          : diff.gapLevel === "significant"
                            ? "text-warning-700 bg-warning-50"
                            : diff.gapLevel === "moderate"
                              ? "text-info-700 bg-info-50"
                              : "text-success-700 bg-success-50"
                      }`}
                    >
                      {diff.gapLevel === "critical"
                        ? "큰 차이"
                        : diff.gapLevel === "significant"
                          ? "유의미한 차이"
                          : diff.gapLevel === "moderate"
                            ? "보통 차이"
                            : "작은 차이"}
                    </span>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-neutral-600">
                          직무 요구
                        </span>
                        <span className="text-xs font-medium text-primary-700">
                          {diff.jobScore}점
                        </span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500"
                          style={{ width: `${diff.jobScore}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-neutral-600">
                          지원자
                        </span>
                        <span className="text-xs font-medium text-purple-700">
                          {diff.applicantScore}점
                        </span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500"
                          style={{ width: `${diff.applicantScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 mt-3 italic">
                    💡 {diff.interpretation}
                  </p>
                </div>
              ))}
            </div>

            {/* 협업/관리 포인트 */}
            {aiAnalysisResult.managementPoints.length > 0 && (
              <div className="mt-4 space-y-3">
                <h6 className="text-sm font-semibold text-neutral-800">
                  협업/관리 포인트
                </h6>
                {aiAnalysisResult.managementPoints.map((point, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-4 border ${
                      point.priority === "high"
                        ? "bg-success-50 border-success-200"
                        : point.priority === "medium"
                          ? "bg-info-50 border-info-200"
                          : "bg-neutral-50 border-neutral-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">
                        {point.priority === "high"
                          ? "✅"
                          : point.priority === "medium"
                            ? "💡"
                            : "📝"}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          point.priority === "high"
                            ? "text-success-800"
                            : point.priority === "medium"
                              ? "text-info-800"
                              : "text-neutral-800"
                        }`}
                      >
                        {point.categoryLabel}
                        {point.priority === "high" && " (높은 우선순위)"}
                      </span>
                    </div>
                    <p
                      className={`text-sm leading-relaxed ${
                        point.priority === "high"
                          ? "text-success-900"
                          : point.priority === "medium"
                            ? "text-info-900"
                            : "text-neutral-700"
                      }`}
                    >
                      {point.point}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 크레딧 정보 */}
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-xs text-neutral-500">
                이 분석은 크레딧 {aiAnalysisResult.creditsUsed}개를 소모했습니다.
                재조회는 무료입니다.
              </p>
            </div>
          </div>
        )}

        {/* 분석 후: Mock 결과 표시 (개발 중 - aiAnalysisResult가 없을 때) */}
        {aiAnalysisStatus === "completed" && !aiAnalysisResult && (
          <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 mt-6">
            <h5 className="text-base sm:text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <span>📊</span>
              <span>분석 결과 (Mock)</span>
            </h5>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-neutral-700">
                    의사결정 속도
                  </span>
                  <span className="text-xs text-warning-700 font-medium px-2 py-1 bg-warning-50 rounded">
                    유의미한 차이
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-neutral-600">직무 요구</span>
                      <span className="text-xs font-medium text-primary-700">
                        빠른 판단 경향
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500"
                        style={{ width: "70%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-neutral-600">지원자</span>
                      <span className="text-xs font-medium text-purple-700">
                        신중한 검토 경향
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{ width: "40%" }}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 mt-3 italic">
                  💡 "직무는 장애 상황에서 빠른 판단을 요구하나, 지원자는
                  신중하게 분석 후 결정하는 스타일입니다."
                </p>
              </div>

              <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">✅</span>
                  <span className="text-sm font-semibold text-success-800">
                    온보딩 포인트 (높은 우선순위)
                  </span>
                </div>
                <p className="text-sm text-success-900 leading-relaxed">
                  장애 대응 매뉴얼과 의사결정 트리를 미리 제공하여 신속한
                  판단을 지원하세요.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
