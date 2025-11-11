export interface Applicant {
  id: string;
  name: string;
  email: string;
  group_id: string;
  test_status: "pending" | "in_progress" | "completed" | "expired";
}
