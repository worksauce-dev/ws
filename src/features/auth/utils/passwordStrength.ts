import type { PasswordStrength } from "@/features/auth/types/password.types";

/**
 * 비밀번호 강도를 계산하는 유틸리티 함수
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      strength: "weak",
      checks: {
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
      },
    };
  }

  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  // 기본 점수 계산
  let score = 0;

  // 각 조건마다 1점씩 추가
  Object.values(checks).forEach(check => {
    if (check) score += 1;
  });

  // 길이에 따른 추가 보너스 점수
  if (password.length >= 12) score += 0.5;
  if (password.length >= 16) score += 0.5;

  // 점수를 5점 만점으로 제한
  score = Math.min(score, 5);

  // 강도 등급 결정
  let strength: "weak" | "medium" | "strong";
  if (score < 3) {
    strength = "weak";
  } else if (score < 4) {
    strength = "medium";
  } else {
    strength = "strong";
  }

  return {
    score,
    strength,
    checks,
  };
}

/**
 * 비밀번호가 최소 요구사항을 만족하는지 확인
 */
export function isPasswordValid(strength: PasswordStrength): boolean {
  return (
    strength.checks.length &&
    strength.checks.lowercase &&
    strength.checks.uppercase &&
    strength.checks.number &&
    strength.score >= 3
  );
}

/**
 * 비밀번호 강도 향상을 위한 제안 생성
 */
export function getPasswordSuggestions(strength: PasswordStrength): string[] {
  const suggestions: string[] = [];

  if (!strength.checks.length) {
    suggestions.push("최소 8자 이상으로 입력해주세요");
  }

  if (!strength.checks.lowercase) {
    suggestions.push("영문 소문자를 포함해주세요");
  }

  if (!strength.checks.uppercase) {
    suggestions.push("영문 대문자를 포함해주세요");
  }

  if (!strength.checks.number) {
    suggestions.push("숫자를 포함해주세요");
  }

  if (!strength.checks.special) {
    suggestions.push("특수문자(!@#$%^&* 등)를 포함해주세요");
  }

  return suggestions;
}
