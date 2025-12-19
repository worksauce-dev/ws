/**
 * 설정 페이지 관련 타입 정의
 */

export type SettingsTab =
  | "profile"
  | "notifications"
  | "security"
  | "preferences"
  | "business";

export interface SettingsSection {
  id: SettingsTab;
  title: string;
  icon: React.ReactNode;
  description: string;
}

export interface NotificationItem {
  title: string;
  description: string;
}
