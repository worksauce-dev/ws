/**
 * 팀 관리 페이지 (리팩토링 완료)
 * 팀 추가, 수정, 상세보기를 모두 한 페이지에서 상태관리로 처리
 */

import { Navigate } from "react-router-dom";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { Button } from "@/shared/components/ui/Button";
import { useUser } from "@/shared/hooks/useUser";
import { useTeamsWithComposition } from "../hooks/useTeamsWithComposition";
import { useTeamDetail } from "../hooks/useTeamDetail";
import { useTeamModals } from "../hooks/useTeamModals";
import { TeamCard } from "../components/TeamCard";
import { TeamCreateModal } from "../components/TeamCreateModal";
import { TeamEditModal } from "../components/TeamEditModal";
import { TeamDeleteModal } from "../components/TeamDeleteModal";
import { TeamDetailDrawer } from "../components/TeamDetailDrawer";
import { CreateGroupLoadingModal } from "@/features/groups/components/CreateGroupLoadingModal";
import { MdAdd, MdPeople } from "react-icons/md";

export const TeamsPage = () => {
  const { userId, isAuthenticated } = useUser();

  // 모달 관리 훅
  const modals = useTeamModals();

  // 데이터 fetching
  const { data: teams, isLoading, error } = useTeamsWithComposition(userId);
  const { data: selectedTeam } = useTeamDetail(
    modals.selectedTeamId || undefined
  );

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "대시보드", href: "/dashboard" },
        { label: "팀 대시보드" },
      ]}
      actions={
        <button
          onClick={modals.handleOpenCreateModal}
          className="inline-flex items-center justify-center w-10 h-10 sm:w-auto sm:h-[52px] sm:px-6 rounded-full sm:rounded-lg font-medium text-white text-sm bg-primary-500 hover:bg-primary-600 transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
        >
          <MdAdd className="w-6 h-6 sm:w-4 sm:h-4 sm:mr-2" />
          <span className="hidden sm:inline">새 팀 만들기</span>
        </button>
      }
    >
      <div className="max-w-7xl mx-auto">
        {/* 로딩 상태 */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
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
                <Button
                  variant="primary"
                  onClick={modals.handleOpenCreateModal}
                >
                  <MdAdd className="mr-2" />첫 팀 만들기
                </Button>
              </div>
            ) : (
              // 팀 카드 그리드
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(team => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    onDetail={modals.handleOpenDetailModal}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* 팀 생성 모달 */}
        <TeamCreateModal
          isOpen={modals.modalState === "create"}
          onClose={modals.handleCloseModal}
          teamName={modals.teamName}
          teamDescription={modals.teamDescription}
          onTeamNameChange={modals.setTeamName}
          onTeamDescriptionChange={modals.setTeamDescription}
          applicantManager={modals.applicantManager}
          fileUpload={modals.fileUpload}
          onSubmit={e => modals.handleSubmitCreate(e, userId!)}
          isCreating={modals.isCreating}
        />

        {/* 팀 수정 모달 */}
        <TeamEditModal
          isOpen={modals.modalState === "edit"}
          onClose={modals.handleCloseModal}
          teamName={modals.teamName}
          teamDescription={modals.teamDescription}
          onTeamNameChange={modals.setTeamName}
          onTeamDescriptionChange={modals.setTeamDescription}
          onSubmit={modals.handleSubmitEdit}
          isUpdating={modals.isUpdating}
        />

        {/* 팀 삭제 확인 모달 */}
        <TeamDeleteModal
          isOpen={modals.teamToDelete !== null}
          onClose={modals.handleCancelDelete}
          onConfirm={modals.handleConfirmDelete}
          isDeleting={modals.isDeleting}
        />

        {/* 팀 상세 드로어 */}
        <TeamDetailDrawer
          isOpen={modals.modalState === "detail"}
          onClose={modals.handleCloseModal}
          team={selectedTeam || null}
          onEdit={() => {
            if (selectedTeam) {
              modals.handleOpenEditModal(selectedTeam.id, teams || []);
            }
          }}
          onDelete={() => {
            if (selectedTeam) {
              modals.handleDeleteClick(selectedTeam.id);
            }
          }}
          onBulkRemoveMembers={memberIds => {
            // TODO: 일괄 팀원 삭제 API 호출
            console.log("Bulk remove members:", memberIds);
          }}
          onBulkMoveMembers={(memberIds, targetTeamId) => {
            // TODO: 일괄 팀원 이동 API 호출
            console.log(
              "Bulk move members:",
              memberIds,
              "to team:",
              targetTeamId
            );
          }}
          availableTeams={teams?.map(t => ({ id: t.id, name: t.name })) || []}
        />

        {/* 팀 생성 진행 상황 모달 */}
        <CreateGroupLoadingModal
          isOpen={
            modals.isCreating ||
            modals.flowState.currentStep === "sending" ||
            modals.flowState.currentStep === "complete"
          }
          currentStep={modals.flowState.currentStep}
          applicantCount={modals.applicantManager.applicants.length}
          successCount={modals.flowState.emailProgress.success}
          failedCount={modals.flowState.emailProgress.failed}
          errorMessage={modals.flowState.error}
        />
      </div>
    </DashboardLayout>
  );
};
