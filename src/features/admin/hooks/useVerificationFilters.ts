import { useState, useMemo } from "react";
import type { BusinessVerification } from "@/features/settings/types/business.types";

export type VerificationStatusFilter =
  | "all"
  | "pending"
  | "approved"
  | "rejected";
export type VerificationSortBy = "date" | "company";

interface VerificationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface UseVerificationFiltersReturn {
  // 필터 상태
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: VerificationStatusFilter;
  setStatusFilter: (status: VerificationStatusFilter) => void;
  sortBy: VerificationSortBy;
  setSortBy: (sort: VerificationSortBy) => void;

  // 결과
  filteredVerifications: BusinessVerification[];
  stats: VerificationStats;
}

export const useVerificationFilters = (
  verifications: BusinessVerification[] | undefined
): UseVerificationFiltersReturn => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<VerificationStatusFilter>("all");
  const [sortBy, setSortBy] = useState<VerificationSortBy>("date");

  // 필터링 및 정렬
  const filteredVerifications = useMemo(() => {
    if (!verifications) return [];

    let filtered = [...verifications];

    // 상태 필터
    if (statusFilter !== "all") {
      filtered = filtered.filter(v => v.status === statusFilter);
    }

    // 검색 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        v =>
          v.company_name.toLowerCase().includes(query) ||
          v.manager_email.toLowerCase().includes(query) ||
          v.business_number.includes(query)
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else {
        return a.company_name.localeCompare(b.company_name);
      }
    });

    return filtered;
  }, [verifications, statusFilter, searchQuery, sortBy]);

  // 통계 계산
  const stats = useMemo((): VerificationStats => {
    if (!verifications) {
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }

    return {
      total: verifications.length,
      pending: verifications.filter(v => v.status === "pending").length,
      approved: verifications.filter(v => v.status === "approved").length,
      rejected: verifications.filter(v => v.status === "rejected").length,
    };
  }, [verifications]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    filteredVerifications,
    stats,
  };
};
