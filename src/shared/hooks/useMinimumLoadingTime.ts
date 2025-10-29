/**
 * useMinimumLoadingTime - 범용 최소 로딩 시간 보장 훅
 * 어떤 로딩 상태에도 사용 가능한 유틸리티 훅
 */

import { useState, useEffect } from "react";

/**
 * 최소 로딩 시간을 보장하는 커스텀 훅
 *
 * @param isLoading - 실제 로딩 상태
 * @param minTime - 최소 로딩 시간 (ms), 기본값: 500ms
 * @returns 최소 시간을 보장하는 로딩 상태
 *
 * @example
 * const { isLoading } = useQuery(...);
 * const showLoading = useMinimumLoadingTime(isLoading, 500);
 */

export const useMinimumLoadingTime = (
  isLoading: boolean,
  minTime: number = 500
): boolean => {
  const [showLoading, setShowLoading] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      // 로딩 시작 - 시작 시간 기록
      setShowLoading(true);
      setStartTime(Date.now());
    } else if (startTime !== null) {
      // 로딩 완료 - 최소 시간 체크
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minTime - elapsed);

      const timer = setTimeout(() => {
        setShowLoading(false);
        setStartTime(null);
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [isLoading, minTime, startTime]);

  return showLoading;
};
