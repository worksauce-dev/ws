/**
 * 대시보드 페이지
 * 리팩토링: 비즈니스 로직을 hooks와 utils로 분리, UI 컴포넌트 추출
 */

import { useState, useMemo } from "react";
import { MdAdd, MdSearch, MdGridView, MdCalendarMonth } from "react-icons/md";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { useAuth } from "@/shared/contexts/useAuth";
import { generateGreeting } from "@/shared/utils/dashboardGreetings";
import { SelectDropdown } from "@/shared/components/ui/Dropdown";
import { TabGroup } from "@/shared/components/ui/TabGroup";
import { useMinimumLoadingTime } from "@/shared/hooks/useMinimumLoadingTime";
import { useUserProfile } from "@/shared/hooks/useUserProfile";
import { useGroups } from "../hooks/useGroups";
import { useGroupFilters } from "../hooks/useGroupFilters";
import { useGroupActions } from "../hooks/useGroupActions";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { GroupsErrorDisplay } from "../../groups/components/GroupsErrorDisplay";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { DashboardStats } from "../components/DashboardStats";
import { GroupsGrid } from "../components/GroupsGrid";
import { Pagination } from "../components/Pagination";
import { EmptyState } from "../components/EmptyState";
import { CalendarView } from "../components/CalendarView";
import { GROUP_STATUS_FILTER_OPTIONS } from "../constants/groupStyles";

type ViewMode = "grid" | "calendar";

export const DashboardPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { user } = useAuth();

  // 데이터 페칭
  const { groups, isLoading, error, refetch } = useGroups();
  const { data: userProfile } = useUserProfile(user?.id);

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

  // 사용자 프로필 로딩 대기
  if (!user || !userProfile) {
    return null;
  }

  return (
    <DashboardLayout
      title={`안녕하세요, ${userProfile.name}님!`}
      description={greeting}
      breadcrumbs={[{ label: "워크소스", href: "/" }, { label: "대시보드" }]}
      credits={userProfile.credits ?? undefined}
      onCreditClick={handleCreditClick}
      actions={
        <button
          onClick={handleCreateGroup}
          className="inline-flex items-center h-[52px] px-6 rounded-lg font-medium text-white text-sm bg-primary-500 hover:bg-primary-dark transition-all duration-200 hover:shadow-md"
        >
          <MdAdd className="w-4 h-4 mr-2" />새 그룹 생성
        </button>
      }
    >
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
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
      <DashboardStats stats={stats} />

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
    </DashboardLayout>
  );
};
