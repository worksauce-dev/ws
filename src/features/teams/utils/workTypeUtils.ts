/**
 * Work Type 관련 유틸리티 함수
 */

import type { TestResult } from "@/shared/types/database.types";
import type { WorkTypeCode } from "@/features/groups/types/workType.types";

/**
 * test_result에서 primary work type(가장 높은 점수의 유형)을 계산
 */
export function getPrimaryWorkType(testResult: TestResult | null): WorkTypeCode | null {
  if (!testResult?.statementScores) {
    return null;
  }

  const workTypes = testResult.statementScores;
  const entries = Object.entries(workTypes) as [WorkTypeCode, number][];

  if (entries.length === 0) {
    return null;
  }

  const maxEntry = entries.reduce((max, current) =>
    current[1] > max[1] ? current : max
  );

  return maxEntry[0];
}

/**
 * 여러 팀원의 test_result로부터 팀 구성(TeamComposition)을 계산
 */
export function calculateTeamComposition(
  testResults: (TestResult | null)[]
): Record<WorkTypeCode, number> {
  const composition: Partial<Record<WorkTypeCode, number>> = {};

  testResults.forEach(result => {
    const primaryType = getPrimaryWorkType(result);
    if (primaryType) {
      composition[primaryType] = (composition[primaryType] || 0) + 1;
    }
  });

  return composition as Record<WorkTypeCode, number>;
}
