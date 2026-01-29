import { useState, useMemo } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { PasswordStrengthIndicator } from "@/features/auth/components/PasswordStrengthIndicator";
import { calculatePasswordStrength } from "@/features/auth/utils/passwordStrength";
import type { SignupStepProps } from "@/features/auth/types/auth.types";
import {
  MIN_PASSWORD_LENGTH,
  MIN_PASSWORD_STRENGTH_SCORE,
} from "@/features/auth/constants/auth.constants";

export const PasswordStep = ({
  onNext,
  onPrev,
  formData,
  setFormData,
}: SignupStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = useMemo(() => {
    return calculatePasswordStrength(formData.password);
  }, [formData.password]);

  const validatePasswords = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (formData.password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다`;
    } else if (!passwordStrength.checks.uppercase) {
      newErrors.password = "대문자를 포함해주세요";
    } else if (!passwordStrength.checks.lowercase) {
      newErrors.password = "소문자를 포함해주세요";
    } else if (!passwordStrength.checks.number) {
      newErrors.password = "숫자를 포함해주세요";
    } else if (passwordStrength.score < MIN_PASSWORD_STRENGTH_SCORE) {
      newErrors.password = "더 강한 비밀번호를 사용해주세요";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호를 다시 입력해주세요";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validatePasswords()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold text-neutral-900">
          비밀번호 설정
        </h2>
        <p className="text-sm text-neutral-600">
          안전한 비밀번호로 계정을 보호하세요
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호 (8자 이상, 대소문자, 숫자 포함)"
              value={formData.password}
              onChange={e => setFormData({ password: e.target.value })}
              error={errors.password}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <MdVisibilityOff className="h-5 w-5" />
              ) : (
                <MdVisibility className="h-5 w-5" />
              )}
            </button>
          </div>

          <PasswordStrengthIndicator
            password={formData.password}
            strength={passwordStrength}
            className="mt-3"
          />
        </div>

        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="비밀번호를 다시 입력하세요"
            value={formData.confirmPassword}
            onChange={e => setFormData({ confirmPassword: e.target.value })}
            error={errors.confirmPassword}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <MdVisibilityOff className="h-5 w-5" />
            ) : (
              <MdVisibility className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button onClick={onPrev} variant="secondary" className="flex-1">
          이전
        </Button>
        <Button onClick={handleNext} variant="primary" className="flex-1">
          다음
        </Button>
      </div>
    </div>
  );
};
