/**
 * 알림 벨 아이콘 컴포넌트
 * - 읽지 않은 알림 개수 표시
 * - 클릭 시 알림 드롭다운 표시
 */

import { useState } from "react";
import { MdNotifications } from "react-icons/md";
import { useAuth } from "@/shared/contexts/useAuth";
import { useNotifications } from "@/shared/hooks/useNotifications";
import { NotificationDropdown } from "./NotificationDropdown";

export const NotificationBell = () => {
  const { user } = useAuth();
  const notificationsData = useNotifications(user?.id);
  const { unreadCount } = notificationsData;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors rounded-lg hover:bg-neutral-100"
        aria-label="알림"
        aria-expanded={isOpen}
      >
        <MdNotifications className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          onClose={() => setIsOpen(false)}
          notificationsData={notificationsData}
        />
      )}
    </div>
  );
};
