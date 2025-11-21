import type { WorkTypeCode } from "@/features/groups/constants/workTypeKeywords";

export type TestStatus = "pending" | "in_progress" | "completed" | "expired";

export interface Applicant {
  id: string;
  group_id: string;
  name: string;
  email: string;
  test_status: TestStatus;
  test_result: any | null; // 차후 수정
  email_opened_at: string | null;
  test_submitted_at: string | null;
  created_at: string;
  updated_at: string;
  is_starred: boolean;
}

export interface Group {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  position: string;
  experience_level: string | null;
  preferred_work_types: WorkTypeCode[];
  deadline: string;
  auto_reminder: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}
