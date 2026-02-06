import { useState, useMemo } from "react";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { useUser } from "@/shared/hooks/useUser";
import { Navigate } from "react-router-dom";
import {
  MdSearch,
  MdFilterList,
  MdDownload,
  MdRefresh,
  MdAssessment,
  MdClose,
  MdStar,
  MdThumbUp,
  MdThumbDown,
} from "react-icons/md";
import { useFeedbackSurveys } from "../hooks/useFeedbackSurveys";
import type { FeedbackSurveyRow } from "../hooks/useFeedbackSurveys";
import { SelectDropdown } from "@/shared/components/ui/Dropdown";
import {
  useMetadata,
  WORKSAUCE_METADATA_PRESETS,
} from "@/shared/hooks/useMetadata";

// 옵션 라벨 매핑
const USAGE_CONTEXT_LABELS: Record<string, string> = {
  new_hire: "신규 채용",
  intern: "인턴/수습",
  experienced: "경력직",
  internal_transfer: "내부 이동",
  team_building: "팀 빌딩",
  other: "기타",
};

const USEFUL_FEATURE_LABELS: Record<string, string> = {
  ai_analysis: "AI 분석",
  work_type_result: "실행유형 결과",
  interview_guide: "면접 가이드",
  group_management: "그룹 관리",
  applicant_comparison: "지원자 비교",
  other: "기타",
};

const IMPROVEMENT_AREA_LABELS: Record<string, string> = {
  ai_accuracy: "AI 정확도",
  ui_ux: "UI/UX",
  speed: "속도",
  features: "기능 부족",
  price: "가격 정책",
  other: "기타",
};

