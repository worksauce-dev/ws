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
 * 팀 적합도 분석 결과
 */
export interface TeamFitAnalysis {
  // 팀 밸런스 점수 (0-100)
  balanceScore: number;

  // 현재 팀 구성
  currentComposition: Record<WorkTypeCode, number>;

  // 지원자 합류 후 팀 구성
  afterComposition: Record<WorkTypeCode, number>;

  // 팀 다양성 점수 (0-100)
  diversityScore: number;

  // 추천 메시지
  recommendation: {
    level: "excellent" | "good" | "neutral" | "caution";
    message: string;
    reasons: string[];
  };
}

/**
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
