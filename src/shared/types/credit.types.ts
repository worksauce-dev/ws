/**
 * 크레딧 트랜잭션 타입 정의
 */

/**
 * 크레딧 트랜잭션 유형
 */
export type CreditTransactionType =
  | "initial" // 최초 가입 시 초기 크레딧
  | "purchase" // 크레딧 구매
  | "ai_analysis" // AI 직무 분석 사용
  | "refund" // 환불
  | "admin_grant"; // 관리자 지급

/**
 * 크레딧 트랜잭션 메타데이터
 * AI 분석 등의 추가 정보를 저장
 */
export interface CreditTransactionMetadata {
  // AI 분석 관련
  analysisId?: string;
  applicantId?: string;
  applicantName?: string;
  groupId?: string;

  // 구매 관련
  paymentId?: string;
  packageType?: string;

  // 환불 관련
  refundReason?: string;
  originalTransactionId?: string;

  // 관리자 지급 관련
  adminNote?: string;
  adminId?: string;

  // 기타
  [key: string]: unknown;
}

/**
 * 크레딧 트랜잭션 레코드
 * database의 credit_transactions 테이블과 매핑
 */
export interface CreditTransaction {
  id: string;
  user_id: string;

  // 트랜잭션 금액 및 잔액
  amount: number; // 양수: 충전/획득, 음수: 차감/소비
  balance_after: number; // 트랜잭션 후 잔액

  // 트랜잭션 분류
  type: CreditTransactionType;
  reason: string; // 사람이 읽을 수 있는 설명

  // 추가 메타데이터
  metadata: CreditTransactionMetadata | null;

  // 타임스탬프
  created_at: string; // ISO 8601 string
}

/**
 * 크레딧 트랜잭션 생성 요청 타입 (API 호출 시)
 */
export interface CreateCreditTransactionRequest {
  user_id: string;
  amount: number;
  type: CreditTransactionType;
  reason: string;
  metadata?: CreditTransactionMetadata;
}

/**
 * 크레딧 차감 요청 타입 (AI 분석 등)
 */
export interface DeductCreditsRequest {
  user_id: string;
  amount: number; // 양수로 입력 (내부에서 음수 변환)
  type: CreditTransactionType;
  reason: string;
  metadata?: CreditTransactionMetadata;
}

/**
 * 크레딧 환불 요청 타입
 */
export interface RefundCreditsRequest {
  user_id: string;
  amount: number; // 양수로 입력
  reason: string;
  metadata?: CreditTransactionMetadata;
}

/**
 * 크레딧 잔액 조회 응답 타입
 */
export interface GetCreditsResponse {
  user_id: string;
  balance: number;
  last_updated: string; // ISO 8601 string
}
