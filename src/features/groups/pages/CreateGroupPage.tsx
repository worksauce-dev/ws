/**
 * 그룹 생성 페이지
 * 그룹 정보 입력 및 지원자 관리 기능 제공
 */

import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { useToast } from "@/shared/components/ui/useToast";
import { ApplicantManager } from "../components/ApplicantManager";
import { GroupInfoForm } from "../components/GroupInfoForm";
import PreviewTestEmail from "../components/PreviewTestEmail";
import { useGroupForm } from "../hooks/useGroupForm";
import { useCustomPosition } from "../hooks/useCustomPosition";
import { useApplicantManager } from "../hooks/useApplicantManager";
import { useFileUpload } from "../hooks/useFileUpload";
import { useCreateGroup } from "../hooks/useCreateGroup";
import type { CreateGroupRequest, Group } from "../types/group.types";
import { useAuth } from "@/shared/contexts/useAuth";
import { sendSauceTestEmail } from "@/shared/services/sauceTestService";

export const CreateGroupPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();

  // State
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [showRealName, setShowRealName] = useState(true); // 기본값: 실명 표시

  // Hooks
  const groupForm = useGroupForm();
  const customPosition = useCustomPosition();
  const applicantManager = useApplicantManager();
  const fileUpload = useFileUpload(applicantManager.applicants);

  // 그룹 생성 mutation
  const { mutate: createGroup, isPending: isCreating } = useCreateGroup({
    onSuccess: async data => {
      showToast(
        "success",
        "그룹 생성 완료",
        `채용 그룹이 생성되었습니다. ${data.applicants.length}명의 지원자가 추가되었습니다.`
      );

      // 모든 지원자에게 소스테스트 이메일 발송
      await handleSendSauceTest(data.group, data.applicants);

      navigate(`/dashboard/groups/${data.group.id}`);
    },
    onError: error => {
      showToast("error", "생성 실패", error.message);
    },
  });

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  // 포지션 변경 처리 (커스텀 포지션 모달 열기)
  const handlePositionChange = (value: string) => {
    if (value === "__custom__") {
      customPosition.openModal();
    } else {
      groupForm.handleInputChange("position", value);
    }
  };

  // 커스텀 포지션 추가
  const handleAddCustomPosition = () => {
    if (!customPosition.customPosition.trim()) {
      showToast("warning", "포지션명 입력 필요", "포지션명을 입력해주세요.");
      return;
    }

    customPosition.addCustomPosition(customPosition.customPosition);
    groupForm.handleInputChange(
      "position",
      customPosition.customPosition.trim()
    );

    showToast(
      "success",
      "포지션 추가 완료",
      `"${customPosition.customPosition.trim()}" 포지션이 추가되었습니다.`
    );
  };

  /**
   * 소스테스트 이메일 발송 함수
   * @param group 생성된 그룹 정보
   * @param applicants 생성된 지원자 배열
   */
  const handleSendSauceTest = async (
    group: Pick<Group, "id" | "deadline">,
    applicants: Array<{
      id: string;
      name: string;
      email: string;
    }>
  ) => {
    try {
      // 사용자 이름 가져오기 (showRealName 설정에 따라)
      const userName = showRealName
        ? user?.user_metadata?.name || user?.email?.split("@")[0] || "관리자"
        : "담당자";

      // 모든 지원자에게 이메일 발송
      const emailPromises = applicants.map(applicant =>
        sendSauceTestEmail({
          applicantEmail: applicant.email,
          userName: userName,
          applicantName: applicant.name,
          testId: applicant.id,
          dashboardId: group.id,
          deadline: group.deadline,
        })
      );

      // 모든 이메일 발송 결과 대기
      const results = await Promise.all(emailPromises);

      // 성공/실패 카운트
      const successCount = results.filter(r => r.success).length;
      const failedCount = results.length - successCount;

      // 결과에 따른 토스트 메시지
      if (failedCount === 0) {
        showToast(
          "success",
          "이메일 발송 완료",
          `${successCount}명의 지원자에게 소스테스트 이메일을 발송했습니다.`
        );
      } else if (successCount === 0) {
        showToast(
          "error",
          "이메일 발송 실패",
          "모든 이메일 발송에 실패했습니다. 나중에 다시 시도해주세요."
        );
      } else {
        showToast(
          "warning",
          "일부 이메일 발송 실패",
          `${successCount}명에게 발송 완료, ${failedCount}명 발송 실패`
        );
      }
    } catch (error) {
      console.error("이메일 발송 중 오류:", error);
      showToast(
        "error",
        "이메일 발송 실패",
        "이메일 발송 중 오류가 발생했습니다."
      );
    }
  };

  // 이메일 미리보기 버튼 클릭
  const handlePreviewEmail = (e: React.FormEvent) => {
    e.preventDefault();

    // 클라이언트 측 유효성 검증
    const validation = groupForm.validateForm(
      applicantManager.applicants.length
    );

    if (!validation.isValid) {
      showToast("warning", "입력 오류", validation.error!);
      return;
    }

    // 이메일 미리보기 표시
    setShowEmailPreview(true);
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 클라이언트 측 유효성 검증
    const validation = groupForm.validateForm(
      applicantManager.applicants.length
    );

    if (!validation.isValid) {
      showToast("warning", "입력 오류", validation.error!);
      return;
    }

    // CreateGroupRequest 객체 생성
    const request: CreateGroupRequest = {
      user_id: user.id,
      name: groupForm.formData.name,
      description: groupForm.formData.description,
      position: groupForm.formData.position,
      experience_level: groupForm.formData.experienceLevel,
      preferred_work_types: groupForm.formData.preferredWorkTypes,
      deadline: groupForm.formData.deadline,
      auto_reminder: groupForm.formData.autoReminder === "yes",
      status: "active",
      applicants: applicantManager.applicants.map(app => ({
        name: app.name,
        email: app.email,
      })),
    };

    // API 호출
    createGroup(request);
  };

  return (
    <DashboardLayout
      title="새 채용 그룹 만들기"
      description="포지션 정보를 입력하고 지원자를 추가하세요"
    >
      <div className="max-w-7xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={handleBackClick}
          className="mb-6 flex items-center gap-2 text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
        >
          <span>←</span>
          <span>대시보드로 돌아가기</span>
        </button>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* 그룹 정보 폼 */}
            <GroupInfoForm
              groupForm={groupForm}
              customPositionList={customPosition.customPositionList}
              onPositionChange={handlePositionChange}
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
                onClick={handleAddCustomPosition}
              >
                추가
              </Button>
            </div>
          </div>
        </Modal>

        {/* 이메일 미리보기 모달 */}
        {showEmailPreview && (
          <PreviewTestEmail
            user={user}
            groupName={groupForm.formData.name}
            deadline={groupForm.formData.deadline}
            applicants={applicantManager.applicants}
            showRealName={showRealName}
            onToggleRealName={() => setShowRealName(!showRealName)}
            onClose={() => setShowEmailPreview(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};
