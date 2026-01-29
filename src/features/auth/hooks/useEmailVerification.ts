import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/shared/lib/supabase";
import {
  VERIFICATION_CODE_LENGTH,
  VERIFICATION_TIMEOUT_SECONDS,
} from "@/features/auth/constants/auth.constants";

interface UseEmailVerificationReturn {
  // 상태
  isVerificationSent: boolean;
  timeLeft: number;
  canResend: boolean;
  isSending: boolean;
  isVerifying: boolean;

  // 액션
  sendVerification: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyCode: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  resetVerification: () => void;

  // 유틸
  formatTime: (seconds: number) => string;
}

export function useEmailVerification(): UseEmailVerificationReturn {
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

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

  // 시간 포맷팅 함수 (MM:SS)
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // 인증 코드 발송
  const sendVerification = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (isSending) {
      return { success: false, error: "이미 발송 중입니다" };
    }

    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email,
          type: 'signup_verification'
        }
      });

      if (error) {
        console.error('Error sending verification email:', error);

        if (data && typeof data === 'object' && 'error' in data) {
          return { success: false, error: `발송 실패: ${data.error}` };
        }
        return { success: false, error: "인증 이메일 발송에 실패했습니다. 다시 시도해주세요." };
      }

      setIsVerificationSent(true);
      setTimeLeft(VERIFICATION_TIMEOUT_SECONDS);
      setCanResend(false);

      return { success: true };
    } catch (error) {
      console.error('Network error:', error);
      return { success: false, error: "네트워크 오류가 발생했습니다. 다시 시도해주세요." };
    } finally {
      setIsSending(false);
    }
  }, [isSending]);

  // 인증 코드 검증
  const verifyCode = useCallback(async (email: string, code: string): Promise<{ success: boolean; error?: string }> => {
    if (!code) {
      return { success: false, error: "인증 코드를 입력해주세요" };
    }

    if (code.length !== VERIFICATION_CODE_LENGTH) {
      return { success: false, error: `${VERIFICATION_CODE_LENGTH}자리 인증 코드를 입력해주세요` };
    }

    if (isVerifying) {
      return { success: false, error: "이미 검증 중입니다" };
    }

    setIsVerifying(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-email-code', {
        body: {
          email,
          code
        }
      });

      if (error || !data?.verified) {
        return { success: false, error: "인증 코드가 올바르지 않거나 만료되었습니다. 다시 확인해주세요." };
      }

      return { success: true };
    } catch (error) {
      console.error('Verification error:', error);
      return { success: false, error: "인증 코드 확인 중 오류가 발생했습니다. 다시 시도해주세요." };
    } finally {
      setIsVerifying(false);
    }
  }, [isVerifying]);

  // 인증 상태 초기화
  const resetVerification = useCallback(() => {
    setIsVerificationSent(false);
    setTimeLeft(0);
    setCanResend(true);
    setIsSending(false);
    setIsVerifying(false);
  }, []);

  return {
    isVerificationSent,
    timeLeft,
    canResend,
    isSending,
    isVerifying,
    sendVerification,
    verifyCode,
    resetVerification,
    formatTime,
  };
}
