import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import { MdCheck } from "react-icons/md";
import toast from "react-hot-toast";
import { NameStep } from "@/features/auth/components/auth/steps/NameStep";
import { EmailStep } from "@/features/auth/components/auth/steps/EmailStep";
import { PasswordStep } from "@/features/auth/components/auth/steps/PasswordStep";
import { AgreementStep } from "@/features/auth/components/auth/steps/AgreementStep";
import { useAuth } from "@/shared/contexts/useAuth";
import type { SignupFormData } from "../../types/auth.types";
import { Logo } from "@/shared/components/ui/Logo";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const StepIndicator = ({
  currentStep,
  totalSteps,
  className,
}: StepIndicatorProps) => {
  return (
    <div
      className={clsx("relative flex items-center justify-center", className)}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`진행 단계: ${currentStep}/${totalSteps}`}
    >
      {/* 배경 연결선 */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-0.5 bg-neutral-200" />
      </div>

      {/* 진행된 연결선 */}
      <div className="absolute inset-0 flex items-center">
        <div
          className={clsx("h-0.5 bg-primary-500 transition-all duration-300")}
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
        />
      </div>

      {/* 단계들 */}
      <div className="relative z-10 flex justify-between w-full">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;
          const isUpcoming = step > currentStep;

          return (
            <div
              key={step}
              className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors bg-white border-2 text-neutral-500",
                {
                  "border-primary-500 bg-primary-500 ": isActive || isCompleted,
                  "border-neutral-200 bg-white ": isUpcoming,
                }
              )}
              aria-current={isActive ? "step" : undefined}
            >
              {isCompleted ? (
                <MdCheck className="w-5 h-5" aria-hidden="true" />
              ) : (
                step
              )}
            </div>
          );
        })}
      </div>

      {/* 스크린 리더용 현재 상태 안내 */}
      <div className="sr-only">
        현재 {currentStep}단계 진행 중, 총 {totalSteps}단계
      </div>
    </div>
  );
};

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
  const navigate = useNavigate();

  const updateFormData = (data: Partial<SignupFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 4) {
      // 회원가입 처리
      await handleSignUp();
    }
  };

  const handleSignUp = async () => {
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
          toast.error("이미 등록된 이메일입니다");
        } else {
          toast.error("회원가입에 실패했습니다");
        }
      } else {
        toast.success("회원가입이 완료되었습니다. 이메일을 확인해주세요.");
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("회원가입 중 오류가 발생했습니다");
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <NameStep
            onNext={handleNext}
            formData={formData}
            setFormData={updateFormData}
          />
        );
      case 2:
        return (
          <EmailStep
            onNext={handleNext}
            onPrev={handlePrev}
            formData={formData}
            setFormData={updateFormData}
          />
        );
      case 3:
        return (
          <PasswordStep
            onNext={handleNext}
            onPrev={handlePrev}
            formData={formData}
            setFormData={updateFormData}
          />
        );
      case 4:
        return (
          <AgreementStep
            onNext={handleNext}
            onPrev={handlePrev}
            formData={formData}
            setFormData={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
          <div className="text-center flex flex-col items-center gap-2 mb-8">
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
        <div className="text-center mt-6">
          <p className="text-neutral-600">
            이미 계정이 있으신가요?{" "}
            <Link
              to="/auth/login"
              className="text-primary font-medium hover:text-primary-600 transition-colors"
            >
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
