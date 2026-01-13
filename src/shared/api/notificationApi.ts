/**
 * 알림 관련 API 함수
 */

import { supabase } from "@/shared/lib/supabase";
import type { Notification, NotificationFilters } from "@/shared/types/notification.types";

/**
 * 사용자의 알림 조회
 */
export async function getNotifications(
  filters?: NotificationFilters
): Promise<{
  data: Notification[] | null;
  error: string | null;
}> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: "로그인이 필요합니다." };
    }

    let query = supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // 필터 적용
    if (filters?.is_read !== undefined) {
      query = query.eq("is_read", filters.is_read);
    }

    if (filters?.type) {
      query = query.eq("type", filters.type);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    } else {
      query = query.limit(50); // 기본 50개
    }

    const { data, error } = await query;

    if (error) {
      console.error("Failed to fetch notifications:", error);
      return { data: null, error: "알림을 불러오는데 실패했습니다." };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Error fetching notifications:", err);
    const errorMessage = err instanceof Error ? err.message : "알림 조회 중 오류가 발생했습니다.";
    return { data: null, error: errorMessage };
  }
}

/**
 * 읽지 않은 알림 개수 조회
 */
export async function getUnreadCount(): Promise<{
  count: number;
  error: string | null;
}> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { count: 0, error: "로그인이 필요합니다." };
    }

    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) {
      console.error("Failed to fetch unread count:", error);
      return { count: 0, error: "읽지 않은 알림 개수를 불러오는데 실패했습니다." };
    }

    return { count: count || 0, error: null };
  } catch (err) {
    console.error("Error fetching unread count:", err);
    const errorMessage = err instanceof Error ? err.message : "알림 개수 조회 중 오류가 발생했습니다.";
    return { count: 0, error: errorMessage };
  }
}

/**
 * 알림을 읽음 처리
 */
export async function markAsRead(notificationId: string): Promise<{
  error: string | null;
}> {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) {
      console.error("Failed to mark notification as read:", error);
      return { error: "알림을 읽음 처리하는데 실패했습니다." };
    }

    return { error: null };
  } catch (err) {
    console.error("Error marking notification as read:", err);
    const errorMessage = err instanceof Error ? err.message : "알림 읽음 처리 중 오류가 발생했습니다.";
    return { error: errorMessage };
  }
}

/**
 * 모든 알림 읽음 처리
 */
export async function markAllAsRead(): Promise<{
  error: string | null;
}> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "로그인이 필요합니다." };
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) {
      console.error("Failed to mark all notifications as read:", error);
      return { error: "모든 알림을 읽음 처리하는데 실패했습니다." };
    }

    return { error: null };
  } catch (err) {
    console.error("Error marking all notifications as read:", err);
    const errorMessage = err instanceof Error ? err.message : "알림 읽음 처리 중 오류가 발생했습니다.";
    return { error: errorMessage };
  }
}

/**
 * 알림 삭제
 */
export async function deleteNotification(notificationId: string): Promise<{
  error: string | null;
}> {
  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      console.error("Failed to delete notification:", error);
      return { error: "알림을 삭제하는데 실패했습니다." };
    }

    return { error: null };
  } catch (err) {
    console.error("Error deleting notification:", err);
    const errorMessage = err instanceof Error ? err.message : "알림 삭제 중 오류가 발생했습니다.";
    return { error: errorMessage };
  }
}
