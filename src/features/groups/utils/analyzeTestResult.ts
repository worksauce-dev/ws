// utils/analyzeTestResult.ts
// 검사 결과를 분석하여 인사이트를 도출하는 유틸리티

import {
  type TestResult,
  type WorkTypeCode,
  type VerbCategory,
  getScoreLevel,
  type ScoreLevel,
} from "../types/workType.types";
import WORK_TYPE_DATA from "../constants/workTypes"; // 모든 유형 데이터
import type { TeamComposition } from "@/shared/types/database.types";
import type { JobProfile, JobFitAnalysis } from "../types/jobProfile.types";

// Re-export for convenience
export type { JobFitAnalysis } from "../types/jobProfile.types";

export interface AnalyzedResult {
  // 기본 정보
  primaryType: {
    code: WorkTypeCode;
    name: string;
    score: number;
    level: ScoreLevel;
  };

  // 점수 분포 분석
  scoreDistribution: {
    code: WorkTypeCode;
    name: string;
    score: number;
    level: ScoreLevel;
    rank: number;
  }[];

  // 상위/하위 유형
  topTypes: WorkTypeCode[]; // 상위 3개
  bottomTypes: WorkTypeCode[]; // 하위 3개

  // 점수 패턴 분석
  scorePattern: {
    range: number; // 최고점 - 최저점
    average: number; // 평균 점수
    standardDeviation: number; // 표준편차
    isBalanced: boolean; // 균형 잡힌 분포인지 (편차 < 15)
    isDominant: boolean; // 특정 유형이 지배적인지 (1위와 2위 차이 > 15)
  };

  // SAUCE 단계별 분석
  sauceAnalysis: Record<
    VerbCategory,
    {
      dominantTypes: WorkTypeCode[]; // 해당 단계에서 선택된 유형들
      insight: string; // 해석
    }
  >;

  // 종합 인사이트
  insights: {
    strengths: string[]; // 강점 요약
    developmentAreas: string[]; // 개발 영역
    interviewFocus: string[]; // 면접에서 집중할 포인트
  };
}

export const analyzeTestResult = (result: TestResult): AnalyzedResult => {
  const { primaryWorkType, statementScores, verbTestSelections } = result;

  // 1. 점수 분포 분석
  const scoreDistribution = Object.entries(statementScores)
    .map(([code, score]) => ({
      code: code as WorkTypeCode,
      name: WORK_TYPE_DATA[code as WorkTypeCode].name,
      score,
      level: getScoreLevel(score),
      rank: 0,
    }))
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  const scores = Object.values(statementScores);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const stdDev = Math.sqrt(
    scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) /
      scores.length
  );

  // 2. SAUCE 단계별 분석
  const sauceAnalysis = {} as AnalyzedResult["sauceAnalysis"];
  const verbCategories: VerbCategory[] = [
    "start",
    "advance",
    "utility",
    "communicate",
    "expert",
  ];

  verbCategories.forEach(category => {
    const selections = verbTestSelections[category] || [];
    const typeCount: Record<string, number> = {};

    selections.forEach(selection => {
      const typeCode = selection.split("-")[0];
      typeCount[typeCode] = (typeCount[typeCode] || 0) + 1;
    });

    const dominantTypes = Object.entries(typeCount)
      .sort((a, b) => b[1] - a[1])
      .map(([code]) => code as WorkTypeCode);

    const categoryLabels: Record<VerbCategory, string> = {
      start: "시작",
      advance: "발전",
      utility: "활용",
      communicate: "소통",
      expert: "전문가",
    };

    sauceAnalysis[category] = {
      dominantTypes,
      insight:
        dominantTypes.length > 0
          ? `${categoryLabels[category]} 단계에서 ${dominantTypes.map(c => WORK_TYPE_DATA[c].name).join(", ")} 성향이 나타남`
          : `${categoryLabels[category]} 단계 데이터 없음`,
    };
  });

  // 3. 종합 인사이트 생성
  const primaryTypeData = WORK_TYPE_DATA[primaryWorkType];
  const primaryScore = statementScores[primaryWorkType];
  const primaryLevel = getScoreLevel(primaryScore);

  const topTypes = scoreDistribution.slice(0, 3).map(s => s.code);
  const bottomTypes = scoreDistribution.slice(-3).map(s => s.code);

  const insights = {
    strengths: primaryTypeData.strengths.slice(0, 3).map(s => s.title),
    developmentAreas: primaryTypeData.weaknesses.slice(0, 2).map(w => w.title),
    interviewFocus: primaryTypeData.interview.questions
      .slice(0, 3)
      .map(q => q.category),
  };

  return {
    primaryType: {
      code: primaryWorkType,
      name: primaryTypeData.name,
      score: primaryScore,
      level: primaryLevel,
    },
    scoreDistribution,
    topTypes,
    bottomTypes,
    scorePattern: {
      range: maxScore - minScore,
      average: avgScore,
      standardDeviation: stdDev,
      isBalanced: stdDev < 15,
      isDominant: scoreDistribution[0].score - scoreDistribution[1].score > 15,
    },
    sauceAnalysis,
    insights,
  };
};

