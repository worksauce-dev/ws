import { useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import type { SignupStepProps } from "@/features/auth/types/auth.types";
import { useEmailVerification } from "@/features/auth/hooks/useEmailVerification";
import { VERIFICATION_CODE_LENGTH } from "@/features/auth/constants/auth.constants";

export const EmailStep = ({
  onNext,
  onPrev,
  formData,
  setFormData,
}: SignupStepProps) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    isVerificationSent,
    timeLeft,
    canResend,
    isSending,
    isVerifying,
    sendVerification,
    verifyCode,
    formatTime,
  } = useEmailVerification();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors({ email: "이메일을 입력해주세요" });
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrors({ email: "올바른 이메일 형식을 입력해주세요" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSendVerification = async () => {
    if (!validateEmail(formData.email)) return;

    const result = await sendVerification(formData.email);
    if (!result.success && result.error) {
      setErrors({ email: result.error });
    } else {
      setVerificationCode("");
      setErrors({});
    }
  };

  const handleVerifyCode = async () => {
    const result = await verifyCode(formData.email, verificationCode);
    if (!result.success && result.error) {
      setErrors({ code: result.error });
    } else {
      setErrors({});
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
          이메일 인증
        </h2>
        <p className="text-neutral-600 text-sm">
          워크소스 계정으로 사용할 이메일을 입력해주세요
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="이메일을 입력하세요"
            value={formData.email}
            onChange={e => setFormData({ email: e.target.value })}
            error={errors.email}
            disabled={isVerificationSent}
            className={isVerificationSent ? "bg-neutral-100" : ""}
          />
          {isVerificationSent && (
            <div className="mt-2">
              <p className="text-sm text-green-600 flex items-center">
                <MdCheckCircle className="w-4 h-4 mr-2" />
                인증 코드가 발송되었습니다
              </p>
              {timeLeft > 0 && (
                <div className="flex items-center justify-between mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center text-sm text-blue-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
                    <span>인증 유효시간</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg font-mono font-semibold text-blue-700">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
              )}
              {timeLeft === 0 && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    인증 시간이 만료되었습니다. 새로운 인증 코드를 요청해주세요.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {isVerificationSent && (
          <div>
            <Input
              type="text"
              placeholder="인증 코드 6자리를 입력하세요"
              value={verificationCode}
              onChange={e => {
                const value = e.target.value.replace(/\D/g, '');
                setVerificationCode(value);
                if (errors.code) {
                  setErrors(prev => ({ ...prev, code: "" }));
                }
              }}
              error={errors.code}
              maxLength={VERIFICATION_CODE_LENGTH}
              disabled={timeLeft === 0}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-neutral-500">
                코드를 받지 못하셨나요?
              </span>
              <button
                className={`text-sm font-medium transition-colors ${
                  canResend && !isSending
                    ? "text-primary hover:text-primary-600"
                    : "text-neutral-400 cursor-not-allowed"
                }`}
                onClick={canResend && !isSending ? handleSendVerification : undefined}
                disabled={!canResend || isSending}
              >
                {isSending
                  ? "발송 중..."
                  : canResend
                  ? "재발송"
                  : `재발송 (${formatTime(timeLeft)})`}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {onPrev && (
          <Button
            onClick={onPrev}
            variant="outline"
            className="flex-1"
            disabled={isSending || isVerifying}
          >
            이전
          </Button>
        )}
        <Button
          onClick={isVerificationSent ? handleVerifyCode : handleSendVerification}
          className="flex-1"
          variant="primary"
          disabled={
            (isVerificationSent && timeLeft === 0) ||
            isSending ||
            isVerifying ||
            (isVerificationSent && !verificationCode)
          }
          isLoading={isSending || isVerifying}
        >
          {isSending
            ? "인증 코드 발송 중..."
            : isVerifying
            ? "인증 중..."
            : isVerificationSent
            ? "인증 완료"
            : "인증 코드 발송"}
        </Button>
      </div>
    </div>
  );
};
