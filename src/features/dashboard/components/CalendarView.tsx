import { useState, useMemo } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { clsx } from "clsx";

interface GroupSummary {
  id: string;
  name: string;
  description: string;
  totalCandidates: number;
  completedTests: number;
  recommendedCandidates: number;
  filteredCandidates: number;
  createdAt: string;
  updatedAt: string;
  deadline: string;
  status: "active" | "completed" | "draft";
}

interface CalendarViewProps {
  groups: GroupSummary[];
  onGroupClick: (groupId: string) => void;
}

export const CalendarView = ({ groups, onGroupClick }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 현재 월의 첫날과 마지막날
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // 캘린더 그리드를 위한 시작일 (이전 달의 일부 날짜 포함)
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  // 캘린더 그리드를 위한 종료일 (다음 달의 일부 날짜 포함)
  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));

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

  // 특정 날짜에 해당하는 그룹들 찾기
  const getGroupsForDate = (date: Date) => {
    // 타임존 이슈 방지: 로컬 날짜를 직접 문자열로 변환
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    return groups.filter(group => group.deadline === dateStr);
  };

  // D-day 계산
  const calculateDday = (deadline: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `D+${Math.abs(diffDays)}`;
    if (diffDays === 0) return "D-Day";
    return `D-${diffDays}`;
  };

  // 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-500 border-blue-600";
      case "completed":
        return "bg-green-500 border-green-600";
      case "draft":
        return "bg-gray-400 border-gray-500";
      default:
        return "bg-gray-400 border-gray-500";
    }
  };

  // D-day에 따른 긴급도 색상
  const getDdayColor = (deadline: string, status: string) => {
    if (status === "completed") return "text-green-600";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-gray-400"; // 지난 마감일
    if (diffDays === 0) return "text-red-600 font-bold"; // 오늘 마감
    if (diffDays <= 3) return "text-red-500"; // 3일 이내
    if (diffDays <= 7) return "text-orange-500"; // 7일 이내
    return "text-blue-600"; // 여유있음
  };

  // 이전 달
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // 다음 달
  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // 오늘로 돌아가기
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 현재 월 표시 형식
  const monthYearText = currentDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });

  // 오늘 날짜인지 확인
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // 현재 월인지 확인
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      {/* 캘린더 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-neutral-800">{monthYearText}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary-50 transition-colors duration-200"
          >
            오늘
          </button>
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors duration-200"
          >
            <MdChevronLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors duration-200"
          >
            <MdChevronRight className="w-5 h-5 text-neutral-600" />
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["일", "월", "화", "수", "목", "금", "토"].map(day => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-neutral-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 캘린더 그리드 */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((date, index) => {
          const dayGroups = getGroupsForDate(date);
          const isCurrentMonthDay = isCurrentMonth(date);
          const isTodayDay = isToday(date);

          return (
            <div
              key={index}
              className={clsx(
                "min-h-[120px] p-2 border rounded-lg",
                isCurrentMonthDay
                  ? "bg-white border-neutral-200"
                  : "bg-neutral-50 border-neutral-100",
                isTodayDay && "ring-2 ring-primary ring-opacity-50"
              )}
            >
              {/* 날짜 */}
              <div
                className={clsx(
                  "text-sm font-medium mb-2",
                  isCurrentMonthDay ? "text-neutral-800" : "text-neutral-400",
                  isTodayDay &&
                    "w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center"
                )}
              >
                {date.getDate()}
              </div>

              {/* 그룹 배지 */}
              <div className="space-y-1">
                {dayGroups.slice(0, 3).map(group => (
                  <button
                    key={group.id}
                    onClick={() => onGroupClick(group.id)}
                    className={clsx(
                      "w-full text-left px-2 py-1 rounded text-xs border cursor-pointer hover:opacity-80 transition-opacity duration-200",
                      getStatusColor(group.status),
                      "text-white truncate"
                    )}
                    title={`${group.name} - ${calculateDday(group.deadline)}`}
                  >
                    {group.name}
                  </button>
                ))}
                {dayGroups.length > 3 && (
                  <div className="text-xs text-neutral-500 text-center">
                    +{dayGroups.length - 3}개 더보기
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 border border-blue-600 rounded"></div>
              <span className="text-sm text-neutral-600">진행중</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 border border-green-600 rounded"></div>
              <span className="text-sm text-neutral-600">완료</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 border border-gray-500 rounded"></div>
              <span className="text-sm text-neutral-600">준비중</span>
            </div>
          </div>
          <div className="text-sm text-neutral-500">
            클릭하여 그룹 상세 보기
          </div>
        </div>
      </div>
    </div>
  );
};
