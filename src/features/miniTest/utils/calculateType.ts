import type { TypeScores, WorkTypeCode } from "../types";

/**
 * 최종 직무 유형을 계산합니다.
 * 가장 높은 점수를 받은 타입을 반환합니다.
 * 동점인 경우 미리 정의된 우선순위에 따라 선택합니다.
 */
export const getFinalType = (scores: TypeScores): WorkTypeCode => {
  // 점수를 배열로 변환하고 내림차순 정렬
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  // 가장 높은 점수
  const highestScore = sortedScores[0][1];

  // 가장 높은 점수를 가진 타입들
  const topTypes = sortedScores
    .filter(([, score]) => score === highestScore)
    .map(([type]) => type as WorkTypeCode);

  // 동점이 없으면 바로 반환
  if (topTypes.length === 1) {
    return topTypes[0];
  }

  // 동점인 경우 우선순위에 따라 선택
  // 우선순위: SE > SA > AS > AF > UM > UR > CA > CH > EE > EG
  const priorityOrder: WorkTypeCode[] = [
    "SE",
    "SA",
    "AS",
    "AF",
    "UM",
    "UR",
    "CA",
    "CH",
    "EE",
    "EG",
  ];

  for (const type of priorityOrder) {
    if (topTypes.includes(type)) {
      return type;
    }
  }

  // 기본값 (이론적으로 도달하지 않음)
  return topTypes[0];
};

/**
 * 점수를 백분율로 변환합니다.
 * @param score 개별 타입의 점수
 * @param totalScore 모든 타입의 점수 합계
 */
export const getScorePercentage = (
  score: number,
  totalScore: number
): number => {
  if (totalScore === 0) return 0;
  return Math.round((score / totalScore) * 100);
};

/**
 * 상위 N개의 타입을 반환합니다.
 */
export const getTopTypes = (
  scores: TypeScores,
  count: number = 3
): Array<{ type: WorkTypeCode; score: number; percentage: number }> => {
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([type, score]) => ({
      type: type as WorkTypeCode,
      score,
      percentage: getScorePercentage(score, totalScore),
    }));
};

/**
 * 타입별 점수 분포를 계산합니다.
 */
export const getScoreDistribution = (
  scores: TypeScores
): Array<{ type: WorkTypeCode; score: number; percentage: number }> => {
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([type, score]) => ({
      type: type as WorkTypeCode,
      score,
      percentage: getScorePercentage(score, totalScore),
    }));
};
