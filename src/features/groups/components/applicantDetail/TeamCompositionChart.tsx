import WORK_TYPE_DATA from "../../constants/workTypes";
import type { WorkTypeCode } from "../../types/workType.types";

interface TeamCompositionChartProps {
  currentComposition: Record<WorkTypeCode, number>;
  afterComposition: Record<WorkTypeCode, number>;
}

export const TeamCompositionChart = ({
  currentComposition,
  afterComposition,
}: TeamCompositionChartProps) => {
  // 모든 유형 코드 추출 (현재 + 합류 후)
  const allTypes = Array.from(
    new Set([
      ...Object.keys(currentComposition),
      ...Object.keys(afterComposition),
    ])
  ) as WorkTypeCode[];

  // 최대값 계산 (차트 스케일링용)
  const maxCount = Math.max(
    ...Object.values(currentComposition),
    ...Object.values(afterComposition),
    1 // 최소값 1로 설정
  );

  return (
    <div className="space-y-4">
      {allTypes.map(code => {
        const currentCount = currentComposition[code] || 0;
        const afterCount = afterComposition[code] || 0;
        const isNew = currentCount === 0 && afterCount > 0;
        const isIncreased = afterCount > currentCount;
        const isDecreased = afterCount < currentCount;

        return (
          <div key={code} className="space-y-2">
            {/* 유형명 */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-700">
                {WORK_TYPE_DATA[code]?.name || code}
              </span>
              {isNew && (
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                  NEW
                </span>
              )}
            </div>

            {/* Before/After 바 차트 */}
            <div className="space-y-1.5">
              {/* 현재 (Before) */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-500 w-12">현재</span>
                <div className="flex-1 bg-neutral-100 rounded-full h-6 relative overflow-hidden">
                  <div
                    className="bg-neutral-400 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{
                      width: `${currentCount === 0 ? 0 : Math.max((currentCount / maxCount) * 100, 8)}%`,
                    }}
                  >
                    {currentCount > 0 && (
                      <span className="text-xs font-semibold text-white">
                        {currentCount}
                      </span>
                    )}
                  </div>
                  {currentCount === 0 && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                      0
                    </span>
                  )}
                </div>
              </div>

              {/* 합류 후 (After) */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-500 w-12">합류 후</span>
                <div className="flex-1 bg-neutral-100 rounded-full h-6 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 ${
                      isNew || isIncreased
                        ? "bg-primary-500"
                        : isDecreased
                          ? "bg-warning-500"
                          : "bg-neutral-400"
                    }`}
                    style={{
                      width: `${afterCount === 0 ? 0 : Math.max((afterCount / maxCount) * 100, 8)}%`,
                    }}
                  >
                    {afterCount > 0 && (
                      <span className="text-xs font-semibold text-white">
                        {afterCount}
                      </span>
                    )}
                  </div>
                  {afterCount === 0 && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                      0
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 변화 표시 */}
            {isIncreased && (
              <div className="flex items-center gap-1 ml-16">
                <span className="text-xs text-primary-600">
                  ↑ +{afterCount - currentCount}명 증가
                </span>
              </div>
            )}
          </div>
        );
      })}

      {/* 범례 */}
      <div className="flex items-center gap-4 pt-4 mt-4 border-t border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neutral-400" />
          <span className="text-xs text-neutral-600">변화 없음</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-500" />
          <span className="text-xs text-neutral-600">증가</span>
        </div>
      </div>
    </div>
  );
};
