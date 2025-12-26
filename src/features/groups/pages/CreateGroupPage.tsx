/**
 * 그룹 생성 페이지 (리팩토링 버전)
 * 그룹 정보 입력 및 지원자 관리 기능 제공
 */

import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { ApplicantManager } from "../components/ApplicantManager";
import { GroupInfoForm } from "../components/GroupInfoForm";
import PreviewTestEmail from "../components/PreviewTestEmail";
import { CreateGroupLoadingModal } from "../components/CreateGroupLoadingModal";
import { useGroupForm } from "../hooks/useGroupForm";
import { useCustomPosition } from "../hooks/useCustomPosition";
import { useApplicantManager } from "../hooks/useApplicantManager";
import { useFileUpload } from "../hooks/useFileUpload";
import { useCreateGroupFlow } from "../hooks/useCreateGroupFlow";
import { useGroupFormValidation } from "../hooks/useGroupFormValidation";
import { buildCreateGroupRequest } from "../utils/buildCreateGroupRequest";
import { useUser } from "@/shared/hooks/useUser";
import { useTeamsWithComposition } from "@/features/teams/hooks/useTeamsWithComposition";
import type { TeamComposition } from "@/shared/types/database.types";

export const CreateGroupPage = () => {
  const navigate = useNavigate();
  const { userId, isAuthenticated } = useUser();

  // State
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [showRealName, setShowRealName] = useState(true);
  const [teamComposition, setTeamComposition] = useState<TeamComposition | null>(null);

  // Hooks
  const groupForm = useGroupForm();
  const customPosition = useCustomPosition();
  const applicantManager = useApplicantManager();
  const fileUpload = useFileUpload(applicantManager.applicants);

  // 팀 목록 불러오기
  const { data: availableTeams } = useTeamsWithComposition(userId);

  // 폼 유효성 검증
  const { validateAndNotify } = useGroupFormValidation({
    groupForm,
    applicantsCount: applicantManager.applicants.length,
  });

  // 그룹 생성 플로우
  const { executeFlow, flowState, isCreating } = useCreateGroupFlow({
    showRealName,
  });

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  // 팀 선택 핸들러
  const handleSelectTeam = (teamId: string) => {
    const selectedTeam = availableTeams?.find(team => team.id === teamId);
    if (selectedTeam?.team_composition) {
      setTeamComposition(selectedTeam.team_composition);
    }
  };

  // 이메일 미리보기 버튼 클릭
  const handlePreviewEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAndNotify()) {
      setShowEmailPreview(true);
    }
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAndNotify()) {
      return;
    }

    const request = buildCreateGroupRequest({
      userId: userId!,
      formData: groupForm.formData,
      applicants: applicantManager.applicants,
      teamComposition,
    });

    executeFlow(request);
  };

  return (
    <DashboardLayout
      title="새 채용 그룹 만들기"
      breadcrumbs={[
        { label: "대시보드", href: "/dashboard" },
        { label: "새 그룹 생성" },
      ]}
      showBackButton={true}
      onBackClick={handleBackClick}
    >
      <div className="max-w-7xl mx-auto">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* 그룹 정보 폼 */}
            <GroupInfoForm
              groupForm={groupForm}
              customPositionList={customPosition.customPositionList}
              onPositionChange={value =>
                customPosition.handlePositionSelection(value, position =>
                  groupForm.handleInputChange("position", position)
                )
              }
              teamComposition={teamComposition}
              onTeamCompositionChange={setTeamComposition}
              availableTeams={availableTeams}
              onSelectTeam={handleSelectTeam}
            />

            {/* 지원자 관리 */}
            <ApplicantManager
              applicantManager={applicantManager}
              fileUpload={fileUpload}
            />
          </div>

          {/* 제출 버튼 */}
          <div className="mt-8 flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleBackClick}
              disabled={isCreating}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviewEmail}
              disabled={isCreating}
            >
              이메일 미리보기
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isCreating}
              isLoading={isCreating}
            >
              {isCreating ? "생성 중..." : "그룹 생성하기"}
            </Button>
          </div>
        </form>

        {/* 커스텀 포지션 추가 모달 */}
        <Modal
          isOpen={customPosition.isCustomPositionModalOpen}
          onClose={customPosition.closeModal}
          title="커스텀 포지션 추가"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                포지션명
              </label>
              <input
                type="text"
                value={customPosition.customPosition}
                onChange={e => customPosition.setCustomPosition(e.target.value)}
                placeholder="예: 풀스택 개발자"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={customPosition.closeModal}
              >
                취소
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() =>
                  customPosition.addPositionWithValidation(
                    customPosition.customPosition,
                    position => groupForm.handleInputChange("position", position)
                  )
                }
              >
                추가
              </Button>
            </div>
          </div>
        </Modal>

        {/* 이메일 미리보기 모달 */}
        {showEmailPreview && (
          <PreviewTestEmail
            groupName={groupForm.formData.name}
            deadline={groupForm.formData.deadline}
            applicants={applicantManager.applicants}
            showRealName={showRealName}
            onToggleRealName={() => setShowRealName(!showRealName)}
            onClose={() => setShowEmailPreview(false)}
          />
        )}

        {/* 그룹 생성 진행 상황 모달 */}
        <CreateGroupLoadingModal
          isOpen={
            isCreating ||
            flowState.currentStep === "sending" ||
            flowState.currentStep === "complete"
          }
          currentStep={flowState.currentStep}
          applicantCount={applicantManager.applicants.length}
          successCount={flowState.emailProgress.success}
          failedCount={flowState.emailProgress.failed}
          errorMessage={flowState.error}
        />
      </div>
    </DashboardLayout>
  );
};
