import { supabase } from "@/shared/lib/supabase";
import type { UserProfile } from "@/shared/lib/supabase";

/**
 * user_profile 테이블에서 사용자 프로필 정보 조회
 * @param userId - 사용자 ID
 * @returns UserProfile 또는 null
 */
export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from("user_profile")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Failed to fetch user profile:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

/**
 * 사용자 크레딧 정보만 조회
 * @param userId - 사용자 ID
 * @returns 크레딧 수량 또는 null
 */
export const getUserCredits = async (
  userId: string
): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .from("user_profile")
      .select("credits")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Failed to fetch user credits:", error);
      return null;
    }

    return data?.credits ?? null;
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return null;
  }
};
