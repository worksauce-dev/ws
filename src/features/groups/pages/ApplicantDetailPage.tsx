import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdPsychology,
  MdGroups,
  MdQuestionAnswer,
  MdSchedule,
} from "react-icons/md";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { useGroupDetail } from "../hooks/useGroupDetail";
import { useUpdateApplicantStatus } from "../hooks/useUpdateApplicantStatus";
import { useToast } from "@/shared/components/ui/useToast";
import {
  analyzeTestResult,
  calculateJobFitScore,
  calculateTeamFitScore,
} from "../utils/analyzeTestResult";
import WORK_TYPE_DATA from "../constants/workTypes";
import { POSITION_OPTIONS } from "../constants/positionOptions";
import { ApplicantDetailHeader } from "../components/applicantDetail/ApplicantDetailHeader";
import { WorkTypeAnalysisTab } from "../components/applicantDetail/WorkTypeAnalysisTab";
import { TeamSynergyTab } from "../components/applicantDetail/TeamSynergyTab";
import { InterviewGuideTab } from "../components/applicantDetail/InterviewGuideTab";
import { TeamCompositionChart } from "../components/applicantDetail/TeamCompositionChart";
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

  // 팀 적합도 분석 (현재 팀 구성이 있는 경우에만)
  const teamFitAnalysis = useMemo(
    () =>
      analyzedResult && data?.group?.current_team_composition
        ? calculateTeamFitScore(
            analyzedResult.primaryType.code,
            data.group.current_team_composition
          )
        : null,
    [analyzedResult, data?.group?.current_team_composition]
  );

  // 상태 관리 (초기값을 applicant 데이터에서 가져오기)
  const [isStarred, setIsStarred] = useState(
    currentApplicant?.is_starred ?? false
  );
  const [activeTab, setActiveTab] = useState<"analysis" | "team" | "interview">(
    "analysis"
  );

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
          </div>
        </div>

        {/* 팀 적합도 분석 (현재 팀 구성이 있는 경우에만 표시) */}
        {teamFitAnalysis && (
          <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-neutral-800 mb-4">
              팀 적합도 분석
            </h3>

            {/* 점수 표시 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="text-xs sm:text-sm text-neutral-600 mb-1">
                  팀 밸런스 점수
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  {teamFitAnalysis.balanceScore}
                  <span className="text-base sm:text-lg text-neutral-500">/100</span>
                </div>
              </div>
              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="text-xs sm:text-sm text-neutral-600 mb-1">
                  팀 다양성 점수
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  {teamFitAnalysis.diversityScore}
                  <span className="text-base sm:text-lg text-neutral-500">/100</span>
                </div>
              </div>
            </div>

            {/* 추천 메시지 */}
            <div
              className={`p-4 rounded-lg border-2 ${
                teamFitAnalysis.recommendation.level === "excellent"
                  ? "bg-success-50 border-success-200"
                  : teamFitAnalysis.recommendation.level === "good"
                    ? "bg-info-50 border-info-200"
                    : teamFitAnalysis.recommendation.level === "neutral"
                      ? "bg-neutral-50 border-neutral-200"
                      : "bg-warning-50 border-warning-200"
              }`}
            >
              <div
                className={`text-sm sm:text-base font-semibold mb-2 ${
                  teamFitAnalysis.recommendation.level === "excellent"
                    ? "text-success-800"
                    : teamFitAnalysis.recommendation.level === "good"
                      ? "text-info-800"
                      : teamFitAnalysis.recommendation.level === "neutral"
                        ? "text-neutral-800"
                        : "text-warning-800"
                }`}
              >
                {teamFitAnalysis.recommendation.message}
              </div>
              <ul className="space-y-1">
                {teamFitAnalysis.recommendation.reasons.map((reason, idx) => (
                  <li
                    key={idx}
                    className={`text-xs sm:text-sm ${
                      teamFitAnalysis.recommendation.level === "excellent"
                        ? "text-success-700"
                        : teamFitAnalysis.recommendation.level === "good"
                          ? "text-info-700"
                          : teamFitAnalysis.recommendation.level === "neutral"
                            ? "text-neutral-700"
                            : "text-warning-700"
                    }`}
                  >
                    • {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* 팀 구성 변화 (Before/After 차트) */}
            <div className="mt-6">
              <div className="text-sm font-medium text-neutral-700 mb-4">
                팀 구성 변화
              </div>
              <TeamCompositionChart
                currentComposition={teamFitAnalysis.currentComposition}
                afterComposition={teamFitAnalysis.afterComposition}
              />
            </div>
          </div>
        )}

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
