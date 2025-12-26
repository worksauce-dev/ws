/**
 * 팀 대시보드 페이지
 * 사용자의 모든 팀 목록 표시
 */

import { Navigate, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { Button } from "@/shared/components/ui/Button";
import { useUser } from "@/shared/hooks/useUser";
import { useTeamsWithComposition } from "../hooks/useTeamsWithComposition";
import { MdAdd, MdPeople, MdCheckCircle } from "react-icons/md";

export const TeamsPage = () => {
  const navigate = useNavigate();
  const { userId, isAuthenticated } = useUser();

  const { data: teams, isLoading, error } = useTeamsWithComposition(userId);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleCreateTeam = () => {
    navigate("/dashboard/teams/create");
  };

  const handleTeamClick = (teamId: string) => {
    navigate(`/dashboard/teams/${teamId}`);
  };

  return (
    <DashboardLayout
      title="팀 관리"
      breadcrumbs={[{ label: "대시보드", href: "/dashboard" }, { label: "팀 관리" }]}
    >
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">팀 관리</h1>
            <p className="text-sm text-neutral-600 mt-1">
              팀원들의 직무 실행 유형을 파악하고 관리하세요
            </p>
          </div>
          <Button variant="primary" onClick={handleCreateTeam}>
            <MdAdd className="mr-2" />새 팀 만들기
          </Button>
        </div>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-neutral-600 mt-4">팀 목록을 불러오는 중...</p>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
            <p className="text-error-800">
              팀 목록을 불러오는 중 오류가 발생했습니다.
            </p>
            <p className="text-sm text-error-600 mt-2">{error.message}</p>
          </div>
        )}

        {/* 팀 목록 */}
        {!isLoading && !error && teams && (
          <>
            {teams.length === 0 ? (
              // 빈 상태
              <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
                    <MdPeople className="text-3xl text-neutral-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  아직 생성된 팀이 없습니다
                </h3>
                <p className="text-neutral-600 mb-6">
                  첫 번째 팀을 만들어 팀원들의 직무 유형을 파악해보세요
                </p>
                <Button variant="primary" onClick={handleCreateTeam}>
                  <MdAdd className="mr-2" />
                  첫 팀 만들기
                </Button>
              </div>
            ) : (
              // 팀 카드 그리드
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(team => (
                  <div
                    key={team.id}
                    onClick={() => handleTeamClick(team.id)}
                    className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    {/* 팀 이름 */}
                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                      {team.name}
                    </h3>

                    {/* 팀 설명 */}
                    {team.description && (
                      <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                        {team.description}
                      </p>
                    )}

                    {/* 통계 */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-neutral-200">
                      <div className="flex items-center gap-2">
                        <MdPeople className="text-neutral-500" />
                        <span className="text-sm text-neutral-700">
                          {team.total_members}명
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdCheckCircle className="text-success-600" />
                        <span className="text-sm text-neutral-700">
                          {team.completed_tests}/{team.total_members} 완료
                        </span>
                      </div>
                    </div>

                    {/* 진행률 바 */}
                    <div className="mt-4">
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${team.total_members > 0 ? (team.completed_tests / team.total_members) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-neutral-500 mt-1 text-right">
                        {team.total_members > 0
                          ? Math.round(
                              (team.completed_tests / team.total_members) * 100
                            )
                          : 0}
                        % 진행
                      </p>
                    </div>

                    {/* 생성일 */}
                    <p className="text-xs text-neutral-500 mt-4">
                      생성일:{" "}
                      {new Date(team.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
