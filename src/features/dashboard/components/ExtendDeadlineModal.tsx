/**
 * 마감일 연장 모달 컴포넌트
 */

import { useState } from "react";
import { MdCalendarToday } from "react-icons/md";
import { Modal } from "@/shared/components/ui/Modal";
import { formatKoreanDate } from "@/shared/utils/formatters";

interface ExtendDeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDeadline: string;
  groupName: string;
  onConfirm: (newDeadline: string) => void;
  isLoading?: boolean;
}

export const ExtendDeadlineModal = ({
  isOpen,
  onClose,
  currentDeadline,
  groupName,
  onConfirm,
  isLoading = false,
}: ExtendDeadlineModalProps) => {
  // 현재 마감일을 기본값으로 설정 (ISO 8601 -> YYYY-MM-DD)
  const [newDeadline, setNewDeadline] = useState(
    currentDeadline.split("T")[0]
  );

  const handleSubmit = () => {
    if (newDeadline) {
      onConfirm(newDeadline);
    }
  };

  // 오늘 날짜 (최소 선택 가능 날짜)
  const today = new Date().toISOString().split("T")[0];

  // 날짜가 변경되었는지 확인
  const isChanged = newDeadline !== currentDeadline.split("T")[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="마감일 연장" size="sm">
      <>
        {/* 그룹 이름 */}
        <div className="mb-4">
          <p className="text-sm text-neutral-600 mb-1">채용 그룹</p>
          <p className="font-medium text-neutral-800">{groupName}</p>
        </div>

        {/* 현재 마감일 */}
        <div className="mb-4">
          <p className="text-sm text-neutral-600 mb-1">현재 마감일</p>
          <div className="flex items-center gap-2 text-neutral-800">
            <MdCalendarToday className="w-4 h-4 text-neutral-500" />
            <p>{formatKoreanDate(currentDeadline)}</p>
          </div>
        </div>

        {/* 새 마감일 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            새 마감일 선택
          </label>
          <input
            type="date"
            value={newDeadline}
            onChange={e => setNewDeadline(e.target.value)}
            min={today}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          />
          <p className="text-xs text-neutral-500 mt-1">
            오늘 이후의 날짜를 선택해주세요
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !newDeadline || !isChanged}
            className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "저장 중..." : "저장"}
          </button>
        </div>
      </>
    </Modal>
  );
};