export const FeedbackSurveysManagementPage = () => {
  useMetadata(WORKSAUCE_METADATA_PRESETS.admin);
  const { isAdmin, isLoading: userLoading } = useUser();
  const { data: surveys, isLoading, error, refetch } = useFeedbackSurveys();

  const [searchTerm, setSearchTerm] = useState("");
  const [npsFilter, setNpsFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "nps" | "satisfaction">("date");
  const [selectedSurvey, setSelectedSurvey] = useState<FeedbackSurveyRow | null>(null);

  // 필터링 및 정렬된 데이터
  const filteredSurveys = useMemo(() => {
    if (!surveys) return [];

    let filtered = surveys.filter(survey => {
      const email = survey.user_profile?.email || "";
      const name = survey.user_profile?.name || "";
      const matchesSearch =
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.feature_request.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesNps = true;
      if (npsFilter === "promoter") {
        matchesNps = survey.nps_score >= 9;
      } else if (npsFilter === "passive") {
        matchesNps = survey.nps_score >= 7 && survey.nps_score <= 8;
      } else if (npsFilter === "detractor") {
        matchesNps = survey.nps_score <= 6;
      }

      return matchesSearch && matchesNps;
    });

    // 정렬
    if (sortBy === "date") {
      filtered = filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === "nps") {
      filtered = filtered.sort((a, b) => b.nps_score - a.nps_score);
    } else if (sortBy === "satisfaction") {
      filtered = filtered.sort((a, b) => b.ai_satisfaction - a.ai_satisfaction);
    }

    return filtered;
  }, [surveys, searchTerm, npsFilter, sortBy]);

  // 통계 계산
  const stats = useMemo(() => {
    if (!surveys || surveys.length === 0) {
      return { total: 0, avgNps: 0, avgSatisfaction: 0, promoters: 0, detractors: 0 };
    }

    const total = surveys.length;
    const avgNps = surveys.reduce((sum, s) => sum + s.nps_score, 0) / total;
    const avgSatisfaction = surveys.reduce((sum, s) => sum + s.ai_satisfaction, 0) / total;
    const promoters = surveys.filter(s => s.nps_score >= 9).length;
    const detractors = surveys.filter(s => s.nps_score <= 6).length;

    return { total, avgNps, avgSatisfaction, promoters, detractors };
  }, [surveys]);

  // NPS 점수 계산 (Promoters % - Detractors %)
  const npsScore = useMemo(() => {
    if (stats.total === 0) return 0;
    const promoterPercent = (stats.promoters / stats.total) * 100;
    const detractorPercent = (stats.detractors / stats.total) * 100;
    return Math.round(promoterPercent - detractorPercent);
  }, [stats]);

  // 관리자가 아닌 경우 대시보드로 리다이렉트
  if (!userLoading && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // 로딩 중
  if (userLoading || isLoading) {
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
      "이름",
      "AI 만족도",
      "NPS 점수",
      "사용 상황",
      "유용한 기능",
      "개선 필요",
      "기능 요청",
      "추가 의견",
      "작성일",
    ];
    const rows = filteredSurveys.map(survey => [
      survey.user_profile?.email || "-",
      survey.user_profile?.name || "-",
      survey.ai_satisfaction,
      survey.nps_score,
      survey.usage_contexts.map(c => USAGE_CONTEXT_LABELS[c] || c).join(", "),
      survey.useful_features.map(f => USEFUL_FEATURE_LABELS[f] || f).join(", "),
      survey.improvement_areas.map(a => IMPROVEMENT_AREA_LABELS[a] || a).join(", "),
      survey.feature_request,
      survey.additional_feedback || "",
      new Date(survey.created_at).toLocaleString("ko-KR"),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `feedback_surveys_${new Date().toISOString().split("T")[0]}.csv`;
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

  const getNpsColor = (score: number) => {
    if (score >= 9) return "text-green-600 bg-green-50";
    if (score >= 7) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getNpsLabel = (score: number) => {
    if (score >= 9) return "추천";
    if (score >= 7) return "중립";
    return "비추천";
  };

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "대시보드", href: "/dashboard" },
        { label: "관리자", href: "/admin" },
        { label: "서비스 피드백 관리" },
      ]}
    >
      <div className="space-y-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-neutral-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg mr-4 bg-primary-100">
                <MdAssessment className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">총 응답 수</p>
                <p className="text-2xl font-bold text-neutral-800">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-neutral-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg mr-4 bg-violet-100">
                <MdAssessment className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">
                  추천 지수
                  <span className="text-xs text-neutral-400 ml-1">(NPS)</span>
                </p>
                <p className={`text-2xl font-bold ${npsScore >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {npsScore > 0 ? "+" : ""}{npsScore}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-neutral-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg mr-4 bg-yellow-100">
                <MdStar className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">AI 만족도</p>
                <p className="text-2xl font-bold text-neutral-800">
                  {stats.avgSatisfaction.toFixed(1)}
                  <span className="text-sm text-neutral-500 ml-1">/ 5.0</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-neutral-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <MdThumbUp className="w-5 h-5 text-green-500 mr-1" />
                <span className="text-lg font-bold text-green-600">{stats.promoters}</span>
              </div>
              <div className="h-8 w-px bg-neutral-200" />
              <div className="flex items-center">
                <MdThumbDown className="w-5 h-5 text-red-500 mr-1" />
                <span className="text-lg font-bold text-red-600">{stats.detractors}</span>
              </div>
            </div>
            <p className="text-xs text-neutral-500 mt-2">추천 / 비추천</p>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="이메일, 이름 또는 기능 요청 검색"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm text-neutral-800"
              />
            </div>

            <SelectDropdown
              value={npsFilter}
              onChange={setNpsFilter}
              options={[
                { value: "all", label: "전체" },
                { value: "promoter", label: "추천 (9-10)" },
                { value: "passive", label: "중립 (7-8)" },
                { value: "detractor", label: "비추천 (0-6)" },
              ]}
              placeholder="추천 지수"
              className="min-w-[140px]"
            />

            <SelectDropdown
              value={sortBy}
              onChange={value => setSortBy(value as "date" | "nps" | "satisfaction")}
              options={[
                { value: "date", label: "최신순" },
                { value: "nps", label: "추천 지수순" },
                { value: "satisfaction", label: "만족도순" },
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
                    사용자
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap">
                    AI 만족도
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap">
                    추천 지수
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap">
                    사용 상황
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap">
                    기능 요청
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap">
                    작성일
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
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
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <MdFilterList className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                      <p className="text-neutral-600">
                        {searchTerm || npsFilter !== "all"
                          ? "검색 결과가 없습니다."
                          : "아직 피드백 설문 응답이 없습니다."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredSurveys.map(survey => (
                    <tr
                      key={survey.id}
                      onClick={() => setSelectedSurvey(survey)}
                      className="hover:bg-neutral-50 transition-colors duration-150 cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            {survey.user_profile?.name || "-"}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {survey.user_profile?.email || "-"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <MdStar className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-medium text-neutral-900">
                            {survey.ai_satisfaction}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getNpsColor(survey.nps_score)}`}
                        >
                          {survey.nps_score} ({getNpsLabel(survey.nps_score)})
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {survey.usage_contexts.slice(0, 2).map(context => (
                            <span
                              key={context}
                              className="inline-block px-2 py-0.5 text-xs bg-neutral-100 text-neutral-700 rounded"
                            >
                              {USAGE_CONTEXT_LABELS[context] || context}
                            </span>
                          ))}
                          {survey.usage_contexts.length > 2 && (
                            <span className="text-xs text-neutral-500">
                              +{survey.usage_contexts.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700 max-w-[250px]">
                        <p className="truncate" title={survey.feature_request}>
                          {survey.feature_request}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 whitespace-nowrap">
                        {formatDate(survey.created_at)}
                      </td>
                    </tr>
                  ))
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

        {/* 상세 모달 */}
        {selectedSurvey && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedSurvey(null)}
          >
            <div
              className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* 모달 헤더 */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200 flex-shrink-0">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    피드백 상세
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    {selectedSurvey.user_profile?.name || "-"} ({selectedSurvey.user_profile?.email || "-"})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSurvey(null)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <MdClose className="w-5 h-5 text-neutral-600" />
                </button>
              </div>

              {/* 모달 내용 */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {/* 점수 요약 */}
                <div className="flex gap-4">
                  <div className="flex-1 bg-yellow-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-yellow-700">AI 만족도</p>
                    <p className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                      <MdStar className="w-6 h-6" />
                      {selectedSurvey.ai_satisfaction}/5
                    </p>
                  </div>
                  <div className={`flex-1 rounded-lg p-4 text-center ${getNpsColor(selectedSurvey.nps_score)}`}>
                    <p className="text-sm">추천 지수</p>
                    <p className="text-2xl font-bold">
                      {selectedSurvey.nps_score}/10
                    </p>
                    <p className="text-xs mt-1">{getNpsLabel(selectedSurvey.nps_score)}</p>
                  </div>
                </div>

                {/* 사용 상황 */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-2">사용 상황</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSurvey.usage_contexts.map(context => (
                      <span
                        key={context}
                        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg"
                      >
                        {USAGE_CONTEXT_LABELS[context] || context}
                      </span>
                    ))}
                  </div>
                  {selectedSurvey.usage_context_other && (
                    <p className="mt-2 text-sm text-neutral-600">
                      기타: {selectedSurvey.usage_context_other}
                    </p>
                  )}
                </div>

                {/* 유용한 기능 */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-2">유용한 기능</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSurvey.useful_features.map(feature => (
                      <span
                        key={feature}
                        className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg"
                      >
                        {USEFUL_FEATURE_LABELS[feature] || feature}
                      </span>
                    ))}
                  </div>
                  {selectedSurvey.useful_feature_other && (
                    <p className="mt-2 text-sm text-neutral-600">
                      기타: {selectedSurvey.useful_feature_other}
                    </p>
                  )}
                </div>

                {/* 개선 필요 부분 */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-2">개선 필요 부분</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSurvey.improvement_areas.map(area => (
                      <span
                        key={area}
                        className="px-3 py-1.5 text-sm bg-orange-50 text-orange-700 rounded-lg"
                      >
                        {IMPROVEMENT_AREA_LABELS[area] || area}
                      </span>
                    ))}
                  </div>
                  {selectedSurvey.improvement_area_other && (
                    <p className="mt-2 text-sm text-neutral-600">
                      기타: {selectedSurvey.improvement_area_other}
                    </p>
                  )}
                </div>

                {/* 기능 요청 */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-2">기능 요청</h4>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-sm text-neutral-800 whitespace-pre-wrap">
                      {selectedSurvey.feature_request}
                    </p>
                  </div>
                </div>

                {/* 추가 의견 */}
                {selectedSurvey.additional_feedback && (
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-700 mb-2">추가 의견</h4>
                    <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                      <p className="text-sm text-neutral-800 whitespace-pre-wrap">
                        {selectedSurvey.additional_feedback}
                      </p>
                    </div>
                  </div>
                )}

                {/* 작성일 */}
                <div className="text-sm text-neutral-500 text-right">
                  작성일: {formatDate(selectedSurvey.created_at)}
                </div>
              </div>

              {/* 모달 푸터 */}
              <div className="flex justify-end gap-3 p-6 border-t border-neutral-200 flex-shrink-0">
                <button
                  onClick={() => setSelectedSurvey(null)}
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
