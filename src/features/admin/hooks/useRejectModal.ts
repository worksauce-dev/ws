import { useState, useCallback } from "react";
import type { BusinessVerification } from "@/features/settings/types/business.types";
import { useRejectBusinessVerification } from "./useBusinessVerifications";

interface UseRejectModalReturn {
  // 상태
  isOpen: boolean;
  selectedVerification: BusinessVerification | null;
  rejectionReason: string;
  isPending: boolean;

  // 액션
  openModal: (verification: BusinessVerification) => void;
  closeModal: () => void;
  setRejectionReason: (reason: string) => void;
  handleConfirm: () => void;
}

export const useRejectModal = (): UseRejectModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVerification, setSelectedVerification] =
    useState<BusinessVerification | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const rejectMutation = useRejectBusinessVerification();

  const openModal = useCallback((verification: BusinessVerification) => {
    setSelectedVerification(verification);
    setRejectionReason("");
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedVerification(null);
    setRejectionReason("");
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selectedVerification || !rejectionReason.trim()) {
      return;
    }

    rejectMutation.mutate(
      {
        verificationId: selectedVerification.id,
        reason: rejectionReason,
      },
      {
        onSuccess: () => {
          closeModal();
        },
      }
    );
  }, [selectedVerification, rejectionReason, rejectMutation, closeModal]);

  return {
    isOpen,
    selectedVerification,
    rejectionReason,
    isPending: rejectMutation.isPending,
    openModal,
    closeModal,
    setRejectionReason,
    handleConfirm,
  };
};
