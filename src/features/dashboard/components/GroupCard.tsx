/**
 * 그룹 카드 컴포넌트
 */

import {
  MdMoreHoriz,
  MdChevronRight,
  MdCalendarToday,
  MdVisibility,
  // MdEdit,        // TODO: 그룹 수정 기능 구현 시 사용
  // MdContentCopy, // TODO: 그룹 복제 기능 구현 시 사용
  // MdDownload,    // TODO: 지원자 내보내기 기능 구현 시 사용
  MdDelete,
} from "react-icons/md";
import { Dropdown } from "@/shared/components/ui/Dropdown";
import type { DropdownItem } from "@/shared/components/ui/Dropdown";
import type { Group } from "@/features/groups/types/group.types";
import { getActualGroupStatus, getGroupCompletionStats, getGroupCompletionRate } from "../utils/groupStatus";
import { GROUP_STATUS_STYLES, GROUP_STATUS_LABELS } from "../constants/groupStyles";
import { formatKoreanDate } from "@/shared/utils/formatters";

interface GroupCardProps {
  group: Group;
  onClick: (groupId: string) => void;
  onMenuAction: (groupId: string, item: DropdownItem) => void;
}

export const GroupCard = ({ group, onClick, onMenuAction }: GroupCardProps) => {
  const status = getActualGroupStatus(group);
  const { completed, total } = getGroupCompletionStats(group);
  const completionRate = getGroupCompletionRate(group);

  return (
    <div
      onClick={() => onClick(group.id)}
      className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg line-clamp-1 text-neutral-800">
              {group.name}
            </h3>
            <span
              className={`px-2 py-1 rounded-md text-xs font-medium border ${GROUP_STATUS_STYLES[status]}`}
            >
              {GROUP_STATUS_LABELS[status]}
            </span>
          </div>
          <p className="text-sm line-clamp-2 mb-3 text-neutral-600">
            {group.description}
          </p>
        </div>
        <div
          onClick={e => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Dropdown
            trigger={
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <MdMoreHoriz className="w-4 h-4 text-neutral-500" />
              </button>
            }
            items={[
              {
                id: "view",
                label: "상세 보기",
                icon: <MdVisibility className="w-4 h-4" />,
                onClick: () =>
                  onMenuAction(group.id, {
                    id: "view",
                    label: "상세 보기",
                  }),
              },
              // TODO: 아래 기능들은 추후 구현 예정
              // {
              //   id: "edit",
              //   label: "그룹 수정",
              //   icon: <MdEdit className="w-4 h-4" />,
              //   onClick: () =>
              //     onMenuAction(group.id, {
              //       id: "edit",
              //       label: "그룹 수정",
              //     }),
              // },
              // {
              //   id: "duplicate",
              //   label: "그룹 복제",
              //   icon: <MdContentCopy className="w-4 h-4" />,
              //   onClick: () =>
              //     onMenuAction(group.id, {
              //       id: "duplicate",
              //       label: "그룹 복제",
              //     }),
              // },
              // {
              //   id: "export",
              //   label: "지원자 내보내기",
              //   icon: <MdDownload className="w-4 h-4" />,
              //   onClick: () =>
              //     onMenuAction(group.id, {
              //       id: "export",
              //       label: "지원자 내보내기",
              //     }),
              // },
              {
                id: "extend",
                label: "마감일 연장",
                icon: <MdCalendarToday className="w-4 h-4" />,
                onClick: () =>
                  onMenuAction(group.id, {
                    id: "extend",
                    label: "마감일 연장",
                  }),
              },
              {
                id: "delete",
                label: "그룹 삭제",
                icon: <MdDelete className="w-4 h-4" />,
                onClick: () =>
                  onMenuAction(group.id, {
                    id: "delete",
                    label: "그룹 삭제",
                  }),
                className: "text-red-600 hover:bg-red-50",
              },
            ]}
            placement="bottom-right"
          />
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-700">
            테스트 완료율
          </span>
          <span className="text-sm font-semibold text-primary">
            {completionRate}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300 bg-primary-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 rounded-lg bg-neutral-50">
          <p className="text-2xl font-bold text-neutral-800">{total}</p>
          <p className="text-xs text-neutral-600">총 지원자</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-neutral-50">
          <p className="text-2xl font-bold text-success">{completed}</p>
          <p className="text-xs text-neutral-600">완료 지원자</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <div className="flex items-center text-xs text-neutral-600">
          <MdCalendarToday className="w-3 h-3 mr-1" />
          최근 업데이트: {formatKoreanDate(group.updated_at)}
        </div>
        <MdChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-primary" />
      </div>
    </div>
  );
};
