import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing env.VITE_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing env.VITE_SUPABASE_ANON_KEY");
}

// 간단한 클라이언트 생성 (타입 없이)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// 기본 타입들 (any로 간단하게)
export type UserProfile = {
  id: string;
  email: string;
  name: string;
  credits: number;
  created_at: string;
  updated_at: string;
  last_login_at?: string | null;
  email_verified: boolean;
  is_active: boolean;
};

export type Candidate = {
  id: string;
  user_id: string;
  email: string;
  name: string;
  position_applied: string;
  test_sent_at?: string | null;
  test_completed_at?: string | null;
  status: "pending" | "test_sent" | "completed" | "expired";
  test_token?: string | null;
  expires_at?: string | null;
  created_at: string;
  updated_at: string;
};
