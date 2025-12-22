/**
 * 알림 타입 정의
 */

export type NotificationType =
  | "test_completed"
  | "test_started"
  | "group_created"
  | "test_expired";

export interface NotificationData {
  applicant_id?: string;
  applicant_name?: string;
  group_id?: string;
  group_name?: string;
  [key: string]: any;
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
