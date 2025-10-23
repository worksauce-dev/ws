import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { useToast } from "@/shared/components/ui/Toast";
import { ApplicantManager } from "../components/ApplicantManager";
import { GroupInfoForm } from "../components/GroupInfoForm";
import { useGroupForm } from "../hooks/useGroupForm";
import { useCustomPosition } from "../hooks/useCustomPosition";
import { useApplicantManager } from "../hooks/useApplicantManager";
import { useFileUpload } from "../hooks/useFileUpload";

export const CreateGroupPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Hooks
  const groupForm = useGroupForm();
  const customPosition = useCustomPosition();
  const applicantManager = useApplicantManager();
  const fileUpload = useFileUpload(applicantManager.applicants);

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

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await groupForm.handleSubmit(
      applicantManager.applicants.length,
      () => {
        showToast(
          "success",
          "그룹 생성 완료",
          "채용 그룹이 성공적으로 생성되었습니다."
        );
      }
    );

    if (!result.success) {
      showToast("warning", "입력 오류", result.error!);
    }
  };

  return (
    <DashboardLayout
      title="새 채용 그룹 생성"
      description="새로운 채용 그룹을 생성하고 지원자들을 효과적으로 관리해보세요"
      showBackButton
      onBackClick={handleBackClick}
      breadcrumbs={[
        { label: "워크소스", href: "/" },
        { label: "대시보드", href: "/dashboard" },
        { label: "새 그룹 생성" },
      ]}
    >
      <div className="max-w-7xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-24"
        >
          <GroupInfoForm
            groupForm={groupForm}
            customPositionList={customPosition.customPositionList}
            onPositionChange={handlePositionChange}
          />

          <ApplicantManager
            applicantManager={applicantManager}
            fileUpload={fileUpload}
          />
        </form>

        {/* 하단 고정 액션바 */}
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-neutral-200 px-6 py-4 flex justify-end gap-3 shadow-sm z-50">
          <Button
            type="button"
            onClick={handleBackClick}
            variant="outline"
            size="md"
          >
            취소
          </Button>
          <Button
            type="submit"
            form="create-group-form"
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={groupForm.isSubmitting}
            isLoading={groupForm.isSubmitting}
          >
            {groupForm.isSubmitting ? "그룹 생성중..." : "그룹 생성하기"}
          </Button>
        </div>
      </div>

      {/* 커스텀 포지션 추가 모달 */}
      <Modal
        isOpen={customPosition.isCustomPositionModalOpen}
        onClose={customPosition.closeModal}
        title="직접 포지션 추가"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              포지션명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customPosition.customPosition}
              onChange={e => customPosition.setCustomPosition(e.target.value)}
              placeholder="예: 블록체인 개발자"
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm text-neutral-800"
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomPosition();
                }
              }}
              autoFocus
            />
            <p className="text-xs text-neutral-500 mt-2">
              목록에 없는 포지션을 직접 추가할 수 있습니다.
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={customPosition.closeModal}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleAddCustomPosition}
            >
              추가
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};
