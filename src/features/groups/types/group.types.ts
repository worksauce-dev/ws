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
