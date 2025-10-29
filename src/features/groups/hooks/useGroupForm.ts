/**
 * 그룹 정보 폼 관리 훅
 * 폼 상태 관리와 유효성 검증에만 집중
 * API 호출은 useCreateGroup 훅이 담당
 */

import { useState, useCallback } from "react";
import type { GroupFormData, UseGroupFormReturn } from "../types/group.types";

const initialFormData: GroupFormData = {
  name: "",
  description: "",
  position: "",
  experienceLevel: "",
  preferredWorkTypes: [],
  deadline: "",
  autoReminder: "",
};

/**
 * 그룹 정보 입력 훅
 * 유효성 검사, 작업 유형 변경 등의 기능을 제공합니다
 */
export const useGroupForm = (): UseGroupFormReturn => {
  const [formData, setFormData] = useState<GroupFormData>(initialFormData);

  // 입력 필드 변경
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // 작업 유형 변경
  const handleWorkTypeChange = useCallback((type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferredWorkTypes: checked
        ? [...prev.preferredWorkTypes, type]
        : prev.preferredWorkTypes.filter(t => t !== type),
    }));
  }, []);

  // 폼 유효성 검사
  const validateForm = useCallback(
    (applicantsCount: number): { isValid: boolean; error?: string } => {
      if (!formData.name.trim()) {
        return { isValid: false, error: "그룹명을 입력해주세요." };
      }

      if (!formData.position) {
        return { isValid: false, error: "포지션을 선택해주세요." };
      }

      if (!formData.deadline) {
        return { isValid: false, error: "마감일을 선택해주세요." };
      }

      // 마감일이 현재 시간보다 이전인지 확인
      const deadlineDate = new Date(formData.deadline);
      const now = new Date();
      if (deadlineDate <= now) {
        return { isValid: false, error: "마감일은 현재 시간 이후여야 합니다." };
      }

      if (applicantsCount === 0) {
        return {
          isValid: false,
          error: "최소 1명 이상의 지원자를 추가해주세요.",
        };
      }

      return { isValid: true };
    },
    [formData]
  );

  // 폼 초기화
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  return {
    formData,
    handleInputChange,
    handleWorkTypeChange,
    validateForm,
    resetForm,
  };
};
