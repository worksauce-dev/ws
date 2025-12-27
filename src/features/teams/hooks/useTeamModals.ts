/**
 * 팀 모달 상태 관리 커스텀 훅
 * 모든 모달 관련 상태와 핸들러를 캡슐화
 */

import { useState } from "react";
import { useToast } from "@/shared/components/ui/useToast";
import { useCreateTeamFlow } from "./useCreateTeamFlow";
import { useUpdateTeam } from "./useUpdateTeam";
import { useDeleteTeam } from "./useDeleteTeam";
import { useApplicantManager } from "@/features/groups/hooks/useApplicantManager";
import { useFileUpload } from "@/features/groups/hooks/useFileUpload";
import type { CreateTeamRequest, TeamDetail } from "../types/team.types";
import type { CreateGroupStep } from "@/features/groups/components/CreateGroupLoadingModal";

export type ModalState = "closed" | "create" | "edit" | "detail";

interface UseTeamModalsReturn {
  // Modal state
  modalState: ModalState;
  selectedTeamId: string | null;
  teamToDelete: string | null;

  // Form state
  teamName: string;
  teamDescription: string;
  setTeamName: (value: string) => void;
  setTeamDescription: (value: string) => void;

  // Applicant/member management
  applicantManager: ReturnType<typeof useApplicantManager>;
  fileUpload: ReturnType<typeof useFileUpload>;

  // Modal handlers
  handleOpenCreateModal: () => void;
  handleOpenDetailModal: (teamId: string) => void;
  handleOpenEditModal: (teamId: string, teams?: TeamDetail[]) => void;
  handleCloseModal: () => void;

  // Form submit handlers
  handleSubmitCreate: (e: React.FormEvent, userId: string) => void;
  handleSubmitEdit: (e: React.FormEvent) => void;

  // Delete handlers
  handleDeleteClick: (teamId: string) => void;
  handleConfirmDelete: () => void;
  handleCancelDelete: () => void;

  // Loading states
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Flow state
  flowState: {
    currentStep: CreateGroupStep;
    emailProgress: { success: number; failed: number };
    error: string;
  };
}

export const useTeamModals = (): UseTeamModalsReturn => {
  const { showToast } = useToast();

  // Modal state
  const [modalState, setModalState] = useState<ModalState>("closed");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);

  // Form state
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");

  // Member management
  const applicantManager = useApplicantManager();
  const fileUpload = useFileUpload(applicantManager.applicants);

  // Mutations
  const { executeFlow, flowState, isCreating } = useCreateTeamFlow({
    showRealName: true,
    onComplete: () => {
      showToast("success", "팀 생성 완료", "팀이 생성되었습니다!");
      handleCloseModal();
    },
  });

  const { mutate: updateTeam, isPending: isUpdating } = useUpdateTeam({
    onSuccess: () => {
      showToast("success", "팀 수정 완료", "팀 정보가 수정되었습니다!");
      handleCloseModal();
    },
    onError: (error: Error) => {
      showToast("error", "팀 수정 실패", error.message);
    },
  });

  const { mutate: deleteTeam, isPending: isDeleting } = useDeleteTeam({
    onSuccess: () => {
      showToast("success", "팀 삭제 완료", "팀이 삭제되었습니다!");
      setTeamToDelete(null);
    },
    onError: (error: Error) => {
      showToast("error", "팀 삭제 실패", error.message);
    },
  });

  // Modal handlers
  const handleOpenCreateModal = () => {
    setModalState("create");
    setTeamName("");
    setTeamDescription("");
    applicantManager.clearApplicants();
  };

  const handleOpenDetailModal = (teamId: string) => {
    setSelectedTeamId(teamId);
    setModalState("detail");
  };

  const handleOpenEditModal = (teamId: string, teams?: TeamDetail[]) => {
    const team = teams?.find((t) => t.id === teamId);
    if (team) {
      setSelectedTeamId(teamId);
      setTeamName(team.name);
      setTeamDescription(team.description || "");
      setModalState("edit");
    }
  };

  const handleCloseModal = () => {
    setModalState("closed");
    setSelectedTeamId(null);
    setTeamName("");
    setTeamDescription("");
    applicantManager.clearApplicants();
  };

  // Form submit handlers
  const handleSubmitCreate = (e: React.FormEvent, userId: string) => {
    e.preventDefault();

    if (!teamName.trim()) {
      showToast("error", "입력 오류", "팀 이름을 입력해주세요.");
      return;
    }

    if (applicantManager.applicants.length === 0) {
      showToast("error", "입력 오류", "최소 1명 이상의 팀원을 추가해주세요.");
      return;
    }

    const request: CreateTeamRequest = {
      user_id: userId,
      name: teamName,
      description: teamDescription,
      members: applicantManager.applicants.map((a) => ({
        name: a.name,
        email: a.email,
      })),
    };

    executeFlow(request);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      showToast("error", "입력 오류", "팀 이름을 입력해주세요.");
      return;
    }

    if (!selectedTeamId) return;

    updateTeam({
      teamId: selectedTeamId,
      updates: {
        name: teamName,
        description: teamDescription,
      },
    });
  };

  // Delete handlers
  const handleDeleteClick = (teamId: string) => {
    setTeamToDelete(teamId);
  };

  const handleConfirmDelete = () => {
    if (teamToDelete) {
      deleteTeam(teamToDelete);
    }
  };

  const handleCancelDelete = () => {
    setTeamToDelete(null);
  };

  return {
    // State
    modalState,
    selectedTeamId,
    teamToDelete,

    // Form state
    teamName,
    teamDescription,
    setTeamName,
    setTeamDescription,

    // Applicant/member management
    applicantManager,
    fileUpload,

    // Modal handlers
    handleOpenCreateModal,
    handleOpenDetailModal,
    handleOpenEditModal,
    handleCloseModal,

    // Form submit handlers
    handleSubmitCreate,
    handleSubmitEdit,

    // Delete handlers
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,

    // Loading states
    isCreating,
    isUpdating,
    isDeleting,

    // Flow state
    flowState,
  };
};
