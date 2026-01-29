/**
 * 팀 생성 페이지
 * 기존 팀원들의 소스테스트 결과를 수집하기 위한 팀 생성
 */

import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { useUser } from "@/shared/hooks/useUser";
import { useCreateTeamFlow } from "../hooks/useCreateTeamFlow";
import { useToast } from "@/shared/components/ui/useToast";
import { useApplicantManager } from "@/features/groups/hooks/useApplicantManager";
import { useFileUpload } from "@/features/groups/hooks/useFileUpload";
import { ApplicantManager } from "@/features/groups/components/ApplicantManager";
import { CreateGroupLoadingModal } from "@/features/groups/components/CreateGroupLoadingModal";
import type { CreateTeamRequest } from "../types/team.types";
import {
  useMetadata,
  WORKSAUCE_METADATA_PRESETS,
} from "@/shared/hooks/useMetadata";

export const CreateTeamPage = () => {
  useMetadata(WORKSAUCE_METADATA_PRESETS.createTeam);
  const navigate = useNavigate();
  const { userId, isAuthenticated } = useUser();
  const { showToast } = useToast();

  // 폼 상태
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [showRealName] = useState(true);

  // 멤버 관리 (ApplicantManager 재사용)
  const applicantManager = useApplicantManager();
  const fileUpload = useFileUpload(applicantManager.applicants);

  // 팀 생성 플로우
  const { executeFlow, flowState, isCreating } = useCreateTeamFlow({
    showRealName,
  });

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleBackClick = () => {
    navigate("/dashboard/teams");
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검증
    if (!teamName.trim()) {
      showToast("error", "입력 오류", "팀 이름을 입력해주세요.");
      return;
    }

    if (applicantManager.applicants.length === 0) {
      showToast("error", "입력 오류", "최소 1명 이상의 팀원을 추가해주세요.");
      return;
    }

    const request: CreateTeamRequest = {
      user_id: userId!,
      name: teamName,
      description: teamDescription,
      members: applicantManager.applicants.map(a => ({
        name: a.name,
        email: a.email,
      })),
    };

    executeFlow(request);
  };

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "대시보드", href: "/dashboard" },
        { label: "팀 관리", href: "/dashboard/teams" },
        { label: "새 팀 생성" },
      ]}
    >
      <div className="max-w-7xl mx-auto">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* 팀 정보 폼 */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                  팀 정보
                </h2>

                {/* 팀 이름 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    팀 이름 <span className="text-error">*</span>
                  </label>
                  <Input
                    type="text"
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    placeholder="예: 개발팀, 마케팅팀"
                    required
                  />
                </div>

                {/* 팀 설명 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    팀 설명 (선택)
                  </label>
                  <textarea
                    value={teamDescription}
                    onChange={e => setTeamDescription(e.target.value)}
                    placeholder="팀에 대한 간단한 설명을 입력하세요"
                    rows={4}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                {/* 안내 메시지 */}
                <div className="mt-6 p-4 bg-info-50 border border-info-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-info-800 mb-2">
                    💡 팀 평가란?
                  </h3>
                  <p className="text-sm text-info-700">
                    현재 팀원들의 직무 실행 유형을 파악하여, 신규 채용 시 팀
                    밸런스를 고려한 의사결정을 할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 팀원 관리 */}
            <ApplicantManager
              applicantManager={applicantManager}
              fileUpload={fileUpload}
            />
          </div>

          {/* 제출 버튼 */}
          <div className="mt-8 flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleBackClick}
              disabled={isCreating}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isCreating}
              isLoading={isCreating}
            >
              {isCreating ? "생성 중..." : "팀 생성하기"}
            </Button>
          </div>
        </form>

        {/* 팀 생성 진행 상황 모달 */}
        <CreateGroupLoadingModal
          isOpen={
            isCreating ||
            flowState.currentStep === "sending" ||
            flowState.currentStep === "complete"
          }
          currentStep={flowState.currentStep}
          applicantCount={applicantManager.applicants.length}
          successCount={flowState.emailProgress.success}
          failedCount={flowState.emailProgress.failed}
          errorMessage={flowState.error}
        />
      </div>
    </DashboardLayout>
  );
};
