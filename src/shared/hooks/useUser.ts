/**
 * 통합 사용자 정보 훅
 *
 * user.user_metadata와 userProfile을 통합하여 일관된 인터페이스 제공
 * - 모든 컴포넌트에서 동일한 fallback 로직 사용
 * - 타입 안전성 보장
 * - 단일 진입점으로 유지보수 용이
 */

import { useAuth } from "@/shared/contexts/useAuth";

export interface UseUserReturn {
  // 기본 정보
  userId: string | undefined;
  userName: string;
  userEmail: string;

  // 확장 정보 (user_profile 테이블)
  isAdmin: boolean;
  isBusinessVerified: boolean;
  businessName: string | null;
  credits: number;
  lastLoginAt: string | null;

  // 원본 객체 (필요시 직접 접근)
  user: ReturnType<typeof useAuth>["user"];
  userProfile: ReturnType<typeof useAuth>["userProfile"];

  // 상태
  isLoading: boolean;
  isAuthenticated: boolean;

  // 메서드
  refreshProfile: () => Promise<void>;
}

/**
 * 통합 사용자 정보 훅
 *
 * @example
 * ```tsx
 * const { userName, isAdmin, credits } = useUser();
 *
 * return (
 *   <div>
 *     <h1>안녕하세요, {userName}님</h1>
 *     {isAdmin && <AdminPanel />}
 *     <p>크레딧: {credits}</p>
 *   </div>
 * );
 * ```
 */
export const useUser = (): UseUserReturn => {
  const { user, userProfile, loading, refreshProfile } = useAuth();

  // 기본 정보 - fallback 체인 통일
  const userId = user?.id;
  const userName =
    userProfile?.name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "사용자";
  const userEmail = userProfile?.email || user?.email || "";

  // 확장 정보 - userProfile에서만 조회
  const isAdmin = userProfile?.is_admin || false;
  const isBusinessVerified = userProfile?.business_verified || false;
  const businessName = userProfile?.business_name || null;
  const credits = userProfile?.credits || 0;
  const lastLoginAt = userProfile?.last_login_at || null;

  // 상태
  const isLoading = loading;
  const isAuthenticated = !!user;

  return {
    // 기본 정보
    userId,
    userName,
    userEmail,

    // 확장 정보
    isAdmin,
    isBusinessVerified,
    businessName,
    credits,
    lastLoginAt,

    // 원본 객체
    user,
    userProfile,

    // 상태
    isLoading,
    isAuthenticated,

    // 메서드
    refreshProfile,
  };
};
