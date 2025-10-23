import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export interface GroupFormData {
  name: string;
  description: string;
  position: string;
  experienceLevel: string;
  preferredWorkTypes: string[];
  deadline: string;
  autoReminder: string;
}

export interface UseGroupFormReturn {
  // State
  formData: GroupFormData;
  isSubmitting: boolean;

  // Actions
  handleInputChange: (field: string, value: string) => void;
  handleWorkTypeChange: (type: string, checked: boolean) => void;
  handleSubmit: (
    applicantsCount: number,
    onSuccess?: () => void
  ) => Promise<{ success: boolean; error?: string }>;
  validateForm: (applicantsCount: number) => {
    isValid: boolean;
    error?: string;
  };
}

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
  const navigate = useNavigate();
  const [formData, setFormData] = useState<GroupFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      if (applicantsCount === 0) {
        return { isValid: false, error: "지원자가 없습니다." };
      }

      return { isValid: true };
    },
    [formData]
  );

  // 폼 제출
  const handleSubmit = useCallback(
    async (
      applicantsCount: number,
      onSuccess?: () => void
    ): Promise<{ success: boolean; error?: string }> => {
      // 유효성 검사
      const validation = validateForm(applicantsCount);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      setIsSubmitting(true);

      try {
        console.log("그룹 정보:", formData);

        // TODO: API 호출
        // const response = await createGroup(formData, applicants);

        // TODO: 3초 대기
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log("그룹 생성 완료");

        // 성공 콜백
        if (onSuccess) {
          onSuccess();
        }

        // 500ms 후 대시보드로 이동
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);

        return { success: true };
      } catch (error) {
        console.error("그룹 생성 실패:", error);
        return {
          success: false,
          error: "그룹 생성 실패. 그룹명, 포지션, 마감일을 확인해주세요.",
        };
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, navigate]
  );

  return {
    formData,
    isSubmitting,
    handleInputChange,
    handleWorkTypeChange,
    handleSubmit,
    validateForm,
  };
};
