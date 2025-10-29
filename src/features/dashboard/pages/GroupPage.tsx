import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdEmail,
  MdFileDownload,
  MdPerson,
  MdCheckCircle,
  MdCancel,
  MdPending,
  MdTrendingUp,
  MdTrendingDown,
  MdMoreVert,
  MdAssignment,
  MdFilterList,
  MdSearch,
  MdStar,
  MdStarBorder,
  MdVisibility,
} from "react-icons/md";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { TabGroup } from "@/shared/components/ui/TabGroup";

// Types
interface Applicant {
  id: string;
  name: string;
  email: string;
  position: string;
  appliedAt: string;
  testCompletedAt?: string;
  status: "pending" | "completed" | "recommended" | "filtered";
  score?: number;
  workType?: string;
  matchScore?: number;
  strengths?: string[];
  concerns?: string[];
  isStarred?: boolean;
}

interface GroupDetail {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: "active" | "completed" | "draft";
  preferredWorkTypes: string[];
  totalCandidates: number;
  completedTests: number;
  recommendedCandidates: number;
  filteredCandidates: number;
}

// Mock data
const mockGroup: GroupDetail = {
  id: "1",
  name: "9월 신입 개발자 채용",
  description: "Frontend/Backend 신입 개발자 공개 채용",
  createdAt: "2024-09-01",
  status: "active",
  preferredWorkTypes: ["기준형", "예술형", "도전형"],
  totalCandidates: 24,
  completedTests: 18,
  recommendedCandidates: 6,
  filteredCandidates: 12,
};

const mockApplicants: Applicant[] = [
  {
    id: "1",
    name: "김철수",
    email: "kim.cs@email.com",
    position: "Frontend Developer",
    appliedAt: "2024-09-15",
    testCompletedAt: "2024-09-18",
    status: "recommended",
    score: 92,
    workType: "창조형",
    matchScore: 95,
    strengths: ["문제해결능력", "창의적 사고", "기술습득력"],
    concerns: ["팀워크 경험 부족"],
    isStarred: true,
  },
  {
    id: "2",
    name: "이영희",
    email: "lee.yh@email.com",
    position: "Backend Developer",
    appliedAt: "2024-09-14",
    testCompletedAt: "2024-09-17",
    status: "recommended",
    score: 88,
    workType: "분석형",
    matchScore: 92,
    strengths: ["논리적 사고", "체계적 접근", "꼼꼼함"],
    concerns: ["커뮤니케이션 스타일"],
    isStarred: true,
  },
  {
    id: "3",
    name: "박민수",
    email: "park.ms@email.com",
    position: "Full Stack Developer",
    appliedAt: "2024-09-13",
    testCompletedAt: "2024-09-16",
    status: "recommended",
    score: 85,
    workType: "협력형",
    matchScore: 88,
    strengths: ["팀워크", "적응력", "의사소통"],
    concerns: ["기술적 깊이"],
    isStarred: false,
  },
  {
    id: "4",
    name: "최지원",
    email: "choi.jw@email.com",
    position: "Frontend Developer",
    appliedAt: "2024-09-12",
    testCompletedAt: "2024-09-15",
    status: "filtered",
    score: 72,
    workType: "실행형",
    matchScore: 65,
    strengths: ["실행력", "책임감"],
    concerns: ["기술적 역량", "학습 의지"],
    isStarred: false,
  },
  {
    id: "5",
    name: "정수진",
    email: "jung.sj@email.com",
    position: "Backend Developer",
    appliedAt: "2024-09-11",
    testCompletedAt: "2024-09-14",
    status: "filtered",
    score: 76,
    workType: "계획형",
    matchScore: 70,
    strengths: ["계획수립", "체계성"],
    concerns: ["유연성 부족", "혁신적 사고"],
    isStarred: false,
  },
  {
    id: "6",
    name: "장혜진",
    email: "jang.hj@email.com",
    position: "Full Stack Developer",
    appliedAt: "2024-09-10",
    status: "pending",
    isStarred: false,
  },
];

const workTypeDistribution = [
  {
    type: "기준형",
    count: 6,
    percentage: 33.3,
    colorClass: "bg-primary-500",
  },
  {
    type: "예술형",
    count: 4,
    percentage: 22.2,
    colorClass: "bg-info",
  },
  {
    type: "도전형",
    count: 3,
    percentage: 16.7,
    colorClass: "bg-success",
  },
  {
    type: "이해형",
    count: 3,
    percentage: 16.7,
    colorClass: "bg-warning",
  },
  {
    type: "소통형",
    count: 2,
    percentage: 11.1,
    colorClass: "bg-error",
  },
];

