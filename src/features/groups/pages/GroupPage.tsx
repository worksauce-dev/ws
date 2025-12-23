import { useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdEmail,
  MdPerson,
  MdCheckCircle,
  MdCancel,
  MdPending,
  MdTrendingUp,
  MdAssignment,
  MdSearch,
  MdStar,
  MdStarBorder,
  MdCalendarToday,
  MdWork,
  MdNotifications,
} from "react-icons/md";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { TabGroup } from "@/shared/components/ui/TabGroup";
import { type TestStatus } from "@/shared/types/database.types";
import { useGroupDetail } from "../hooks/useGroupDetail";
import {
  WORK_TYPE_KEYWORDS,
  type WorkTypeCode,
} from "@/features/groups/constants/workTypeKeywords";
import { POSITION_OPTIONS } from "@/features/groups/constants/positionOptions";
import { useDdayCalculator } from "@/features/dashboard/hooks/useDdayCalculator";
import { calculateJobFitScore } from "../utils/analyzeTestResult";
import { AddApplicantModal } from "../components/AddApplicantModal";

export const GroupPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  // 그룹 상세 정보 조회
  const { data, isLoading, isError, error } = useGroupDetail(groupId || "");

  // D-day 계산 훅
  const { calculateDday, getDdayColor } = useDdayCalculator();

  const [selectedTab, setSelectedTab] = useState<"all" | "completed">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddApplicantModalOpen, setIsAddApplicantModalOpen] = useState(false);

  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case "completed":
        return <MdCheckCircle className="w-4 h-4 text-success" />;
      case "in_progress":
        return <MdStar className="w-4 h-4 text-warning" />;
      case "expired":
        return <MdCancel className="w-4 h-4 text-error" />;
      case "pending":
        return <MdPending className="w-4 h-4 text-neutral-500" />;
      default:
        return <MdPending className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getStatusLabel = (status: TestStatus): string => {
    switch (status) {
      case "completed":
        return "완료";
      case "in_progress":
        return "진행중";
      case "expired":
        return "만료";
      case "pending":
        return "대기중";
      default:
        return "대기중";
    }
  };

  const getStatusColor = (status: TestStatus) => {
    switch (status) {
      case "completed":
        return "bg-success-50 text-success-700 border-success-200";
      case "in_progress":
        return "bg-warning-50 text-warning-700 border-warning-200";
      case "expired":
        return "bg-error-50 text-error-700 border-error-200";
      case "pending":
        return "bg-neutral-50 text-neutral-700 border-neutral-200";
      default:
        return "bg-neutral-50 text-neutral-700 border-neutral-200";
    }
  };

  // 데이터 추출
  const currentGroup = data?.group;
  const applicants = useMemo(() => data?.applicants || [], [data?.applicants]);

  const filteredApplicants = applicants.filter(applicant => {
    // 탭 필터링
    const matchesTab =
      selectedTab === "all" || applicant.test_status === selectedTab;

    // 검색어 필터링
    const matchesSearch =
      searchTerm === "" ||
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.test_status.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  };

  // 포지션 라벨 표시 헬퍼 함수
  const getPositionLabel = (positionValue: string): string => {
    const position = POSITION_OPTIONS.find(p => p.value === positionValue);
    return position?.label || positionValue;
  };

  // 경력 수준 표시 헬퍼 함수
  const getExperienceLevelLabel = (level: string): string => {
    const levelMap: Record<string, string> = {
      entry: "신입 (0-1년)",
      junior: "주니어 (1-3년)",
      mid: "중급 (3-5년)",
      senior: "시니어 (5년 이상)",
      lead: "리드/매니저급",
      any: "경력 무관",
    };
    return levelMap[level] || level;
  };

  // 그룹 상태 색상 (deadline 기준)
  const getGroupStatusColor = (group: typeof currentGroup) => {
    if (!group) return "bg-gray-100 text-gray-800 border-gray-200";

    // draft 상태는 그대로 유지
    if (group.status === "draft") {
      return "bg-gray-100 text-gray-800 border-gray-200";
    }

    // 마감일 기준으로 판단
    const now = new Date();
    const deadline = new Date(group.deadline);

    if (deadline < now) {
      // 마감됨
      return "bg-red-100 text-red-800 border-red-200";
    } else {
      // 진행중
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  // 그룹 상태 텍스트 (deadline 기준)
  const getGroupStatusText = (group: typeof currentGroup) => {
    if (!group) return "상태 없음";

    // draft 상태는 그대로 유지
    if (group.status === "draft") {
      return "준비중";
    }

    // 마감일 기준으로 판단
    const now = new Date();
    const deadline = new Date(group.deadline);

    if (deadline < now) {
      return "마감";
    } else {
      return "진행중";
    }
  };

  const toggleStar = (candidateId: string) => {
    // Mock function - 실제 구현에서는 상태 업데이트 로직 추가
    console.log("Toggle star for candidate:", candidateId);
  };

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const handleApplicantClick = (applicantId: string) => {
    navigate(`/dashboard/groups/${groupId}/applicants/${applicantId}`);
  };

  // 지원자 추가 버튼 클릭 핸들러
  const handleAddApplicantClick = () => {
    if (!currentGroup) return;

    // 마감일 체크
    const now = new Date();
    const deadline = new Date(currentGroup.deadline);

    if (deadline < now) {
      // 마감일이 지난 경우 확인 메시지
      const confirmed = window.confirm(
        `⚠️ 이미 마감일이 지난 그룹이에요.\n\n마감일: ${new Date(
          currentGroup.deadline
        ).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}\n\n계속 지원자를 추가하시겠습니까?`
      );

      if (!confirmed) {
        return; // 취소하면 모달 열지 않음
      }
    }

    // 확인했거나 마감일 전이면 모달 열기
    setIsAddApplicantModalOpen(true);
  };

  // WorkType 코드를 이름으로 변환하는 헬퍼 함수
  const getWorkTypeName = (code: WorkTypeCode): string => {
    const workType = WORK_TYPE_KEYWORDS.find(wt => wt.code === code);
    return workType?.type || code;
  };

  // WorkType별 색상 매핑
  const getWorkTypeColor = (code: WorkTypeCode): string => {
    const colorMap: Record<WorkTypeCode, string> = {
      SE: "bg-blue-500",
      SA: "bg-purple-500",
      AS: "bg-pink-500",
      AF: "bg-orange-500",
      UM: "bg-teal-500",
      UR: "bg-indigo-500",
      CA: "bg-green-500",
      CH: "bg-cyan-500",
      EE: "bg-red-500",
      EG: "bg-amber-500",
    };
    return colorMap[code] || "bg-gray-500";
  };

  // 2차 직무 유형 계산 (statementScores에서 두 번째로 높은 점수)
  const getSecondaryWorkType = (
    statementScores: Record<WorkTypeCode, number>
  ): WorkTypeCode | null => {
    const sorted = Object.entries(statementScores).sort(
      ([, a], [, b]) => b - a
    );
    return sorted.length > 1 ? (sorted[1][0] as WorkTypeCode) : null;
  };

  // statementScores를 scoreDistribution 형태로 변환하는 헬퍼
  const convertToScoreDistribution = useCallback(
    (statementScores: Record<WorkTypeCode, number>) => {
      return Object.entries(statementScores).map(([code, score]) => ({
        code: code as WorkTypeCode,
        name: getWorkTypeName(code as WorkTypeCode),
        score,
        level: "high" as const, // 실제로는 사용하지 않음
        rank: 0, // 실제로는 사용하지 않음
      }));
    },
    []
  );

  // 점수 색상 클래스
  const getScoreColorClass = (score: number): string => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-warning";
    return "text-error";
  };

  // 직무 유형 분포 계산
  const calculateWorkTypeDistribution = () => {
    const completedApplicants = applicants.filter(
      a => a.test_result?.primaryWorkType
    );

    if (completedApplicants.length === 0) return [];

    // WorkType별 카운트
    const countMap: Record<string, number> = {};
    completedApplicants.forEach(applicant => {
      const workType = applicant.test_result?.primaryWorkType;
      if (workType) {
        countMap[workType] = (countMap[workType] || 0) + 1;
      }
    });

    // 배열로 변환하고 정렬
    return Object.entries(countMap)
      .map(([code, count]) => ({
        code: code as WorkTypeCode,
        name: getWorkTypeName(code as WorkTypeCode),
        count,
        percentage: Math.round((count / completedApplicants.length) * 100),
        colorClass: getWorkTypeColor(code as WorkTypeCode),
      }))
      .sort((a, b) => b.count - a.count); // 카운트 많은 순으로 정렬
  };

  const workTypeDistribution = calculateWorkTypeDistribution();

  // 평균 매칭도 계산 (useMemo로 최적화)
  const averageJobMatchScore = useMemo(() => {
    const completedWithScores = applicants.filter(
      a => a.test_status === "completed" && a.test_result?.statementScores
    );
    if (completedWithScores.length === 0) return 0;

    const totalScore = completedWithScores.reduce(
      (sum, a) =>
        sum +
        Math.round(
          calculateJobFitScore(
            convertToScoreDistribution(a.test_result!.statementScores),
            currentGroup?.preferred_work_types || []
          )
        ),
      0
    );
    return Math.round(totalScore / completedWithScores.length);
  }, [applicants, currentGroup?.preferred_work_types, convertToScoreDistribution]);

  // 추천 후보 수 계산
  const recommendedCount = useMemo(() => {
    return applicants.filter(
      applicant =>
        applicant.test_status === "completed" &&
        applicant.test_result?.primaryWorkType &&
        currentGroup?.preferred_work_types.includes(
          applicant.test_result.primaryWorkType
        )
    ).length;
  }, [applicants, currentGroup?.preferred_work_types]);

  // 완료된 지원자 수
  const completedCount = useMemo(() => {
    return applicants.filter(a => a.test_status === "completed").length;
  }, [applicants]);

  // 로딩 상태
  if (isLoading) {
    return (
      <DashboardLayout title="로딩 중..." description="">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-neutral-600 text-lg">
              그룹 정보를 불러오는 중...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // 에러 상태
  if (isError || !currentGroup) {
    return (
      <DashboardLayout title="오류" description="">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-error text-lg mb-4">
              {error?.message || "그룹을 찾을 수 없습니다."}
            </p>
            <button
              onClick={handleBackClick}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
            >
              대시보드로 돌아가기
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={currentGroup.name}
      description={currentGroup.description || ""}
      showBackButton={true}
      onBackClick={handleBackClick}
      breadcrumbs={[
        { label: "대시보드", href: "/dashboard" },
        { label: currentGroup.name },
      ]}
      statusBadge={
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium border ${getGroupStatusColor(currentGroup)}`}
        >
          {getGroupStatusText(currentGroup)}
        </span>
      }
      actions={
        <button
          onClick={handleAddApplicantClick}
          className="inline-flex items-center px-4 py-2 rounded-lg font-medium border border-neutral-200 text-neutral-700 transition-colors duration-200 hover:bg-neutral-50"
        >
          <MdEmail className="w-4 h-4 mr-2" />
          지원자 추가하기
        </button>
      }
    >
      {/* 지원자 추가 모달 */}
      <AddApplicantModal
        isOpen={isAddApplicantModalOpen}
        onClose={() => setIsAddApplicantModalOpen(false)}
        groupId={groupId!}
      />
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="h-full bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center h-full">
            <div className="p-3 rounded-lg mr-4 bg-info-100">
              <MdPerson className="w-6 h-6 text-info" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-600">총 지원자</p>
              <p className="text-2xl font-bold text-neutral-800">
                {applicants.length}명
              </p>
            </div>
          </div>
        </div>
        <div className="h-full bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center h-full">
            <div className="p-3 rounded-lg mr-4 bg-success-100">
              <MdCheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-600">
                테스트 완료
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-neutral-800">
                  {completedCount}명
                </p>
                <p className="text-sm text-neutral-600">
                  (
                  {applicants.length > 0
                    ? Math.round((completedCount / applicants.length) * 100)
                    : 0}
                  %)
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center h-full">
            <div className="p-3 rounded-lg mr-4 bg-warning-100">
              <MdTrendingUp className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-600">추천 후보</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-neutral-800">
                  {recommendedCount}명
                </p>
                <p className="text-sm text-neutral-600">
                  (
                  {completedCount > 0
                    ? Math.round((recommendedCount / completedCount) * 100)
                    : 0}
                  %)
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center h-full">
            <div className="p-3 rounded-lg mr-4 bg-primary-100">
              <MdTrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-600">
                평균 매칭도
              </p>
              <div className="flex items-baseline gap-2">
                <p
                  className={`text-2xl font-bold ${getScoreColorClass(averageJobMatchScore)}`}
                >
                  {averageJobMatchScore}%
                </p>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                완료된 지원자 기준
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs and Controls */}
          <div className="bg-white rounded-xl border border-neutral-200 mb-6 overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                {/* Tabs */}
                <TabGroup
                  tabs={[
                    {
                      id: "all",
                      label: "전체",
                      count: applicants.length,
                    },
                    {
                      id: "completed",
                      label: "완료",
                      count: applicants.filter(
                        applicant => applicant.test_status === "completed"
                      ).length,
                    },
                  ]}
                  activeTab={selectedTab}
                  variant="secondary"
                  onChange={tabId =>
                    setSelectedTab(tabId as "all" | "completed")
                  }
                />

                {/* Search */}
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="이름, 이메일 검색"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm text-neutral-800"
                  />
                </div>
              </div>
            </div>

            {/* applicant List */}
            <div className="divide-y divide-neutral-200">
              {filteredApplicants.map(applicant => (
                <div
                  key={applicant.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleApplicantClick(applicant.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            toggleStar(applicant.id);
                          }}
                          className="p-1 rounded hover:bg-gray-200 transition-colors duration-200"
                        >
                          {applicant.is_starred ? (
                            <MdStar className="w-4 h-4 text-warning" />
                          ) : (
                            <MdStarBorder className="w-4 h-4 text-neutral-500" />
                          )}
                        </button>
                        <h3 className="font-semibold text-lg text-neutral-800">
                          {applicant.name}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(applicant.test_status)}`}
                        >
                          {getStatusIcon(applicant.test_status)}
                          <span>{getStatusLabel(applicant.test_status)}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mb-3 text-sm text-neutral-600">
                        <span>{applicant.email}</span>
                        <span>•</span>
                        <span>지원일: {formatDate(applicant.created_at)}</span>
                        {applicant.test_submitted_at && (
                          <>
                            <span>•</span>
                            <span>
                              완료일: {formatDate(applicant.test_submitted_at)}
                            </span>
                          </>
                        )}
                      </div>

                      {applicant.test_result?.statementScores && (
                        <div className="flex items-center gap-6 mb-3">
                          {/* 주/부 유형 */}
                          <div className="flex items-center gap-1">
                            <span className="text-base font-bold text-primary">
                              {getWorkTypeName(
                                applicant.test_result.primaryWorkType
                              )}
                            </span>
                            {(() => {
                              const secondary = getSecondaryWorkType(
                                applicant.test_result.statementScores
                              );
                              return secondary ? (
                                <>
                                  <span className="text-neutral-400 mx-1">
                                    /
                                  </span>
                                  <span className="text-sm font-medium text-neutral-600">
                                    {getWorkTypeName(secondary)}
                                  </span>
                                </>
                              ) : null;
                            })()}
                          </div>

                          <span className="text-neutral-300">|</span>

                          {/* 유형 매칭도 */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-neutral-700">
                              유형 매칭도
                            </span>
                            <span
                              className={`text-lg font-bold ${getScoreColorClass(
                                Math.round(
                                  calculateJobFitScore(
                                    convertToScoreDistribution(
                                      applicant.test_result.statementScores
                                    ),
                                    currentGroup.preferred_work_types
                                  )
                                )
                              )}`}
                            >
                              {Math.round(
                                calculateJobFitScore(
                                  convertToScoreDistribution(
                                    applicant.test_result.statementScores
                                  ),
                                  currentGroup.preferred_work_types
                                )
                              )}
                              %
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredApplicants.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
                  <MdAssignment className="w-8 h-8 text-neutral-500" />
                </div>
                <p className="text-sm text-neutral-600">
                  조건에 맞는 지원자가 없습니다
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Group Info & Work Type Distribution */}
        <div className="lg:col-span-1">
          {/* 그룹 정보 */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-neutral-800">
              그룹 정보
            </h2>
            <div className="space-y-4">
              {/* 모집 포지션 */}
              <div className="flex items-start gap-3">
                <MdWork className="w-5 h-5 text-neutral-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-neutral-500 mb-1">모집 포지션</p>
                  <p className="text-sm font-medium text-neutral-800">
                    {getPositionLabel(currentGroup.position)}
                  </p>
                </div>
              </div>

              {/* 경력 수준 */}
              <div className="flex items-start gap-3">
                <MdPerson className="w-5 h-5 text-neutral-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-neutral-500 mb-1">경력 수준</p>
                  <p className="text-sm font-medium text-neutral-800">
                    {getExperienceLevelLabel(currentGroup.experience_level)}
                  </p>
                </div>
              </div>

              {/* 마감일 */}
              <div className="flex items-start gap-3">
                <MdCalendarToday className="w-5 h-5 text-neutral-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-neutral-500 mb-1">마감일</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm font-medium text-neutral-800">
                      {new Date(currentGroup.deadline).toLocaleDateString(
                        "ko-KR",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <span
                      className={`text-xs font-semibold ${getDdayColor(currentGroup.deadline, currentGroup.status)}`}
                    >
                      {calculateDday(currentGroup.deadline)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 자동 리마인더 */}
              {currentGroup.auto_reminder && (
                <div className="flex items-start gap-3">
                  <MdNotifications className="w-5 h-5 text-neutral-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-neutral-500 mb-1">
                      자동 리마인더
                    </p>
                    <p className="text-sm font-medium text-success-600">
                      활성화됨
                    </p>
                  </div>
                </div>
              )}

              {/* 선호 직무 유형 */}
              <div className="pt-2 border-t border-neutral-100">
                <p className="text-xs text-neutral-500 mb-2">선호 직무 유형</p>
                <div className="flex flex-wrap gap-2">
                  {currentGroup.preferred_work_types.map(
                    (type: WorkTypeCode) => (
                      <span
                        key={type}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary"
                      >
                        {getWorkTypeName(type as WorkTypeCode)}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold mb-4 text-neutral-800">
              지원자 직무 유형 분포
            </h2>
            {workTypeDistribution.length > 0 ? (
              <div className="space-y-4">
                {workTypeDistribution.map(item => (
                  <div key={item.code}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-700 font-medium">
                        {item.name}
                      </span>
                      <span className="text-neutral-600">
                        {item.count}명 ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${item.colorClass}`}
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-neutral-600">
                  아직 완료된 테스트가 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
