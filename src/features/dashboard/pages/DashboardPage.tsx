import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdPeople,
  MdAccessTime,
  MdPersonAdd,
  MdTrendingUp,
  MdCalendarToday,
  MdSearch,
  MdMoreHoriz,
  MdChevronRight,
  MdGridView,
  MdCalendarMonth,
  MdVisibility,
  MdEdit,
  MdContentCopy,
  MdDownload,
  MdDelete,
} from "react-icons/md";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { useAuth } from "@/shared/contexts/useAuth";
import type { UserProfile } from "@/shared/lib/supabase";
import { generateGreeting } from "@/shared/utils/dashboardGreetings";
import { SelectDropdown, Dropdown } from "@/shared/components/ui/Dropdown";
import { CalendarView } from "../components/CalendarView";
import type { DropdownItem } from "@/shared/components/ui/Dropdown";
import { TabGroup } from "@/shared/components/ui/TabGroup";
import type { Group } from "@/features/groups/types/group.types";
import { useGroups } from "../hooks/useGroups";
import { GroupsErrorDisplay } from "../../groups/components/GroupsErrorDisplay";
import { useMinimumLoadingTime } from "@/shared/hooks/useMinimumLoadingTime";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { useDeleteGroup } from "@/features/groups/hooks/useDeleteGroup";
import { useToast } from "@/shared/components/ui/useToast";

const ITEMS_PER_PAGE = 6;

type ViewMode = "grid" | "calendar";

