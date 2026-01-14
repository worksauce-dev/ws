import type { TestResult } from "@/shared/types/database.types";

export type TestContext = "recruitment" | "team";

export interface Applicant {
  id: string;
  name: string;
  email: string;
  group_id: string;
  test_token: string;
  test_status: "pending" | "in_progress" | "completed" | "expired";
  test_result?: TestResult | null; // 테스트 결과 (완료된 경우)
  context?: TestContext; // 테스트 컨텍스트 (채용 vs 팀)
}
