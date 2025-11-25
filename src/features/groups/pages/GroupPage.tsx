import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdEmail,
  MdFileDownload,
  MdPerson,
  MdCheckCircle,
  MdCancel,
  MdPending,
  MdTrendingUp,
  MdMoreVert,
  MdAssignment,
  MdSearch,
  MdStar,
  MdStarBorder,
  MdVisibility,
} from "react-icons/md";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { TabGroup } from "@/shared/components/ui/TabGroup";
import { type TestStatus } from "@/shared/types/database.types";
import { useGroupDetail } from "../hooks/useGroupDetail";
import {
  WORK_TYPE_KEYWORDS,
  type WorkTypeCode,
} from "@/features/groups/constants/workTypeKeywords";

export const GroupPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  // 그룹 상세 정보 조회
  const { data, isLoading, isError, error } = useGroupDetail(groupId || "");

  const [selectedTab, setSelectedTab] = useState<"all" | "completed">("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  // 데이터 추출
  const currentGroup = data?.group;
  const applicants = data?.applicants || [];

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

  // 직무 적합도 계산 (선호 유형들의 평균 점수)
  const calculateJobMatchScore = (
    statementScores: Record<WorkTypeCode, number>,
    preferredTypes: string[]
  ): number => {
    if (!preferredTypes.length) return 0;

    const matchingScores = preferredTypes.map(
      type => statementScores[type as WorkTypeCode] || 0
    );

    const average =
      matchingScores.reduce((sum, score) => sum + score, 0) /
      matchingScores.length;
    return Math.round(average);
  };

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
                {applicants.length}명
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
                  {
                    applicants.filter(
                      applicant => applicant.test_status === "completed"
                    ).length
                  }
                  명
                </p>
                <p className="text-sm text-neutral-600">
                  (
                  {applicants.length > 0
                    ? Math.round(
                        (applicants.filter(
                          applicant => applicant.test_status === "completed"
                        ).length /
                          applicants.length) *
                          100
                      )
                    : 0}
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
                  {
                    applicants.filter(
                      applicant =>
                        applicant.test_status === "completed" &&
                        applicant.test_result?.primaryWorkType &&
                        currentGroup.preferred_work_types.includes(
                          applicant.test_result.primaryWorkType
                        )
                    ).length
                  }
                  명
                </p>
                <p className="text-sm text-neutral-600">
                  (
                  {applicants.filter(a => a.test_status === "completed")
                    .length > 0
                    ? Math.round(
                        (applicants.filter(
                          applicant =>
                            applicant.test_status === "completed" &&
                            applicant.test_result?.primaryWorkType &&
                            currentGroup.preferred_work_types.includes(
                              applicant.test_result.primaryWorkType
                            )
                        ).length /
                          applicants.filter(
                            applicant => applicant.test_status === "completed"
                          ).length) *
                          100
                      )
                    : 0}
                  %)
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4 bg-primary-100">
              <MdTrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-600">
                평균 적합도
              </p>
              <div className="flex items-baseline gap-2">
                <p
                  className={`text-2xl font-bold ${getScoreColorClass(
                    (() => {
                      const completedWithScores = applicants.filter(
                        a =>
                          a.test_status === "completed" &&
                          a.test_result?.statementScores
                      );
                      if (completedWithScores.length === 0) return 0;

                      const totalScore = completedWithScores.reduce(
                        (sum, a) =>
                          sum +
                          calculateJobMatchScore(
                            a.test_result!.statementScores,
                            currentGroup.preferred_work_types
                          ),
                        0
                      );
                      return Math.round(
                        totalScore / completedWithScores.length
                      );
                    })()
                  )}`}
                >
                  {(() => {
                    const completedWithScores = applicants.filter(
                      a =>
                        a.test_status === "completed" &&
                        a.test_result?.statementScores
                    );
                    if (completedWithScores.length === 0) return 0;

                    const totalScore = completedWithScores.reduce(
                      (sum, a) =>
                        sum +
                        calculateJobMatchScore(
                          a.test_result!.statementScores,
                          currentGroup.preferred_work_types
                        ),
                      0
                    );
                    return Math.round(totalScore / completedWithScores.length);
                  })()}
                  점
                </p>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                완료된 지원자 기준
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                          className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(applicant.test_status)}`}
                        >
                          {getStatusIcon(applicant.test_status)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mb-3 text-sm text-neutral-600">
                        <span>{applicant.email}</span>
                        <span>•</span>
                        <span>
                          지원일:{" "}
                          {formatDate(applicant.test_submitted_at || "")}
                        </span>
                        {applicant.test_submitted_at && (
                          <>
                            <span>•</span>
                            <span>
                              완료일:{" "}
                              {formatDate(applicant.test_submitted_at || "")}
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

                          {/* 직무 적합도 */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-neutral-700">
                              직무 적합도
                            </span>
                            <span
                              className={`text-lg font-bold ${getScoreColorClass(
                                calculateJobMatchScore(
                                  applicant.test_result.statementScores,
                                  currentGroup.preferred_work_types
                                )
                              )}`}
                            >
                              {calculateJobMatchScore(
                                applicant.test_result.statementScores,
                                currentGroup.preferred_work_types
                              )}
                              %
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleApplicantClick(applicant.id);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        title="상세보기"
                      >
                        <MdVisibility className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={e => e.stopPropagation()}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        title="더보기"
                      >
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
                  조건에 맞는 지원자가 없습니다.
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
              {currentGroup.preferred_work_types.map((type: WorkTypeCode) => (
                <span
                  key={type}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary"
                >
                  {getWorkTypeName(type as WorkTypeCode)}
                </span>
              ))}
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
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
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
