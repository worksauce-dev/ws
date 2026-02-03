/**
 * 크레딧 관련 타입 정의
 * credit_transactions 테이블 스키마 기반
 */

// 크레딧 거래 메타데이터
export interface CreditTransactionMetadata {
  groupId?: string;
  groupName?: string;
  applicantId?: string;
  applicantName?: string;
  surveyId?: string;
  [key: string]: unknown;
}

// 크레딧 거래 내역 (credit_transactions 테이블)
export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number; // 양수: 충전/적립, 음수: 사용
  balanceAfter: number;
  type: "use" | "charge" | "reward" | "signup_bonus";
  reason: string | null;
  metadata: CreditTransactionMetadata | null;
  createdAt: string;
}

// UI 표시용 크레딧 내역 (변환된 형태)
export interface CreditHistory {
  id: string;
  type: "use" | "charge" | "reward";
  amount: number; // 항상 양수로 표시
  description: string;
  createdAt: string;
  balanceAfter: number;
  relatedApplicantName?: string;
  relatedGroupName?: string;
}

// 크레딧 잔액 (user_profile.credits 기반)
export interface CreditBalance {
  credits: number; // 현재 보유 크레딧
}

/**
 * 피드백 설문조사 타입 정의
 */

// 사용 상황 옵션
export type UsageContext =
  | "new_hire" // 신규 채용
  | "intern" // 인턴/수습 채용
  | "experienced" // 경력직 채용
  | "internal_transfer" // 내부 이동/배치
  | "team_building" // 팀 빌딩/조직 구성
  | "other"; // 기타

// 유용했던 기능 옵션
export type UsefulFeature =
  | "ai_analysis" // AI 직무 매칭 분석
  | "work_type_result" // 실행유형 테스트 결과
  | "interview_guide" // 면접 가이드
  | "group_management" // 그룹 관리 기능
  | "applicant_comparison" // 지원자 비교 기능
  | "other"; // 기타

// 개선이 필요한 부분 옵션
export type ImprovementArea =
  | "ai_accuracy" // AI 분석 정확도
  | "ui_ux" // 사용 편의성 (UI/UX)
  | "speed" // 로딩/처리 속도
  | "features" // 기능 부족
  | "price" // 가격/크레딧 정책
  | "other"; // 기타

// 설문 응답 데이터
export interface FeedbackSurveyData {
  // 1. AI 분석 만족도 (1-5)
  aiSatisfaction: number;

  // 2. 사용 상황 (복수 선택 가능)
  usageContexts: UsageContext[];
  usageContextOther?: string;

  // 3. 가장 유용했던 기능 (복수 선택 가능)
  usefulFeatures: UsefulFeature[];
  usefulFeatureOther?: string;

  // 4. 개선이 필요한 부분 (복수 선택 가능)
  improvementAreas: ImprovementArea[];
  improvementAreaOther?: string;

  // 5. 추가 기능 요청 (필수 주관식, 최소 20자)
  featureRequest: string;

  // 6. NPS (0-10)
  npsScore: number;

  // 7. 기타 의견 (선택적 주관식)
  additionalFeedback?: string;
}

// 설문 상태
export interface SurveyStatus {
  hasCompleted: boolean;
  completedAt?: string;
  rewardCredited?: boolean;
}
