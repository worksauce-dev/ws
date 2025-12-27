/**
 * 팀 카드 컴포넌트
 * 팀 목록에서 각 팀을 표시하는 카드
 */

import { MdPeople, MdCheckCircle, MdMoreVert, MdEdit, MdDelete } from "react-icons/md";
import { Dropdown } from "@/shared/components/ui/Dropdown";
import type { TeamDetail } from "../types/team.types";

interface TeamCardProps {
  team: TeamDetail;
  onEdit: (teamId: string) => void;
  onDelete: (teamId: string) => void;
  onDetail: (teamId: string) => void;
}

export const TeamCard = ({ team, onEdit, onDelete, onDetail }: TeamCardProps) => {
  const completionPercentage =
    team.total_members > 0
      ? Math.round((team.completed_tests / team.total_members) * 100)
      : 0;

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow relative group">
      {/* 3 dots 메뉴 */}
      <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
        <Dropdown
          trigger={
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="팀 메뉴"
            >
              <MdMoreVert className="w-5 h-5 text-neutral-600" />
            </button>
          }
          items={[
            {
              id: `edit-${team.id}`,
              icon: <MdEdit className="w-4 h-4" />,
              label: "수정",
              onClick: () => onEdit(team.id),
            },
            {
              id: `delete-${team.id}`,
              icon: <MdDelete className="w-4 h-4 text-error-600" />,
              label: "삭제",
              onClick: () => onDelete(team.id),
              className: "text-error-600 hover:bg-error-50",
            },
          ]}
          className="w-auto"
          placement="bottom-right"
        />
      </div>

      {/* 팀 카드 내용 (클릭 시 상세보기) */}
      <div onClick={() => onDetail(team.id)} className="cursor-pointer">
        {/* 팀 이름 */}
        <h3 className="text-lg font-semibold text-neutral-800 mb-2 pr-8">
          {team.name}
        </h3>

        {/* 팀 설명 */}
        {team.description && (
          <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
            {team.description}
          </p>
        )}

        {/* 통계 */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-neutral-200">
          <div className="flex items-center gap-2">
            <MdPeople className="text-neutral-500" />
            <span className="text-sm text-neutral-700">{team.total_members}명</span>
          </div>
          <div className="flex items-center gap-2">
            <MdCheckCircle className="text-success-600" />
            <span className="text-sm text-neutral-700">
              {team.completed_tests}/{team.total_members} 완료
            </span>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="mt-4">
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1 text-right">
            {completionPercentage}% 진행
          </p>
        </div>

        {/* 생성일 */}
        <p className="text-xs text-neutral-500 mt-4">
          생성일: {new Date(team.created_at).toLocaleDateString("ko-KR")}
        </p>
      </div>
    </div>
  );
};