export const GroupPage = () => {
  const [selectedTab, setSelectedTab] = useState<
    "recommended" | "all" | "filtered"
  >("recommended");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "matchScore" | "appliedAt">(
    "matchScore"
  );
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <MdCheckCircle className="w-4 h-4 text-success" />;
      case "recommended":
        return <MdStar className="w-4 h-4 text-warning" />;
      case "filtered":
        return <MdCancel className="w-4 h-4 text-error" />;
      case "pending":
        return <MdPending className="w-4 h-4 text-neutral-500" />;
      default:
        return <MdPending className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "recommended":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "filtered":
        return "bg-red-50 text-red-700 border-red-200";
      case "pending":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const filteredApplicants = mockApplicants
    .filter(applicant => {
      const matchesTab =
        selectedTab === "all" ||
        (selectedTab === "recommended" && applicant.status === "recommended") ||
        (selectedTab === "filtered" && applicant.status === "filtered");
      const matchesSearch =
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.position.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "appliedAt") {
        return (
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
        );
      }
      if (sortBy === "score") {
        return (b.score || 0) - (a.score || 0);
      }
      if (sortBy === "matchScore") {
        return (b.matchScore || 0) - (a.matchScore || 0);
      }
      return 0;
    });

  const getScoreColorClass = (score?: number) => {
    if (!score) return "text-neutral-500";
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-warning";
    if (score >= 70) return "text-info";
    return "text-error";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  };

  const toggleStar = (candidateId: string) => {
    // Mock function - 실제 구현에서는 상태 업데이트 로직 추가
    console.log("Toggle star for candidate:", candidateId);
  };

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  // URL 파라미터로 받은 groupId로 해당 그룹 찾기
  // 실제로는 API 호출로 데이터를 가져와야 함
  const currentGroup = mockGroup; // 임시로 mockGroup 사용

  return (
    <DashboardLayout
      title={currentGroup.name}
      description={currentGroup.description}
      showBackButton={true}
      onBackClick={handleBackClick}
      breadcrumbs={[
        { label: "대시보드", href: "/dashboard" },
        { label: currentGroup.name },
      ]}
      statusBadge={
        <span className="px-2 py-1 rounded-md text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
          진행중
        </span>
      }
      actions={
        <>
          <button className="inline-flex items-center px-4 py-2 rounded-lg font-medium border border-neutral-200 text-neutral-700 transition-colors duration-200 hover:bg-gray-50">
            <MdEmail className="w-4 h-4 mr-2" />
            지원자 추가 하기
          </button>
          <button className="inline-flex items-center px-4 py-2 rounded-lg font-medium border border-neutral-200 text-neutral-700 transition-colors duration-200 hover:bg-gray-50">
            <MdFileDownload className="w-4 h-4 mr-2" />
            결과 내보내기
          </button>
        </>
      }
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4 bg-primary-100">
              <MdPerson className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-600">총 지원자</p>
              <p className="text-2xl font-bold text-neutral-800">
                {currentGroup.totalCandidates}명
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4 bg-success-100">
              <MdCheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-600">
                테스트 완료
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-neutral-800">
                  {currentGroup.completedTests}명
                </p>
                <p className="text-sm text-neutral-600">
                  (
                  {Math.round(
                    (currentGroup.completedTests /
                      currentGroup.totalCandidates) *
                      100
                  )}
                  %)
                </p>
              </div>
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
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-neutral-800">
                  {currentGroup.recommendedCandidates}명
                </p>
                <p className="text-sm text-neutral-600">
                  (
                  {Math.round(
                    (currentGroup.recommendedCandidates /
                      currentGroup.completedTests) *
                      100
                  )}
                  %)
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4 bg-error-100">
              <MdTrendingDown className="w-6 h-6 text-error" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-600">
                필터링 후보
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-neutral-800">
                  {currentGroup.filteredCandidates}명
                </p>
                <p className="text-sm text-neutral-600">
                  (
                  {Math.round(
                    (currentGroup.filteredCandidates /
                      currentGroup.completedTests) *
                      100
                  )}
                  %)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs and Controls */}
          <div className="bg-white rounded-xl border border-neutral-200 mb-6">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                {/* Tabs */}
                <TabGroup
                  tabs={[
                    {
                      id: "recommended",
                      label: "추천 후보",
                      count: currentGroup.recommendedCandidates,
                    },
                    {
                      id: "all",
                      label: "전체",
                      count: currentGroup.totalCandidates,
                    },
                    {
                      id: "filtered",
                      label: "필터링",
                      count: currentGroup.filteredCandidates,
                    },
                  ]}
                  activeTab={selectedTab}
                  variant="secondary"
                  onChange={tabId =>
                    setSelectedTab(tabId as "recommended" | "all" | "filtered")
                  }
                />

                {/* Search and Sort */}
                <div className="flex gap-2">
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
                  <select
                    value={sortBy}
                    onChange={e =>
                      setSortBy(
                        e.target.value as "score" | "matchScore" | "appliedAt"
                      )
                    }
                    className="px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm text-neutral-800"
                  >
                    <option value="matchScore">적합도 순</option>
                    <option value="score">점수 순</option>
                    <option value="appliedAt">지원일 순</option>
                  </select>
                  <button className="p-2 border border-neutral-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <MdFilterList className="w-4 h-4 text-neutral-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Candidate List */}
            <div className="divide-y divide-neutral-200">
              {filteredApplicants.map(applicant => (
                <div
                  key={applicant.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          onClick={() => toggleStar(applicant.id)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors duration-200"
                        >
                          {applicant.isStarred ? (
                            <MdStar className="w-4 h-4 text-warning" />
                          ) : (
                            <MdStarBorder className="w-4 h-4 text-neutral-500" />
                          )}
                        </button>
                        <h3 className="font-semibold text-lg text-neutral-800">
                          {applicant.name}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(applicant.status)}`}
                        >
                          {getStatusIcon(applicant.status)}
                        </span>
                        {applicant.workType && (
                          <span className="px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary">
                            {applicant.workType}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-3 text-sm text-neutral-600">
                        <span>{applicant.email}</span>
                        <span>•</span>
                        <span>{applicant.position}</span>
                        <span>•</span>
                        <span>지원일: {formatDate(applicant.appliedAt)}</span>
                        {applicant.testCompletedAt && (
                          <>
                            <span>•</span>
                            <span>
                              완료일: {formatDate(applicant.testCompletedAt)}
                            </span>
                          </>
                        )}
                      </div>

                      {applicant.score && (
                        <div className="flex items-center gap-6 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-neutral-700">
                              테스트 점수
                            </span>
                            <span
                              className={`text-lg font-bold ${getScoreColorClass(applicant.score)}`}
                            >
                              {applicant.score}점
                            </span>
                          </div>
                          {applicant.matchScore && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-neutral-700">
                                직무 적합도
                              </span>
                              <span
                                className={`text-lg font-bold ${getScoreColorClass(applicant.matchScore)}`}
                              >
                                {applicant.matchScore}%
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {applicant.strengths &&
                        applicant.strengths.length > 0 && (
                          <div className="mb-2">
                            <span className="text-xs font-medium text-success">
                              강점:
                            </span>
                            <span className="text-xs ml-2 text-neutral-600">
                              {applicant.strengths.join(", ")}
                            </span>
                          </div>
                        )}

                      {applicant.concerns && applicant.concerns.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-warning">
                            고려사항:
                          </span>
                          <span className="text-xs ml-2 text-neutral-600">
                            {applicant.concerns.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <MdVisibility className="w-4 h-4 text-primary" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <MdMoreVert className="w-4 h-4 text-neutral-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredApplicants.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <MdAssignment className="w-8 h-8 text-neutral-500" />
                </div>
                <p className="text-sm text-neutral-600">
                  조건에 맞는 후보자가 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Work Type Distribution */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-neutral-800">
              선호 직무 유형
            </h2>
            <div className="flex flex-wrap gap-2">
              {currentGroup.preferredWorkTypes.map(type => (
                <span
                  key={type}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold mb-4 text-neutral-800">
              후보자 직무 유형 분포
            </h2>
            <div className="space-y-4">
              {workTypeDistribution.map(item => (
                <div key={item.type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-700">{item.type}</span>
                    <span className="text-neutral-600">
                      {item.count}명 ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${item.colorClass}`}
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
