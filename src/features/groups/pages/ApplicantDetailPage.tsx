import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdPsychology,
  MdGroups,
  MdQuestionAnswer,
  MdSchedule,
  MdWorkOutline,
  MdAutoAwesome,
} from "react-icons/md";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { useGroupDetail } from "../hooks/useGroupDetail";
import { useUpdateApplicantStatus } from "../hooks/useUpdateApplicantStatus";
import { useToast } from "@/shared/components/ui/useToast";
import {
  analyzeTestResult,
  calculateJobFitScore,
  calculateJobFitScoreV2,
} from "../utils/analyzeTestResult";
import WORK_TYPE_DATA from "../constants/workTypes";
import { POSITION_OPTIONS } from "../constants/positionOptions";
import { getJobProfile } from "../constants/jobProfiles";
import { ApplicantDetailHeader } from "../components/applicantDetail/ApplicantDetailHeader";
import { WorkTypeAnalysisTab } from "../components/applicantDetail/WorkTypeAnalysisTab";
import { TeamSynergyTab } from "../components/applicantDetail/TeamSynergyTab";
import { InterviewGuideTab } from "../components/applicantDetail/InterviewGuideTab";
import { JobMatchAnalysisSection } from "../components/applicantDetail/JobMatchAnalysisSection";
import type { ApplicantStatus } from "@/shared/types/database.types";

