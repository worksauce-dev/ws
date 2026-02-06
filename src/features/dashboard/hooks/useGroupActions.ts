/**
 * 그룹 액션 관리 훅
 * 그룹 삭제, 수정, 복제, 내보내기 등의 액션 처리
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteGroup } from "@/features/groups/hooks/useDeleteGroup";
import { useUpdateGroup } from "@/features/groups/hooks/useUpdateGroup";
import { useToast } from "@/shared/components/ui/useToast";
import type { DropdownItem } from "@/shared/components/ui/Dropdown";
import type { Group } from "@/features/groups/types/group.types";

export const useGroupActions = (groups: Group[]) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // 마감일 연장 모달 상태
  const [extendDeadlineModal, setExtendDeadlineModal] = useState<{
    isOpen: boolean;
    groupId: string | null;
  }>({ isOpen: false, groupId: null });

  // 그룹 삭제 mutation
  const { mutate: deleteGroup } = useDeleteGroup({
    onSuccess: () => {
      showToast(
        "success",
        "그룹 삭제 완료",
        "그룹이 성공적으로 삭제되었습니다."
      );
    },
    onError: error => {
      showToast("error", "삭제 실패", error.message);
    },
  });

  // 그룹 업데이트 mutation
  const { mutate: updateGroup, isPending: isUpdating } = useUpdateGroup({
    onSuccess: () => {
      showToast(
        "success",
        "마감일 연장 완료",
        "마감일이 성공적으로 변경되었습니다."
      );
      setExtendDeadlineModal({ isOpen: false, groupId: null });
    },
    onError: error => {
      showToast("error", "업데이트 실패", error.message);
    },
  });

  // 그룹 카드 클릭 (상세 페이지로 이동)
  const handleGroupClick = (groupId: string) => {
    navigate(`/dashboard/groups/${groupId}`);
  };

  // 새 그룹 생성 페이지로 이동
  const handleCreateGroup = () => {
    navigate("/dashboard/create-group");
  };

  // 그룹 메뉴 액션 처리
  const handleGroupMenuAction = (groupId: string, item: DropdownItem) => {
    switch (item.id) {
      case "view":
        navigate(`/dashboard/groups/${groupId}`);
        break;

      case "edit":
        // TODO: 수정 모달 열기 등
        showToast("info", "준비중", "그룹 수정 기능은 곧 제공될 예정입니다.");
        break;

      case "duplicate":
        // TODO: 복제 로직
        showToast("info", "준비중", "그룹 복제 기능은 곧 제공될 예정입니다.");
        break;

      case "export":
        // TODO: CSV/Excel 다운로드
        showToast(
          "info",
          "준비중",
          "지원자 내보내기 기능은 곧 제공될 예정입니다."
        );
        break;

      case "extend":
        // 마감일 연장 모달 열기
        setExtendDeadlineModal({ isOpen: true, groupId });
        break;

      case "delete": {
        // 삭제 확인 다이얼로그
        const groupToDelete = groups.find(g => g.id === groupId);
        const confirmMessage = groupToDelete
          ? `"${groupToDelete.name}" 그룹을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없으며, 그룹 내 모든 지원자 데이터도 함께 삭제됩니다.`
          : "정말로 이 그룹을 삭제하시겠습니까?";

        if (window.confirm(confirmMessage)) {
          deleteGroup(groupId);
        }
        break;
      }

      default:
        break;
    }
  };

  // 크레딧 클릭 처리 (크레딧 관리 페이지로 이동)
  const handleCreditClick = () => {
    navigate("/dashboard/credit");
  };

  // 마감일 변경 핸들러
  const handleExtendDeadline = (newDeadline: string) => {
    if (!extendDeadlineModal.groupId) return;

    updateGroup({
      groupId: extendDeadlineModal.groupId,
      updates: { deadline: newDeadline },
    });
  };

  // 모달 닫기 핸들러
  const closeExtendDeadlineModal = () => {
    setExtendDeadlineModal({ isOpen: false, groupId: null });
  };

  return {
    handleGroupClick,
    handleCreateGroup,
    handleGroupMenuAction,
    handleCreditClick,
    // 마감일 연장 관련
    extendDeadlineModal,
    handleExtendDeadline,
    closeExtendDeadlineModal,
    isUpdating,
  };
};
