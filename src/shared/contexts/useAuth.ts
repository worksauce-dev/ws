import { createContext, useContext } from "react";
import { type User, type Session } from "@supabase/supabase-js";
import { type UserProfile } from "@/shared/lib/supabase";
import type { SignupFormData } from "@/features/auth/types/auth.types";

// AuthContext 타입 정의
export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (signUpData: SignupFormData) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  forceSignOut: () => Promise<{ error: Error | null }>;
  deleteAccount: () => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

// AuthContext 생성 (단일 소스)
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// useAuth 훅 정의
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
