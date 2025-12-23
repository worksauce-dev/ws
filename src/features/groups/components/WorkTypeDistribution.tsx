import { MdAssignment } from "react-icons/md";
import type { WorkTypeCode } from "@/features/groups/constants/workTypeKeywords";

interface WorkTypeDistributionItem {
  code: WorkTypeCode;
  name: string;
  count: number;
  percentage: number;
  colorClass: string;
}

interface WorkTypeDistributionProps {
  distribution: WorkTypeDistributionItem[];
}

export const WorkTypeDistribution = ({
  distribution,
}: WorkTypeDistributionProps) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <h2 className="text-lg font-semibold mb-4 text-neutral-800">
        지원자 직무 유형 분포
      </h2>
      {distribution.length > 0 ? (
        <div className="space-y-4">
          {distribution.map(item => (
            <div key={item.code}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-neutral-700 font-medium">
                  {item.name}
                </span>
                <span className="text-neutral-600">
                  {item.count}명 ({item.percentage}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${item.colorClass}`}
                  style={{
                    width: `${item.percentage}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-neutral-600">
            아직 완료된 테스트가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
};
