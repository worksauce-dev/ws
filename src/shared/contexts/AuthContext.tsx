import { useEffect, useState, type ReactNode } from "react";
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

  // 프로필 새로고침 (현재 사용하지 않음 - user.user_metadata 사용)
  const refreshProfile = async () => {
    if (!user) return;
    // Skip profile refresh since we're using user.user_metadata
    setUserProfile(null);
  };

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

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
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
            return;
          }
        } catch (error) {
          console.warn("Error verifying user, clearing session:", error);
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setUserProfile(null);
          setLoading(false);
          return;
        }
      }

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Skip profile fetching since we're using user.user_metadata
        setUserProfile(null);
      }

      setLoading(false);
    };

    getInitialSession();

    // 인증 상태 변화 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Skip profile fetching since we're using user.user_metadata
        setUserProfile(null);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