export const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { groups, isLoading, error, refetch } = useGroups();
  const { showToast } = useToast();

  // 그룹 삭제 mutation
  const { mutate: deleteGroup } = useDeleteGroup({
    onSuccess: () => {
      showToast(
        "success",
        "그룹 삭제 완료",
        "그룹이 성공적으로 삭제되었습니다."
      );
    },
    onError: error => {
      showToast("error", "삭제 실패", error.message);
    },
  });

  const showLoading = useMinimumLoadingTime(isLoading, 1250);

  if (showLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <DashboardLayout title="대시보드">
        <div className="max-w-2xl mx-auto">
          <GroupsErrorDisplay error={error} onRetry={refetch} />
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null; // 또는 로딩 스피너
  }

  const userProfile: UserProfile = {
    id: user.id,
    created_at: user.created_at,
    updated_at: user.updated_at ?? user.created_at,
    email_verified: Boolean(user.user_metadata?.email_verified),
    name: (user.user_metadata?.name as string | undefined) ?? "사용자",
    email: user.email ?? "",
  };

  const filteredGroups: Group[] = groups.filter(group => {
    const matchesSearch = group.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || group.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentGroups = filteredGroups.slice(startIndex, endIndex);

  // 검색어나 필터 변경 시 1페이지로 리셋
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const getStatusColor = (group: Group) => {
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

  const getStatusText = (group: Group) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });
  };

  const getCompletionRate = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const handleGroupClick = (groupId: string) => {
    navigate(`/dashboard/groups/${groupId}`);
  };

  const handleCreateGroup = () => {
    navigate("/dashboard/create-group");
  };

  const handleGroupMenuAction = (groupId: string, item: DropdownItem) => {
    // TODO: 각 액션에 대한 실제 기능 구현

    switch (item.id) {
      case "view":
        console.log("상세 보기:", groupId);
        // navigate(`/dashboard/groups/${groupId}`);
        break;
      case "edit":
        console.log("그룹 수정:", groupId);
        // 수정 모달 열기 등
        break;
      case "duplicate":
        console.log("그룹 복제:", groupId);
        // 복제 로직
        break;
      case "export":
        console.log("지원자 내보내기:", groupId);
        // CSV/Excel 다운로드
        break;
      case "extend":
        console.log("마감일 연장:", groupId);
        // 마감일 수정 모달
        break;
      case "delete": {
        // 삭제 확인 다이얼로그
        const groupToDelete = groups.find(g => g.id === groupId);
        const confirmMessage = groupToDelete
          ? `"${groupToDelete.name}" 그룹을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없으며, 그룹 내 모든 지원자 데이터도 함께 삭제됩니다.`
          : "정말로 이 그룹을 삭제하시겠습니까?";

        if (window.confirm(confirmMessage)) {
          deleteGroup(groupId);
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <DashboardLayout
      title={`안녕하세요, ${userProfile?.name}님!`}
      description={
        userProfile
          ? generateGreeting(userProfile)
          : "워크소스에 오신 것을 환영합니다!"
      }
      breadcrumbs={[{ label: "워크소스", href: "/" }, { label: "대시보드" }]}
      actions={
        <button
          onClick={handleCreateGroup}
          className="inline-flex items-center px-6 py-3 rounded-lg font-medium text-white text-sm bg-primary-500 hover:bg-primary-dark transition-all duration-200 hover:shadow-md"
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
            options={[
              { value: "all", label: "모든 상태" },
              { value: "active", label: "진행중" },
              { value: "completed", label: "완료" },
              { value: "draft", label: "준비중" },
            ]}
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4 bg-primary-100">
              <MdPeople className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-600">전체 그룹</p>
              <p className="text-2xl font-bold text-neutral-800">
                {groups.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4 bg-success-100">
              <MdPersonAdd className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-600">활성 그룹</p>
              <p className="text-2xl font-bold text-neutral-800">
                {groups.filter(g => g.status === "active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4 bg-info-100">
              <MdAccessTime className="w-6 h-6 text-info" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-600">총 지원자</p>
              <p className="text-2xl font-bold text-neutral-800">
                {groups.reduce(
                  (sum, group) => sum + group.applicants.length,
                  0
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4 bg-warning-100">
              <MdTrendingUp className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-600">
                완료 지원자
              </p>
              <p className="text-2xl font-bold text-neutral-800">
                {groups.reduce(
                  (sum, group) =>
                    sum +
                    group.applicants.filter(
                      applicant => applicant.test_status === "completed"
                    ).length,
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <>
          {/* Groups Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {currentGroups.map(group => (
              <div
                key={group.id}
                onClick={() => handleGroupClick(group.id)}
                className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1 text-neutral-800">
                        {group.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(group)}`}
                      >
                        {getStatusText(group)}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2 mb-3 text-neutral-600">
                      {group.description}
                    </p>
                  </div>
                  <div
                    onClick={e => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Dropdown
                      trigger={
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <MdMoreHoriz className="w-4 h-4 text-neutral-500" />
                        </button>
                      }
                      items={[
                        {
                          id: "view",
                          label: "상세 보기",
                          icon: <MdVisibility className="w-4 h-4" />,
                          onClick: () =>
                            handleGroupMenuAction(group.id, {
                              id: "view",
                              label: "상세 보기",
                            }),
                        },
                        {
                          id: "edit",
                          label: "그룹 수정",
                          icon: <MdEdit className="w-4 h-4" />,
                          onClick: () =>
                            handleGroupMenuAction(group.id, {
                              id: "edit",
                              label: "그룹 수정",
                            }),
                        },
                        {
                          id: "duplicate",
                          label: "그룹 복제",
                          icon: <MdContentCopy className="w-4 h-4" />,
                          onClick: () =>
                            handleGroupMenuAction(group.id, {
                              id: "duplicate",
                              label: "그룹 복제",
                            }),
                        },
                        {
                          id: "export",
                          label: "지원자 내보내기",
                          icon: <MdDownload className="w-4 h-4" />,
                          onClick: () =>
                            handleGroupMenuAction(group.id, {
                              id: "export",
                              label: "지원자 내보내기",
                            }),
                        },
                        {
                          id: "extend",
                          label: "마감일 연장",
                          icon: <MdCalendarToday className="w-4 h-4" />,
                          onClick: () =>
                            handleGroupMenuAction(group.id, {
                              id: "extend",
                              label: "마감일 연장",
                            }),
                        },
                        {
                          id: "delete",
                          label: "그룹 삭제",
                          icon: <MdDelete className="w-4 h-4" />,
                          onClick: () =>
                            handleGroupMenuAction(group.id, {
                              id: "delete",
                              label: "그룹 삭제",
                            }),
                          className: "text-red-600 hover:bg-red-50",
                        },
                      ]}
                      placement="bottom-right"
                    />
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-neutral-700">
                      테스트 완료율
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {getCompletionRate(
                        group.applicants.filter(
                          applicant => applicant.test_status === "completed"
                        ).length,
                        group.applicants.length
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300 bg-primary-500"
                      style={{
                        width: `${getCompletionRate(
                          group.applicants.filter(
                            applicant => applicant.test_status === "completed"
                          ).length,
                          group.applicants.length
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-lg bg-neutral-50">
                    <p className="text-2xl font-bold text-neutral-800">
                      {group.applicants.length}
                    </p>
                    <p className="text-xs text-neutral-600">총 지원자</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-neutral-50">
                    <p className="text-2xl font-bold text-success">
                      {
                        group.applicants.filter(
                          applicant => applicant.test_status === "completed"
                        ).length
                      }
                    </p>
                    <p className="text-xs text-neutral-600">완료 지원자</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <div className="flex items-center text-xs text-neutral-600">
                    <MdCalendarToday className="w-3 h-3 mr-1" />
                    최근 업데이트: {formatDate(group.updated_at)}
                  </div>
                  <MdChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-primary" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {filteredGroups.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {/* 이전 버튼 */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                이전
              </button>

              {/* 페이지 번호 */}
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  page => {
                    // 첫 페이지, 마지막 페이지, 현재 페이지 주변 표시
                    const isFirstPage = page === 1;
                    const isLastPage = page === totalPages;
                    const isNearCurrent = Math.abs(page - currentPage) <= 1;
                    const shouldShow =
                      isFirstPage || isLastPage || isNearCurrent;

                    // ... 표시 로직
                    const shouldShowEllipsisBefore =
                      page === currentPage - 2 && currentPage > 3;
                    const shouldShowEllipsisAfter =
                      page === currentPage + 2 && currentPage < totalPages - 2;

                    if (
                      !shouldShow &&
                      !shouldShowEllipsisBefore &&
                      !shouldShowEllipsisAfter
                    ) {
                      return null;
                    }

                    if (shouldShowEllipsisBefore || shouldShowEllipsisAfter) {
                      return (
                        <span
                          key={`ellipsis-${page}`}
                          className="px-3 py-2 text-neutral-500"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          currentPage === page
                            ? "bg-primary-500 text-white"
                            : "border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}
              </div>

              {/* 다음 버튼 */}
              <button
                onClick={() =>
                  setCurrentPage(prev => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                다음
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <MdPeople className="w-8 h-8 text-neutral-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral-800">
                검색 결과가 없습니다
              </h3>
              <p className="text-sm mb-6 text-neutral-600">
                다른 검색어나 필터 조건을 시도해보세요
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("all");
                  setCurrentPage(1);
                }}
                className="inline-flex items-center px-4 py-2 rounded-lg font-medium border border-primary text-primary hover:bg-primary-500 hover:text-white transition-colors duration-200"
              >
                필터 초기화
              </button>
            </div>
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
