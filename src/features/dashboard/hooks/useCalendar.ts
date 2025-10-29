import { useState, useMemo } from "react";

/**
 * 캘린더 날짜 계산 및 네비게이션 관리 훅
 */
export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 현재 월의 첫날과 마지막날
  const firstDayOfMonth = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    [currentDate]
  );

  const lastDayOfMonth = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
    [currentDate]
  );

  // 캘린더 그리드를 위한 시작일 (이전 달의 일부 날짜 포함)
  const startDate = useMemo(() => {
    const date = new Date(firstDayOfMonth);
    date.setDate(date.getDate() - firstDayOfMonth.getDay());
    return date;
  }, [firstDayOfMonth]);

  // 캘린더 그리드를 위한 종료일 (다음 달의 일부 날짜 포함)
  const endDate = useMemo(() => {
    const date = new Date(lastDayOfMonth);
    date.setDate(date.getDate() + (6 - lastDayOfMonth.getDay()));
    return date;
  }, [lastDayOfMonth]);

  // 캘린더에 표시할 날짜 배열 생성
  const calendarDays = useMemo(() => {
    const days = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [startDate, endDate]);

  // 현재 월 표시 형식
  const monthYearText = currentDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });

  // 오늘 날짜인지 확인
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // 현재 월인지 확인
  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth();
  };

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // 오늘로 돌아가기
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return {
    currentDate,
    calendarDays,
    monthYearText,
    isToday,
    isCurrentMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
  };
};
