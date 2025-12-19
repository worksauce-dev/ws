import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getAllBusinessVerifications,
  approveBusinessVerification,
  rejectBusinessVerification,
} from "@/features/settings/api/businessApi";

/**
 * 모든 기업 인증 신청 조회 훅
 */
export const useAllBusinessVerifications = () => {
  return useQuery({
    queryKey: ["admin", "business-verifications"],
    queryFn: async () => {
      const { data, error } = await getAllBusinessVerifications();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 1000 * 60 * 5, // 5분
  });
};

/**
 * 기업 인증 승인 훅
 */
export const useApproveBusinessVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (verificationId: string) => {
      const { data, error } = await approveBusinessVerification(verificationId);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      toast.success("기업 인증을 승인했습니다.");
      queryClient.invalidateQueries({
        queryKey: ["admin", "business-verifications"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "기업 인증 승인에 실패했습니다.");
    },
  });
};

/**
 * 기업 인증 거부 훅
 */
export const useRejectBusinessVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      verificationId,
      reason,
    }: {
      verificationId: string;
      reason: string;
    }) => {
      const { data, error } = await rejectBusinessVerification(
        verificationId,
        reason
      );
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      toast.success("기업 인증을 거부했습니다.");
      queryClient.invalidateQueries({
        queryKey: ["admin", "business-verifications"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "기업 인증 거부에 실패했습니다.");
    },
  });
};
