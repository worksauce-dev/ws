import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdPerson,
  MdCheckCircle,
  MdTrendingUp,
  MdAssignment,
  MdSearch,
  MdEmail,
} from "react-icons/md";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { SelectDropdown } from "@/shared/components/ui/Dropdown";
import { useGroupDetail } from "../hooks/useGroupDetail";
import type { WorkTypeCode } from "@/features/groups/constants/workTypeKeywords";
import { useDdayCalculator } from "@/features/dashboard/hooks/useDdayCalculator";
import { calculateJobFitScore } from "../utils/analyzeTestResult";
import { AddApplicantModal } from "../components/AddApplicantModal";
import { ApplicantCard } from "../components/ApplicantCard";
import { GroupInfoSidebar } from "../components/GroupInfoSidebar";
import { WorkTypeDistribution } from "../components/WorkTypeDistribution";
import { GroupPageSkeleton } from "../components/GroupPageSkeleton";
import { DeletedResourceNotice } from "@/shared/components/DeletedResourceNotice";
import {
  getWorkTypeName,
  getWorkTypeColor,
  convertToScoreDistribution,
} from "../utils/workTypeHelpers";
import { getScoreColorClass } from "../utils/formatHelpers";
import {
  usePageSEO,
  WORKSAUCE_SEO_PRESETS,
} from "@/shared/hooks/usePageSEO";
import { useResendEmail } from "../hooks/useResendEmail";
import { Button } from "@/shared/components/ui/Button";

