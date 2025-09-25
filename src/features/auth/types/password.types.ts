// types/password.types.ts
export interface PasswordStrength {
  score: number; // 0-5 점수
  strength: "weak" | "medium" | "strong";
  checks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export interface PasswordStrengthIndicatorProps {
  password: string;
  strength: PasswordStrength;
  className?: string;
  showRequirements?: boolean;
}
