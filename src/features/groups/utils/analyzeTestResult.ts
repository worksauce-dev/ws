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
