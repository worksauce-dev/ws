import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdEmail,
  MdCalendarToday,
  MdStar,
  MdStarBorder,
  MdFileDownload,
  MdCheckCircle,
  MdTrendingUp,
  MdGroups,
  MdPsychology,
  MdQuestionAnswer,
  MdLightbulb,
  MdWarning,
  MdThumbUp,
  MdThumbDown,
  MdSchedule,
  MdWork,
} from "react-icons/md";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { useGroupDetail } from "../hooks/useGroupDetail";
import {
  analyzeTestResult,
  calculateJobFitScore,
} from "../utils/analyzeTestResult";
import WORK_TYPE_DATA from "../constants/workTypes";
import { POSITION_OPTIONS } from "../constants/positionOptions";
import type { WorkTypeCode } from "../types/workType.types";

export const ApplicantDetailPage = () => {
  const { groupId, applicantId } = useParams<{
    groupId: string;
    applicantId: string;
  }>();
  const navigate = useNavigate();

  // 상태 관리
  const [isStarred, setIsStarred] = useState(false);
  const [activeTab, setActiveTab] = useState<"analysis" | "team" | "interview">(
    "analysis"
  );
  const [potentialView, setPotentialView] = useState<"career" | "capability">(
    "career"
  );

  // 그룹 상세 정보 조회 (지원자 데이터 포함)
  const { data, isLoading, isError, error } = useGroupDetail(groupId || "");

  // 현재 지원자 찾기
  const currentApplicant = data?.applicants?.find(a => a.id === applicantId);

  const handleBackClick = () => {
    navigate(`/dashboard/groups/${groupId}`);
  };

  // Helper 함수들
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-warning";
    return "text-error";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success">
            <MdCheckCircle className="w-4 h-4 mr-1" />
            테스트 완료
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-warning-100 text-warning">
            <MdSchedule className="w-4 h-4 mr-1" />
            진행 중
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 text-neutral-600">
            <MdSchedule className="w-4 h-4 mr-1" />
            대기 중
          </span>
        );
      default:
        return null;
    }
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

  // 테스트 결과 분석
  const analyzedResult = analyzeTestResult(currentApplicant.test_result);
  const workTypeData = WORK_TYPE_DATA[analyzedResult.primaryType.code];

  // 유형 매칭도: 선호 유형들과의 종합 매칭 점수 (반올림)
  const matchScore = Math.round(
    calculateJobFitScore(
      analyzedResult.scoreDistribution,
      data.group.preferred_work_types
    )
  );

  // 포지션 라벨 찾기
  const positionLabel =
    POSITION_OPTIONS.find(option => option.value === data.group.position)
      ?.label || data.group.position;

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
      actions={
        <button className="inline-flex items-center px-4 py-2 rounded-lg font-medium border border-neutral-200 text-neutral-700 transition-colors duration-200 hover:bg-gray-50">
          <MdFileDownload className="w-4 h-4 mr-2" />
          리포트 다운로드
        </button>
      }
    >
      <div className="space-y-6">
        {/* 종합 평가 헤더 - 통합형 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-8">
          {/* 기본 정보 */}
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-3xl font-bold text-neutral-800">
              {currentApplicant.name}
            </h2>
            <button
              onClick={() => setIsStarred(!isStarred)}
              className="p-1 rounded hover:bg-gray-200 transition-colors duration-200"
              aria-label={isStarred ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            >
              {isStarred ? (
                <MdStar className="w-6 h-6 text-warning" />
              ) : (
                <MdStarBorder className="w-6 h-6 text-neutral-500" />
              )}
            </button>
            {getStatusBadge(currentApplicant.test_status)}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-neutral-600 mb-6">
            <div className="flex items-center gap-2">
              <MdEmail className="w-4 h-4" />
              <span>{currentApplicant.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MdCalendarToday className="w-4 h-4" />
              <span>
                {currentApplicant.test_submitted_at
                  ? `검사 완료일: ${new Date(currentApplicant.test_submitted_at).toLocaleDateString()}`
                  : `지원일: ${new Date(currentApplicant.created_at).toLocaleDateString()}`}
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
                    className={`text-3xl font-bold ${getScoreColor(matchScore)}`}
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
                  {data.group.preferred_work_types
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

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-xl border border-neutral-200">
          <div className="px-6 py-4 border-b border-neutral-200">
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
                className={`px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "analysis"
                    ? "bg-white text-primary shadow-md scale-[1.02]"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <MdPsychology className="w-5 h-5" />
                  <span className="whitespace-nowrap">직무유형 분석</span>
                </div>
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "team"}
                aria-controls="team-panel"
                id="team-tab"
                onClick={() => setActiveTab("team")}
                className={`px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "team"
                    ? "bg-white text-primary shadow-md scale-[1.02]"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <MdGroups className="w-5 h-5" />
                  <span className="whitespace-nowrap">팀워크 스타일</span>
                </div>
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "interview"}
                aria-controls="interview-panel"
                id="interview-tab"
                onClick={() => setActiveTab("interview")}
                className={`px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "interview"
                    ? "bg-white text-primary shadow-md scale-[1.02]"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <MdQuestionAnswer className="w-5 h-5" />
                  <span className="whitespace-nowrap">면접 가이드</span>
                </div>
              </button>
            </div>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="p-6">
            {activeTab === "analysis" && (
              <div
                role="tabpanel"
                id="analysis-panel"
                aria-labelledby="analysis-tab"
                className="space-y-6"
              >
                {/* 강점 & 약점 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
                      <MdTrendingUp className="w-4 h-4" />
                      주요 강점
                    </h4>
                    <div className="space-y-3">
                      {workTypeData.strengths.map((strength, index) => (
                        <div
                          key={index}
                          className="p-4 bg-success-50 rounded-xl border border-success-100 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-success-100 flex items-center justify-center flex-shrink-0">
                              <MdTrendingUp className="w-5 h-5 text-success" />
                            </div>
                            <div>
                              <p className="font-semibold text-success-700 mb-1.5">
                                {strength.title}
                              </p>
                              <p className="text-sm text-success-600 leading-relaxed">
                                {strength.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-warning mb-3 flex items-center gap-2">
                      <MdWarning className="w-4 h-4" />
                      주의 사항
                    </h4>
                    <div className="space-y-3">
                      {workTypeData.weaknesses.map((weakness, index) => (
                        <div
                          key={index}
                          className="p-4 bg-warning-50 rounded-xl border border-warning-100 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-warning-100 flex items-center justify-center flex-shrink-0">
                              <MdWarning className="w-5 h-5 text-warning" />
                            </div>
                            <div>
                              <p className="font-semibold text-warning-700 mb-1.5">
                                {weakness.title}
                              </p>
                              <p className="text-sm text-warning-600 leading-relaxed">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                      <MdThumbUp className="w-5 h-5" />
                      동기 부여 요소
                    </h4>
                    <div className="space-y-2">
                      {workTypeData.motivators.map((motivator, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-primary-50 rounded-lg border border-primary-100"
                        >
                          <MdThumbUp className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-primary-700">{motivator}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-error mb-4 flex items-center gap-2">
                      <MdThumbDown className="w-5 h-5" />
                      스트레스 요인
                    </h4>
                    <div className="space-y-2">
                      {workTypeData.stressors.map((stressor, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-error-50 rounded-lg border border-error-100"
                        >
                          <MdThumbDown className="w-4 h-4 text-error flex-shrink-0" />
                          <span className="text-error-700">{stressor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 업무 스타일 */}
                <div>
                  <h4 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                    <MdLightbulb className="w-5 h-5 text-info" />
                    업무 스타일
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workTypeData.workStyle.map((style, index) => (
                      <div
                        key={index}
                        className="p-4 bg-info-50 rounded-xl border border-info-100 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-info-100 flex items-center justify-center flex-shrink-0">
                            <MdLightbulb className="w-5 h-5 text-info" />
                          </div>
                          <div>
                            <p className="font-semibold text-info-700 mb-1.5">
                              {style.title}
                            </p>
                            <p className="text-sm text-info-600 leading-relaxed">
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
                  <h4 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                    <MdCheckCircle className="w-5 h-5 text-primary" />
                    효과적인 관리 방법
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {workTypeData.managementTips.map((tip, index) => (
                      <div
                        key={index}
                        className="p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                      >
                        <span className="text-neutral-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 발전 가능성 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
                      <MdTrendingUp className="w-5 h-5 text-success" />
                      발전 가능성
                    </h4>
                    {/* 토글 버튼 */}
                    <div className="flex rounded-lg p-1 bg-neutral-100">
                      <button
                        onClick={() => setPotentialView("career")}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                          potentialView === "career"
                            ? "bg-white text-success shadow-sm"
                            : "text-neutral-600 hover:text-neutral-800"
                        }`}
                      >
                        직무/포지션 중심
                      </button>
                      <button
                        onClick={() => setPotentialView("capability")}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
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
                  <div className="mb-4 p-4 bg-success-50 rounded-lg border border-success-100">
                    <p className="text-sm text-success-700 leading-relaxed">
                      {potentialView === "career" ? (
                        <>
                          <strong className="font-semibold">직무/포지션 중심 관점:</strong>{" "}
                          이 유형이 성장할 수 있는 구체적인 직무와 포지션 경로를 제시합니다.
                        </>
                      ) : (
                        <>
                          <strong className="font-semibold">역량 중심 관점:</strong>{" "}
                          이 유형이 개발할 수 있는 핵심 역량과 성장 방향을 제시합니다.
                        </>
                      )}
                    </p>
                  </div>

                  {/* 발전 가능성 3가지 */}
                  <div className="space-y-3">
                    {workTypeData.developmentPotential[potentialView].map(
                      (potential, index) => (
                        <div
                          key={index}
                          className="p-5 bg-gradient-to-r from-success-50 to-info-50 rounded-xl border border-success-100 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-success-100 flex items-center justify-center">
                              <span className="text-success font-bold text-lg">
                                {index + 1}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="text-neutral-800 leading-relaxed">
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
            )}

            {activeTab === "team" && (
              <div
                role="tabpanel"
                id="team-panel"
                aria-labelledby="team-tab"
                className="space-y-6"
              >
                {/* 팀워크 스타일 소개 */}
                <div className="bg-gradient-to-r from-primary-50 to-info-50 rounded-xl p-6 border border-primary-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <MdGroups className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-2">
                        {workTypeData.name}의 팀워크 스타일
                      </h3>
                      <p className="text-neutral-700 leading-relaxed">
                        이 유형은 다음과 같은 방식으로 팀에 기여하며 협업합니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 팀워크 스타일 3가지 */}
                <div className="space-y-4">
                  {workTypeData.teamworkStyle.map((style, index) => (
                    <div
                      key={index}
                      className="p-6 bg-white rounded-xl border-2 border-primary-100 hover:border-primary-200 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary font-bold text-lg">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-neutral-800 text-lg leading-relaxed">
                            {style}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 관리 팁 */}
                <div>
                  <h4 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                    <MdLightbulb className="w-5 h-5 text-info" />
                    효과적인 협업을 위한 관리 팁
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {workTypeData.managementTips.map((tip, index) => (
                      <div
                        key={index}
                        className="p-4 bg-info-50 rounded-lg border border-info-100"
                      >
                        <div className="flex items-start gap-2">
                          <MdCheckCircle className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                          <span className="text-info-700 leading-relaxed">
                            {tip}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "interview" && (
              <div
                role="tabpanel"
                id="interview-panel"
                aria-labelledby="interview-tab"
                className="space-y-6"
              >
                {/* 추천 면접 질문 - Full Width */}
                <div>
                  <h4 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                    <MdQuestionAnswer className="w-5 h-5" />
                    추천 면접 질문
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {workTypeData.interview.questions.map((item, index) => (
                      <div
                        key={index}
                        className="p-5 bg-white border-2 border-primary-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary font-bold text-sm flex items-center justify-center">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <span className="inline-block px-2.5 py-1 rounded-md bg-primary-50 text-primary text-xs font-semibold mb-2">
                              {item.category}
                            </span>
                            <p className="text-neutral-800 font-medium leading-relaxed">
                              {item.question}
                            </p>
                          </div>
                        </div>

                        <div className="ml-11 pl-4 border-l-2 border-primary-100">
                          <p className="text-sm text-primary-600 leading-relaxed">
                            <span className="font-semibold">✓ </span>
                            {item.lookFor}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 긍정적 신호 & 주의 신호 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-success mb-4 flex items-center gap-2">
                      <MdThumbUp className="w-5 h-5" />
                      긍정적 신호
                    </h4>
                    <div className="space-y-2">
                      {workTypeData.interview.greenFlags.map(
                        (signal, index) => (
                          <div
                            key={index}
                            className="p-3 bg-success-50 rounded-lg border border-success-100"
                          >
                            <div className="flex items-start gap-2">
                              <MdThumbUp className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                              <span className="text-success-700 leading-relaxed">
                                {signal}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-error mb-4 flex items-center gap-2">
                      <MdWarning className="w-5 h-5" />
                      주의 신호
                    </h4>
                    <div className="space-y-2">
                      {workTypeData.interview.redFlags.map((flag, index) => (
                        <div
                          key={index}
                          className="p-3 bg-error-50 rounded-lg border border-error-100"
                        >
                          <div className="flex items-start gap-2">
                            <MdWarning className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                            <span className="text-error-700 leading-relaxed">
                              {flag}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 면접 체크리스트 */}
                <div className="bg-gradient-to-r from-neutral-50 to-primary-50 rounded-xl p-6 border border-neutral-200">
                  <h4 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                    <MdCheckCircle className="w-5 h-5 text-primary" />
                    면접 진행 체크리스트
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {workTypeData.interview.questions
                      .slice(0, 6)
                      .map((item, index) => (
                        <label
                          key={index}
                          className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-primary-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            className="rounded text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-neutral-700 font-medium">
                            {item.category} 확인
                          </span>
                        </label>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-1">
                다음 단계
              </h3>
              <p className="text-neutral-600">
                분석 결과를 바탕으로 채용 의사결정을 진행하세요.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-6 py-2 rounded-lg font-medium border border-error text-error transition-colors duration-200 hover:bg-error-50">
                불합격 처리
              </button>
              <button className="px-6 py-2 rounded-lg font-medium border border-warning text-warning transition-colors duration-200 hover:bg-warning-50">
                추가 면접 일정
              </button>
              <button className="px-6 py-2 rounded-lg font-medium bg-primary-500 text-white transition-colors duration-200 hover:bg-primary-600">
                최종 합격 처리
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
