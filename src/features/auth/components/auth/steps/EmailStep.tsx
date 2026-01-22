import { useState, useEffect, useCallback } from "react";
import { MdCheckCircle } from "react-icons/md";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { supabase } from "@/shared/lib/supabase";
import type { SignupStepProps } from "@/features/auth/types/auth.types";

export const EmailStep = ({
  onNext,
  onPrev,
  formData,
  setFormData,
}: SignupStepProps) => {
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0); // 남은 시간 (초)
  const [canResend, setCanResend] = useState(true);
  const [isSending, setIsSending] = useState(false); // 이메일 발송 중
  const [isVerifying, setIsVerifying] = useState(false); // 코드 검증 중

  // 시간 포맷팅 함수 (MM:SS)
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // 타이머 효과
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timeLeft]);

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
    if (isSending) return; // 중복 요청 방지

    setIsSending(true);

    try {
      // Supabase Edge Function을 통한 인증 코드 발송
      const { data, error } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email: formData.email,
          type: 'signup_verification'
        }
      });

      if (error) {
        console.error('Error sending verification email:', error);
        console.error('Error details:', error.message, error.status, error.statusText);

        // Try to get more detailed error from response
        if (data && typeof data === 'object' && 'error' in data) {
          console.error('Function response error:', data.error);
          setErrors({ email: `발송 실패: ${data.error}` });
        } else {
          setErrors({ email: "인증 이메일 발송에 실패했습니다. 다시 시도해주세요." });
        }
        return;
      }

      setIsVerificationSent(true);
      setTimeLeft(600); // 10분 = 600초
      setCanResend(false);
      setVerificationCode(""); // 재발송 시 코드 입력 초기화
      setErrors({}); // 에러 초기화
    } catch (error) {
      console.error('Network error:', error);
      setErrors({ email: "네트워크 오류가 발생했습니다. 다시 시도해주세요." });
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setErrors({ code: "인증 코드를 입력해주세요" });
      return;
    }

    if (verificationCode.length !== 6) {
      setErrors({ code: "6자리 인증 코드를 입력해주세요" });
      return;
    }

    if (isVerifying) return; // 중복 요청 방지
    setIsVerifying(true);

    try {
      // Supabase Edge Function을 통한 인증 코드 확인
      const { data, error } = await supabase.functions.invoke('verify-email-code', {
        body: {
          email: formData.email,
          code: verificationCode
        }
      });

      if (error || !data?.verified) {
        // 기술적 에러 메시지 대신 사용자 친화적 메시지 사용
        const userFriendlyMessage = "인증 코드가 올바르지 않거나 만료되었습니다. 다시 확인해주세요.";
        setErrors({
          code: userFriendlyMessage
        });
        return;
      }

      // 인증 성공
      setErrors({});
      onNext();
    } catch (error) {
      console.error('Verification error:', error);
      setErrors({ code: "인증 코드 확인 중 오류가 발생했습니다. 다시 시도해주세요." });
    } finally {
      setIsVerifying(false);
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
                // 숫자만 입력 허용
                const value = e.target.value.replace(/\D/g, '');
                setVerificationCode(value);
                // 에러 초기화
                if (errors.code) {
                  setErrors(prev => ({ ...prev, code: "" }));
                }
              }}
              error={errors.code}
              maxLength={6}
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
