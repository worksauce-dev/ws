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
import { DashboardLayout } from "../DashboardLayout";
import { useAuth } from "@/shared/contexts/useAuth";
import type { UserProfile } from "@/shared/lib/supabase";
import { generateGreeting } from "@/shared/utils/dashboardGreetings";
import { SelectDropdown, Dropdown } from "@/shared/components/ui/Dropdown";
import { CalendarView } from "../components/CalendarView";
import type { DropdownItem } from "@/shared/components/ui/Dropdown";
import { TabGroup } from "@/shared/components/ui/TabGroup";

// Types
interface GroupSummary {
  id: string;
  name: string;
  description: string;
  totalCandidates: number;
  completedTests: number;
  recommendedCandidates: number;
  filteredCandidates: number;
  createdAt: string;
  updatedAt: string;
  deadline: string; // 마감일
  status: "active" | "completed" | "draft";
}

// Mock data
const mockGroups: GroupSummary[] = [
  {
    id: "1",
    name: "9월 신입 개발자 채용",
    description: "Frontend/Backend 신입 개발자 공개 채용",
    totalCandidates: 24,
    completedTests: 18,
    recommendedCandidates: 6,
    filteredCandidates: 12,
    createdAt: "2025-09-01",
    updatedAt: "2025-09-20",
    deadline: "2025-10-05",
    status: "active",
  },
  {
    id: "2",
    name: "디자이너 경력 채용",
    description: "UX/UI 디자이너 3년 이상 경력직",
    totalCandidates: 15,
    completedTests: 12,
    recommendedCandidates: 4,
    filteredCandidates: 8,
    createdAt: "2025-08-15",
    updatedAt: "2025-09-18",
    deadline: "2025-10-15",
    status: "active",
  },
  {
    id: "3",
    name: "8월 인턴십 프로그램",
    description: "여름 인턴십 프로그램 참가자 선발",
    totalCandidates: 45,
    completedTests: 45,
    recommendedCandidates: 12,
    filteredCandidates: 33,
    createdAt: "2025-07-20",
    updatedAt: "2025-08-30",
    deadline: "2025-08-31",
    status: "completed",
  },
  {
    id: "4",
    name: "마케터 신규 채용",
    description: "디지털 마케팅 담당자 채용",
    totalCandidates: 8,
    completedTests: 3,
    recommendedCandidates: 1,
    filteredCandidates: 2,
    createdAt: "2025-09-10",
    updatedAt: "2025-09-19",
    deadline: "2025-10-25",
    status: "active",
  },
  {
    id: "5",
    name: "백엔드 개발자 시니어 채용",
    description: "Node.js/Python 5년 이상 시니어 개발자",
    totalCandidates: 32,
    completedTests: 28,
    recommendedCandidates: 8,
    filteredCandidates: 15,
    createdAt: "2025-08-01",
    updatedAt: "2025-09-21",
    deadline: "2025-10-10",
    status: "active",
  },
  {
    id: "6",
    name: "프로덕트 매니저 채용",
    description: "IT 서비스 PM 경력 3년 이상",
    totalCandidates: 19,
    completedTests: 19,
    recommendedCandidates: 5,
    filteredCandidates: 11,
    createdAt: "2025-07-10",
    updatedAt: "2025-08-25",
    deadline: "2025-09-10",
    status: "completed",
  },
  {
    id: "7",
    name: "데이터 분석가 신입 채용",
    description: "SQL, Python 활용 가능한 데이터 분석가",
    totalCandidates: 28,
    completedTests: 22,
    recommendedCandidates: 7,
    filteredCandidates: 14,
    createdAt: "2025-09-05",
    updatedAt: "2025-09-22",
    deadline: "2025-10-20",
    status: "active",
  },
  {
    id: "8",
    name: "QA 엔지니어 채용",
    description: "테스트 자동화 경험 보유자 우대",
    totalCandidates: 12,
    completedTests: 8,
    recommendedCandidates: 3,
    filteredCandidates: 5,
    createdAt: "2025-09-15",
    updatedAt: "2025-09-23",
    deadline: "2025-10-30",
    status: "active",
  },
  {
    id: "9",
    name: "DevOps 엔지니어 채용",
    description: "AWS/GCP 인프라 운영 경험자",
    totalCandidates: 16,
    completedTests: 16,
    recommendedCandidates: 4,
    filteredCandidates: 9,
    createdAt: "2025-06-20",
    updatedAt: "2025-07-30",
    deadline: "2025-08-05",
    status: "completed",
  },
  {
    id: "10",
    name: "프론트엔드 개발자 경력 채용",
    description: "React, TypeScript 실무 경험 3년 이상",
    totalCandidates: 35,
    completedTests: 30,
    recommendedCandidates: 9,
    filteredCandidates: 18,
    createdAt: "2025-08-20",
    updatedAt: "2025-09-24",
    deadline: "2025-10-18",
    status: "active",
  },
  {
    id: "11",
    name: "콘텐츠 마케터 채용",
    description: "SNS 마케팅 및 콘텐츠 기획 경험자",
    totalCandidates: 21,
    completedTests: 21,
    recommendedCandidates: 6,
    filteredCandidates: 13,
    createdAt: "2025-07-05",
    updatedAt: "2025-08-15",
    deadline: "2025-08-20",
    status: "completed",
  },
  {
    id: "12",
    name: "모바일 개발자 채용",
    description: "iOS/Android 네이티브 또는 Flutter 개발자",
    totalCandidates: 18,
    completedTests: 14,
    recommendedCandidates: 5,
    filteredCandidates: 8,
    createdAt: "2025-09-12",
    updatedAt: "2025-09-25",
    deadline: "2025-11-05",
    status: "active",
  },
  {
    id: "13",
    name: "AI/ML 엔지니어 채용",
    description: "머신러닝 모델 개발 및 배포 경험자",
    totalCandidates: 14,
    completedTests: 9,
    recommendedCandidates: 3,
    filteredCandidates: 6,
    createdAt: "2025-09-18",
    updatedAt: "2025-09-26",
    deadline: "2025-11-10",
    status: "active",
  },
  {
    id: "14",
    name: "HR 매니저 채용",
    description: "채용 프로세스 설계 및 운영 경험자",
    totalCandidates: 11,
    completedTests: 11,
    recommendedCandidates: 3,
    filteredCandidates: 7,
    createdAt: "2025-06-15",
    updatedAt: "2025-07-20",
    deadline: "2025-07-25",
    status: "completed",
  },
  {
    id: "15",
    name: "10월 대규모 공채",
    description: "전 직군 신입/경력 공개 채용",
    totalCandidates: 120,
    completedTests: 85,
    recommendedCandidates: 25,
    filteredCandidates: 60,
    createdAt: "2025-09-25",
    updatedAt: "2025-09-27",
    deadline: "2025-10-31",
    status: "active",
  },
  {
    id: "16",
    name: "브랜드 디자이너 채용",
    description: "브랜드 아이덴티티 디자인 경험자",
    totalCandidates: 9,
    completedTests: 5,
    recommendedCandidates: 2,
    filteredCandidates: 3,
    createdAt: "2025-09-20",
    updatedAt: "2025-09-26",
    deadline: "2025-11-15",
    status: "draft",
  },
];

