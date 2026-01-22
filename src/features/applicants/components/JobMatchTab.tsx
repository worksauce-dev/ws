import { useState } from "react";
import { MdAutoAwesome } from "react-icons/md";
import type { AIComparisonAnalysis } from "../types/aiJobMatching.types";
import { AIAnalysisResult } from "./AIAnalysisResult";

/**
 * AI 분석 상태
 * - idle: 분석 전 (버튼 활성화)
 * - pending: API 호출 중 (로딩 스피너)
 * - completed: 성공 (결과 렌더링)
 * - failed: 실패 (에러 메시지 + 재시도)
 */
export type AIAnalysisStatus = "idle" | "pending" | "completed" | "failed";

interface JobMatchTabProps {
  jobDescription?: string; // 그룹의 description (선택)
  aiAnalysisStatus: AIAnalysisStatus;
  aiAnalysisResult?: AIComparisonAnalysis;
  onRequestAnalysis: (additionalContext?: string) => void;
  onRetry?: () => void;
}

export const JobMatchTab = ({
  jobDescription,
  aiAnalysisStatus,
  aiAnalysisResult,
  onRequestAnalysis,
  onRetry,
}: JobMatchTabProps) => {
  // 추가 직무 설명 입력 상태
  const [additionalContext, setAdditionalContext] = useState("");

  return (
    <div className="space-y-6">
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

        {/* AI 분석 트리거 카드 - completed 상태가 아닐 때만 표시 */}
        {aiAnalysisStatus !== "completed" && (
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
                  직무 실행 요구사항과 지원자의 업무 스타일 차이를 해석하고, 관리
                  시 고려할 점을 제공합니다.
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

                {/* 분석 섹션 */}
                {aiAnalysisStatus === "idle" && (
                  <div className="space-y-3">
                    {/* 추가 설명 입력 - 항상 표시 */}
                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        추가 직무 설명 (선택)
                      </label>
                      <textarea
                        value={additionalContext}
                        onChange={e => setAdditionalContext(e.target.value)}
                        placeholder="예: 현장 대응이 많은 직무입니다 / 반복 업무 비중이 높은 편입니다 / 고객 클레임 응대가 중요합니다"
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                      <p className="mt-1 text-xs text-neutral-500">
                        AI가 직무 특성을 더 잘 이해할 수 있도록 도와주세요
                      </p>
                    </div>

                    {/* 분석 시작 버튼 */}
                    <button
                      onClick={() => {
                        // jobDescription이 있으면 공백 추가해서 구분
                        const context = jobDescription
                          ? `${jobDescription} ${additionalContext}`.trim()
                          : additionalContext || undefined;
                        onRequestAnalysis(context);
                      }}
                      className="w-full sm:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors"
                    >
                      <MdAutoAwesome className="w-5 h-5" />
                      <span>AI 분석 시작</span>
                    </button>

                    {/* 크레딧 안내 */}
                    <p className="text-xs text-neutral-600 flex items-center gap-1.5">
                      <span>💳</span>
                      <span>
                        크레딧 1 소모{" "}
                        <span className="text-neutral-500">· 재조회 무료</span>
                      </span>
                    </p>
                  </div>
                )}

                {aiAnalysisStatus === "pending" && (
                  <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl border-2 border-primary-300 p-6">
                    <div className="flex items-start gap-4">
                      {/* 애니메이션 아이콘 */}
                      <div className="flex-shrink-0">
                        <div className="relative w-14 h-14">
                          <div className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-20"></div>
                          <div className="relative w-14 h-14 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                            <MdAutoAwesome className="w-7 h-7 text-white animate-pulse" />
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-neutral-800 mb-2">
                          AI 분석이 진행 중입니다
                        </h4>
                        <p className="text-sm text-neutral-700 mb-4">
                          분석이 완료되면{" "}
                          <strong className="text-primary-700">알림</strong>으로
                          안내드립니다. 다른 작업을 계속하셔도 괜찮습니다.
                        </p>

                        {/* 진행 상태 */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 rounded-full bg-success-500"></div>
                            <span className="text-neutral-600">
                              요청 전송 완료
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600"></div>
                            <span className="text-neutral-700 font-medium">
                              AI 분석 중 (약 1-2분 소요)
                            </span>
                          </div>
                        </div>

                        {/* 하단 안내 */}
                        <div className="pt-3 border-t border-primary-200">
                          <div className="flex items-start gap-2 text-sm">
                            <span className="text-lg flex-shrink-0">💡</span>
                            <p className="text-neutral-600">
                              분석 완료 후 이 페이지로 돌아오시면 결과를 바로
                              확인하실 수 있습니다.
                            </p>
                          </div>
                        </div>
                      </div>
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
                      className="w-full sm:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
                    >
                      <MdAutoAwesome className="w-5 h-5" />
                      <span>다시 시도</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
                    Trade-off 분석 (양면적 인사이트)
                  </h6>
                  <p className="text-xs sm:text-sm text-neutral-600">
                    각 차이가 가진 긍정적 측면과 주의할 측면을 동시에 제시하여
                    균형 잡힌 평가를 돕습니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <div>
                  <h6 className="text-sm font-semibold text-neutral-800 mb-1">
                    시나리오 분석 및 팀 시너지 제안
                  </h6>
                  <p className="text-xs sm:text-sm text-neutral-600">
                    최적 환경과 도전 환경을 예측하고, 함께 일할 때 시너지를
                    낼 수 있는 팀 구성을 제안합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <div>
                  <h6 className="text-sm font-semibold text-neutral-800 mb-1">
                    온보딩 및 일상 업무 관리 포인트
                  </h6>
                  <p className="text-xs sm:text-sm text-neutral-600">
                    실행 방식 차이를 고려한 구체적인 관리 가이드와 주의사항을
                    제공합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-purple-200">
              <p className="text-xs text-neutral-600 flex items-center gap-2">
                <span>💡</span>
                <span>
                  분석 후에는 실제 데이터 기반의 상세한 해석 결과를 확인하실 수
                  있습니다.
                </span>
              </p>
            </div>
          </div>
        )}

        {/* 분석 후: 상세 결과 (실제 데이터) */}
        {aiAnalysisStatus === "completed" && aiAnalysisResult && (
          <AIAnalysisResult result={aiAnalysisResult} />
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
                      <span className="text-xs text-neutral-600">
                        직무 요구
                      </span>
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
                  장애 대응 매뉴얼과 의사결정 트리를 미리 제공하여 신속한 판단을
                  지원하세요.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
