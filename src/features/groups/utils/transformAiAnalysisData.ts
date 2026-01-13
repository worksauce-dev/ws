/**
 * Supabase ai_job_analysis 데이터를 UI용 AIComparisonAnalysis 타입으로 변환
 */

import type { AiAnalysisRecord } from "@/shared/api/aiAnalysisApi";
import type {
  AIComparisonAnalysis,
  ExecutionAxisCode,
} from "../types/aiJobMatching.types";
import { toExecutionAxisScore } from "../types/aiJobMatching.types";

/**
 * Supabase에서 가져온 AI 분석 데이터를 UI 타입으로 변환
 *
 * @param record - Supabase ai_job_analysis 테이블 레코드
 * @returns AIComparisonAnalysis 타입 객체
 */
export function transformAiAnalysisData(
  record: AiAnalysisRecord,
): AIComparisonAnalysis {
  // ExecutionProfile의 점수를 ExecutionAxisScore 타입으로 변환
  const jobExecutionProfile = {
    decision_speed: toExecutionAxisScore(
      record.job_execution_profile.executionProfile.decision_speed,
    ),
    uncertainty_tolerance: toExecutionAxisScore(
      record.job_execution_profile.executionProfile.uncertainty_tolerance,
    ),
    autonomy: toExecutionAxisScore(
      record.job_execution_profile.executionProfile.autonomy,
    ),
    relationship_focus: toExecutionAxisScore(
      record.job_execution_profile.executionProfile.relationship_focus,
    ),
    precision_requirement: toExecutionAxisScore(
      record.job_execution_profile.executionProfile.precision_requirement,
    ),
  };

  const applicantExecutionProfile = {
    decision_speed: toExecutionAxisScore(
      record.applicant_execution_profile.executionProfile.decision_speed,
    ),
    uncertainty_tolerance: toExecutionAxisScore(
      record.applicant_execution_profile.executionProfile
        .uncertainty_tolerance,
    ),
    autonomy: toExecutionAxisScore(
      record.applicant_execution_profile.executionProfile.autonomy,
    ),
    relationship_focus: toExecutionAxisScore(
      record.applicant_execution_profile.executionProfile.relationship_focus,
    ),
    precision_requirement: toExecutionAxisScore(
      record.applicant_execution_profile.executionProfile
        .precision_requirement,
    ),
  };

  // AxisDifference의 점수를 ExecutionAxisScore 타입으로 변환
  const axisDifferences = record.axis_differences.map((diff) => ({
    axis: diff.axis as ExecutionAxisCode,
    axisName: diff.axisName,
    jobScore: toExecutionAxisScore(diff.jobScore),
    applicantScore: toExecutionAxisScore(diff.applicantScore),
    gap: diff.gap,
    gapLevel: diff.gapLevel,
    interpretation: diff.interpretation,
  }));

  // axisBreakdown 더미 데이터 생성 (n8n 응답에는 포함되지 않음)
  const axisBreakdown = {
    decision_speed: {
      score: jobExecutionProfile.decision_speed,
      reasoning: "",
      examples: [],
    },
    uncertainty_tolerance: {
      score: jobExecutionProfile.uncertainty_tolerance,
      reasoning: "",
      examples: [],
    },
    autonomy: {
      score: jobExecutionProfile.autonomy,
      reasoning: "",
      examples: [],
    },
    relationship_focus: {
      score: jobExecutionProfile.relationship_focus,
      reasoning: "",
      examples: [],
    },
    precision_requirement: {
      score: jobExecutionProfile.precision_requirement,
      reasoning: "",
      examples: [],
    },
  };

  return {
    analysisId: record.analysis_id,
    creditsUsed: record.credits_used,
    generatedAt: record.created_at,

    jobExecutionProfile: {
      id: record.job_execution_profile.id,
      jobInput: record.job_execution_profile.jobInput,
      executionProfile: jobExecutionProfile,
      axisBreakdown,
      creditsUsed: record.job_execution_profile.creditsUsed,
      generatedAt: record.job_execution_profile.generatedAt,
    },

    applicantExecutionProfile: {
      applicantId: record.applicant_execution_profile.applicantId,
      executionProfile: applicantExecutionProfile,
      sourceData: record.applicant_execution_profile.sourceData,
      transformedAt: record.applicant_execution_profile.transformedAt,
    },

    axisDifferences,

    overallSummary: record.overall_summary,

    managementPoints: record.management_points,

    confidence: {
      level: record.confidence.level,
      note: record.confidence.note ?? undefined,
    },
  };
}
