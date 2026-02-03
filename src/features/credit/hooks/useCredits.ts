/**
 * 크레딧 관련 React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/shared/contexts/useAuth";
import { creditApi } from "../api/creditApi";
import type { CreditTransactionMetadata } from "../types/credit.types";

const CREDIT_QUERY_KEYS = {
  balance: (userId: string) => ["credits", "balance", userId] as const,
  history: (userId: string) => ["credits", "history", userId] as const,
};

/**
 * 크레딧 잔액 조회 hook
 */
export const useCreditBalance = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: CREDIT_QUERY_KEYS.balance(user?.id || ""),
    queryFn: () => creditApi.getCreditBalance(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

/**
 * 크레딧 사용 내역 조회 hook
 */
export const useCreditHistory = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: CREDIT_QUERY_KEYS.history(user?.id || ""),
    queryFn: () => creditApi.getCreditHistory(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

/**
 * 크레딧 사용 mutation hook
 */
export const useUseCredit = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      amount,
      reason,
      metadata,
    }: {
      amount: number;
      reason: string;
      metadata?: CreditTransactionMetadata;
    }) => creditApi.useCredit(user!.id, amount, reason, metadata),
    onSuccess: () => {
      // 크레딧 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: CREDIT_QUERY_KEYS.balance(user?.id || ""),
      });
      queryClient.invalidateQueries({
        queryKey: CREDIT_QUERY_KEYS.history(user?.id || ""),
      });
    },
  });
};

/**
 * 크레딧 충전 mutation hook
 */
export const useAddCredit = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      amount,
      type,
      reason,
      metadata,
    }: {
      amount: number;
      type: "charge" | "reward";
      reason: string;
      metadata?: CreditTransactionMetadata;
    }) => creditApi.addCredit(user!.id, amount, type, reason, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CREDIT_QUERY_KEYS.balance(user?.id || ""),
      });
      queryClient.invalidateQueries({
        queryKey: CREDIT_QUERY_KEYS.history(user?.id || ""),
      });
    },
  });
};
