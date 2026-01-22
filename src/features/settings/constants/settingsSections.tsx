import {
  MdPerson,
  // MdNotifications,
  MdBusiness,
} from "react-icons/md";
import type {
  SettingsSection,
  NotificationItem,
} from "../types/settings.types";

/**
 * 설정 섹션 목록
 */
export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: "profile",
    title: "프로필",
    icon: <MdPerson className="w-5 h-5" />,
    description: "개인 정보 및 계정 설정",
  },
  {
    id: "business",
    title: "기업 인증",
    icon: <MdBusiness className="w-5 h-5" />,
    description: "기업 회원 인증 및 혜택",
  },
  // {
  //   id: "notifications",
  //   title: "알림",
  //   icon: <MdNotifications className="w-5 h-5" />,
  //   description: "이메일 및 푸시 알림 설정",
  // },
];

/**
 * 알림 설정 항목
 */
export const NOTIFICATION_ITEMS: NotificationItem[] = [
  {
    title: "이메일 알림",
    description: "새로운 지원자 및 테스트 완료 알림",
  },
  {
    title: "마감일 리마인더",
    description: "그룹 마감일 3일 전 알림",
  },
  {
    title: "주간 리포트",
    description: "매주 월요일 채용 현황 요약",
  },
];
