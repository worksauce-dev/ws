import type { Group } from "@/shared/types/database.types";

/**
 * 그룹 상태 색상 (deadline 기준)
 */
export const getGroupStatusColor = (
  group: Pick<Group, "status" | "deadline"> | null | undefined
): string => {
  if (!group) return "bg-gray-100 text-gray-800 border-gray-200";

  // draft 상태는 그대로 유지
  if (group.status === "draft") {
    return "bg-gray-100 text-gray-800 border-gray-200";
  }

  // 마감일 기준으로 판단
  const now = new Date();
  const deadline = new Date(group.deadline);

  if (deadline < now) {
    // 마감됨
    return "bg-red-100 text-red-800 border-red-200";
  } else {
    // 진행중
    return "bg-blue-100 text-blue-800 border-blue-200";
  }
};

/**
 * 그룹 상태 텍스트 (deadline 기준)
 */
export const getGroupStatusText = (
  group: Pick<Group, "status" | "deadline"> | null | undefined
): string => {
  if (!group) return "상태 없음";

  // draft 상태는 그대로 유지
  if (group.status === "draft") {
    return "준비중";
  }

  // 마감일 기준으로 판단
  const now = new Date();
  const deadline = new Date(group.deadline);

  if (deadline < now) {
    return "마감";
  } else {
    return "진행중";
  }
};
