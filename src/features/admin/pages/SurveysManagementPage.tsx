import { useState, useMemo } from "react";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { useAuth } from "@/shared/contexts/useAuth";
import { useUserProfile } from "@/shared/hooks/useUserProfile";
import { Navigate } from "react-router-dom";
import {
  MdSearch,
  MdFilterList,
  MdDownload,
  MdRefresh,
  MdAssessment,
  MdClose,
} from "react-icons/md";
import { useSurveys } from "../hooks/useSurveys";
import { SelectDropdown } from "@/shared/components/ui/Dropdown";

export const SurveysManagementPage = () => {
  const { user } = useAuth();
  const { data: userProfile, isLoading: profileLoading } = useUserProfile(
    user?.id
  );
  const { data: surveys, isLoading, error, refetch } = useSurveys();

  const [searchTerm, setSearchTerm] = useState("");
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "rating">("date");
  const [selectedFeedback, setSelectedFeedback] = useState<{
    email: string;
    feedback: string;
  } | null>(null);

  // 필터링 및 정렬된 데이터
  const filteredSurveys = useMemo(() => {
    if (!surveys) return [];

    let filtered = surveys.filter(survey => {
      const matchesSearch =
        survey.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (survey.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false);
      const matchesAge = ageFilter === "all" || survey.age_range === ageFilter;
      return matchesSearch && matchesAge;
    });

    // 정렬
    if (sortBy === "date") {
      filtered = filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === "rating") {
      filtered = filtered.sort((a, b) => {
        const avgA = (a.q1 + a.q2 + a.q3) / 3;
        const avgB = (b.q1 + b.q2 + b.q3) / 3;
        return avgB - avgA;
      });
    }

    return filtered;
  }, [surveys, searchTerm, ageFilter, sortBy]);

  // 통계 계산
  const stats = useMemo(() => {
    if (!surveys) return { total: 0, avgRating: 0, withFeedback: 0 };

    const total = surveys.length;
    const withFeedback = surveys.filter(s => s.feedback).length;
    const avgRating =
      surveys.reduce((sum, s) => sum + (s.q1 + s.q2 + s.q3) / 3, 0) /
      (total || 1);

    return { total, avgRating, withFeedback };
  }, [surveys]);

  // 관리자가 아닌 경우 대시보드로 리다이렉트
  if (!profileLoading && !userProfile?.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  // 로딩 중
  if (profileLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner h-8 w-8 text-primary-500" />
      </div>
    );
  }

  // CSV 다운로드
  const handleExportCSV = () => {
    if (!filteredSurveys.length) return;

    const headers = [
      "이메일",
      "연령대",
      "만족도",
      "추천도",
      "유용도",
      "평균 점수",
      "피드백",
      "작성일",
    ];
    const rows = filteredSurveys.map(survey => [
      survey.email,
      survey.age_range,
      survey.q1,
      survey.q2,
      survey.q3,
      ((survey.q1 + survey.q2 + survey.q3) / 3).toFixed(1),
      survey.feedback || "",
      new Date(survey.created_at).toLocaleString("ko-KR"),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `minitest_surveys_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAgeRangeLabel = (ageRange: string) => {
    const labels: Record<string, string> = {
      "10s": "10대",
      "20s": "20대",
      "30s": "30대",
      "40s": "40대",
      "50s": "50대 이상",
    };
    return labels[ageRange] || ageRange;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <DashboardLayout
      title="설문조사 관리"
      description="미니 테스트 설문조사 응답 현황"
      breadcrumbs={[
        { label: "대시보드", href: "/dashboard" },
        { label: "관리자", href: "/admin" },
        { label: "설문조사 관리" },
      ]}
    >
      <div className="space-y-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-neutral-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg mr-4 bg-primary-100">
                <MdAssessment className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">
                  총 응답 수
                </p>
                <p className="text-2xl font-bold text-neutral-800">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-neutral-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg mr-4 bg-success-100">
                <MdAssessment className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">
                  평균 평점
                </p>
                <p className="text-2xl font-bold text-neutral-800">
                  {stats.avgRating.toFixed(1)}
                  <span className="text-sm text-neutral-500 ml-1">/ 5.0</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-neutral-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg mr-4 bg-info-100">
                <MdAssessment className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">
                  피드백 작성
                </p>
                <p className="text-2xl font-bold text-neutral-800">
                  {stats.withFeedback}
                  <span className="text-sm text-neutral-500 ml-1">
                    (
                    {((stats.withFeedback / (stats.total || 1)) * 100).toFixed(
                      0
                    )}
                    %)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="이메일 또는 피드백 검색"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm text-neutral-800"
              />
            </div>

            <SelectDropdown
              value={ageFilter}
              onChange={setAgeFilter}
              options={[
                { value: "all", label: "전체 연령" },
                { value: "10s", label: "10대" },
                { value: "20s", label: "20대" },
                { value: "30s", label: "30대" },
                { value: "40s", label: "40대" },
                { value: "50s", label: "50대 이상" },
              ]}
              placeholder="연령대 선택"
              className="min-w-[140px]"
            />

            <SelectDropdown
              value={sortBy}
              onChange={value => setSortBy(value as "date" | "rating")}
              options={[
                { value: "date", label: "최신순" },
                { value: "rating", label: "평점순" },
              ]}
              placeholder="정렬"
              className="min-w-[120px]"
            />

            <button
              onClick={() => refetch()}
              className="px-4 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
              title="새로고침"
            >
              <MdRefresh className="w-5 h-5 text-neutral-700" />
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center gap-2"
            >
              <MdDownload className="w-5 h-5" />
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        </div>

        {/* 테이블 */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap">
                    이메일
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap">
                    연령대
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap min-w-[80px]">
                    만족도
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap min-w-[80px]">
                    추천도
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap min-w-[80px]">
                    유용도
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap min-w-[80px]">
                    평균
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap">
                    피드백
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap">
                    작성일
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {error ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <p className="text-red-600 mb-2">
                        데이터를 불러오는 중 오류가 발생했습니다.
                      </p>
                      <button
                        onClick={() => refetch()}
                        className="text-primary-600 hover:underline"
                      >
                        다시 시도
                      </button>
                    </td>
                  </tr>
                ) : filteredSurveys.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <MdFilterList className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                      <p className="text-neutral-600">
                        {searchTerm || ageFilter !== "all"
                          ? "검색 결과가 없습니다."
                          : "아직 설문조사 응답이 없습니다."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredSurveys.map(survey => {
                    const avgRating = (survey.q1 + survey.q2 + survey.q3) / 3;
                    return (
                      <tr
                        key={survey.id}
                        className="hover:bg-neutral-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 text-sm text-neutral-900 whitespace-nowrap">
                          {survey.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-700 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 whitespace-nowrap">
                            {getAgeRangeLabel(survey.age_range)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-neutral-900">
                          {survey.q1}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-neutral-900">
                          {survey.q2}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-neutral-900">
                          {survey.q3}
                        </td>
                        <td
                          className={`px-6 py-4 text-sm text-center font-semibold ${getRatingColor(avgRating)}`}
                        >
                          {avgRating.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-700 max-w-[200px]">
                          {survey.feedback ? (
                            <button
                              onClick={() =>
                                setSelectedFeedback({
                                  email: survey.email,
                                  feedback: survey.feedback!,
                                })
                              }
                              className="text-left w-full truncate hover:text-primary-600 transition-colors cursor-pointer block"
                              title="클릭하여 전체 내용 보기"
                            >
                              {survey.feedback}
                            </button>
                          ) : (
                            <span className="text-neutral-400 italic">
                              없음
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600 whitespace-nowrap">
                          {formatDate(survey.created_at)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 결과 수 표시 */}
        {filteredSurveys.length > 0 && (
          <div className="text-sm text-neutral-600 text-center">
            총 {filteredSurveys.length}개의 응답
          </div>
        )}

        {/* 피드백 상세 모달 */}
        {selectedFeedback && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedFeedback(null)}
          >
            <div
              className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* 모달 헤더 */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    피드백 상세
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    {selectedFeedback.email}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <MdClose className="w-5 h-5 text-neutral-600" />
                </button>
              </div>

              {/* 모달 내용 */}
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                  <p className="text-sm text-neutral-800 whitespace-pre-wrap leading-relaxed">
                    {selectedFeedback.feedback}
                  </p>
                </div>
              </div>

              {/* 모달 푸터 */}
              <div className="flex justify-end gap-3 p-6 border-t border-neutral-200">
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
