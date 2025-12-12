/**
 * Email validation utility
 * Validates email format using a standard regex pattern
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== "string") {
    return false;
  }

  // RFC 5322 compliant email regex (simplified version)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email.trim());
};

/**
 * Validates Korean phone number format
 * Supports formats: 010-1234-5678, 01012345678
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  if (!phone || typeof phone !== "string") {
    return false;
  }

  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
  return phoneRegex.test(phone.trim());
};
