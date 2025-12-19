/**
 * 범용 포맷팅 유틸리티 함수
 * 다양한 도메인에서 재사용 가능한 포맷팅 로직
 */

/**
 * 한국어 날짜 포맷 (월 일)
 * @example formatKoreanDate("2024-12-25") // "12월 25일"
 */
export const formatKoreanDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });
};

/**
 * 전체 한국어 날짜 포맷 (년 월 일)
 * @example formatKoreanDateFull("2024-12-25") // "2024년 12월 25일"
 */
export const formatKoreanDateFull = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * 상대 시간 포맷 (몇 분 전, 몇 시간 전 등)
 * @example formatRelativeTime("2024-12-25T10:00:00") // "2시간 전"
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}년 전`;
  if (months > 0) return `${months}개월 전`;
  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return "방금 전";
};

/**
 * 퍼센트 계산
 * @example calculatePercentage(30, 100) // 30
 * @example calculatePercentage(0, 0) // 0
 */
export const calculatePercentage = (
  part: number,
  whole: number,
  decimals: number = 0
): number => {
  if (whole === 0) return 0;
  const percentage = (part / whole) * 100;
  return decimals === 0
    ? Math.round(percentage)
    : Number(percentage.toFixed(decimals));
};

/**
 * 숫자를 한국어 형식으로 포맷 (천 단위 구분)
 * @example formatNumber(1234567) // "1,234,567"
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString("ko-KR");
};

/**
 * 숫자를 축약 형식으로 포맷 (K, M, B)
 * @example formatCompactNumber(1234) // "1.2K"
 * @example formatCompactNumber(1234567) // "1.2M"
 */
export const formatCompactNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * 바이트를 읽기 쉬운 형식으로 포맷
 * @example formatBytes(1024) // "1 KB"
 * @example formatBytes(1048576) // "1 MB"
 */
export const formatBytes = (
  bytes: number,
  decimals: number = 2
): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * 한국 화폐 형식으로 포맷
 * @example formatKoreanCurrency(10000) // "₩10,000"
 */
export const formatKoreanCurrency = (amount: number): string => {
  return `₩${formatNumber(amount)}`;
};

/**
 * 전화번호 포맷 (한국)
 * @example formatPhoneNumber("01012345678") // "010-1234-5678"
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
};
