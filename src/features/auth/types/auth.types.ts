export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
}

export interface SignupStepProps {
  onNext: () => void;
  onPrev?: () => void;
  onSubmit?: () => Promise<void>;
  formData: SignupFormData;
  setFormData: (data: Partial<SignupFormData>) => void;
}
