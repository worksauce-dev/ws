/**
 * 팀 수정 모달 컴포넌트
 * 기존 팀 정보를 수정하는 모달
 */

import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import { TeamForm } from "./TeamForm";
import { MdEdit } from "react-icons/md";

interface TeamEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  teamDescription: string;
  onTeamNameChange: (value: string) => void;
  onTeamDescriptionChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isUpdating: boolean;
}

export const TeamEditModal = ({
  isOpen,
  onClose,
  teamName,
  teamDescription,
  onTeamNameChange,
  onTeamDescriptionChange,
  onSubmit,
  isUpdating,
}: TeamEditModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="팀 정보 수정" size="lg">
      <form onSubmit={onSubmit} noValidate className="space-y-6">
        {/* 헤더 섹션 */}
        <div className="flex items-start gap-4 pb-6 border-b border-neutral-200">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <MdEdit className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-neutral-600 leading-relaxed">
              팀 이름과 설명을 수정할 수 있습니다.
              <br />
              <span className="text-xs text-neutral-500 mt-1 inline-block">
                💡 팀원 정보는 팀 상세보기에서 관리할 수 있습니다.
              </span>
            </p>
          </div>
        </div>

        {/* 폼 영역 */}
        <TeamForm
          teamName={teamName}
          teamDescription={teamDescription}
          onTeamNameChange={onTeamNameChange}
          onTeamDescriptionChange={onTeamDescriptionChange}
          showInfoMessage={false}
        />

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-3 pt-6 border-t border-neutral-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isUpdating}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isUpdating}
            isLoading={isUpdating}
            className="min-w-[100px]"
          >
            {isUpdating ? "수정 중..." : "수정하기"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