/**
 * 직무 적합도 계산
 * 선호 유형들의 점수를 종합적으로 고려하여 계산
 *
 * @param scoreDistribution - 전체 유형별 점수 분포
 * @param preferredWorkTypes - 모집 포지션의 선호 유형들
 * @returns 직무 적합도 점수 (0-100)
 */
export const calculateJobFitScore = (
  scoreDistribution: AnalyzedResult["scoreDistribution"],
  preferredWorkTypes?: WorkTypeCode[]
): number => {
  // 선호 유형이 지정되지 않은 경우, primary type 점수 반환
  if (!preferredWorkTypes || preferredWorkTypes.length === 0) {
    return scoreDistribution[0].score;
  }

  // 선호 유형들의 점수 추출
  const preferredScores = preferredWorkTypes
    .map(code => {
      const dist = scoreDistribution.find(d => d.code === code);
      return dist ? dist.score : 0;
    })
    .filter(score => score > 0);

  // 선호 유형 점수가 없는 경우, primary type 점수 반환
  if (preferredScores.length === 0) {
    return scoreDistribution[0].score;
  }

  // 선호 유형이 1개인 경우
  if (preferredScores.length === 1) {
    return preferredScores[0];
  }

  // 선호 유형이 여러 개인 경우, 가중 평균 계산
  // 가장 높은 점수에 60% 가중치, 나머지에 40% 가중치
  const sortedScores = [...preferredScores].sort((a, b) => b - a);
  const topScore = sortedScores[0];
  const otherScoresAvg =
    sortedScores.slice(1).reduce((sum, score) => sum + score, 0) /
    (sortedScores.length - 1);

  return topScore * 0.6 + otherScoresAvg * 0.4;
};

/**
 * 팀 구성 비교 결과 (팩트 기반)
 * 주관적 점수나 판단을 배제하고 객관적 정보만 제공
 */
export interface TeamCompositionComparison {
  // 지원자의 유형
  applicantType: WorkTypeCode;
  applicantTypeName: string;

  // 현재 팀 구성
  currentComposition: Record<WorkTypeCode, number>;

  // 지원자 합류 후 팀 구성
  afterComposition: Record<WorkTypeCode, number>;

  // 현재 팀에서 해당 유형 인원 수
  existingCount: number;

  // 현재 팀 총 인원
  totalMembers: number;

  // 합류 전 해당 유형 비율 (0-100%)
  percentageBefore: number;

  // 합류 후 해당 유형 비율 (0-100%)
  percentageAfter: number;

  // 새로운 유형인지 여부 (현재 팀에 없는 유형)
  isNewType: boolean;
}

/**
 * @deprecated 주관적 점수 및 판단이 포함되어 있어 사용을 권장하지 않습니다.
 * TeamCompositionComparison을 사용하세요.
 */
export interface TeamFitAnalysis {
  balanceScore: number;
  currentComposition: Record<WorkTypeCode, number>;
  afterComposition: Record<WorkTypeCode, number>;
  diversityScore: number;
  recommendation: {
    level: "excellent" | "good" | "neutral" | "caution";
    message: string;
    reasons: string[];
  };
}

/**
 * 팀 구성 비교 정보 생성 (팩트 기반)
 * 주관적 점수나 판단 없이 객관적인 팀 구성 변화만 제공
 *
 * @param applicantPrimaryType - 지원자의 주 유형
 * @param currentTeamComposition - 현재 팀 구성 (유형별 인원수)
 * @returns 팀 구성 비교 결과 (객관적 정보만 포함)
 */
