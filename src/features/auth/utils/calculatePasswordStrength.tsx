import type { PasswordStrength } from "@/features/auth/types/password.types";

export function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  score += checks.length ? 1 : 0;
  score += checks.lowercase ? 1 : 0;
  score += checks.uppercase ? 1 : 0;
  score += checks.number ? 1 : 0;
  score += checks.special ? 1 : 0;

  const strength: "weak" | "medium" | "strong" =
    score <= 2 ? "weak" : score <= 3 ? "medium" : "strong";

  return { score, strength, checks };
}
