/**
 * 그룹 폼 유효성 검증 훅
 * 폼 검증 로직과 토스트 메시지를 통합 관리
 */

import { useCallback } from "react";
import { useToast } from "@/shared/components/ui/useToast";
import type { UseGroupFormReturn } from "../types/group.types";

interface UseGroupFormValidationParams {
  groupForm: UseGroupFormReturn;
  applicantsCount: number;
}

export const useGroupFormValidation = ({
  groupForm,
  applicantsCount,
}: UseGroupFormValidationParams) => {
  const { showToast } = useToast();

  /**
   * 폼 유효성 검증 + 토스트 메시지 표시
   * @returns 유효성 검증 통과 여부
   */
  const validateAndNotify = useCallback((): boolean => {
    const validation = groupForm.validateForm(applicantsCount);

    if (!validation.isValid) {
      showToast("warning", "입력 오류", validation.error!);
      return false;
    }

    return true;
  }, [groupForm, applicantsCount, showToast]);

  return {
    validateAndNotify,
  };
};