export const getTeamCompositionComparison = (
  applicantPrimaryType: WorkTypeCode,
  currentTeamComposition: TeamComposition | null
): TeamCompositionComparison | null => {
  // 팀 구성 정보가 없는 경우, null 반환
  if (!currentTeamComposition || Object.keys(currentTeamComposition).length === 0) {
    return null;
  }

  // 현재 팀 총 인원
  const totalMembers = Object.values(currentTeamComposition).reduce((sum, count) => sum + count, 0);

  // 현재 팀에서 해당 유형 인원 수
  const existingCount = currentTeamComposition[applicantPrimaryType] || 0;

  // 지원자 합류 후 팀 구성
  const afterComposition = { ...currentTeamComposition };
  afterComposition[applicantPrimaryType] = existingCount + 1;

  // 비율 계산 (0-100%)
  const percentageBefore = totalMembers > 0 ? Math.round((existingCount / totalMembers) * 100) : 0;
  const percentageAfter = Math.round(((existingCount + 1) / (totalMembers + 1)) * 100);

  // 새로운 유형인지 확인
  const isNewType = existingCount === 0;

  // 지원자 유형 이름
  const applicantTypeName = WORK_TYPE_DATA[applicantPrimaryType].name;

  return {
    applicantType: applicantPrimaryType,
    applicantTypeName,
    currentComposition: currentTeamComposition as Record<WorkTypeCode, number>,
    afterComposition: afterComposition as Record<WorkTypeCode, number>,
    existingCount,
    totalMembers,
    percentageBefore,
    percentageAfter,
    isNewType,
  };
};

/**
 * @deprecated 주관적 점수 및 판단이 포함되어 있어 사용을 권장하지 않습니다.
 * getTeamCompositionComparison()을 사용하세요.
 *
 * 팀 적합도 계산
 * 현재 팀 구성과 지원자의 유형을 고려하여 팀 밸런스를 분석
 *
 * @param applicantPrimaryType - 지원자의 주 유형
 * @param currentTeamComposition - 현재 팀 구성 (유형별 인원수)
 * @returns 팀 적합도 분석 결과
 */
