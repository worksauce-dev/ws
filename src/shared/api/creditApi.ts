/**
 * 크레딧 시스템 API 함수
 */

import { supabase } from "@/shared/lib/supabase";
import { InsufficientCreditsError } from "@/shared/errors/CreditErrors";
import type {
  CreditTransaction,
  DeductCreditsRequest,
  RefundCreditsRequest,
  GetCreditsResponse,
} from "@/shared/types/credit.types";

/**
 * 사용자의 현재 크레딧 잔액 조회
 */
export async function getUserCredits(
  userId: string
): Promise<GetCreditsResponse> {
  const { data, error } = await supabase
    .from("user_profile")
    .select("credits, updated_at")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("❌ 크레딧 조회 실패:", error);
    throw new Error(`크레딧 조회에 실패했습니다: ${error.message}`);
  }

  if (!data) {
    throw new Error("사용자 프로필을 찾을 수 없습니다.");
  }

  return {
    user_id: userId,
    balance: data.credits ?? 0,
    last_updated: data.updated_at,
  };
}

/**
 * 사용자의 크레딧 트랜잭션 히스토리 조회
 */
export async function getCreditTransactions(
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
    type?: string;
  }
): Promise<CreditTransaction[]> {
  let query = supabase
    .from("credit_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (options?.type) {
    query = query.eq("type", options.type);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit ?? 10) - 1
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("❌ 트랜잭션 히스토리 조회 실패:", error);
    throw new Error(`트랜잭션 히스토리 조회에 실패했습니다: ${error.message}`);
  }

  return data ?? [];
}

// createCreditTransaction 함수 제거 (RPC 함수로 대체)

/**
 * 크레딧 차감 (AI 분석 등)
 *
 * @throws {Error} 크레딧이 부족하거나 차감 실패 시
 */
export async function deductCredits(
  request: DeductCreditsRequest
): Promise<{ transaction: CreditTransaction; newBalance: number }> {
  try {
    // Supabase RPC 함수 호출
    const { data, error } = await supabase.rpc("deduct_credits", {
      p_user_id: request.user_id,
      p_amount: request.amount,
      p_type: request.type,
      p_reason: request.reason,
      p_metadata: request.metadata ?? null,
    });

    if (error) {
      console.error("❌ 크레딧 차감 RPC 실패:", error);

      // Insufficient credits 에러 처리
      if (error.message.includes("Insufficient credits")) {
        const matches = error.message.match(/Required: (\d+), Available: (\d+)/);
        if (matches) {
          throw new InsufficientCreditsError(
            parseInt(matches[1]),
            parseInt(matches[2])
          );
        }
      }

      throw new Error(`크레딧 차감에 실패했습니다: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error("크레딧 차감 결과를 받지 못했습니다.");
    }

    const result = data[0];

    console.log("✅ 크레딧 차감 완료:", {
      amount: request.amount,
      newBalance: result.new_balance,
      transactionId: result.transaction_id,
    });

    // 트랜잭션 객체 구성 (타입 호환성)
    const transaction: CreditTransaction = {
      id: result.transaction_id,
      user_id: request.user_id,
      amount: -request.amount,
      balance_after: result.new_balance,
      type: request.type,
      reason: request.reason,
      metadata: request.metadata ?? null,
      created_at: new Date().toISOString(),
    };

    return {
      transaction,
      newBalance: result.new_balance,
    };
  } catch (error) {
    console.error("❌ 크레딧 차감 실패:", error);
    throw error;
  }
}

/**
 * 크레딧 환불 (분석 실패 시 등)
 */
export async function refundCredits(
  request: RefundCreditsRequest
): Promise<{ transaction: CreditTransaction; newBalance: number }> {
  try {
    const { data, error } = await supabase.rpc("refund_credits", {
      p_user_id: request.user_id,
      p_amount: request.amount,
      p_reason: request.reason,
      p_metadata: request.metadata ?? null,
    });

    if (error) {
      console.error("❌ 크레딧 환불 RPC 실패:", error);
      throw new Error(`크레딧 환불에 실패했습니다: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error("크레딧 환불 결과를 받지 못했습니다.");
    }

    const result = data[0];

    console.log("✅ 크레딧 환불 완료:", {
      amount: request.amount,
      newBalance: result.new_balance,
      transactionId: result.transaction_id,
    });

    const transaction: CreditTransaction = {
      id: result.transaction_id,
      user_id: request.user_id,
      amount: request.amount,
      balance_after: result.new_balance,
      type: "refund",
      reason: request.reason,
      metadata: request.metadata ?? null,
      created_at: new Date().toISOString(),
    };

    return {
      transaction,
      newBalance: result.new_balance,
    };
  } catch (error) {
    console.error("❌ 크레딧 환불 실패:", error);
    throw error;
  }
}

/**
 * 크레딧 추가 (구매, 관리자 지급 등)
 */
export async function addCredits(request: {
  user_id: string;
  amount: number;
  type: "purchase" | "admin_grant" | "initial";
  reason: string;
  metadata?: Record<string, unknown>;
}): Promise<{ transaction: CreditTransaction; newBalance: number }> {
  try {
    const { data, error } = await supabase.rpc("add_credits", {
      p_user_id: request.user_id,
      p_amount: request.amount,
      p_type: request.type,
      p_reason: request.reason,
      p_metadata: request.metadata ?? null,
    });

    if (error) {
      console.error("❌ 크레딧 추가 RPC 실패:", error);
      throw new Error(`크레딧 추가에 실패했습니다: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error("크레딧 추가 결과를 받지 못했습니다.");
    }

    const result = data[0];

    console.log("✅ 크레딧 추가 완료:", {
      amount: request.amount,
      newBalance: result.new_balance,
      transactionId: result.transaction_id,
    });

    const transaction: CreditTransaction = {
      id: result.transaction_id,
      user_id: request.user_id,
      amount: request.amount,
      balance_after: result.new_balance,
      type: request.type,
      reason: request.reason,
      metadata: request.metadata ?? null,
      created_at: new Date().toISOString(),
    };

    return {
      transaction,
      newBalance: result.new_balance,
    };
  } catch (error) {
    console.error("❌ 크레딧 추가 실패:", error);
    throw error;
  }
}
