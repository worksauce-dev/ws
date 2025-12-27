/**
 * 팀 상세 정보 드로어 컴포넌트
 * 팀의 상세 정보와 팀원 목록을 우측 슬라이딩 패널로 표시
 */

import { useState } from "react";
import { Drawer } from "@/shared/components/ui/Drawer";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { MdPeople, MdAdd, MdClose, MdEdit, MdDelete } from "react-icons/md";
import { TeamMemberStatusBadge } from "./TeamMemberStatusBadge";
import WORK_TYPE_DATA from "@/features/groups/constants/workTypes";
import { getPrimaryWorkType } from "../utils/workTypeUtils";
import type { TeamDetail } from "../types/team.types";
import type { WorkTypeCode } from "@/features/groups/types/workType.types";

interface TeamDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamDetail | null;
  onEdit?: () => void;
  onDelete?: () => void;
  onRemoveMember?: (memberId: string) => void;
}

export const TeamDetailDrawer = ({
  isOpen,
  onClose,
  team,
  onEdit,
  onDelete,
  onRemoveMember,
}: TeamDetailDrawerProps) => {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");

  if (!team) return null;

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (confirm(`${memberName}님을 팀에서 제거하시겠습니까?`)) {
      onRemoveMember?.(memberId);
    }
  };

  const handleAddMember = () => {
    // TODO: API 호출로 팀원 추가
    console.log("Adding member:", { name: newMemberName, email: newMemberEmail });
    // 폼 초기화
    setNewMemberName("");
    setNewMemberEmail("");
    setIsAddingMember(false);
  };

  const handleCancelAdd = () => {
    setNewMemberName("");
    setNewMemberEmail("");
    setIsAddingMember(false);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={team.name}
      subtitle={team.description || undefined}
      size="xl"
      headerActions={
        <>
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            title="팀 수정"
            aria-label="팀 수정"
          >
            <MdEdit className="w-5 h-5 text-neutral-600" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-error-50 transition-colors"
            title="팀 삭제"
            aria-label="팀 삭제"
          >
            <MdDelete className="w-5 h-5 text-error-600" />
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {/* 팀 구성 차트 */}
        {team.team_composition && team.completed_tests > 0 && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-neutral-800 mb-6 flex items-center gap-3">
              <div className="w-1.5 h-6 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full" />
              팀 직무 유형 분포
            </h3>
            <div className="space-y-5">
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
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <span className="text-primary-700 font-bold text-sm">
                              {code}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-neutral-700 group-hover:text-primary-600 transition-colors">
                            {workType?.name || code}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-neutral-800">
                            {count}명
                          </div>
                          <div className="text-xs text-neutral-500">
                            {Math.round(percentage)}%
                          </div>
                        </div>
                      </div>
                      <div className="relative w-full bg-neutral-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-700 ease-out group-hover:from-primary-600 group-hover:to-primary-700"
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
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-neutral-800 mb-6 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full" />
            팀원 목록
            <span className="ml-auto text-sm font-normal text-neutral-500">
              총 {team.members.length}명
            </span>
          </h3>

          <div className="space-y-4">
            {team.members.length === 0 ? (
              <div className="text-center py-16 bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-200">
                <MdPeople className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-sm text-neutral-500 font-medium">
                  등록된 팀원이 없습니다.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {team.members.map((member) => (
                  <div
                    key={member.id}
                    className="group flex items-center gap-4 p-4 bg-neutral-50 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent rounded-xl border border-neutral-200 hover:border-primary-200 transition-all duration-200"
                  >
                    {/* 아바타 */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {member.name.charAt(0)}
                    </div>

                    {/* 정보 */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-neutral-800 truncate group-hover:text-primary-700 transition-colors">
                        {member.name}
                      </h4>
                      <p className="text-sm text-neutral-600 truncate">
                        {member.email}
                      </p>
                      {(() => {
                        const primaryType = getPrimaryWorkType(member.test_result);
                        return primaryType ? (
                          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-xs font-semibold">
                            {WORK_TYPE_DATA[primaryType]?.name}
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* 상태 배지 */}
                    <div className="flex-shrink-0">
                      <TeamMemberStatusBadge status={member.test_status} />
                    </div>

                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => handleRemoveMember(member.id, member.name)}
                      className="flex-shrink-0 p-2 rounded-lg text-neutral-400 hover:text-error-600 hover:bg-error-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="팀원 제거"
                    >
                      <MdClose className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 팀원 추가 폼 */}
            {isAddingMember ? (
              <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-neutral-800">새 팀원 추가</h4>
                  <button
                    onClick={handleCancelAdd}
                    className="p-1 rounded-lg hover:bg-primary-100 transition-colors"
                    aria-label="취소"
                  >
                    <MdClose className="w-5 h-5 text-neutral-600" />
                  </button>
                </div>
                <div className="space-y-3">
                  <Input
                    label="이름"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="홍길동"
                    required
                  />
                  <Input
                    label="이메일"
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="hong@example.com"
                    required
                  />
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="secondary"
                      onClick={handleCancelAdd}
                      className="flex-1"
                    >
                      취소
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleAddMember}
                      className="flex-1"
                      disabled={!newMemberName.trim() || !newMemberEmail.trim()}
                    >
                      추가
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingMember(true)}
                className="w-full flex items-center justify-center gap-2 p-4 bg-white hover:bg-primary-50 border-2 border-dashed border-neutral-300 hover:border-primary-400 rounded-xl transition-all duration-200 group"
              >
                <MdAdd className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                <span className="text-sm font-medium text-neutral-600 group-hover:text-primary-700 transition-colors">
                  팀원 추가하기
                </span>
              </button>
            )}
          </div>
        </div>

        {/* 액션 버튼 - 고정 하단 */}
        <div className="sticky bottom-0 bg-white pt-6 pb-2 border-t border-neutral-200 -mx-6 px-6">
          <Button
            variant="secondary"
            onClick={onClose}
            className="w-full"
          >
            닫기
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
