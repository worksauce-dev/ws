/**
 * 대시보드 페이지
 * 리팩토링: 비즈니스 로직을 hooks와 utils로 분리, UI 컴포넌트 추출
 */

import { useState, useMemo } from "react";
import { MdAdd, MdSearch, MdGridView, MdCalendarMonth } from "react-icons/md";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { useUser } from "@/shared/hooks/useUser";
import { generateGreeting } from "@/shared/utils/dashboardGreetings";
import { SelectDropdown } from "@/shared/components/ui/Dropdown";
import { TabGroup } from "@/shared/components/ui/TabGroup";
import { useMinimumLoadingTime } from "@/shared/hooks/useMinimumLoadingTime";
import { useGroups } from "../hooks/useGroups";
import { useGroupFilters } from "../hooks/useGroupFilters";
import { useGroupActions } from "../hooks/useGroupActions";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useOnboardingTour } from "../hooks/useOnboardingTour";
import { GroupsErrorDisplay } from "../../groups/components/GroupsErrorDisplay";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { DashboardStats } from "../components/DashboardStats";
import { GroupsGrid } from "../components/GroupsGrid";
import { Pagination } from "../components/Pagination";
import { EmptyState } from "../components/EmptyState";
import { CalendarView } from "../components/CalendarView";
import { OnboardingTour } from "../components/OnboardingTour";
import { GROUP_STATUS_FILTER_OPTIONS } from "../constants/groupStyles";

type ViewMode = "grid" | "calendar";

export const DashboardPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userName, credits, userProfile, isAuthenticated } = useUser();

  // 데이터 페칭
  const { groups, isLoading, error, refetch } = useGroups();

  // 커스텀 hooks
  const {
    searchTerm,
    selectedStatus,
    filteredGroups,
    currentGroups,
    totalPages,
    currentPage,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
  } = useGroupFilters(groups);

  const {
    handleGroupClick,
    handleCreateGroup,
    handleGroupMenuAction,
    handleCreditClick,
  } = useGroupActions(groups);

  const stats = useDashboardStats(groups);

  // 온보딩 투어
  const { showTour, completeTour, skipTour } = useOnboardingTour();

  // 투어 단계 정의
  const tourSteps = useMemo(
    () => [
      {
        target: "[data-tour='create-group-button']",
        title: "채용 그룹 만들기",
        description:
          "여기를 클릭하여 첫 채용 그룹을 생성해보세요. 포지션, 우대 직무유형, 마감일을 설정할 수 있습니다.",
        placement: "bottom" as const,
      },
      {
        target: "[data-tour='notification-bell']",
        title: "실시간 알림",
        description: "지원자가 테스트를 제출하면 여기에서 즉시 알림을 받을 수 있습니다. 놓치지 마세요!",
        placement: "bottom" as const,
      },
      {
        target: "[data-tour='stats']",
        title: "한눈에 보는 통계",
        description:
          "전체 그룹 수, 활성 그룹, 지원자 수, 완료된 테스트 수를 실시간으로 확인하세요.",
        placement: "bottom" as const,
      },
    ],
    []
  );

  // 로딩 상태 처리
  const showLoading = useMinimumLoadingTime(isLoading, 1250);

  // 인사말 메모이제이션
  const greeting = useMemo(
    () =>
      userProfile
        ? generateGreeting(userProfile)
        : "워크소스에 오신 것을 환영합니다!",
    [userProfile]
  );

  // 필터 초기화 핸들러
  const handleResetFilters = () => {
    handleSearchChange("");
    handleStatusChange("all");
    handlePageChange(1);
  };

  // 로딩 상태
  if (showLoading) {
    return <DashboardSkeleton />;
  }

  // 에러 상태
  if (error) {
    return (
      <DashboardLayout title="대시보드">
        <div className="max-w-2xl mx-auto">
          <GroupsErrorDisplay error={error} onRetry={refetch} />
        </div>
      </DashboardLayout>
    );
  }

  // 사용자 정보 없으면 로딩 스켈레톤
  if (!isAuthenticated) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardLayout
      title={`안녕하세요, ${userName}님!`}
      description={greeting}
      breadcrumbs={[{ label: "워크소스", href: "/" }, { label: "대시보드" }]}
      credits={credits}
      onCreditClick={handleCreditClick}
      isMobileMenuOpen={isMobileMenuOpen}
      onMobileMenuToggle={setIsMobileMenuOpen}
      actions={
        <button
          data-tour="create-group-button"
          onClick={handleCreateGroup}
          className="inline-flex items-center h-[52px] sm:px-6 px-3 rounded-lg font-medium text-white text-sm bg-primary-500 hover:bg-primary-dark transition-all duration-200 hover:shadow-md"
        >
          <MdAdd className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
          <span className="hidden sm:inline">새 그룹 생성</span>
        </button>
      }
    >
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1" data-tour="search-bar">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            placeholder="그룹명 또는 설명으로 검색"
            value={searchTerm}
            onChange={e => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm text-neutral-800"
          />
        </div>
        <div className="flex gap-2">
          <SelectDropdown
            value={selectedStatus}
            onChange={handleStatusChange}
            options={GROUP_STATUS_FILTER_OPTIONS}
            placeholder="상태 선택"
            className="min-w-[140px]"
          />
          {/* View Mode Toggle */}
          <TabGroup
            data-tour="view-mode"
            tabs={[
              {
                id: "grid",
                label: "그리드",
                icon: <MdGridView className="w-4 h-4" />,
              },
              {
                id: "calendar",
                label: "캘린더",
                icon: <MdCalendarMonth className="w-4 h-4" />,
              },
            ]}
            activeTab={viewMode}
            onChange={tab => setViewMode(tab as ViewMode)}
            variant="primary"
            className="hidden md:inline-flex flex-shrink-0"
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div data-tour="stats">
        <DashboardStats stats={stats} />
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <>
          {filteredGroups.length > 0 ? (
            <>
              <GroupsGrid
                groups={currentGroups}
                onGroupClick={handleGroupClick}
                onMenuAction={handleGroupMenuAction}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <EmptyState onReset={handleResetFilters} />
          )}
        </>
      )}

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <CalendarView groups={filteredGroups} onGroupClick={handleGroupClick} />
      )}

      {/* Onboarding Tour */}
      {showTour && groups.length === 0 && (
        <OnboardingTour
          steps={tourSteps}
          onComplete={completeTour}
          onSkip={skipTour}
          onMobileMenuToggle={setIsMobileMenuOpen}
        />
      )}
    </DashboardLayout>
  );
};