export const calculateTeamFitScore = (
  applicantPrimaryType: WorkTypeCode,
  currentTeamComposition: TeamComposition | null
): TeamFitAnalysis => {
  // 팀 구성 정보가 없는 경우, 기본 분석 반환
  if (!currentTeamComposition || Object.keys(currentTeamComposition).length === 0) {
    return {
      balanceScore: 75, // 중립적 점수
      currentComposition: {} as Record<WorkTypeCode, number>,
      afterComposition: { [applicantPrimaryType]: 1 } as Record<WorkTypeCode, number>,
      diversityScore: 100,
      recommendation: {
        level: "neutral",
        message: "팀 구성 정보가 없어 상세 분석을 제공할 수 없습니다",
        reasons: ["현재 팀 구성을 입력하면 더 정확한 분석을 받을 수 있습니다"],
      },
    };
  }

  // 현재 팀 총 인원
  const currentTotal = Object.values(currentTeamComposition).reduce((sum, count) => sum + count, 0);

  // 지원자 합류 후 팀 구성
  const afterComposition = { ...currentTeamComposition };
  afterComposition[applicantPrimaryType] = (afterComposition[applicantPrimaryType] || 0) + 1;

  // 1. 팀 밸런스 점수 계산
  // 지원자의 유형이 현재 팀에서 부족한 유형일수록 높은 점수
  const currentTypeCount = currentTeamComposition[applicantPrimaryType] || 0;
  const currentTypeRatio = currentTotal > 0 ? currentTypeCount / currentTotal : 0;

  // 이상적인 비율은 균등 분배 (1/10 = 0.1)
  // 현재 비율이 낮을수록 (부족할수록) 밸런스 점수가 높음
  const balanceScore = Math.max(0, Math.min(100, 100 - currentTypeRatio * 400));

  // 2. 팀 다양성 점수 계산
  // 서로 다른 유형의 수가 많을수록 높은 점수
  const currentUniqueTypes = Object.keys(currentTeamComposition).length;
  const afterUniqueTypes = Object.keys(afterComposition).length;
  const diversityImprovement = afterUniqueTypes > currentUniqueTypes ? 20 : 0;
  const diversityScore = Math.min(100, (afterUniqueTypes / 10) * 100 + diversityImprovement);

  // 3. 추천 수준 및 메시지 생성
  let level: TeamFitAnalysis["recommendation"]["level"];
  let message: string;
  const reasons: string[] = [];

  const applicantTypeName = WORK_TYPE_DATA[applicantPrimaryType].name;

  if (currentTypeCount === 0) {
    // 팀에 없는 새로운 유형
    level = "excellent";
    message = `${applicantTypeName} 유형은 현재 팀에 없는 새로운 관점을 제공합니다`;
    reasons.push("팀 다양성이 크게 향상됩니다");
    reasons.push("새로운 강점이 추가됩니다");
  } else if (currentTypeRatio < 0.2) {
    // 부족한 유형 (20% 미만)
    level = "good";
    message = `${applicantTypeName} 유형이 보강되어 팀 밸런스가 개선됩니다`;
    reasons.push("현재 부족한 유형을 보완합니다");
    reasons.push("팀의 역량이 균형있게 발전합니다");
  } else if (currentTypeRatio < 0.4) {
    // 적정 수준 (20-40%)
    level = "neutral";
    message = `${applicantTypeName} 유형이 추가되어 해당 강점이 강화됩니다`;
    reasons.push("기존 강점이 더욱 탄탄해집니다");
    reasons.push("팀 시너지를 높일 수 있습니다");
  } else {
    // 이미 많은 유형 (40% 이상)
    level = "caution";
    message = `${applicantTypeName} 유형이 이미 충분하여 팀 다양성이 제한될 수 있습니다`;
    reasons.push("특정 유형에 편중될 수 있습니다");
    reasons.push("다른 관점이 부족할 수 있습니다");
    reasons.push("하지만 개인의 역량이 더 중요할 수 있습니다");
  }

  return {
    balanceScore: Math.round(balanceScore),
    currentComposition: currentTeamComposition as Record<WorkTypeCode, number>,
    afterComposition: afterComposition as Record<WorkTypeCode, number>,
    diversityScore: Math.round(diversityScore),
    recommendation: {
      level,
      message,
      reasons,
    },
  };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Phase 3: 직무 프로필 기반 적합도 분석
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 직무 프로필 기반 적합도 분석 (개선된 알고리즘)
 *
 * 기존 calculateJobFitScore와 달리:
 * 1. 직무별 역량 가중치 반영
 * 2. 최소 요구 점수 미달 시 명확한 경고
 * 3. 강점/약점을 직무 맥락으로 설명
 * 4. 면접 체크포인트 제공
 *
 * @param scoreDistribution - 지원자의 전체 유형별 점수 분포
 * @param jobProfile - 직무 프로필 (역량 요구사항 포함)
 * @returns 직무 적합도 분석 결과
 */
export const calculateJobFitScoreV2 = (
  scoreDistribution: AnalyzedResult["scoreDistribution"],
  jobProfile: JobProfile
): JobFitAnalysis => {
  // 1. 점수 맵 생성 (빠른 조회용)
  const scoreMap: Partial<Record<WorkTypeCode, number>> = {};
  scoreDistribution.forEach(item => {
    scoreMap[item.code] = item.score;
  });

  // 2. 역량별 점수 계산 및 분류
  const strengths: JobFitAnalysis["strengths"] = [];
  const weaknesses: JobFitAnalysis["weaknesses"] = [];
  const adequateCompetencies: JobFitAnalysis["adequateCompetencies"] = [];

  let totalWeightedScore = 0;
  let totalWeight = 0;
  let criticalFailures = 0; // Critical 역량 미달 횟수

  jobProfile.competencies.forEach(competency => {
    const applicantScore = scoreMap[competency.workType] || 0;
    const workTypeName = WORK_TYPE_DATA[competency.workType].name;

    // 가중치 계산 (critical: 3, important: 2, preferred: 1)
    const weightValue = competency.weight === "critical" ? 3 : competency.weight === "important" ? 2 : 1;

    // 가중 점수 누적
    totalWeightedScore += applicantScore * weightValue;
    totalWeight += weightValue;

    // 역량 분류
    if (applicantScore >= competency.optimalScore) {
      // 강점: optimal 이상
      strengths.push({
        workType: competency.workType,
        workTypeName,
        score: applicantScore,
        weight: competency.weight,
        description: competency.description,
      });
    } else if (applicantScore < competency.minScore) {
      // 약점: min 미만
      weaknesses.push({
        workType: competency.workType,
        workTypeName,
        score: applicantScore,
        weight: competency.weight,
        minScore: competency.minScore,
        description: competency.description,
        interviewCheckpoints: competency.interviewCheckpoints,
      });

      // Critical 역량 미달 체크
      if (competency.weight === "critical") {
        criticalFailures++;
      }
    } else {
      // 적정 수준: min 이상 optimal 미만
      adequateCompetencies.push({
        workType: competency.workType,
        workTypeName,
        score: applicantScore,
        weight: competency.weight,
      });
    }
  });

  // 3. 종합 점수 계산 (0-100)
  const overallScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;

  // 4. 적합도 수준 결정
  let fitLevel: JobFitAnalysis["fitLevel"];
  let fitLevelLabel: string;

  if (criticalFailures > 0) {
    // Critical 역량 미달이 하나라도 있으면 낮은 적합도
    fitLevel = "low";
    fitLevelLabel = "면접 집중 확인 필요";
  } else if (overallScore >= 85) {
    fitLevel = "excellent";
    fitLevelLabel = "높은 매칭도";
  } else if (overallScore >= 70) {
    fitLevel = "good";
    fitLevelLabel = "양호한 매칭도";
  } else if (overallScore >= 60) {
    fitLevel = "moderate";
    fitLevelLabel = "보통 매칭도";
  } else {
    fitLevel = "low";
    fitLevelLabel = "면접 집중 확인 필요";
  }

  // 5. 채용 의사결정 가이드 생성
  let recommendationLevel: JobFitAnalysis["hiringRecommendation"]["level"];
  let recommendationLevelLabel: string;
  let reasoning: string;
  const criticalCheckpoints: string[] = [];

  if (fitLevel === "excellent" && weaknesses.length === 0) {
    // 최고 등급: 모든 역량 우수
    recommendationLevel = "strongly_recommended";
    recommendationLevelLabel = "높은 매칭도";
    reasoning = `${jobProfile.jobTitle} 직무의 필수 역량을 모두 충족하며, 핵심 영역에서 우수한 점수를 보입니다.`;
  } else if (fitLevel === "excellent" || (fitLevel === "good" && criticalFailures === 0)) {
    // 권장: 핵심 역량 충족, 일부 보완 필요
    recommendationLevel = "recommended";
    recommendationLevelLabel = "양호한 매칭도";

    if (weaknesses.length === 0) {
      reasoning = `${jobProfile.jobTitle} 직무의 핵심 역량을 충족합니다. 전반적으로 균형잡힌 역량 분포를 보입니다.`;
    } else {
      const weakCompetencies = weaknesses.map(w => w.workTypeName).join(", ");
      reasoning = `${jobProfile.jobTitle} 직무의 필수 역량을 충족합니다. ${weakCompetencies} 영역은 기준보다 낮은 점수를 보이므로, 면접에서 실무 경험을 중점적으로 확인하세요.`;

      // 약점 역량의 면접 체크포인트 추가
      weaknesses.forEach(weakness => {
        criticalCheckpoints.push(...weakness.interviewCheckpoints);
      });
    }
  } else if (fitLevel === "moderate" && criticalFailures === 0) {
    // 조건부: 필수 역량은 충족하나 전반적으로 평균 수준
    recommendationLevel = "conditional";
    recommendationLevelLabel = "면접 확인 필요";

    const weakCompetencies = weaknesses.map(w => w.workTypeName).join(", ");
    reasoning = `${jobProfile.jobTitle} 직무의 필수 역량은 최소 기준을 충족하나, ${weakCompetencies} 영역이 평균 수준입니다. 면접에서 실무 경험, 성장 가능성, 학습 의지를 집중적으로 확인하세요.`;

    // 모든 약점 역량의 면접 체크포인트 추가
    weaknesses.forEach(weakness => {
      criticalCheckpoints.push(...weakness.interviewCheckpoints);
    });
  } else {
    // 주의 필요: Critical 역량 미달
    recommendationLevel = "not_recommended";
    recommendationLevelLabel = "면접 집중 확인";

    const criticalWeaknesses = weaknesses.filter(w => w.weight === "critical");
    const criticalCompetencies = criticalWeaknesses.map(w => w.workTypeName).join(", ");

    reasoning = `${jobProfile.jobTitle} 직무의 필수 역량인 ${criticalCompetencies} 영역에서 기준 점수에 미달합니다. 면접에서 관련 경험을 깊이 있게 검증하고, 온보딩 시 추가 지원이 필요할 수 있습니다.`;

    // Critical 약점의 면접 체크포인트 추가
    criticalWeaknesses.forEach(weakness => {
      criticalCheckpoints.push(...weakness.interviewCheckpoints);
    });
  }

  return {
    overallScore,
    fitLevel,
    fitLevelLabel,
    strengths,
    weaknesses,
    adequateCompetencies,
    hiringRecommendation: {
      level: recommendationLevel,
      levelLabel: recommendationLevelLabel,
      reasoning,
      criticalCheckpoints,
    },
  };
};
