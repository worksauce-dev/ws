export type TestContext = "recruitment" | "team";

export interface Applicant {
  id: string;
  name: string;
  email: string;
  group_id: string;
  test_token: string;
  test_status: "pending" | "in_progress" | "completed" | "expired";
  context?: TestContext; // 테스트 컨텍스트 (채용 vs 팀)
}
