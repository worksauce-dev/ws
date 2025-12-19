/**
 * 범용 유효성 검사 유틸리티 함수
 * 다양한 도메인에서 재사용 가능한 검증 로직
 */

/**
 * 이메일 유효성 검사
 * @example isValidEmail("test@example.com") // true
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 한국 전화번호 유효성 검사
 * @example isValidPhoneNumber("010-1234-5678") // true
 * @example isValidPhoneNumber("01012345678") // true
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, "");
  return /^01[0-9]{8,9}$/.test(cleaned);
};

/**
 * URL 유효성 검사
 * @example isValidUrl("https://example.com") // true
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 빈 문자열 또는 null/undefined 검사
 * @example isEmpty("") // true
 * @example isEmpty(null) // true
 * @example isEmpty("  ") // true
 */
export const isEmpty = (value: string | null | undefined): boolean => {
  return !value || value.trim().length === 0;
};

/**
 * 범위 내 숫자 검사
 * @example isInRange(5, 0, 10) // true
 * @example isInRange(15, 0, 10) // false
 */
export const isInRange = (
  value: number,
  min: number,
  max: number
): boolean => {
  return value >= min && value <= max;
};

/**
 * 최소 길이 검사
 * @example hasMinLength("hello", 3) // true
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

/**
 * 최대 길이 검사
 * @example hasMaxLength("hello", 10) // true
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

/**
 * 날짜가 유효한지 검사
 * @example isValidDate("2024-12-25") // true
 * @example isValidDate("invalid") // false
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * 미래 날짜인지 검사
 * @example isFutureDate("2099-12-25") // true
 */
export const isFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date > now;
};

/**
 * 과거 날짜인지 검사
 * @example isPastDate("2020-01-01") // true
 */
export const isPastDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
};

/**
 * 오늘 날짜인지 검사
 * @example isToday("2024-12-25") // depends on current date
 */
export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

/**
 * 숫자인지 검사 (문자열 포함)
 * @example isNumeric("123") // true
 * @example isNumeric("abc") // false
 */
export const isNumeric = (value: string | number): boolean => {
  return !isNaN(Number(value)) && !isNaN(parseFloat(String(value)));
};

/**
 * 양수인지 검사
 * @example isPositive(5) // true
 * @example isPositive(-5) // false
 */
export const isPositive = (value: number): boolean => {
  return value > 0;
};

/**
 * 배열이 비어있는지 검사
 * @example isEmptyArray([]) // true
 * @example isEmptyArray([1, 2]) // false
 */
export const isEmptyArray = <T>(arr: T[]): boolean => {
  return !arr || arr.length === 0;
};

/**
 * 객체가 비어있는지 검사
 * @example isEmptyObject({}) // true
 * @example isEmptyObject({a: 1}) // false
 */
export const isEmptyObject = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};
