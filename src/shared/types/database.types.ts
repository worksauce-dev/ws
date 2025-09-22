export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string; // UUID (Supabase auth.users의 id)
          email: string; // 로그인 ID
          name: string; // 사용자 이름 (실명)
          credits: number; // 보유 크레딧 (기본 0)
          created_at: string; // 가입일시
          updated_at: string; // 최종 수정일시
          last_login_at: string | null; // 마지막 로그인 (선택)
          email_verified: boolean; // 이메일 인증 여부
          is_active: boolean; // 계정 활성화 상태
        };
        Insert: {
          id: string; // auth.users의 id와 연결
          email: string;
          name: string;
          credits?: number; // 기본값 0
          created_at?: string; // 기본값 NOW()
          updated_at?: string; // 기본값 NOW()
          last_login_at?: string | null;
          email_verified?: boolean; // 기본값 false
          is_active?: boolean; // 기본값 true
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          credits?: number;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
          email_verified?: boolean;
          is_active?: boolean;
        };
      };
      candidates: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          name: string;
          position_applied: string;
          test_sent_at: string | null;
          test_completed_at: string | null;
          status: "pending" | "test_sent" | "completed" | "expired";
          test_token: string | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          name: string;
          position_applied: string;
          test_sent_at?: string | null;
          test_completed_at?: string | null;
          status?: "pending" | "test_sent" | "completed" | "expired";
          test_token?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          name?: string;
          position_applied?: string;
          test_sent_at?: string | null;
          test_completed_at?: string | null;
          status?: "pending" | "test_sent" | "completed" | "expired";
          test_token?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      test_results: {
        Row: {
          id: string;
          candidate_id: string;
          result_data: any; // JSON 데이터
          analysis_data: any; // JSON 데이터
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          result_data: any;
          analysis_data?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          result_data?: any;
          analysis_data?: any;
          created_at?: string;
        };
      };
      team_members: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          position: string;
          test_result: any; // JSON 데이터
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          position: string;
          test_result: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          position?: string;
          test_result?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      credits_history: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: "purchase" | "usage";
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          type: "purchase" | "usage";
          description: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          type?: "purchase" | "usage";
          description?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      candidate_status: "pending" | "test_sent" | "completed" | "expired";
      credit_type: "purchase" | "usage";
    };
  };
}
