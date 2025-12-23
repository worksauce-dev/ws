import {
  MdWork,
  MdPerson,
  MdCalendarToday,
  MdNotifications,
} from "react-icons/md";
import type { Group } from "@/shared/types/database.types";
import type { WorkTypeCode } from "@/features/groups/constants/workTypeKeywords";
import { getPositionLabel, getExperienceLevelLabel } from "../utils/formatHelpers";
import { getWorkTypeName } from "../utils/workTypeHelpers";

interface GroupInfoSidebarProps {
  group: Group;
  calculateDday: (deadline: string) => string;
  getDdayColor: (deadline: string, status: string) => string;
}

export const GroupInfoSidebar = ({
  group,
  calculateDday,
  getDdayColor,
}: GroupInfoSidebarProps) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-neutral-800">그룹 정보</h2>
      <div className="space-y-4">
        {/* 모집 포지션 */}
        <div className="flex items-start gap-3">
          <MdWork className="w-5 h-5 text-neutral-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-neutral-500 mb-1">모집 포지션</p>
            <p className="text-sm font-medium text-neutral-800">
              {getPositionLabel(group.position)}
            </p>
          </div>
        </div>

        {/* 경력 수준 */}
        <div className="flex items-start gap-3">
          <MdPerson className="w-5 h-5 text-neutral-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-neutral-500 mb-1">경력 수준</p>
            <p className="text-sm font-medium text-neutral-800">
              {getExperienceLevelLabel(group.experience_level)}
            </p>
          </div>
        </div>

        {/* 마감일 */}
        <div className="flex items-start gap-3">
          <MdCalendarToday className="w-5 h-5 text-neutral-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-neutral-500 mb-1">마감일</p>
            <div className="flex items-baseline gap-2">
              <p className="text-sm font-medium text-neutral-800">
                {new Date(group.deadline).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <span
                className={`text-xs font-semibold ${getDdayColor(group.deadline, group.status)}`}
              >
                {calculateDday(group.deadline)}
              </span>
            </div>
          </div>
        </div>

        {/* 자동 리마인더 */}
        {group.auto_reminder && (
          <div className="flex items-start gap-3">
            <MdNotifications className="w-5 h-5 text-neutral-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500 mb-1">자동 리마인더</p>
              <p className="text-sm font-medium text-success-600">활성화됨</p>
            </div>
          </div>
        )}

        {/* 선호 직무 유형 */}
        <div className="pt-2 border-t border-neutral-100">
          <p className="text-xs text-neutral-500 mb-2">선호 직무 유형</p>
          <div className="flex flex-wrap gap-2">
            {group.preferred_work_types.map((type: WorkTypeCode) => (
              <span
                key={type}
                className="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary"
              >
                {getWorkTypeName(type as WorkTypeCode)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
