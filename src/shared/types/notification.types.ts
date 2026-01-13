/**
 * 알림 타입 정의
 */

export type NotificationType =
  | "test_completed"
  | "test_started"
  | "group_created"
  | "test_expired"
  | "team_member_test_completed" // 팀원 테스트 완료
  | "ai_analysis_complete"; // AI 분석 완료

export interface NotificationData {
  applicant_id?: string;
  applicant_name?: string;
  group_id?: string;
  group_name?: string;
  team_id?: string; // 팀 ID
  team_name?: string; // 팀 이름
  team_member_id?: string; // 팀원 ID
  team_member_name?: string; // 팀원 이름
  [key: string]: string | number | boolean | null | undefined;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
  is_read: boolean;
  created_at: string;
}

export interface NotificationFilters {
  is_read?: boolean;
  type?: NotificationType;
  limit?: number;
}
