/**
 * 팀 상세 정보 모달 컴포넌트
 * 팀의 상세 정보와 팀원 목록을 표시하는 모달
 */

import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import { MdPeople, MdCheckCircle, MdPending } from "react-icons/md";
import { TeamMemberStatusBadge } from "./TeamMemberStatusBadge";
import WORK_TYPE_DATA from "@/features/groups/constants/workTypes";
import type { TeamDetail } from "../types/team.types";
import type { WorkTypeCode } from "@/features/groups/types/workType.types";

interface TeamDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamDetail | null;
}

export const TeamDetailModal = ({
  isOpen,
  onClose,
  team,
}: TeamDetailModalProps) => {
  if (!team) return null;

  const completionPercentage =
    team.total_members > 0
      ? Math.round((team.completed_tests / team.total_members) * 100)
      : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={team.name} size="xl">
      <div className="space-y-8">
        {/* 팀 설명 */}
        {team.description && (
          <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-xl p-4 border border-primary-200">
            <p className="text-sm text-neutral-700 leading-relaxed">
              {team.description}
            </p>
          </div>
        )}

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-5 border border-neutral-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center">
                <MdPeople className="w-5 h-5 text-neutral-600" />
              </div>
              <span className="text-sm font-medium text-neutral-600">총 팀원</span>
            </div>
            <p className="text-3xl font-bold text-neutral-800">
              {team.total_members}
              <span className="text-lg font-normal text-neutral-500 ml-1">명</span>
            </p>
          </div>

          <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-5 border border-success-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-success-200 rounded-lg flex items-center justify-center">
                <MdCheckCircle className="w-5 h-5 text-success-700" />
              </div>
              <span className="text-sm font-medium text-success-700">완료</span>
            </div>
            <p className="text-3xl font-bold text-success-800">
              {team.completed_tests}
              <span className="text-lg font-normal text-success-600 ml-1">명</span>
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                <MdPending className="w-5 h-5 text-amber-700" />
              </div>
              <span className="text-sm font-medium text-amber-700">대기 중</span>
            </div>
            <p className="text-3xl font-bold text-amber-800">
              {team.total_members - team.completed_tests}
              <span className="text-lg font-normal text-amber-600 ml-1">명</span>
            </p>
          </div>
        </div>

        {/* 진행률 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-neutral-800">테스트 진행률</h4>
            <span className="text-2xl font-bold text-primary-600">
              {completionPercentage}%
            </span>
          </div>
          <div className="relative w-full bg-neutral-200 rounded-full h-4 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs text-neutral-500 mt-2 text-right">
            {team.completed_tests} / {team.total_members} 완료
          </p>
        </div>

        {/* 팀 구성 차트 */}
        {team.team_composition && team.completed_tests > 0 && (
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="text-base font-semibold text-neutral-800 mb-5 flex items-center gap-2">
              <div className="w-1 h-5 bg-primary-500 rounded-full" />
              팀 직무 유형 분포
            </h3>
            <div className="space-y-4">
              {Object.entries(team.team_composition)
                .sort((a, b) => b[1] - a[1])
                .map(([code, count]) => {
                  const workType = WORK_TYPE_DATA[code as WorkTypeCode];
                  const percentage =
                    team.completed_tests > 0
                      ? (count / team.completed_tests) * 100
                      : 0;

                  return (
                    <div key={code} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-700 group-hover:text-primary-600 transition-colors">
                          {workType?.name || code}
                        </span>
                        <span className="text-sm font-semibold text-neutral-600">
                          {count}명 <span className="text-neutral-400">({Math.round(percentage)}%)</span>
                        </span>
                      </div>
                      <div className="relative w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out group-hover:from-primary-600 group-hover:to-primary-700"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* 팀원 목록 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="text-base font-semibold text-neutral-800 mb-5 flex items-center gap-2">
            <div className="w-1 h-5 bg-primary-500 rounded-full" />
            팀원 목록
          </h3>

          {team.members.length === 0 ? (
            <div className="text-center py-12 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-200">
              <MdPeople className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm text-neutral-500">등록된 팀원이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {team.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-neutral-800 truncate">
                      {member.name}
                    </h4>
                    <p className="text-sm text-neutral-600 truncate">{member.email}</p>
                    {member.primary_work_type && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-100 text-primary-700 rounded-md text-xs font-medium">
                        {WORK_TYPE_DATA[member.primary_work_type as WorkTypeCode]?.name}
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <TeamMemberStatusBadge status={member.test_status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-end pt-6 border-t border-neutral-200">
          <Button
            variant="secondary"
            onClick={onClose}
            className="min-w-[100px]"
          >
            닫기
          </Button>
        </div>
      </div>
    </Modal>
  );
};
