/**
 * 그룹 생성 전체 플로우 관리 훅
 * 그룹 생성 -> 이메일 발송 -> 페이지 이동의 전체 과정을 관리
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/shared/components/ui/useToast";
import { useCreateGroup } from "./useCreateGroup";
import { useSendTestEmails } from "./useSendTestEmails";
import type { CreateGroupRequest } from "../types/group.types";
import type { CreateGroupStep } from "../components/CreateGroupLoadingModal";

interface FlowState {
  currentStep: CreateGroupStep;
  emailProgress: {
    success: number;
    failed: number;
  };
  error: string;
}

interface UseCreateGroupFlowOptions {
  showRealName?: boolean;
}

export const useCreateGroupFlow = (
  options: UseCreateGroupFlowOptions = {}
) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { sendEmails } = useSendTestEmails();

  const [flowState, setFlowState] = useState<FlowState>({
    currentStep: "creating",
    emailProgress: { success: 0, failed: 0 },
    error: "",
  });

  // 그룹 생성 mutation (onSuccess/onError 없이)
  const { mutate: createGroupMutation, isPending: isCreating } =
    useCreateGroup();

  /**
   * 전체 플로우 실행
   */
  const executeFlow = useCallback(
    async (request: CreateGroupRequest) => {
      try {
        // Step 1: 그룹 생성
        setFlowState({
          currentStep: "creating",
          emailProgress: { success: 0, failed: 0 },
          error: "",
        });

        const data = await new Promise<{
          group: { id: string; deadline: string };
          applicants: Array<{
            id: string;
            name: string;
            email: string;
            test_token: string;
          }>;
        }>((resolve, reject) => {
          createGroupMutation(request, {
            onSuccess: resolve,
            onError: reject,
          });
        });

        // Step 2: 이메일 발송
        setFlowState(prev => ({
          ...prev,
          currentStep: "sending",
        }));

        await sendEmails({
          applicants: data.applicants,
          group: data.group,
          showRealName: options.showRealName ?? true,
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

        // Step 4: 페이지 이동 (1.5초 후)
        setTimeout(() => {
          navigate(`/dashboard/groups/${data.group.id}`);
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
    [createGroupMutation, sendEmails, navigate, showToast, options.showRealName]
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
