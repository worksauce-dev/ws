/**
 * 그룹 생성 React Query 훅
 * API 호출, 로딩 상태, 에러 처리를 담당
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupApi } from "../api/groupAPI";
import type {
  CreateGroupRequest,
  CreateGroupResponse,
} from "../types/group.types";

export interface UseCreateGroupOptions {
  onSuccess?: (data: CreateGroupResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * 그룹 생성 훅
 *
 * 사용 예시:
 * ```tsx
 * const { mutate, isPending } = useCreateGroup({
 *   onSuccess: (data) => {
 *     console.log('그룹 생성 성공:', data);
 *   }
 * });
 *
 * mutate(createGroupRequest);
 * ```
 */
export const useCreateGroup = (options?: UseCreateGroupOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateGroupRequest) => groupApi.createGroup(request),

    onSuccess: data => {
      // 그룹 목록 쿼리 무효화 (자동 리페치)
      queryClient.invalidateQueries({ queryKey: ["groups"] });

      // 커스텀 성공 핸들러 실행
      options?.onSuccess?.(data);
    },

    onError: (error: Error) => {
      console.error("그룹 생성 중 오류 발생:", error);

      // 커스텀 에러 핸들러 실행
      options?.onError?.(error);
    },
  });
};

/**
 * 사용 예시:
 *
 * const CreateGroupPage = () => {
 *   const navigate = useNavigate();
 *   const { showToast } = useToast();
 *
 *   const { mutate: createGroup, isPending } = useCreateGroup({
 *     onSuccess: (data) => {
 *       showToast('success', '그룹 생성 완료',
 *         `${data.applicants.length}명의 지원자가 추가되었습니다.`);
 *       navigate(`/dashboard/groups/${data.group.id}`);
 *     },
 *     onError: (error) => {
 *       showToast('error', '생성 실패', error.message);
 *     }
 *   });
 *
 *   const handleSubmit = (formData: GroupFormData, applicants: Applicant[]) => {
 *     const request: CreateGroupRequest = {
 *       name: formData.name,
 *       description: formData.description,
 *       position: formData.position,
 *       experience_level: formData.experienceLevel,
 *       preferred_work_types: formData.preferredWorkTypes,
 *       deadline: formData.deadline,
 *       auto_reminder: formData.autoReminder === 'yes',
 *       applicants: applicants.map(app => ({
 *         name: app.name,
 *         email: app.email,
 *       })),
 *     };
 *
 *     createGroup(request);
 *   };
 * };
 */
