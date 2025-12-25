import { useState, useCallback } from "react";
import { useToast } from "@/shared/components/ui/useToast";
import {
  type PositionOption,
  type UseCustomPositionReturn,
} from "../types/group.types";

/**
 * 커스텀 포지션 관리 hook
 * 사용자가 직접 포지션을 추가할 수 있는 기능을 제공합니다
 */
export const useCustomPosition = (): UseCustomPositionReturn => {
  const { showToast } = useToast();
  const [customPositionList, setCustomPositionList] = useState<
    PositionOption[]
  >([]);
  const [customPosition, setCustomPosition] = useState("");
  const [isCustomPositionModalOpen, setIsCustomPositionModalOpen] =
    useState(false);

  const openModal = useCallback(() => {
    setIsCustomPositionModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsCustomPositionModalOpen(false);
    setCustomPosition("");
  }, []);

  const addCustomPosition = useCallback(
    (position: string) => {
      const trimmedPosition = position.trim();
      if (!trimmedPosition) return;

      const newPosition: PositionOption = {
        value: trimmedPosition,
        label: trimmedPosition,
      };

      setCustomPositionList(prev => [...prev, newPosition]);
      closeModal();
    },
    [closeModal]
  );

  /**
   * 포지션 선택 핸들러
   * "__custom__" 선택 시 모달 열기, 그 외에는 콜백 실행
   */
  const handlePositionSelection = useCallback(
    (value: string, onSelect: (value: string) => void) => {
      if (value === "__custom__") {
        openModal();
      } else {
        onSelect(value);
      }
    },
    [openModal]
  );

  /**
   * 커스텀 포지션 추가 + 유효성 검증 + 토스트
   */
  const addPositionWithValidation = useCallback(
    (position: string, onSelect: (value: string) => void): boolean => {
      if (!position.trim()) {
        showToast("warning", "포지션명 입력 필요", "포지션명을 입력해주세요.");
        return false;
      }

      addCustomPosition(position);
      onSelect(position.trim());
      showToast(
        "success",
        "포지션 추가 완료",
        `"${position.trim()}" 포지션이 추가되었습니다.`
      );
      return true;
    },
    [addCustomPosition, showToast]
  );

  return {
    customPositionList,
    customPosition,
    isCustomPositionModalOpen,
    setCustomPosition,
    openModal,
    closeModal,
    addCustomPosition,
    handlePositionSelection,
    addPositionWithValidation,
  };
};