export const GroupPage = () => {
  usePageSEO(WORKSAUCE_SEO_PRESETS.groupDetail);
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  // 그룹 상세 정보 조회
  const { data, isLoading, isError } = useGroupDetail(groupId || "");

  // D-day 계산 훅
  const { calculateDday, getDdayColor } = useDdayCalculator();

  const [selectedTab, setSelectedTab] = useState<
    | "all"
    | "completed"
    | "pending"
    | "shortlisted"
    | "interview"
    | "rejected"
    | "passed"
    | "email_pending"
    | "email_sent"
    | "email_failed"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddApplicantModalOpen, setIsAddApplicantModalOpen] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(
    new Set()
  );

  // Email resend hook
  const { resendEmail, resendBulkEmails, isLoading: isResending } =
    useResendEmail();

  // 데이터 추출
  const currentGroup = data?.group;
  const applicants = useMemo(() => data?.applicants || [], [data?.applicants]);

  const filteredApplicants = applicants.filter(applicant => {
    // 탭 필터링
    let matchesTab = false;
    if (selectedTab === "all") {
      matchesTab = true;
    } else if (selectedTab === "completed") {
      matchesTab = applicant.test_status === "completed";
    } else if (selectedTab === "email_pending") {
      matchesTab = applicant.email_sent_status === "pending";
    } else if (selectedTab === "email_sent") {
      matchesTab = applicant.email_sent_status === "sent";
    } else if (selectedTab === "email_failed") {
      matchesTab = applicant.email_sent_status === "failed";
    } else {
      // 채용 상태로 필터링 (pending, shortlisted, interview, rejected, passed)
      matchesTab = applicant.status === selectedTab;
    }

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

  const handleApplicantClick = (applicantId: string) => {
    navigate(`/dashboard/groups/${groupId}/applicants/${applicantId}`);
  };

  // 개별 이메일 재발송 핸들러
  const handleResendEmail = async (applicantId: string) => {
    const applicant = applicants.find(a => a.id === applicantId);
    if (!applicant || !currentGroup) return;

    await resendEmail({
      applicant,
      groupDeadline: currentGroup.deadline,
      groupId: groupId!,
      showRealName: true,
    });
  };

  // 일괄 선택/해제 핸들러
  const handleSelectionChange = (applicantId: string, selected: boolean) => {
    setSelectedApplicants(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(applicantId);
      } else {
        newSet.delete(applicantId);
      }
      return newSet;
    });
  };

  // 전체 선택/해제 핸들러
  const handleSelectAll = () => {
    if (selectedApplicants.size === filteredApplicants.length) {
      setSelectedApplicants(new Set());
    } else {
      setSelectedApplicants(new Set(filteredApplicants.map(a => a.id)));
    }
  };

  // 일괄 이메일 재발송 핸들러 (선택된 지원자)
  const handleBulkResend = async () => {
    if (!currentGroup || selectedApplicants.size === 0) return;

    const selectedApplicantsList = applicants.filter(a =>
      selectedApplicants.has(a.id)
    );

    await resendBulkEmails({
      applicants: selectedApplicantsList,
      groupDeadline: currentGroup.deadline,
      groupId: groupId!,
      showRealName: true,
    });

    // 재발송 완료 후 선택 해제
    setSelectedApplicants(new Set());
  };

  // 전체 이메일 재발송 핸들러
  const handleResendAllEmails = async () => {
    if (!currentGroup || applicants.length === 0) return;

    const confirmed = window.confirm(
      `${applicants.length}명의 지원자 전체에게 이메일을 재발송하시겠습니까?`
    );

    if (!confirmed) return;

    await resendBulkEmails({
      applicants: applicants,
      groupDeadline: currentGroup.deadline,
      groupId: groupId!,
      showRealName: true,
    });
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
      <DashboardLayout
        breadcrumbs={[{ label: "대시보드", href: "/dashboard" }]}
      >
        <DeletedResourceNotice resourceType="group" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "대시보드", href: "/dashboard" },
        { label: currentGroup.name },
      ]}
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
              <p className="text-xs sm:text-sm font-medium text-neutral-600">
                총 지원자
              </p>
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
              <p className="text-xs sm:text-sm font-medium text-neutral-600">
                추천 후보
              </p>
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
              {/* Bulk Actions Bar */}
              {selectedApplicants.size > 0 && (
                <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-primary-700">
                      {selectedApplicants.size}명 선택됨
                    </span>
                    <button
                      onClick={handleSelectAll}
                      className="text-xs text-primary-600 hover:text-primary-700 underline"
                    >
                      전체 선택 해제
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleBulkResend}
                    disabled={isResending}
                    className="flex items-center gap-2"
                  >
                    <MdEmail className="w-4 h-4" />
                    <span>선택한 지원자에게 이메일 재발송</span>
                  </Button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                {/* Select All Checkbox */}
                {filteredApplicants.length > 0 && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        selectedApplicants.size === filteredApplicants.length &&
                        filteredApplicants.length > 0
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary cursor-pointer"
                    />
                    <span className="text-sm text-neutral-700">전체 선택</span>
                  </div>
                )}

                {/* Status Filter Dropdown */}
                <div className="w-full sm:w-64">
                  <SelectDropdown
                    value={selectedTab}
                    placeholder="상태별 필터"
                    options={[
                      {
                        value: "all",
                        label: `전체 (${applicants.length}명)`,
                      },
                      {
                        value: "completed",
                        label: `테스트 완료 (${applicants.filter(a => a.test_status === "completed").length}명)`,
                      },
                      {
                        value: "email_pending",
                        label: `이메일 발송 대기 (${applicants.filter(a => a.email_sent_status === "pending").length}명)`,
                      },
                      {
                        value: "email_sent",
                        label: `이메일 발송 완료 (${applicants.filter(a => a.email_sent_status === "sent").length}명)`,
                      },
                      {
                        value: "email_failed",
                        label: `이메일 발송 실패 (${applicants.filter(a => a.email_sent_status === "failed").length}명)`,
                      },
                      {
                        value: "shortlisted",
                        label: `서류 합격 (${applicants.filter(a => a.status === "shortlisted").length}명)`,
                      },
                      {
                        value: "interview",
                        label: `면접 예정 (${applicants.filter(a => a.status === "interview").length}명)`,
                      },
                      {
                        value: "passed",
                        label: `최종 합격 (${applicants.filter(a => a.status === "passed").length}명)`,
                      },
                      {
                        value: "rejected",
                        label: `불합격 (${applicants.filter(a => a.status === "rejected").length}명)`,
                      },
                    ]}
                    onChange={value =>
                      setSelectedTab(
                        value as
                          | "all"
                          | "completed"
                          | "pending"
                          | "shortlisted"
                          | "interview"
                          | "rejected"
                          | "passed"
                          | "email_pending"
                          | "email_sent"
                          | "email_failed"
                      )
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
                  onResendEmail={handleResendEmail}
                  isSelected={selectedApplicants.has(applicant.id)}
                  onSelectionChange={handleSelectionChange}
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

            {/* 하단 액션 버튼 */}
            <div className="p-4 border-t border-neutral-200">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleResendAllEmails}
                  disabled={isResending || applicants.length === 0}
                  className="py-3 text-sm font-medium text-primary hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <MdEmail className="w-4 h-4" />
                  <span>전체 이메일 재발송</span>
                </button>
                <button
                  onClick={handleAddApplicantClick}
                  className="py-3 text-sm font-medium text-neutral-700 hover:text-primary hover:bg-neutral-50 transition-colors duration-200 rounded-lg flex items-center justify-center gap-2"
                >
                  <span>+ 지원자 추가하기</span>
                </button>
              </div>
            </div>
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
