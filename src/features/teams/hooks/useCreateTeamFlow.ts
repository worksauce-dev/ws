/**
 * 팀 생성 전체 플로우 관리 훅
 * 팀 생성 -> 이메일 발송 -> 페이지 이동의 전체 과정을 관리
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/shared/components/ui/useToast";
import { useCreateTeam } from "./useCreateTeam";
import { useSendTestEmails } from "@/features/groups/hooks/useSendTestEmails";
import type { CreateTeamRequest } from "../types/team.types";
import type { CreateGroupStep } from "@/features/groups/components/CreateGroupLoadingModal";

interface FlowState {
  currentStep: CreateGroupStep;
  emailProgress: {
    success: number;
    failed: number;
  };
  error: string;
}

interface UseCreateTeamFlowOptions {
  showRealName?: boolean;
  onComplete?: () => void;
}

export const useCreateTeamFlow = (
  options: UseCreateTeamFlowOptions = {}
) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { sendEmails } = useSendTestEmails();

  const [flowState, setFlowState] = useState<FlowState>({
    currentStep: "creating",
    emailProgress: { success: 0, failed: 0 },
    error: "",
  });

  // 팀 생성 mutation (onSuccess/onError 없이)
  const { mutate: createTeamMutation, isPending: isCreating } = useCreateTeam();

  // options를 구조분해하여 의존성 배열에 개별 값 추가
  const { showRealName = true, onComplete } = options;

  /**
   * 전체 플로우 실행
   */
  const executeFlow = useCallback(
    async (request: CreateTeamRequest) => {
      try {
        // Step 1: 팀 생성
        setFlowState({
          currentStep: "creating",
          emailProgress: { success: 0, failed: 0 },
          error: "",
        });

        const data = await new Promise<{
          team: { id: string };
          members: Array<{
            id: string;
            name: string;
            email: string;
            test_token: string;
          }>;
        }>((resolve, reject) => {
          createTeamMutation(request, {
            onSuccess: resolve,
            onError: reject,
          });
        });

        // Step 2: 이메일 발송
        setFlowState(prev => ({
          ...prev,
          currentStep: "sending",
        }));

        // 팀원 테스트를 위한 더미 deadline (30일 후)
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 30);

        await sendEmails({
          applicants: data.members,
          group: {
            id: data.team.id,
            deadline: deadline.toISOString().split("T")[0],
          },
          showRealName,
          recipientLabel: "팀원", // 팀 생성 시에는 "팀원"으로 표시
          onProgress: progress => {
            setFlowState(prev => ({
              ...prev,
              emailProgress: progress,
            }));
          },
        });

        // Step 3: 완료
        setFlowState(prev => ({
          ...prev,
          currentStep: "complete",
        }));

        // Step 4: 완료 후 처리 (1.5초 후)
        setTimeout(() => {
          if (onComplete) {
            // 커스텀 완료 핸들러가 있으면 실행 (모달 닫기 등)
            onComplete();
          } else {
            // 없으면 페이지 이동 (CreateTeamPage에서 사용)
            navigate("/dashboard/teams");
          }
        }, 1500);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

        setFlowState({
          currentStep: "error",
          emailProgress: { success: 0, failed: 0 },
          error: errorMessage,
        });

        showToast("error", "생성 실패", errorMessage);
      }
    },
    [createTeamMutation, sendEmails, navigate, showToast, showRealName, onComplete]
  );

  /**
   * 플로우 초기화
   */
  const resetFlow = useCallback(() => {
    setFlowState({
      currentStep: "creating",
      emailProgress: { success: 0, failed: 0 },
      error: "",
    });
  }, []);

  return {
    executeFlow,
    resetFlow,
    flowState,
    isCreating,
  };
};
