/**
 * 그룹 생성 전체 플로우 관리 훅
 * 그룹 생성 -> 이메일 발송 -> 페이지 이동의 전체 과정을 관리
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/shared/components/ui/useToast";
import { useCreateGroup } from "./useCreateGroup";
import { useSendTestEmails } from "./useSendTestEmails";
import { deleteGroup } from "../api/groupApi";
import type { CreateGroupRequest } from "../types/group.types";
import type { CreateGroupStep } from "../components/CreateGroupLoadingModal";

interface FlowState {
  currentStep: CreateGroupStep;
  emailProgress: {
    success: number;
    failed: number;
  };
  error: string;
  createdGroupId?: string; // 생성된 그룹 ID 저장
  createdApplicants?: Array<{
    id: string;
    name: string;
    email: string;
    test_token: string;
  }>; // 생성된 지원자 목록 저장
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
    createdGroupId: undefined,
    createdApplicants: undefined,
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

        const emailResult = await sendEmails({
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

        // 이메일 전체 실패 체크
        if (emailResult.success === 0 && emailResult.failed > 0) {
          setFlowState({
            currentStep: "email_failed",
            emailProgress: { success: 0, failed: emailResult.failed },
            error: "모든 이메일 발송에 실패했습니다. Resend 서비스 상태를 확인해주세요.",
            createdGroupId: data.group.id,
            createdApplicants: data.applicants,
          });
          return; // 사용자 선택 대기
        }

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
   * 그룹 페이지로 이동 (이메일 실패 시)
   */
  const handleGoToGroupPage = useCallback(() => {
    if (flowState.createdGroupId) {
      navigate(`/dashboard/groups/${flowState.createdGroupId}`);
    }
  }, [flowState.createdGroupId, navigate]);

  /**
   * 이메일 재발송 시도
   */
  const handleRetryEmail = useCallback(async () => {
    if (!flowState.createdGroupId || !flowState.createdApplicants) {
      return;
    }

    try {
      setFlowState(prev => ({
        ...prev,
        currentStep: "sending",
        emailProgress: { success: 0, failed: 0 },
      }));

      const emailResult = await sendEmails({
        applicants: flowState.createdApplicants,
        group: {
          id: flowState.createdGroupId,
          deadline: flowState.createdApplicants[0]?.test_token || "", // deadline 필요 시 수정
        },
        showRealName: options.showRealName ?? true,
        onProgress: progress => {
          setFlowState(prev => ({
            ...prev,
            emailProgress: progress,
          }));
        },
      });

      if (emailResult.success === 0) {
        // 재시도도 실패
        setFlowState(prev => ({
          ...prev,
          currentStep: "email_failed",
          error: "이메일 재발송에도 실패했습니다.",
        }));
      } else {
        // 성공
        setFlowState(prev => ({
          ...prev,
          currentStep: "complete",
        }));

        setTimeout(() => {
          navigate(`/dashboard/groups/${flowState.createdGroupId}`);
        }, 1500);
      }
    } catch (error) {
      showToast("error", "재발송 실패", "이메일 재발송 중 오류가 발생했습니다.");
      setFlowState(prev => ({
        ...prev,
        currentStep: "email_failed",
      }));
    }
  }, [
    flowState.createdGroupId,
    flowState.createdApplicants,
    sendEmails,
    navigate,
    showToast,
    options.showRealName,
  ]);

  /**
   * 그룹 삭제 (이메일 실패 시)
   */
  const handleDeleteGroup = useCallback(async () => {
    if (!flowState.createdGroupId) {
      return;
    }

    try {
      await deleteGroup(flowState.createdGroupId);
      showToast("success", "그룹 삭제 완료", "그룹이 삭제되었습니다.");
      navigate("/dashboard");
    } catch (error) {
      showToast("error", "삭제 실패", "그룹 삭제 중 오류가 발생했습니다.");
    }
  }, [flowState.createdGroupId, showToast, navigate]);

  /**
   * 플로우 초기화
   */
  const resetFlow = useCallback(() => {
    setFlowState({
      currentStep: "creating",
      emailProgress: { success: 0, failed: 0 },
      error: "",
      createdGroupId: undefined,
      createdApplicants: undefined,
    });
  }, []);

  return {
    executeFlow,
    resetFlow,
    flowState,
    isCreating,
    // 이메일 실패 시 액션 핸들러
    handleGoToGroupPage,
    handleRetryEmail,
    handleDeleteGroup,
  };
};
