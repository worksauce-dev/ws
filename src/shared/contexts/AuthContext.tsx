import { useEffect, useState, useCallback, type ReactNode } from "react";
import { type User, type Session } from "@supabase/supabase-js";
import { supabase, type UserProfile } from "@/shared/lib/supabase";
import type { SignupFormData } from "@/features/auth/types/auth.types";
import { AuthContext } from "./useAuth";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // 사용자 프로필 조회
  // const fetchUserProfile = async (
  //   userId: string
  // ): Promise<UserProfile | null> => {
  //   try {
  //     const { data, error } = await supabase
  //       .from("user_profile")
  //       .select("*")
  //       .eq("id", userId)
  //       .single();

  //     if (error) {
  //       console.warn("❌ User profile fetch error:", {
  //         message: error.message,
  //         details: error.details,
  //         hint: error.hint,
  //         code: error.code,
  //       });
  //       return null;
  //     }

  //     return data as UserProfile;
  //   } catch (error) {
  //     console.warn("❌ Exception fetching user profile:", error);
  //     return null;
  //   }
  // };

  // 사용자 프로필 조회 (기업 인증 정보 포함)
  // useCallback으로 메모이제이션하여 무한 루프 방지
  const fetchUserProfile = useCallback(
    async (userId: string): Promise<UserProfile | null> => {
      try {
        const { data, error } = await supabase
          .from("user_profile")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.warn("❌ User profile fetch error:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          });
          return null;
        }

        return data as UserProfile;
      } catch (error) {
        console.warn("❌ Exception fetching user profile:", error);
        return null;
      }
    },
    []
  );

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const profile = await fetchUserProfile(user.id);
    setUserProfile(profile);
  }, [user, fetchUserProfile]);

  const signUp = async (formData: SignupFormData) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name, // raw_user_meta_data 로 들어감
            agreedToTerms: formData.agreedToTerms,
            agreedToPrivacy: formData.agreedToPrivacy,
          },
        },
      });

      if (error) {
        console.error("회원가입 실패:", error.message);
        return { error: error as Error };
      }

      return { error: null };
    } catch (err) {
      console.error("알 수 없는 오류:", err);
      return { error: err as Error };
    }
  };

  // 로그인
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      // 로그인 성공 시 즉시 세션과 사용자 정보 업데이트
      if (data.session && data.user) {
        setSession(data.session);
        setUser(data.user);

        // 사용자 프로필 조회
        const profile = await fetchUserProfile(data.user.id);
        setUserProfile(profile);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (!error) {
        setUser(null);
        setUserProfile(null);
        setSession(null);
      }

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // 강제 로그아웃 (개발/디버깅용)
  const forceSignOut = async () => {
    try {
      // 로컬 스토리지 정리
      localStorage.clear();
      sessionStorage.clear();

      // Supabase 세션 정리
      await supabase.auth.signOut();

      // 상태 초기화
      setUser(null);
      setUserProfile(null);
      setSession(null);

      console.log("Force sign out completed");
      return { error: null };
    } catch (error) {
      console.error("Force sign out error:", error);
      return { error: error as Error };
    }
  };

  // 회원 탈퇴 (개발/디버깅용)
  const deleteAccount = async () => {
    try {
      if (!user) {
        return { error: new Error("No user logged in") };
      }

      // Supabase에서 현재 로그인된 사용자 삭제
      const { error } = await supabase.rpc("delete_user");

      if (error) {
        console.error("Account deletion error:", error);
        return { error };
      }

      // 로컬 스토리지 및 세션 정리
      localStorage.clear();
      sessionStorage.clear();

      // Supabase 세션 정리
      await supabase.auth.signOut();

      // 상태 초기화
      setUser(null);
      setUserProfile(null);
      setSession(null);

      console.log("Account deleted successfully");
      return { error: null };
    } catch (error) {
      console.error("Account deletion error:", error);
      return { error: error as Error };
    }
  };

  useEffect(() => {
    // 초기 세션 가져오기
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Debug: 삭제된 사용자 감지 및 정리
      if (session?.user) {
        try {
          // 사용자가 실제로 존재하는지 확인
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();

          if (error || !user) {
            console.warn(
              "User no longer exists, clearing session:",
              error?.message
            );
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setUserProfile(null);
            setLoading(false);
            setInitialLoadComplete(true);
            return;
          }
        } catch (error) {
          console.warn("Error verifying user, clearing session:", error);
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setUserProfile(null);
          setLoading(false);
          setInitialLoadComplete(true);
          return;
        }
      }

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUserProfile(profile);
      }

      setLoading(false);
      setInitialLoadComplete(true);
    };

    getInitialSession();

    // 인증 상태 변화 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (import.meta.env.VITE_ENV === "Dev") {
        console.log("Auth state changed:", event, "Session exists:", !!session);
      }

      // TOKEN_REFRESHED 이벤트는 세션만 업데이트하고 프로필은 다시 조회하지 않음
      if (event === "TOKEN_REFRESHED") {
        if (session?.user) {
          setSession(session);
          setUser(session.user);
        }
        return;
      }

      // INITIAL_SESSION 이벤트는 무시 (getInitialSession에서 이미 처리됨)
      if (event === "INITIAL_SESSION") {
        return;
      }

      // 초기 로드가 완료되지 않은 상태에서 발생하는 SIGNED_IN 이벤트는 무시
      if (event === "SIGNED_IN" && !initialLoadComplete) {
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // user_profile 테이블 변경사항 실시간 구독
  useEffect(() => {
    if (!user?.id) return;

    const isDev = import.meta.env.VITE_ENV === "Dev";

    if (isDev) {
      console.log("👤 Setting up user_profile realtime subscription for:", user.id);
    }

    const channel = supabase
      .channel(`user-profile-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_profile",
          filter: `id=eq.${user.id}`,
        },
        async (payload) => {
          if (isDev) {
            console.log("👤 User profile updated:", payload.new);
          }

          // 프로필 변경 시 자동으로 최신 정보 가져오기
          const updatedProfile = await fetchUserProfile(user.id);
          setUserProfile(updatedProfile);
        }
      )
      .subscribe();

    return () => {
      if (isDev) {
        console.log("👤 Cleaning up user_profile subscription");
      }
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const value = {
    user,
    userProfile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    forceSignOut,
    deleteAccount,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
