/**
 * 알림 드롭다운 컴포넌트
 * - 알림 목록 표시
 * - 읽음/안읽음 처리
 * - 알림 클릭 시 해당 페이지로 이동
 */

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  MdCheckCircle,
  MdClose,
  MdDoneAll,
  MdNotifications,
} from "react-icons/md";
import { useAuth } from "@/shared/contexts/useAuth";
import type { Notification } from "@/shared/types/notification.types";

interface NotificationDropdownProps {
  onClose: () => void;
  notificationsData: ReturnType<typeof import("@/shared/hooks/useNotifications").useNotifications>;
}

export const NotificationDropdown = ({
  onClose,
  notificationsData,
}: NotificationDropdownProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    isMarkingAllAsRead,
  } = notificationsData;

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // 알림 클릭 핸들러
  const handleNotificationClick = (notification: Notification) => {
    // 읽지 않은 알림이면 읽음 처리
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // 알림 타입에 따라 해당 페이지로 이동
    if (notification.type === "test_completed") {
      const { group_id, applicant_id } = notification.data || {};

      if (group_id && applicant_id) {
        // 지원자 상세 페이지로 이동
        navigate(`/dashboard/groups/${group_id}/applicants/${applicant_id}`);
        onClose();
      } else if (group_id) {
        // applicant_id가 없으면 그룹 페이지로 이동
        navigate(`/dashboard/groups/${group_id}`);
        onClose();
      }
    }
  };

  // 시간 포맷팅
  const formatTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: ko,
    });
  };

  // 알림 아이콘
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "test_completed":
        return <MdCheckCircle className="w-5 h-5 text-success-600" />;
      default:
        return <MdNotifications className="w-5 h-5 text-primary-600" />;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-neutral-200 z-50 max-h-[600px] flex flex-col"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <h3 className="text-lg font-bold text-neutral-900">알림</h3>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={() => markAllAsRead()}
              disabled={isMarkingAllAsRead}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 disabled:opacity-50"
              title="모두 읽음"
            >
              <MdDoneAll className="w-4 h-4" />
              모두 읽음
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded transition-colors"
            aria-label="닫기"
          >
            <MdClose className="w-5 h-5 text-neutral-600" />
          </button>
        </div>
      </div>

      {/* 알림 목록 */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="spinner h-6 w-6 text-primary-500" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-neutral-500">
            <MdNotifications className="w-12 h-12 mb-2 text-neutral-300" />
            <p className="text-sm">새로운 알림이 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full p-4 text-left hover:bg-neutral-50 transition-colors ${
                  !notification.is_read ? "bg-primary-50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-sm font-semibold ${
                          !notification.is_read
                            ? "text-neutral-900"
                            : "text-neutral-700"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      {!notification.is_read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-neutral-500 mt-2">
                      {formatTime(notification.created_at)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 푸터 (모든 알림 보기 링크 - 선택사항) */}
      {notifications.length > 0 && (
        <div className="border-t border-neutral-200 p-3">
          <button
            onClick={() => {
              navigate("/dashboard/notifications");
              onClose();
            }}
            className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium text-center"
          >
            모든 알림 보기
          </button>
        </div>
      )}
    </div>
  );
};
