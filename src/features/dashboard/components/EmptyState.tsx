/**
 * 빈 상태 컴포넌트
 */

import { MdPeople } from "react-icons/md";

interface EmptyStateProps {
  onReset: () => void;
}

export const EmptyState = ({ onReset }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <MdPeople className="w-8 h-8 text-neutral-500" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-neutral-800">
        검색 결과가 없습니다
      </h3>
      <p className="text-sm mb-6 text-neutral-600">
        다른 검색어나 필터 조건을 시도해보세요
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center px-4 py-2 rounded-lg font-medium border border-primary text-primary hover:bg-primary-500 hover:text-white transition-colors duration-200"
      >
        필터 초기화
      </button>
    </div>
  );
};
