import { MdCheckCircle, MdCancel, MdPending, MdStar } from "react-icons/md";
import { type TestStatus } from "@/shared/types/database.types";

/**
 * TestStatus에 따른 아이콘 반환
 */
export const getStatusIcon = (status: TestStatus) => {
  switch (status) {
    case "completed":
      return <MdCheckCircle className="w-4 h-4 text-success" />;
    case "in_progress":
      return <MdStar className="w-4 h-4 text-warning" />;
    case "expired":
      return <MdCancel className="w-4 h-4 text-error" />;
    case "pending":
      return <MdPending className="w-4 h-4 text-neutral-500" />;
    default:
      return <MdPending className="w-4 h-4 text-neutral-500" />;
  }
};

/**
 * TestStatus에 따른 라벨 반환
 */
export const getStatusLabel = (status: TestStatus): string => {
  switch (status) {
    case "completed":
      return "완료";
    case "in_progress":
      return "진행중";
    case "expired":
      return "만료";
    case "pending":
      return "대기중";
    default:
      return "대기중";
  }
};

/**
 * TestStatus에 따른 색상 클래스 반환
 */
export const getStatusColor = (status: TestStatus): string => {
  switch (status) {
    case "completed":
      return "bg-success-50 text-success-700 border-success-200";
    case "in_progress":
      return "bg-warning-50 text-warning-700 border-warning-200";
    case "expired":
      return "bg-error-50 text-error-700 border-error-200";
    case "pending":
      return "bg-neutral-50 text-neutral-700 border-neutral-200";
    default:
      return "bg-neutral-50 text-neutral-700 border-neutral-200";
  }
};
