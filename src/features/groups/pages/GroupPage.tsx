import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdEmail,
  MdPerson,
  MdCheckCircle,
  MdTrendingUp,
  MdAssignment,
  MdSearch,
} from "react-icons/md";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { TabGroup } from "@/shared/components/ui/TabGroup";
import { useGroupDetail } from "../hooks/useGroupDetail";
import type { WorkTypeCode } from "@/features/groups/constants/workTypeKeywords";
import { useDdayCalculator } from "@/features/dashboard/hooks/useDdayCalculator";
import { calculateJobFitScore } from "../utils/analyzeTestResult";
import { AddApplicantModal } from "../components/AddApplicantModal";
import { ApplicantCard } from "../components/ApplicantCard";
import { GroupInfoSidebar } from "../components/GroupInfoSidebar";
import { WorkTypeDistribution } from "../components/WorkTypeDistribution";
import { GroupPageSkeleton } from "../components/GroupPageSkeleton";
import {
  getGroupStatusColor,
  getGroupStatusText,
} from "../utils/groupStatusHelpers";
import {
  getWorkTypeName,
  getWorkTypeColor,
  convertToScoreDistribution,
} from "../utils/workTypeHelpers";
import { getScoreColorClass } from "../utils/formatHelpers";

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
  }, [applicants, currentGroup?.preferred_work_types]);

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
      <DashboardLayout>
        <GroupPageSkeleton />
      </DashboardLayout>
    );
  }

  // 에러 상태
  if (isError || !currentGroup) {
    return (
      <DashboardLayout title="오류">
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
          className={`hidden sm:inline-flex px-2 py-1 rounded-md text-xs font-medium border ${getGroupStatusColor(currentGroup)}`}
        >
          {getGroupStatusText(currentGroup)}
        </span>
      }
      actions={
        <button
          onClick={handleAddApplicantClick}
          className="inline-flex items-center px-3 sm:px-4 py-2 rounded-lg font-medium border border-neutral-200 text-neutral-700 transition-colors duration-200 hover:bg-neutral-50"
          aria-label="지원자 추가하기"
        >
          <MdEmail className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">지원자 추가하기</span>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <div className="h-full bg-white rounded-xl p-3 sm:p-6 border border-neutral-200">
          <div className="flex items-center h-full">
            <div className="p-2 sm:p-3 rounded-lg mr-2 sm:mr-4 bg-info-100">
              <MdPerson className="w-4 h-4 sm:w-6 sm:h-6 text-info" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-neutral-600">총 지원자</p>
              <p className="text-lg sm:text-2xl font-bold text-neutral-800">
                {applicants.length}명
              </p>
            </div>
          </div>
        </div>
        <div className="h-full bg-white rounded-xl p-3 sm:p-6 border border-neutral-200">
          <div className="flex items-center h-full">
            <div className="p-2 sm:p-3 rounded-lg mr-2 sm:mr-4 bg-success-100">
              <MdCheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-success" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-neutral-600">
                테스트 완료
              </p>
              <div className="flex items-baseline gap-1 sm:gap-2">
                <p className="text-lg sm:text-2xl font-bold text-neutral-800">
                  {completedCount}명
                </p>
                <p className="text-xs sm:text-sm text-neutral-600">
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
        <div className="h-full bg-white rounded-xl p-3 sm:p-6 border border-neutral-200">
          <div className="flex items-center h-full">
            <div className="p-2 sm:p-3 rounded-lg mr-2 sm:mr-4 bg-warning-100">
              <MdTrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-warning" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-neutral-600">추천 후보</p>
              <div className="flex items-baseline gap-1 sm:gap-2">
                <p className="text-lg sm:text-2xl font-bold text-neutral-800">
                  {recommendedCount}명
                </p>
                <p className="text-xs sm:text-sm text-neutral-600">
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
        <div className="h-full bg-white rounded-xl p-3 sm:p-6 border border-neutral-200">
          <div className="flex items-center h-full">
            <div className="p-2 sm:p-3 rounded-lg mr-2 sm:mr-4 bg-primary-100">
              <MdTrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-neutral-600">
                평균 매칭도
              </p>
              <div className="flex items-baseline gap-1 sm:gap-2">
                <p
                  className={`text-lg sm:text-2xl font-bold ${getScoreColorClass(averageJobMatchScore)}`}
                >
                  {averageJobMatchScore}%
                </p>
              </div>
              <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5 sm:mt-1">
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
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                {/* Tabs */}
                <div className="w-fit">
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
                </div>

                {/* Search */}
                <div className="relative sm:ml-auto sm:w-64">
                  <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="이름, 이메일 검색"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm text-neutral-800"
                  />
                </div>
              </div>
            </div>

            {/* applicant List */}
            <div className="divide-y divide-neutral-200">
              {filteredApplicants.map(applicant => (
                <ApplicantCard
                  key={applicant.id}
                  applicant={applicant}
                  preferredWorkTypes={currentGroup.preferred_work_types}
                  onToggleStar={toggleStar}
                  onClick={handleApplicantClick}
                />
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
          <GroupInfoSidebar
            group={currentGroup}
            calculateDday={calculateDday}
            getDdayColor={getDdayColor}
          />
          <WorkTypeDistribution distribution={workTypeDistribution} />
        </div>
      </div>
    </DashboardLayout>
  );
};
