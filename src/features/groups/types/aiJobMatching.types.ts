/**
 * AI 기반 직무 매칭 시스템 타입 정의
 *
 * 설계 철학:
 * - AI는 판단하지 않고 해석만 수행
 * - 고정된 실행 축 기반 (신뢰성 확보)
 * - 선택형 고부가 기능 (크레딧 소모)
 *
 * @see /직무 실행 유형 검사 – AI Agent 활용 설계 보고서.md
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. 실행 축 (Execution Axis) - 고정된 5개 축
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 실행 축 코드
 *
 * 5개의 고정된 축으로 직무와 지원자의 실행 특성을 측정
 */
export type ExecutionAxisCode =
  | "decision_speed"        // 의사결정 속도
  | "uncertainty_tolerance" // 불확실성 내성
  | "autonomy"              // 자율성
  | "relationship_focus"    // 관계 중심성
  | "precision_requirement"; // 정확성 요구도

/**
 * 실행 축 점수 (0-100)
 *
 * Brand 타입으로 타입 안정성 확보
 * - 0-30: 낮음
 * - 31-70: 중간
 * - 71-100: 높음
 */
export type ExecutionAxisScore = number & { readonly __brand: "ExecutionAxisScore" };

/**
 * 실행 축 점수 생성 함수
 *
 * 유효성 검증을 통해 0-100 범위를 강제
 */
export function toExecutionAxisScore(value: number): ExecutionAxisScore {
  if (value < 0 || value > 100) {
    throw new Error(`Invalid ExecutionAxisScore: ${value}. Must be between 0 and 100.`);
  }
  return value as ExecutionAxisScore;
}

/**
 * 실행 축 단일 항목
 */
export interface ExecutionAxis {
  code: ExecutionAxisCode;
  name: string;
  description: string;
  score: ExecutionAxisScore;
}

/**
 * 실행 축 프로필 (5개 축의 집합)
 */
