/**
 * 페이지네이션 컴포넌트
 */

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };

  const handleNext = () => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  };

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {/* 이전 버튼 */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        이전
      </button>

      {/* 페이지 번호 */}
      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
          // 첫 페이지, 마지막 페이지, 현재 페이지 주변 표시
          const isFirstPage = page === 1;
          const isLastPage = page === totalPages;
          const isNearCurrent = Math.abs(page - currentPage) <= 1;
          const shouldShow = isFirstPage || isLastPage || isNearCurrent;

          // ... 표시 로직
          const shouldShowEllipsisBefore =
            page === currentPage - 2 && currentPage > 3;
          const shouldShowEllipsisAfter =
            page === currentPage + 2 && currentPage < totalPages - 2;

          if (
            !shouldShow &&
            !shouldShowEllipsisBefore &&
            !shouldShowEllipsisAfter
          ) {
            return null;
          }

          if (shouldShowEllipsisBefore || shouldShowEllipsisAfter) {
            return (
              <span
                key={`ellipsis-${page}`}
                className="px-3 py-2 text-neutral-500"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                currentPage === page
                  ? "bg-primary-500 text-white"
                  : "border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        다음
      </button>
    </div>
  );
};
