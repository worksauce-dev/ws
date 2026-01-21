import { MdSearch } from "react-icons/md";
import { Input } from "@/shared/components/ui/Input";
import { SelectDropdown } from "@/shared/components/ui/Dropdown";
import type {
  VerificationStatusFilter,
  VerificationSortBy,
} from "../hooks/useVerificationFilters";

const STATUS_OPTIONS = [
  { value: "all", label: "전체 상태" },
  { value: "pending", label: "대기 중" },
  { value: "approved", label: "승인" },
  { value: "rejected", label: "거부" },
] as const;

const SORT_OPTIONS = [
  { value: "date", label: "최신순" },
  { value: "company", label: "회사명순" },
] as const;

interface VerificationFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: VerificationStatusFilter;
  onStatusFilterChange: (status: VerificationStatusFilter) => void;
  sortBy: VerificationSortBy;
  onSortByChange: (sort: VerificationSortBy) => void;
}

export const VerificationFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
}: VerificationFiltersProps) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 검색 */}
        <div className="flex-1 relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 z-10" />
          <Input
            type="text"
            placeholder="회사명, 이메일, 사업자번호로 검색..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* 상태 필터 */}
        <div className="sm:w-36">
          <SelectDropdown
            value={statusFilter}
            options={STATUS_OPTIONS}
            onChange={value =>
              onStatusFilterChange(value as VerificationStatusFilter)
            }
          />
        </div>

        {/* 정렬 */}
        <div className="sm:w-32">
          <SelectDropdown
            value={sortBy}
            options={SORT_OPTIONS}
            onChange={value => onSortByChange(value as VerificationSortBy)}
          />
        </div>
      </div>


    </div>
  );
};
