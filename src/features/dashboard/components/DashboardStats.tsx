/**
 * 대시보드 요약 통계 컴포넌트
 */

import {
  MdPeople,
  MdPersonAdd,
  MdAccessTime,
  MdTrendingUp,
} from "react-icons/md";
import type { DashboardStats as Stats } from "../hooks/useDashboardStats";

interface DashboardStatsProps {
  stats: Stats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {/* 전체 그룹 */}
      <div className="bg-white rounded-xl p-6 border border-neutral-200">
        <div className="flex items-center">
          <div className="p-3 rounded-lg mr-4 bg-primary-100">
            <MdPeople className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600">전체 그룹</p>
            <p className="text-2xl font-bold text-neutral-800">
              {stats.totalGroups}
            </p>
          </div>
        </div>
      </div>

      {/* 활성 그룹 */}
      <div className="bg-white rounded-xl p-6 border border-neutral-200">
        <div className="flex items-center">
          <div className="p-3 rounded-lg mr-4 bg-success-100">
            <MdPersonAdd className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600">활성 그룹</p>
            <p className="text-2xl font-bold text-neutral-800">
              {stats.activeGroups}
            </p>
          </div>
        </div>
      </div>

      {/* 총 지원자 */}
      <div className="bg-white rounded-xl p-6 border border-neutral-200">
        <div className="flex items-center">
          <div className="p-3 rounded-lg mr-4 bg-info-100">
            <MdAccessTime className="w-6 h-6 text-info" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600">총 지원자</p>
            <p className="text-2xl font-bold text-neutral-800">
              {stats.totalApplicants}
            </p>
          </div>
        </div>
      </div>

      {/* 완료 지원자 */}
      <div className="bg-white rounded-xl p-6 border border-neutral-200">
        <div className="flex items-center">
          <div className="p-3 rounded-lg mr-4 bg-warning-100">
            <MdTrendingUp className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600">완료</p>
            <p className="text-2xl font-bold text-neutral-800">
              {stats.completedTests}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
