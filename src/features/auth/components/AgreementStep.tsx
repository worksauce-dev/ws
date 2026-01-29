import { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Checkbox } from "@/shared/components/ui/Checkbox";
import type { SignupStepProps } from "@/features/auth/types/auth.types";

export const AgreementStep = ({
  onPrev,
  onSubmit,
  formData,
  setFormData,
}: SignupStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAgreements = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.agreedToTerms) {
      newErrors.terms = "이용약관에 동의해주세요";
    }
    if (!formData.agreedToPrivacy) {
      newErrors.privacy = "개인정보 처리방침에 동의해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateAgreements()) return;
    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
          약관 동의
        </h2>
        <p className="text-neutral-600 text-sm">
          서비스 이용을 위해 약관에 동의해주세요
        </p>
      </div>

      {/* 이메일 확인 */}
      <div className="bg-neutral-50 rounded-lg p-4 border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-neutral-900">가입 이메일</p>
            <p className="text-neutral-600 text-sm">{formData.email}</p>
          </div>
        </div>
      </div>

      {/* 약관 동의 */}
      <div className="space-y-4">
        <div className="space-y-3">
          <div className={`${errors.terms ? "text-red-600" : ""}`}>
            <Checkbox
              id="terms"
              checked={formData.agreedToTerms}
              onChange={checked => setFormData({ agreedToTerms: checked })}
              label={
                <span className="text-sm">
                  <span className="text-red-500">*</span> 이용약관에 동의합니다{" "}
                  <button className="text-primary hover:underline font-medium">
                    내용보기
                  </button>
                </span>
              }
            />
          </div>

          <div className={`${errors.privacy ? "text-red-600" : ""}`}>
            <Checkbox
              id="privacy"
              checked={formData.agreedToPrivacy}
              onChange={checked => setFormData({ agreedToPrivacy: checked })}
              label={
                <span className="text-sm">
                  <span className="text-red-500">*</span> 개인정보 처리방침에
                  동의합니다{" "}
                  <button className="text-primary hover:underline font-medium">
                    내용보기
                  </button>
                </span>
              }
            />
          </div>
        </div>

        {(errors.terms || errors.privacy) && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            필수 약관에 동의해주세요
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <Button
          onClick={onPrev}
          variant="secondary"
          className="flex-1"
          disabled={isSubmitting}
        >
          이전
        </Button>
        <Button
          onClick={handleSubmit}
          variant="primary"
          className="flex-1"
          isLoading={isSubmitting}
        >
          {isSubmitting ? "계정 생성 중..." : "계정 만들기"}
        </Button>
      </div>
    </div>
  );
};