export const ApplicantDetailPage = () => {
  const { groupId, applicantId } = useParams<{
    groupId: string;
    applicantId: string;
  }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // 그룹 상세 정보 조회 (지원자 데이터 포함)
  const { data, isLoading, isError, error } = useGroupDetail(groupId || "");

  // 지원자 상태 업데이트 mutation
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateApplicantStatus({
      groupId: groupId || "",
      onSuccess: data => {
        const statusLabels: Record<ApplicantStatus, string> = {
          pending: "검토 대기",
          shortlisted: "서류 합격",
          interview: "면접 예정",
          rejected: "불합격",
          passed: "최종 합격",
        };
        showToast(
          "success",
          "상태 변경 완료",
          `채용 상태가 "${statusLabels[data.status]}"(으)로 변경되었습니다.`
        );
      },
      onError: error => {
        showToast("error", "상태 변경 실패", error.message);
      },
    });

  // 현재 지원자 찾기 (useMemo로 최적화)
  const currentApplicant = useMemo(
    () => data?.applicants?.find(a => a.id === applicantId),
    [data?.applicants, applicantId]
  );

  // 테스트 결과 분석 (useMemo로 최적화) - early return 전에 모든 hooks 호출
  const analyzedResult = useMemo(
    () =>
      currentApplicant?.test_result
        ? analyzeTestResult(currentApplicant.test_result)
        : null,
    [currentApplicant?.test_result]
  );

  const workTypeData = useMemo(
    () =>
      analyzedResult ? WORK_TYPE_DATA[analyzedResult.primaryType.code] : null,
    [analyzedResult]
  );

  // 유형 매칭도: 선호 유형들과의 종합 매칭 점수 (반올림)
  const matchScore = useMemo(
    () =>
      analyzedResult && data?.group
        ? Math.round(
            calculateJobFitScore(
              analyzedResult.scoreDistribution,
              data.group.preferred_work_types
            )
          )
        : 0,
    [analyzedResult, data?.group]
  );

  // 포지션 라벨 찾기 (useMemo로 최적화)
  const positionLabel = useMemo(
    () =>
      data?.group
        ? POSITION_OPTIONS.find(option => option.value === data.group.position)
            ?.label || data.group.position
        : "",
    [data?.group]
  );

  // 직무 프로필 기반 분석 (Phase 3)
  const jobFitAnalysis = useMemo(() => {
    if (!analyzedResult || !data?.group) return null;

    const jobProfile = getJobProfile(data.group.position);
    if (!jobProfile) return null;

    return calculateJobFitScoreV2(analyzedResult.scoreDistribution, jobProfile);
  }, [analyzedResult, data?.group]);

  // 상태 관리 (초기값을 applicant 데이터에서 가져오기)
  const [isStarred, setIsStarred] = useState(
    currentApplicant?.is_starred ?? false
  );
  const [activeTab, setActiveTab] = useState<
    "analysis" | "team" | "interview" | "jobmatch"
  >("analysis");

  // AI 분석 상태 (TODO: 실제 분석 완료 시 true로 변경)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasAIAnalysis, setHasAIAnalysis] = useState(false);

  const handleBackClick = () => {
    navigate(`/dashboard/groups/${groupId}`);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <DashboardLayout title="로딩 중..." description="">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-neutral-600 text-lg">
              지원자 정보를 불러오는 중...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // 에러 상태
  if (isError || !data?.group || !currentApplicant) {
    return (
      <DashboardLayout title="오류" description="">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-error text-lg mb-4">
              {error?.message || "지원자를 찾을 수 없습니다."}
            </p>
            <button
              onClick={handleBackClick}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
            >
              그룹 페이지로 돌아가기
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // 테스트 미완료 상태
  if (!currentApplicant.test_result) {
    return (
      <DashboardLayout
        title={currentApplicant.name}
        description={currentApplicant.email}
        showBackButton={true}
        onBackClick={handleBackClick}
        breadcrumbs={[
          { label: "대시보드", href: "/dashboard" },
          { label: data.group.name, href: `/dashboard/groups/${groupId}` },
          { label: currentApplicant.name },
        ]}
      >
        <div className="bg-neutral-50 rounded-xl p-12 border border-neutral-200 text-center">
          <MdSchedule className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-800 mb-2">
            테스트를 아직 완료하지 않았습니다
          </h3>
          <p className="text-neutral-600">
            지원자가 테스트를 완료하면 상세한 분석 결과를 확인할 수 있습니다.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // workTypeData와 analyzedResult가 null이 아님을 보장 (타입스크립트)
  if (!workTypeData || !analyzedResult) {
    return null;
  }

  return (
    <DashboardLayout
      title={currentApplicant.name}
      description="소스테스트 결과 기반 채용 의사결정 지원"
      showBackButton={true}
      onBackClick={handleBackClick}
      breadcrumbs={[
        { label: "대시보드", href: "/dashboard" },
        { label: data.group.name, href: `/dashboard/groups/${groupId}` },
        { label: currentApplicant.name },
      ]}
    >
      <div className="space-y-6">
        {/* 종합 평가 헤더 */}
        <ApplicantDetailHeader
          applicant={currentApplicant}
          group={data.group}
          workTypeData={workTypeData}
          matchScore={matchScore}
          positionLabel={positionLabel}
          isStarred={isStarred}
          onToggleStar={() => setIsStarred(!isStarred)}
        />

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-xl border border-neutral-200">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-200">
            <div
              className="flex rounded-xl p-1.5 bg-neutral-100 w-fit"
              role="tablist"
            >
              <button
                role="tab"
                aria-selected={activeTab === "analysis"}
                aria-controls="analysis-panel"
                id="analysis-tab"
                onClick={() => setActiveTab("analysis")}
                className={`px-3 sm:px-5 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === "analysis"
                    ? "bg-white text-primary shadow-md scale-[1.02]"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800"
                }`}
              >
                <div className="flex flex-row sm:flex-col items-center gap-1.5 sm:gap-1">
                  <MdPsychology className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="whitespace-nowrap">
                    <span className="sm:hidden">분석</span>
                    <span className="hidden sm:inline">직무유형 분석</span>
                  </span>
                </div>
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "team"}
                aria-controls="team-panel"
                id="team-tab"
                onClick={() => setActiveTab("team")}
                className={`px-3 sm:px-5 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === "team"
                    ? "bg-white text-primary shadow-md scale-[1.02]"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800"
                }`}
              >
                <div className="flex flex-row sm:flex-col items-center gap-1.5 sm:gap-1">
                  <MdGroups className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="whitespace-nowrap">
                    <span className="sm:hidden">팀워크</span>
                    <span className="hidden sm:inline">팀워크 스타일</span>
                  </span>
                </div>
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "interview"}
                aria-controls="interview-panel"
                id="interview-tab"
                onClick={() => setActiveTab("interview")}
                className={`px-3 sm:px-5 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === "interview"
                    ? "bg-white text-primary shadow-md scale-[1.02]"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800"
                }`}
              >
                <div className="flex flex-row sm:flex-col items-center gap-1.5 sm:gap-1">
                  <MdQuestionAnswer className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="whitespace-nowrap">
                    <span className="sm:hidden">면접</span>
                    <span className="hidden sm:inline">면접 가이드</span>
                  </span>
                </div>
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "jobmatch"}
                aria-controls="jobmatch-panel"
                id="jobmatch-tab"
                onClick={() => setActiveTab("jobmatch")}
                className={`px-3 sm:px-5 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === "jobmatch"
                    ? "bg-white text-primary shadow-md scale-[1.02]"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800"
                }`}
              >
                <div className="flex flex-row sm:flex-col items-center gap-1.5 sm:gap-1">
                  <MdWorkOutline className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="whitespace-nowrap">
                    <span className="sm:hidden">직무</span>
                    <span className="hidden sm:inline">직무 적합도</span>
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="p-4 sm:p-6">
            {activeTab === "analysis" && (
              <WorkTypeAnalysisTab workTypeData={workTypeData} />
            )}
            {activeTab === "team" && (
              <TeamSynergyTab workTypeData={workTypeData} />
            )}
            {activeTab === "interview" && (
              <InterviewGuideTab workTypeData={workTypeData} />
            )}
            {activeTab === "jobmatch" && (
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
                        AI가 직무 요구 특성과 지원자 유형을 비교·해석한
                        결과입니다
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
                          직무 실행 요구사항과 지원자의 업무 스타일 차이를
                          해석하고, 관리 시 고려할 점을 제공합니다.
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
                                <strong>의사결정 속도:</strong> 빠른 판단 vs
                                신중한 검토
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              <span>
                                <strong>불확실성 내성:</strong> 애매한 상황
                                수용도
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

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                          <div className="flex items-center gap-2 px-3 py-2 bg-warning-50 border border-warning-200 rounded-lg">
                            <span className="text-2xl">💳</span>
                            <div className="text-sm">
                              <span className="font-semibold text-warning-800">
                                크레딧 1 소모
                              </span>
                              <span className="text-neutral-600 ml-1">
                                (분석 후 재조회는 무료)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-info-50 border border-info-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-info-600 text-lg mt-0.5">
                              ℹ️
                            </span>
                            <p className="text-xs sm:text-sm text-info-900 leading-relaxed">
                              <strong>중요:</strong> AI는 "적합/부적합"을
                              판단하지 않습니다. 실행 방식의 차이를 객관적으로
                              해석하고, 관리 시 고려할 점을 제공합니다.
                            </p>
                          </div>
                        </div>

                        <button
                          disabled
                          className="w-full sm:w-auto px-6 py-3 bg-neutral-200 text-neutral-500 rounded-xl font-semibold text-sm sm:text-base cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <MdAutoAwesome className="w-5 h-5" />
                          <span>분석 시작 (준비 중)</span>
                        </button>

                        <p className="mt-3 text-xs text-neutral-500">
                          * AI Agent 구현 예정 기능입니다. 곧 만나보실 수
                          있습니다!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 분석 전: 개념적 미리보기 */}
                  {!hasAIAnalysis && (
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
                              의사결정 속도, 불확실성 내성, 자율성, 관계 중심성, 정확성 요구도를 직무와 지원자 간 비교하여 해석합니다.
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
                              실행 방식 차이를 고려한 구체적인 관리 가이드와 주의사항을 제공합니다.
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
                              지원자의 성장을 돕고 효과적인 소통을 위한 맞춤형 조언을 제공합니다.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-purple-200">
                        <p className="text-xs text-neutral-600 flex items-center gap-2">
                          <span>💡</span>
                          <span>분석 후에는 실제 데이터 기반의 상세한 해석 결과를 확인하실 수 있습니다.</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 분석 후: 상세 결과 */}
                  {hasAIAnalysis && (
                    <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 mt-6">
                      <h5 className="text-base sm:text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                        <span>📊</span>
                        <span>분석 결과</span>
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
                                <span className="text-xs text-neutral-600">
                                  지원자
                                </span>
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
                            💡 "직무는 장애 상황에서 빠른 판단을 요구하나,
                            지원자는 신중하게 분석 후 결정하는 스타일입니다."
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
                            장애 대응 매뉴얼과 의사결정 트리를 미리 제공하여
                            신속한 판단을 지원하세요.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 채용 상태 관리 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6 no-pdf">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-neutral-800 mb-1">
                  채용 상태 관리
                </h3>
                <p className="text-sm sm:text-base text-neutral-600">
                  분석 결과를 바탕으로 채용 의사결정을 진행하세요.
                </p>
              </div>
              {/* 현재 상태 배지 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600">현재 상태:</span>
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    currentApplicant.status === "pending"
                      ? "bg-neutral-100 text-neutral-700"
                      : currentApplicant.status === "shortlisted"
                        ? "bg-info-50 text-info-700 border border-info-200"
                        : currentApplicant.status === "interview"
                          ? "bg-warning-50 text-warning-700 border border-warning-200"
                          : currentApplicant.status === "rejected"
                            ? "bg-error-50 text-error-700 border border-error-200"
                            : "bg-success-50 text-success-700 border border-success-200"
                  }`}
                >
                  {currentApplicant.status === "pending"
                    ? "검토 대기"
                    : currentApplicant.status === "shortlisted"
                      ? "서류 합격"
                      : currentApplicant.status === "interview"
                        ? "면접 예정"
                        : currentApplicant.status === "rejected"
                          ? "불합격"
                          : "최종 합격"}
                </span>
              </div>
            </div>

            {/* 상태 변경 버튼들 */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <button
                onClick={() => {
                  if (applicantId) {
                    updateStatus({ applicantId, status: "shortlisted" });
                  }
                }}
                disabled={
                  currentApplicant.status === "shortlisted" || isUpdating
                }
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentApplicant.status === "shortlisted" || isUpdating
                    ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                    : "border border-info text-info hover:bg-info-50"
                }`}
              >
                {isUpdating ? "처리 중..." : "서류 합격"}
              </button>
              <button
                onClick={() => {
                  if (applicantId) {
                    updateStatus({ applicantId, status: "interview" });
                  }
                }}
                disabled={currentApplicant.status === "interview" || isUpdating}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentApplicant.status === "interview" || isUpdating
                    ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                    : "border border-warning text-warning hover:bg-warning-50"
                }`}
              >
                {isUpdating ? "처리 중..." : "면접 예정"}
              </button>
              <button
                onClick={() => {
                  if (applicantId) {
                    updateStatus({ applicantId, status: "passed" });
                  }
                }}
                disabled={currentApplicant.status === "passed" || isUpdating}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentApplicant.status === "passed" || isUpdating
                    ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                    : "bg-primary-500 text-white hover:bg-primary-600"
                }`}
              >
                {isUpdating ? "처리 중..." : "최종 합격"}
              </button>
              <button
                onClick={() => {
                  if (applicantId) {
                    updateStatus({ applicantId, status: "rejected" });
                  }
                }}
                disabled={currentApplicant.status === "rejected" || isUpdating}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentApplicant.status === "rejected" || isUpdating
                    ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                    : "border border-error text-error hover:bg-error-50"
                }`}
              >
                {isUpdating ? "처리 중..." : "불합격"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
