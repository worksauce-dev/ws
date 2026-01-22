import { supabase } from "@/shared/lib/supabase"

/**
 * AI 분석 상태
 * - pending: 분석 요청됨, n8n 처리 대기 중
 * - processing: n8n에서 처리 중
 * - completed: 분석 완료
 * - failed: 분석 실패
 */
export type AiAnalysisStatus = "pending" | "processing" | "completed" | "failed"

/**
 * AI 분석 결과 저장 요청 타입
 */
export interface SaveAiAnalysisRequest {
  user_id: string
  applicant_id: string
  group_id: string
  analysis_id: string
  job_execution_profile: {
    id: string
    jobInput: {
      jobTitle: string
      jobDescription: string
      position: string
      mainResponsibilities?: string
      performanceCriteria?: string
      collaborationStyle?: string
    }
    executionProfile: {
      decision_speed: number
      uncertainty_tolerance: number
      autonomy: number
      relationship_focus: number
      precision_requirement: number
    }
    axisBreakdown: null
    creditsUsed: number
    generatedAt: string
  }
  applicant_execution_profile: {
    applicantId: string
    executionProfile: {
      decision_speed: number
      uncertainty_tolerance: number
      autonomy: number
      relationship_focus: number
      precision_requirement: number
    }
    sourceData: {
      primaryWorkType: string
      workTypeScores: Record<string, number>
    }
    transformedAt: string
  }
  axis_differences: Array<{
    axis: string
    axisName: string
    jobScore: number
    applicantScore: number
    gap: number
    gapLevel: "critical" | "significant" | "moderate" | "minimal"
    interpretation: string
    trade_off: {
      positive: string
      negative: string
    }
  }>
  overall_summary: {
    matchingAreas: string[]
    differingAreas: string[]
    interpretationSummary: string
  }
  scenario_analysis: {
    bestScenario: string
    worstScenario: string
    teamSynergyRecommendation: string
  }
  management_points: Array<{
    category: "onboarding" | "daily_work" | "growth" | "communication"
    categoryLabel: string
    point: string
    priority: "high" | "medium" | "low"
  }>
  confidence: {
    level: "high" | "medium" | "low"
    note: string | null
  }
  credits_used: number
}

/**
 * AI 분석 결과 저장 응답 타입
 */
export interface AiAnalysisRecord extends SaveAiAnalysisRequest {
  id: string
  status: AiAnalysisStatus
  created_at: string
  updated_at: string
}

/**
 * AI 분석 결과를 데이터베이스에 저장
 *
 * @param request - AI 분석 결과 객체
 * @returns 저장된 분석 레코드
 * @throws Error - 저장 실패 시
 */
export async function saveAiAnalysis(
  request: SaveAiAnalysisRequest,
): Promise<AiAnalysisRecord> {
  const { data, error } = await supabase
    .from("ai_job_analysis")
    .insert([request])
    .select()
    .single()

  if (error) {
    throw new Error(`AI 분석 저장 실패: ${error.message}`)
  }

  return data
}

/**
 * AI 분석 요청 시 pending 레코드 생성
 *
 * n8n 처리 전에 미리 레코드를 생성하여 새로고침 시에도 상태 유지
 *
 * @param params - pending 레코드 생성에 필요한 정보
 * @returns 생성된 pending 레코드
 */
export async function createPendingAiAnalysis(params: {
  user_id: string
  applicant_id: string
  group_id: string
  analysis_id: string
  transaction_id: string
}): Promise<AiAnalysisRecord> {
  const { data, error } = await supabase
    .from("ai_job_analysis")
    .insert([
      {
        user_id: params.user_id,
        applicant_id: params.applicant_id,
        group_id: params.group_id,
        analysis_id: params.analysis_id,
        transaction_id: params.transaction_id,
        status: "pending" as AiAnalysisStatus,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`AI 분석 pending 레코드 생성 실패: ${error.message}`)
  }

  return data
}

/**
 * AI 분석 상태 업데이트
 *
 * @param analysisId - 분석 ID
 * @param status - 새로운 상태
 */
export async function updateAiAnalysisStatus(
  analysisId: string,
  status: AiAnalysisStatus,
): Promise<void> {
  const { error } = await supabase
    .from("ai_job_analysis")
    .update({ status })
    .eq("analysis_id", analysisId)

  if (error) {
    throw new Error(`AI 분석 상태 업데이트 실패: ${error.message}`)
  }
}

/**
 * 특정 지원자의 AI 분석 결과 조회
 *
 * @param applicantId - 지원자 ID
 * @returns AI 분석 레코드 (없으면 null)
 */
export async function getAiAnalysisByApplicant(
  applicantId: string,
): Promise<AiAnalysisRecord | null> {
  const { data, error } = await supabase
    .from("ai_job_analysis")
    .select("*")
    .eq("applicant_id", applicantId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(`AI 분석 조회 실패: ${error.message}`)
  }

  return data
}

/**
 * 특정 그룹의 모든 AI 분석 결과 조회
 *
 * @param groupId - 그룹 ID
 * @returns AI 분석 레코드 배열
 */
export async function getAiAnalysesByGroup(
  groupId: string,
): Promise<AiAnalysisRecord[]> {
  const { data, error } = await supabase
    .from("ai_job_analysis")
    .select("*")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`AI 분석 목록 조회 실패: ${error.message}`)
  }

  return data
}

/**
 * AI 분석 결과 삭제
 *
 * @param analysisId - 분석 ID
 */
export async function deleteAiAnalysis(analysisId: string): Promise<void> {
  const { error } = await supabase
    .from("ai_job_analysis")
    .delete()
    .eq("analysis_id", analysisId)

  if (error) {
    throw new Error(`AI 분석 삭제 실패: ${error.message}`)
  }
}
