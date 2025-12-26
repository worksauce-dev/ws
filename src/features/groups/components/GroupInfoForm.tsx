import { WORK_TYPE_KEYWORDS } from "@/features/groups/constants/workTypeKeywords";
import { POSITION_OPTIONS } from "@/features/groups/constants/positionOptions";
import {
  SelectDropdown,
  SearchableSelectDropdown,
} from "@/shared/components/ui/Dropdown";
import { Tooltip } from "@/shared/components/ui/Tooltip";
import { MdCheckCircle } from "react-icons/md";
import { WorkTypeCounter } from "./WorkTypeCounter";
import type { UseGroupFormReturn } from "../types/group.types";
import type { PositionOption } from "../types/group.types";
import type { WorkTypeCode } from "../constants/workTypeKeywords";
import type { TeamComposition } from "@/shared/types/database.types";
import type { TeamDetail } from "@/features/teams/types/team.types";

interface GroupInfoFormProps {
  groupForm: UseGroupFormReturn;
  customPositionList: PositionOption[];
  onPositionChange: (value: string) => void;
  teamComposition: TeamComposition | null;
  onTeamCompositionChange: (composition: TeamComposition | null) => void;
  availableTeams?: TeamDetail[]; // 선택 가능한 팀 목록
  onSelectTeam?: (teamId: string) => void; // 팀 선택 핸들러
}