export interface ExecutionProfile {
  decision_speed: ExecutionAxisScore;
  uncertainty_tolerance: ExecutionAxisScore;
  autonomy: ExecutionAxisScore;
  relationship_focus: ExecutionAxisScore;
  precision_requirement: ExecutionAxisScore;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. 크레딧 소모 (공통 타입)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 크레딧 소모 정보 (공통)
 *
 * AI 분석 결과에 포함되는 크레딧 관련 정보
 */
export interface CreditConsumption {
  creditsUsed: number; // 이번 분석에 소모된 크레딧
  generatedAt: string; // 생성 시각 (ISO 8601)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. 직무 실행 프로필 (Job Execution Profile)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 직무 입력 데이터 (유저가 제공)
 */
export interface JobInput {
  jobTitle: string;
  jobDescription: string; // 최소 8-10자
  mainResponsibilities?: string; // 주요 역할 (선택)
  performanceCriteria?: string; // 성과 기준 (선택)
  collaborationStyle?: string; // 협업 방식 (선택)
}

/**
 * 직무 실행 프로필 (AI가 생성)
 *
 * AI가 직무 설명을 5개 실행 축으로 분해한 결과
 */
export interface JobExecutionProfile extends CreditConsumption {
  id: string; // 직무 프로필 ID (DB 저장 시 생성)
  jobInput: JobInput; // 원본 입력
  executionProfile: ExecutionProfile; // 5개 축 점수
  axisBreakdown: {
    // 각 축별 상세 설명
    [key in ExecutionAxisCode]: {
      score: ExecutionAxisScore;
      reasoning: string; // AI가 이 점수를 부여한 근거
      examples: string[]; // 직무 설명에서 추출한 예시
    };
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. 지원자 실행 프로필 (Applicant Execution Profile)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 지원자 실행 프로필 (시스템이 생성)
 *
 * 소스테스트 결과를 5개 실행 축으로 변환
 * AI 호출 없이 고정된 로직으로 변환 (비용 절감)
 */
export interface ApplicantExecutionProfile {
  applicantId: string;
  executionProfile: ExecutionProfile; // 5개 축 점수
  sourceData: {
    // 변환 근거가 되는 소스테스트 결과
    primaryWorkType: string;
    workTypeScores: Record<string, number>;
  };
  transformedAt: string; // ISO 8601
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. AI 비교 분석 결과 (AI Comparison Analysis)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 축별 차이 분석
 */
export interface AxisDifference {
  axis: ExecutionAxisCode;
  axisName: string;
  jobScore: ExecutionAxisScore;
  applicantScore: ExecutionAxisScore;
  gap: number; // jobScore - applicantScore (-100 ~ +100)
  gapLevel: "critical" | "significant" | "moderate" | "minimal"; // 차이 수준
  interpretation: string; // AI가 생성한 차이 해석 (판단 아님!)
}

/**
 * 협업/관리 포인트 카테고리
 *
 * 향후 확장 가능성을 고려한 타입 정의
 */
export type ManagementCategory =
  | "onboarding"          // 온보딩
  | "daily_work"          // 일상 업무
  | "growth"              // 성장/발전
  | "communication"       // 커뮤니케이션
  | "performance_review"  // 성과 평가 (향후)
  | "role_design";        // 역할 설계 (향후)

/**
 * 협업/관리 포인트
 */
export interface ManagementPoint {
  category: ManagementCategory;
  categoryLabel: string;
  point: string; // 구체적인 관리 포인트
  priority: "high" | "medium" | "low";
}

/**
 * AI 분석 신뢰도 수준
 */
export type AIConfidenceLevel = "high" | "medium" | "low";

/**
 * AI 분석 신뢰도 정보
 */
export interface AIConfidence {
  level: AIConfidenceLevel;
  note?: string; // 신뢰도가 낮을 때 이유 설명
}

/**
 * AI 비교 분석 결과
 *
 * ⚠️ 중요: 이 결과는 "적합/부적합" 판단이 아니라
 * "실행 방식 차이"와 "관리 포인트"를 제공합니다.
 */
export interface AIComparisonAnalysis extends CreditConsumption {
  // 메타데이터
  analysisId: string;

  // 분석 대상
  jobExecutionProfile: JobExecutionProfile;
  applicantExecutionProfile: ApplicantExecutionProfile;

  // 축별 차이 분석
  axisDifferences: AxisDifference[];

  // 전체 요약 (AI 생성)
  overallSummary: {
    matchingAreas: string[]; // 비슷한 실행 방식 영역
    differingAreas: string[]; // 다른 실행 방식 영역
    interpretationSummary: string; // 전체 해석 (200자 이내)
  };

  // 협업/관리 포인트
  managementPoints: ManagementPoint[];

  // AI 분석 신뢰도
  confidence: AIConfidence;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. UI 상태 관리
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * AI 분석 상태
 */
export type AIAnalysisStatus =
  | "not_started"    // 분석 전
  | "validating"     // 직무 입력 검증 중
  | "generating_job" // 직무 프로필 생성 중
  | "analyzing"      // 비교 분석 중
  | "completed"      // 완료
  | "error";         // 에러

/**
 * AI 분석 에러 타입
 */
export interface AIAnalysisError {
  code: "invalid_input" | "insufficient_description" | "axis_coverage_failed" | "api_error" | "credit_insufficient";
  message: string;
  suggestions?: string[]; // 사용자에게 제안할 개선 방법
}

/**
 * AI 분석 UI 상태
 */
export interface AIAnalysisUIState {
  status: AIAnalysisStatus;
  error: AIAnalysisError | null;

  // 크레딧 정보
  userCredits: number;
  requiredCredits: number;

  // 결과 (완료 시)
  result: AIComparisonAnalysis | null;

  // 캐시된 결과 여부 (재조회 시 크레딧 미소모)
  isCached: boolean;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7. API 요청/응답 타입
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 직무 프로필 생성 요청
 */
export interface GenerateJobProfileRequest {
  userId: string;
  jobInput: JobInput;
}

/**
 * 직무 프로필 생성 응답
 */
export interface GenerateJobProfileResponse {
  success: boolean;
  jobExecutionProfile?: JobExecutionProfile;
  error?: AIAnalysisError;
}

/**
 * AI 비교 분석 요청
 */
export interface GenerateAIAnalysisRequest {
  userId: string;
  applicantId: string;
  jobExecutionProfileId: string; // 이미 생성된 직무 프로필 ID
}

/**
 * AI 비교 분석 응답
 */
export interface GenerateAIAnalysisResponse {
  success: boolean;
  analysis?: AIComparisonAnalysis;
  error?: AIAnalysisError;
  creditsRemaining?: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8. 데이터베이스 스키마 타입
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * job_execution_profiles 테이블
 */
export interface JobExecutionProfileRecord {
  id: string;
  user_id: string;
  job_input: JobInput;
  execution_profile: ExecutionProfile;
  axis_breakdown: JobExecutionProfile["axisBreakdown"];
  credits_used: number;
  created_at: string;
  updated_at: string;
}

/**
 * ai_comparison_analyses 테이블
 */
export interface AIComparisonAnalysisRecord {
  id: string;
  user_id: string;
  applicant_id: string;
  job_execution_profile_id: string;
  axis_differences: AxisDifference[];
  overall_summary: AIComparisonAnalysis["overallSummary"];
  management_points: ManagementPoint[];
  credits_used: number;
  created_at: string;
  updated_at: string;
}
