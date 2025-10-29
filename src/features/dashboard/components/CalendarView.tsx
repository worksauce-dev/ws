import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { clsx } from "clsx";
import type { Group } from "@/features/groups/types/group.types";
import { useCalendar } from "../hooks/useCalendar";
import { useGroupsByDate } from "../hooks/useGroupsByDate";
import { useDdayCalculator } from "../hooks/useDdayCalculator";
import { getStatusColor } from "../utils/calendarHelpers";

interface CalendarViewProps {
  groups: Group[];
  onGroupClick: (groupId: string) => void;
}

export const CalendarView = ({ groups, onGroupClick }: CalendarViewProps) => {
  // 커스텀 훅으로 로직 분리
  const {
    calendarDays,
    monthYearText,
    isToday,
    isCurrentMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
  } = useCalendar();

  const { getGroupsForDate } = useGroupsByDate(groups);
  const { calculateDday, getDdayColor } = useDdayCalculator();

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      {/* 캘린더 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-neutral-800">{monthYearText}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-primary-500 border border-primary-500 rounded-lg hover:bg-primary-50 transition-colors duration-200"
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
                isTodayDay && "ring-2 ring-primary-500 ring-opacity-50"
              )}
            >
              {/* 날짜 */}
              <div
                className={clsx(
                  "text-sm font-medium mb-2",
                  isCurrentMonthDay ? "text-neutral-800" : "text-neutral-400",
                  isTodayDay &&
                    "w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center"
                )}
              >
                {date.getDate()}
              </div>

              {/* 그룹 배지 */}
              <div className="space-y-1">
                {dayGroups.slice(0, 3).map(group => {
                  const applicantCount = group.applicants?.length || 0;
                  const completedCount =
                    group.applicants?.filter(a => a.test_status === "completed")
                      .length || 0;

                  return (
                    <button
                      key={group.id}
                      onClick={() => onGroupClick(group.id)}
                      className={clsx(
                        "w-full text-left px-2 py-1.5 rounded text-xs border cursor-pointer hover:opacity-80 transition-opacity duration-200",
                        getStatusColor(group.status),
                        "text-white"
                      )}
                      title={`${group.name}\n${calculateDday(group.deadline)}\n지원자: ${applicantCount}명 (완료: ${completedCount}명)`}
                    >
                      <div className="space-y-1">
                        {/* 그룹명과 지원자 수 */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="truncate flex-1">{group.name}</span>
                          <span className="text-[10px] opacity-90 shrink-0">
                            {applicantCount}명
                          </span>
                        </div>
                        {/* D-day 배지 */}
                        <span
                          className={clsx(
                            "inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white",
                            getDdayColor(group.deadline, group.status)
                          )}
                        >
                          {calculateDday(group.deadline)}
                        </span>
                      </div>
                    </button>
                  );
                })}
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
