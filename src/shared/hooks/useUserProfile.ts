import { useQuery } from "@tanstack/react-query";
import { getUserProfile, getUserCredits } from "@/shared/api/userApi";

/**
 * 사용자 프로필 정보를 가져오는 hook
 * @param userId - 사용자 ID
 */
export const useUserProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return getUserProfile(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (cacheTime → gcTime)
  });
};

/**
 * 사용자 크레딧 정보만 가져오는 hook
 * @param userId - 사용자 ID
 */
export const useUserCredits = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["userCredits", userId],
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return getUserCredits(userId);
    },
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1분 (크레딧은 자주 변경될 수 있음)
    gcTime: 5 * 60 * 1000, // 5분
  });
};
