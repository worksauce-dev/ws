/**
 * 팀 상세 페이지
 * 팀 정보, 멤버 목록, 팀 구성 차트 표시
 */

import { Navigate, useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { Button } from "@/shared/components/ui/Button";
import { useUser } from "@/shared/hooks/useUser";
import { useTeamDetail } from "../hooks/useTeamDetail";
import { MdPeople, MdCheckCircle, MdPending, MdEmail } from "react-icons/md";
import WORK_TYPE_DATA from "@/features/groups/constants/workTypes";
import type { WorkTypeCode } from "@/features/groups/types/workType.types";
import { getPrimaryWorkType } from "../utils/workTypeUtils";

export const TeamDetailPage = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const { isAuthenticated } = useUser();

  const { data: team, isLoading, error } = useTeamDetail(teamId);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleBackClick = () => {
    navigate("/dashboard/teams");
  };

  // 테스트 상태 배지
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-success-100 text-success-800 rounded">
            <MdCheckCircle />
            완료
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-800 rounded">
            <MdPending />
            대기
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-info-100 text-info-800 rounded">
            <MdEmail />
            진행 중
          </span>
        );
    }
  };

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "대시보드", href: "/dashboard" },
        { label: "팀 관리", href: "/dashboard/teams" },
        { label: team?.name || "팀 상세" },
      ]}
    >
      <div className="max-w-7xl mx-auto">
        {/* 로딩 상태 */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-neutral-600 mt-4">팀 정보를 불러오는 중...</p>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
            <p className="text-error-800">
              팀 정보를 불러오는 중 오류가 발생했습니다.
            </p>
            <p className="text-sm text-error-600 mt-2">{error.message}</p>
          </div>
        )}

        {/* 팀 정보 */}
        {!isLoading && !error && team && (
          <div className="space-y-6">
            {/* 팀 개요 카드 */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-800">
                    {team.name}
                  </h2>
                  {team.description && (
                    <p className="text-neutral-600 mt-2">{team.description}</p>
                  )}
                </div>
              </div>

              {/* 통계 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-neutral-600 mb-1">
                    <MdPeople />
                    <span className="text-sm">총 팀원</span>
                  </div>
                  <p className="text-2xl font-bold text-neutral-800">
                    {team.total_members}명
                  </p>
                </div>
                <div className="bg-success-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-success-600 mb-1">
                    <MdCheckCircle />
                    <span className="text-sm">완료</span>
                  </div>
                  <p className="text-2xl font-bold text-success-800">
                    {team.completed_tests}명
                  </p>
                </div>
                <div className="bg-info-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-info-600 mb-1">
                    <MdPending />
                    <span className="text-sm">대기 중</span>
                  </div>
                  <p className="text-2xl font-bold text-info-800">
                    {team.total_members - team.completed_tests}명
                  </p>
                </div>
              </div>

              {/* 진행률 */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-600">
                    테스트 진행률
                  </span>
                  <span className="text-sm font-medium text-neutral-800">
                    {team.total_members > 0
                      ? Math.round(
                          (team.completed_tests / team.total_members) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-3">
                  <div
                    className="bg-primary-500 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${team.total_members > 0 ? (team.completed_tests / team.total_members) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 팀 구성 차트 (완료된 테스트가 있는 경우) */}
            {team.team_composition && team.completed_tests > 0 && (
              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                  팀 직무 유형 분포
                </h3>
                <div className="space-y-3">
                  {Object.entries(team.team_composition)
                    .sort((a, b) => b[1] - a[1])
                    .map(([code, count]) => {
                      const workType = WORK_TYPE_DATA[code as WorkTypeCode];
                      const percentage =
                        team.completed_tests > 0
                          ? (count / team.completed_tests) * 100
                          : 0;

                      return (
                        <div key={code}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-neutral-700">
                              {workType?.name || code}
                            </span>
                            <span className="text-sm text-neutral-600">
                              {count}명 ({Math.round(percentage)}%)
                            </span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2">
                            <div
                              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 팀원 목록 */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                팀원 목록
              </h3>

              {team.members.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  등록된 팀원이 없습니다.
                </div>
              ) : (
                <div className="space-y-3">
                  {team.members.map(member => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-neutral-800">
                          {member.name}
                        </h4>
                        <p className="text-sm text-neutral-600">
                          {member.email}
                        </p>
                        {(() => {
                          const primaryType = getPrimaryWorkType(
                            member.test_result
                          );
                          return primaryType ? (
                            <p className="text-sm text-primary-600 mt-1">
                              {WORK_TYPE_DATA[primaryType]?.name}
                            </p>
                          ) : null;
                        })()}
                      </div>
                      <div>{getStatusBadge(member.test_status)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 액션 버튼 */}
            <div className="flex justify-end gap-4">
              <Button variant="secondary" onClick={handleBackClick}>
                목록으로
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // TODO: 테스트 이메일 재발송 기능
                  alert("테스트 이메일 재발송 기능은 곧 추가됩니다.");
                }}
              >
                테스트 이메일 재발송
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
