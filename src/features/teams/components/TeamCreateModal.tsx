/**
 * 팀 생성 모달 컴포넌트
 * 새로운 팀을 생성하는 모달
 */

import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import { TeamForm } from "./TeamForm";
import { ApplicantManager } from "@/features/groups/components/ApplicantManager";
import { MdGroupAdd } from "react-icons/md";
import type { UseApplicantManagerReturn } from "@/features/groups/types/applicant.types";
import type { UseFileUploadReturn } from "@/features/groups/types/fileUpload.types";

interface TeamCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  teamDescription: string;
  onTeamNameChange: (value: string) => void;
  onTeamDescriptionChange: (value: string) => void;
  applicantManager: UseApplicantManagerReturn;
  fileUpload: UseFileUploadReturn;
  onSubmit: (e: React.FormEvent) => void;
  isCreating: boolean;
}

export const TeamCreateModal = ({
  isOpen,
  onClose,
  teamName,
  teamDescription,
  onTeamNameChange,
  onTeamDescriptionChange,
  applicantManager,
  fileUpload,
  onSubmit,
  isCreating,
}: TeamCreateModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="새 팀 만들기" size="xl">
      <form onSubmit={onSubmit} noValidate className="space-y-8">
        {/* 헤더 섹션 */}
        <div className="flex items-start gap-4 pb-6 border-b border-neutral-200">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <MdGroupAdd className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-neutral-600 leading-relaxed">
              팀원들의 직무 실행 유형을 파악하여 팀 밸런스를 분석하고,
              <br className="hidden sm:block" />
              신규 채용 시 더 나은 의사결정을 할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 폼 영역 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 팀 정보 폼 */}
          <div className="xl:col-span-1 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-bold">
                  1
                </span>
                팀 기본 정보
              </h3>
              <TeamForm
                teamName={teamName}
                teamDescription={teamDescription}
                onTeamNameChange={onTeamNameChange}
                onTeamDescriptionChange={onTeamDescriptionChange}
                showInfoMessage={false}
              />
            </div>
          </div>

          {/* 팀원 관리 */}
          <div className="xl:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-bold">
                  2
                </span>
                팀원 추가
              </h3>
              <ApplicantManager
                applicantManager={applicantManager}
                fileUpload={fileUpload}
                labelOverride={{ singular: "팀원", plural: "팀원" }}
              />
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-between items-center pt-6 border-t border-neutral-200">
          <p className="text-xs text-neutral-500">
            {applicantManager.applicants.length > 0 && (
              <span className="font-medium text-primary-600">
                {applicantManager.applicants.length}명의 팀원
              </span>
            )}
            {applicantManager.applicants.length === 0 && (
              <span>최소 1명 이상의 팀원을 추가해주세요</span>
            )}
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isCreating}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isCreating}
              isLoading={isCreating}
              className="min-w-[120px]"
            >
              {isCreating ? "생성 중..." : "팀 생성하기"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
