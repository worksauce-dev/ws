import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/shared/components/ui/useToast";
import { NameStep } from "@/features/auth/components/NameStep";
import { EmailStep } from "@/features/auth/components/EmailStep";
import { PasswordStep } from "@/features/auth/components/PasswordStep";
import { AgreementStep } from "@/features/auth/components/AgreementStep";
import { StepIndicator } from "@/features/auth/components/StepIndicator";
import { useAuth } from "@/shared/contexts/useAuth";
import type { SignupFormData } from "@/features/auth/types/auth.types";
import { Logo } from "@/shared/components/ui/Logo";

const INITIAL_FORM_DATA: SignupFormData = {
  email: "",
  name: "",
  password: "",
  confirmPassword: "",
  agreedToTerms: false,
  agreedToPrivacy: false,
};

export const SignupFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>(INITIAL_FORM_DATA);
  const { signUp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const updateFormData = (data: Partial<SignupFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const { error } = await signUp({
        email: formData.email,
        name: formData.name,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreedToTerms: formData.agreedToTerms,
        agreedToPrivacy: formData.agreedToPrivacy,
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          showToast("error", "회원가입 실패", "이미 등록된 이메일입니다");
        } else {
          showToast("error", "회원가입 실패", "회원가입에 실패했습니다");
        }
      } else {
        showToast(
          "success",
          "회원가입 완료",
          "회원가입이 완료되었습니다. 이메일을 확인해주세요."
        );
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Signup error:", error);
      showToast("error", "회원가입 실패", "회원가입 중 오류가 발생했습니다");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <NameStep
            onNext={goToNextStep}
            formData={formData}
            setFormData={updateFormData}
          />
        );
      case 2:
        return (
          <EmailStep
            onNext={goToNextStep}
            onPrev={goToPrevStep}
            formData={formData}
            setFormData={updateFormData}
          />
        );
      case 3:
        return (
          <PasswordStep
            onNext={goToNextStep}
            onPrev={goToPrevStep}
            formData={formData}
            setFormData={updateFormData}
          />
        );
      case 4:
        return (
          <AgreementStep
            onNext={goToNextStep}
            onPrev={goToPrevStep}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-8 flex flex-col items-center gap-2 text-center">
            <Logo />
          </div>

          {/* 진행률 표시기 */}
          <StepIndicator
            currentStep={currentStep}
            totalSteps={4}
            className="mb-8"
          />

          {/* 단계별 콘텐츠 */}
          {renderStep()}
        </div>

        {/* 로그인 링크 */}
        <div className="mt-6 text-center">
          <p className="text-neutral-600">
            이미 계정이 있으신가요?{" "}
            <Link
              to="/auth/login"
              className="text-primary font-medium transition-colors hover:text-primary-600"
            >
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