const ITEMS_PER_PAGE = 6;

type ViewMode = "grid" | "calendar";

export const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { user } = useAuth();
  const navigate = useNavigate();

  // ProtectedRoute로 보호되어 있지만 TypeScript 안전성을 위한 방어적 코딩
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

  const filteredGroups = mockGroups.filter(group => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase());
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "진행중";
      case "completed":
        return "완료";
      case "draft":
        return "준비중";
      default:
        return "알수없음";
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
    console.log("메뉴 액션:", item.id, "그룹 ID:", groupId);

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
      case "delete":
        console.log("그룹 삭제:", groupId);
        // 삭제 확인 모달
        break;
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
                {mockGroups.length}
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
                {mockGroups.filter(g => g.status === "active").length}
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
                {mockGroups.reduce(
                  (sum, group) => sum + group.totalCandidates,
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
              <p className="text-sm font-medium text-neutral-600">추천 후보</p>
              <p className="text-2xl font-bold text-neutral-800">
                {mockGroups.reduce(
                  (sum, group) => sum + group.recommendedCandidates,
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
                        className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(group.status)}`}
                      >
                        {getStatusText(group.status)}
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
                        group.completedTests,
                        group.totalCandidates
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300 bg-primary-500"
                      style={{
                        width: `${getCompletionRate(group.completedTests, group.totalCandidates)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-lg bg-neutral-50">
                    <p className="text-2xl font-bold text-neutral-800">
                      {group.totalCandidates}
                    </p>
                    <p className="text-xs text-neutral-600">총 지원자</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-neutral-50">
                    <p className="text-2xl font-bold text-success">
                      {group.recommendedCandidates}
                    </p>
                    <p className="text-xs text-neutral-600">추천 후보</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex justify-between items-center text-xs mb-4 text-neutral-600">
                  <span>테스트 완료: {group.completedTests}명</span>
                  <span>필터링: {group.filteredCandidates}명</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <div className="flex items-center text-xs text-neutral-600">
                    <MdCalendarToday className="w-3 h-3 mr-1" />
                    최근 업데이트: {formatDate(group.updatedAt)}
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
