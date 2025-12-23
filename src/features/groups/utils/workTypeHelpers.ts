import {
  WORK_TYPE_KEYWORDS,
  type WorkTypeCode,
} from "@/features/groups/constants/workTypeKeywords";

/**
 * WorkType 코드를 이름으로 변환
 */
export const getWorkTypeName = (code: WorkTypeCode): string => {
  const workType = WORK_TYPE_KEYWORDS.find(wt => wt.code === code);
  return workType?.type || code;
};

/**
 * WorkType별 색상 매핑
 */
export const getWorkTypeColor = (code: WorkTypeCode): string => {
  const colorMap: Record<WorkTypeCode, string> = {
    SE: "bg-blue-500",
    SA: "bg-purple-500",
    AS: "bg-pink-500",
    AF: "bg-orange-500",
    UM: "bg-teal-500",
    UR: "bg-indigo-500",
    CA: "bg-green-500",
    CH: "bg-cyan-500",
    EE: "bg-red-500",
    EG: "bg-amber-500",
  };
  return colorMap[code] || "bg-gray-500";
};

/**
 * 2차 직무 유형 계산 (statementScores에서 두 번째로 높은 점수)
 */
export const getSecondaryWorkType = (
  statementScores: Record<WorkTypeCode, number>
): WorkTypeCode | null => {
  const sorted = Object.entries(statementScores).sort(
    ([, a], [, b]) => b - a
  );
  return sorted.length > 1 ? (sorted[1][0] as WorkTypeCode) : null;
};

/**
 * statementScores를 scoreDistribution 형태로 변환
 */
export const convertToScoreDistribution = (
  statementScores: Record<WorkTypeCode, number>
) => {
  return Object.entries(statementScores).map(([code, score]) => ({
    code: code as WorkTypeCode,
    name: getWorkTypeName(code as WorkTypeCode),
    score,
    level: "high" as const,
    rank: 0,
  }));
};
