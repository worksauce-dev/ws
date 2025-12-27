/**
 * 팀 카드 컴포넌트
 * 팀 목록에서 각 팀을 표시하는 카드
 */

import { MdPeople, MdCheckCircle } from "react-icons/md";
import type { TeamDetail } from "../types/team.types";

interface TeamCardProps {
  team: TeamDetail;
  onDetail: (teamId: string) => void;
}

export const TeamCard = ({ team, onDetail }: TeamCardProps) => {
  const completionPercentage =
    team.total_members > 0
      ? Math.round((team.completed_tests / team.total_members) * 100)
      : 0;

  return (
    <div
      onClick={() => onDetail(team.id)}
      className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* 팀 이름 */}
      <h3 className="text-lg font-semibold text-neutral-800 mb-2">
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
  );
};