export const GroupInfoForm = ({
  groupForm,
  customPositionList,
  onPositionChange,
  teamComposition,
  onTeamCompositionChange,
  availableTeams,
  onSelectTeam,
}: GroupInfoFormProps) => {
  // 팀 구성 토글 핸들러
  const handleToggleTeamComposition = () => {
    if (teamComposition === null) {
      // 활성화: 빈 객체로 초기화
      onTeamCompositionChange({});
    } else {
      // 비활성화: null로 설정
      onTeamCompositionChange(null);
    }
  };

  // 팀 구성 카운터 변경 핸들러
  const handleTeamCountChange = (code: WorkTypeCode, newCount: number) => {
    if (teamComposition === null) return;

    if (newCount === 0) {
      // 0이면 해당 키 제거
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [code]: _, ...rest } = teamComposition;
      onTeamCompositionChange(rest);
    } else {
      // 값 업데이트
      onTeamCompositionChange({
        ...teamComposition,
        [code]: newCount,
      });
    }
  };

  return (
    <div className="xl:col-span-2 space-y-8">
      {/* 기본 정보 섹션 */}
      <div className="bg-white rounded-xl p-6 border border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-800 mb-6">
          기본 정보
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              그룹명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={groupForm.formData.name}
              onChange={e =>
                groupForm.handleInputChange("name", e.target.value)
              }
              placeholder="예: 2024년 3월 신입 개발자 채용"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              설명
            </label>
            <textarea
              rows={4}
              value={groupForm.formData.description}
              onChange={e =>
                groupForm.handleInputChange("description", e.target.value)
              }
              placeholder="채용 그룹에 대한 간단한 설명을 입력해주세요"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm resize-none"
            />
          </div>
        </div>
      </div>

      {/* 모집 정보 섹션 */}
      <div className="bg-white rounded-xl p-6 border border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-800 mb-6">
          모집 정보
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                모집 포지션 <span className="text-red-500">*</span>
              </label>
              <SearchableSelectDropdown
                value={groupForm.formData.position}
                placeholder="포지션을 선택해주세요"
                maxHeight="max-h-64"
                options={[
                  ...customPositionList,
                  ...POSITION_OPTIONS,
                  {
                    value: "__custom__",
                    label: "+ 직접 추가하기",
                  },
                ]}
                onChange={onPositionChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                경력 수준
              </label>
              <SelectDropdown
                value={groupForm.formData.experienceLevel}
                placeholder="경력 수준을 선택해주세요"
                options={[
                  { value: "entry", label: "신입 (0-1년)" },
                  { value: "junior", label: "주니어 (1-3년)" },
                  { value: "mid", label: "중급 (3-5년)" },
                  { value: "senior", label: "시니어 (5년 이상)" },
                  { value: "lead", label: "리드/매니저급" },
                  { value: "any", label: "경력 무관" },
                ]}
                onChange={value =>
                  groupForm.handleInputChange("experienceLevel", value)
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              선호하는 유형 키워드
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {WORK_TYPE_KEYWORDS.map(type => {
                const isSelected =
                  groupForm.formData.preferredWorkTypes.includes(type.code);
                return (
                  <Tooltip
                    key={type.code}
                    content={type.description}
                    placement="top"
                  >
                    <div
                      onClick={() =>
                        groupForm.handleWorkTypeChange(type.code, !isSelected)
                      }
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-primary-500 bg-primary-50"
                          : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                      }`}
                    >
                      {/* 체크 아이콘 */}
                      {isSelected && (
                        <MdCheckCircle className="absolute top-3 right-3 w-5 h-5 text-primary-500" />
                      )}

                      <div className="flex flex-col pr-6">
                        <span
                          className={`text-sm font-medium ${
                            isSelected ? "text-primary-700" : "text-neutral-800"
                          }`}
                        >
                          {type.type}
                        </span>
                        <span
                          className={`text-xs mt-0.5 ${
                            isSelected ? "text-primary-600" : "text-neutral-500"
                          }`}
                        >
                          {type.keywords.join(" • ")}
                        </span>
                      </div>
                    </div>
                  </Tooltip>
                );
              })}
            </div>
            <p className="text-xs text-neutral-500 mt-3">
              *선택하지 않으면 모든 유형을 대상으로 합니다.
            </p>
          </div>

          {/* 현재 팀 구성 (선택 사항) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-neutral-700">
                현재 팀 구성
              </label>
              <button
                type="button"
                onClick={handleToggleTeamComposition}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                  teamComposition !== null
                    ? "bg-primary-100 text-primary-700 hover:bg-primary-200"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {teamComposition !== null ? "입력 중" : "입력하기"}
              </button>
            </div>

            {/* 기존 팀에서 가져오기 (팀이 있는 경우에만 표시) */}
            {availableTeams && availableTeams.length > 0 && teamComposition !== null && (
              <div className="mb-4 p-3 bg-info-50 border border-info-200 rounded-lg">
                <p className="text-xs font-medium text-info-800 mb-2">
                  💡 기존 팀에서 가져오기
                </p>
                <select
                  onChange={e => {
                    const teamId = e.target.value;
                    if (teamId && onSelectTeam) {
                      onSelectTeam(teamId);
                    }
                  }}
                  className="w-full px-3 py-2 text-sm border border-info-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white"
                  defaultValue=""
                >
                  <option value="">팀을 선택하세요</option>
                  {availableTeams
                    .filter(team => team.team_composition && team.completed_tests > 0)
                    .map(team => (
                      <option key={team.id} value={team.id}>
                        {team.name} ({team.completed_tests}/{team.total_members} 완료)
                      </option>
                    ))}
                </select>
                <p className="text-xs text-info-600 mt-2">
                  기존 팀의 구성 데이터를 자동으로 가져올 수 있습니다
                </p>
              </div>
            )}

            {teamComposition !== null && (
              <div className="space-y-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <p className="text-xs text-neutral-600 mb-2">
                  각 유형별로 현재 팀원 수를 입력해주세요
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {WORK_TYPE_KEYWORDS.map(type => (
                    <WorkTypeCounter
                      key={type.code}
                      workTypeName={type.type}
                      code={type.code}
                      count={teamComposition[type.code] || 0}
                      onChange={handleTeamCountChange}
                    />
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-neutral-700">총 팀원 수</span>
                    <span className="font-semibold text-primary">
                      {Object.values(teamComposition).reduce((sum, count) => sum + count, 0)}명
                    </span>
                  </div>
                </div>
              </div>
            )}

            {teamComposition === null && (
              <div className="p-4 bg-neutral-50 rounded-lg border border-dashed border-neutral-300">
                <p className="text-xs text-neutral-500 text-center">
                  선택 사항입니다. 입력하지 않아도 채용 진행에 문제없습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 테스트 설정 섹션 */}
      <div className="bg-white rounded-xl p-6 border border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-800 mb-6">
          테스트 설정
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              마감일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={groupForm.formData.deadline}
              min={new Date().toISOString().split("T")[0]}
              onChange={e =>
                groupForm.handleInputChange("deadline", e.target.value)
              }
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm text-neutral-800"
              required
            />
            {/* 빠른 선택 버튼 */}
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  const date = new Date();
                  date.setDate(date.getDate() + 7);
                  groupForm.handleInputChange(
                    "deadline",
                    date.toISOString().split("T")[0]
                  );
                }}
                className="text-xs px-3 py-1.5 rounded-md bg-neutral-50 text-neutral-600 hover:bg-neutral-100 transition-colors duration-200"
              >
                +7일
              </button>
              <button
                type="button"
                onClick={() => {
                  const date = new Date();
                  date.setDate(date.getDate() + 14);
                  groupForm.handleInputChange(
                    "deadline",
                    date.toISOString().split("T")[0]
                  );
                }}
                className="text-xs px-3 py-1.5 rounded-md bg-neutral-50 text-neutral-600 hover:bg-neutral-100 transition-colors duration-200"
              >
                +14일
              </button>
              <button
                type="button"
                onClick={() => {
                  const date = new Date();
                  date.setDate(date.getDate() + 30);
                  groupForm.handleInputChange(
                    "deadline",
                    date.toISOString().split("T")[0]
                  );
                }}
                className="text-xs px-3 py-1.5 rounded-md bg-neutral-50 text-neutral-600 hover:bg-neutral-100 transition-colors duration-200"
              >
                +30일
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              자동 리마인더
            </label>
            <SelectDropdown
              value={groupForm.formData.autoReminder}
              placeholder="자동 리마인더 기능은 아직 준비중이에요."
              options={[
                { value: "on", label: "활성화 (권장)" },
                { value: "off", label: "비활성화" },
              ]}
              disabled={true}
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            💡 테스트 설정 안내
          </h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• 테스트 기간은 지원자가 테스트를 완료할 수 있는 기간입니다</li>
            <li>
              • 자동 리마인더를 활성화하면 미완료 지원자에게 알림을 보냅니다
            </li>
            <li>• 설정은 그룹 생성 후에도 언제든 변경할 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
