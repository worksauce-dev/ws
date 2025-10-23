import { z } from "zod";

// Applicant 타입 정의 (Zod 스키마로부터 추론)
export const ApplicantSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "이름을 입력해주세요."),
  email: z.string().email("올바른 이메일 주소를 입력해주세요."),
});

export type Applicant = z.infer<typeof ApplicantSchema>;

// 새 지원자 입력 스키마 (id 제외)
export const NewApplicantInputSchema = z.object({
  name: z.string().trim().min(1, "지원자 이름을 입력해주세요."),
  email: z
    .string()
    .trim()
    .min(1, "지원자 이메일을 입력해주세요.")
    .email("올바른 이메일 주소를 입력해주세요."),
});

export type NewApplicantInput = z.infer<typeof NewApplicantInputSchema>;

/**
 * 이메일 유효성 검사
 * @deprecated Zod 스키마를 사용하세요
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 지원자 데이터 유효성 검사 (Zod 사용)
 */
export const validateApplicant = (
  name: string,
  email: string
): { isValid: boolean; error?: string } => {
  try {
    NewApplicantInputSchema.parse({ name, email });
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // 첫 번째 에러 메시지 반환
      const firstError = error.errors[0];
      return { isValid: false, error: firstError.message };
    }
    return { isValid: false, error: "유효하지 않은 입력입니다." };
  }
};

/**
 * 지원자 데이터 유효성 검사 (SafeParse 버전 - 추천)
 * @example
 * const result = validateApplicantSafe(name, email);
 * if (!result.success) {
 *   console.error(result.error);
 * }
 */
export const validateApplicantSafe = (name: string, email: string) => {
  return NewApplicantInputSchema.safeParse({ name, email });
};

/**
 * 중복 이메일 확인
 */
export const isDuplicateEmail = (
  email: string,
  existingApplicants: Applicant[]
): boolean => {
  return existingApplicants.some(
    applicant => applicant.email.toLowerCase() === email.toLowerCase()
  );
};

/**
 * 지원자 ID 생성
 * crypto.randomUUID()를 사용하여 충돌 없는 고유 ID 생성
 */
export const generateApplicantId = (): string => {
  return crypto.randomUUID();
};

/**
 * 지원자 생성 (validation 포함)
 * @returns 성공 시 생성된 지원자 객체, 실패 시 null
 */
export const createApplicant = (
  name: string,
  email: string,
  existingApplicants: Applicant[] = []
): { success: true; applicant: Applicant } | { success: false; error: string } => {
  // 입력 검증
  const validation = validateApplicant(name, email);
  if (!validation.isValid) {
    return { success: false, error: validation.error! };
  }

  // 중복 검증
  if (isDuplicateEmail(email, existingApplicants)) {
    return { success: false, error: "이미 추가된 이메일입니다." };
  }

  // 지원자 생성
  const applicant: Applicant = {
    id: generateApplicantId(),
    name: name.trim(),
    email: email.trim(),
  };

  return { success: true, applicant };
};

/**
 * 여러 지원자 데이터 일괄 검증
 */
export const validateApplicants = (
  applicants: Array<{ name: string; email: string }>
): {
  valid: Applicant[];
  invalid: Array<{ index: number; error: string; data: { name: string; email: string } }>;
} => {
  const valid: Applicant[] = [];
  const invalid: Array<{
    index: number;
    error: string;
    data: { name: string; email: string };
  }> = [];

  applicants.forEach((applicant, index) => {
    const result = validateApplicantSafe(applicant.name, applicant.email);

    if (result.success) {
      valid.push({
        id: generateApplicantId(),
        name: result.data.name,
        email: result.data.email,
      });
    } else {
      invalid.push({
        index,
        error: result.error.errors[0].message,
        data: applicant,
      });
    }
  });

  return { valid, invalid };
};
