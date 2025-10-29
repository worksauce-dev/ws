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

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
  email_verified: boolean;
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

// 타입 헬퍼 (선택사항)
export type Database = {
  public: {
    Tables: {
      groups: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          position: string;
          experience_level: string | null;
          preferred_work_types: string[];
          deadline: string;
          auto_reminder: boolean;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["groups"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["groups"]["Insert"]>;
      };
      applicants: {
        Row: {
          id: string;
          group_id: string;
          name: string;
          email: string;
          test_token: string;
          test_status: string;
          test_result: unknown | null;
          test_url: string | null;
          email_sent_at: string | null;
          email_opened_at: string | null;
          test_started_at: string | null;
          test_submitted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["applicants"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["applicants"]["Insert"]>;
      };
    };
  };
};
