/**
 * 관리자 여부 확인 훅
 *
 * admins 테이블을 조회하여 현재 사용자가 관리자인지 확인합니다.
 * user_metadata.is_admin 대신 서버 관리 테이블을 사용하여 보안 강화.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/shared/lib/supabase";
import { useAuth } from "@/shared/contexts/useAuth";

interface UseIsAdminReturn {
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * 관리자 여부 확인 훅
 *
 * @example
 * ```tsx
 * const { isAdmin, isLoading } = useIsAdmin();
 *
 * if (isLoading) return <Spinner />;
 * if (!isAdmin) return <Navigate to="/dashboard" />;
 *
 * return <AdminPanel />;
 * ```
 */
export const useIsAdmin = (): UseIsAdminReturn => {
  const { user } = useAuth();
  const userId = user?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["isAdmin", userId],
    queryFn: async () => {
      if (!userId) return false;

      const { data, error } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return !!data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5분 캐시
    gcTime: 10 * 60 * 1000, // 10분 가비지 컬렉션
  });

  return {
    isAdmin: data ?? false,
    isLoading: isLoading && !!userId,
    error: error as Error | null,
  };
};
