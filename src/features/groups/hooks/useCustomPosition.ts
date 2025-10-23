import { useState, useCallback } from "react";

export interface PositionOption {
  value: string;
  label: string;
}

export interface UseCustomPositionReturn {
  customPositionList: PositionOption[];
  customPosition: string;
  isCustomPositionModalOpen: boolean;
  setCustomPosition: (value: string) => void;
  openModal: () => void;
  closeModal: () => void;
  addCustomPosition: (position: string) => void;
}

/**
 * 커스텀 포지션 관리 hook
 * 사용자가 직접 포지션을 추가할 수 있는 기능을 제공합니다
 */
export const useCustomPosition = (): UseCustomPositionReturn => {
  const [customPositionList, setCustomPositionList] = useState<PositionOption[]>([]);
  const [customPosition, setCustomPosition] = useState("");
  const [isCustomPositionModalOpen, setIsCustomPositionModalOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsCustomPositionModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsCustomPositionModalOpen(false);
    setCustomPosition("");
  }, []);

  const addCustomPosition = useCallback((position: string) => {
    const trimmedPosition = position.trim();
    if (!trimmedPosition) return;

    const newPosition: PositionOption = {
      value: trimmedPosition,
      label: trimmedPosition,
    };

    setCustomPositionList(prev => [...prev, newPosition]);
    closeModal();
  }, [closeModal]);

  return {
    customPositionList,
    customPosition,
    isCustomPositionModalOpen,
    setCustomPosition,
    openModal,
    closeModal,
    addCustomPosition,
  };
};
