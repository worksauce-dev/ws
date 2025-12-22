/**
 * 알림 관리 및 Realtime 구독 훅
 */

import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/shared/lib/supabase";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "@/shared/api/notificationApi";
import toast from "react-hot-toast";
import type { Notification } from "@/shared/types/notification.types";

/**
 * 알림 관리 훅
 * - 알림 목록 조회
 * - 읽지 않은 알림 개수 조회
 * - Realtime 구독으로 실시간 알림 수신
 */
export const useNotifications = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  // 알림 목록 조회
  const {
    data: notifications = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      const { data, error } = await getNotifications({ limit: 50 });
      if (error) throw new Error(error);
      return data || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60, // 1분
    gcTime: 1000 * 60 * 10, // 10분
  });

  // 읽지 않은 알림 개수
  const { data: unreadCount = 0, refetch: refetchUnreadCount } = useQuery({
    queryKey: ["notifications", "unread", userId],
    queryFn: async () => {
      const { count, error } = await getUnreadCount();
      if (error) throw new Error(error);
      return count;
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // 30초
    gcTime: 1000 * 60 * 5, // 5분
  });

  // 알림 읽음 처리 mutation
  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread", userId],
      });
    },
  });

  // 모든 알림 읽음 처리 mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread", userId],
      });
      toast.success("모든 알림을 읽음 처리했습니다.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "알림 읽음 처리에 실패했습니다.");
    },
  });

  // Realtime 구독
  useEffect(() => {
    if (!userId) return;

    const isDev = import.meta.env.VITE_ENV === "Dev";

    if (isDev) {
      console.log("🔔 Setting up notification subscription for user:", userId);
    }

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;

          console.log("🔔 New notification received:", newNotification);

          // 토스트 알림 표시
          toast.success(newNotification.title, {
            description: newNotification.message,
            duration: 5000,
          });

          // React Query 캐시 무효화 (최신 데이터 다시 조회)
          queryClient.invalidateQueries({
            queryKey: ["notifications", userId],
          });
          queryClient.invalidateQueries({
            queryKey: ["notifications", "unread", userId],
          });
        }
      )
      .subscribe();

    return () => {
      if (isDev) {
        console.log("🔔 Cleaning up notification subscription");
      }
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return {
    notifications,
    unreadCount,
    isLoading,
    refetch,
    refetchUnreadCount,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
  };
};
