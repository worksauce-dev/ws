/**
 * 팀 정보 입력 폼 컴포넌트
 * 팀 생성 및 수정에서 공통으로 사용되는 폼
 */

import { Input } from "@/shared/components/ui/Input";

interface TeamFormProps {
  teamName: string;
  teamDescription: string;
  onTeamNameChange: (value: string) => void;
  onTeamDescriptionChange: (value: string) => void;
  showInfoMessage?: boolean;
  infoMessage?: string;
}

export const TeamForm = ({
  teamName,
  teamDescription,
  onTeamNameChange,
  onTeamDescriptionChange,
  showInfoMessage = false,
  infoMessage,
}: TeamFormProps) => {
  return (
    <div className="space-y-4">
      {/* 팀 이름 */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          팀 이름 <span className="text-error">*</span>
        </label>
        <Input
          type="text"
          value={teamName}
          onChange={(e) => onTeamNameChange(e.target.value)}
          placeholder="예: 개발팀, 마케팅팀"
          required
        />
      </div>

      {/* 팀 설명 */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          팀 설명 (선택)
        </label>
        <textarea
          value={teamDescription}
          onChange={(e) => onTeamDescriptionChange(e.target.value)}
          placeholder="팀에 대한 간단한 설명을 입력하세요"
          rows={4}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
      </div>

      {/* 안내 메시지 (선택적) */}
      {showInfoMessage && infoMessage && (
        <div className="p-4 bg-info-50 border border-info-200 rounded-lg">
          <p className="text-sm text-info-700">{infoMessage}</p>
        </div>
      )}
    </div>
  );
};
