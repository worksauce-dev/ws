/**
 * 그룹 필터링 및 페이지네이션 관리 훅
 */

import { useState, useMemo } from "react";
import type { Group } from "@/features/groups/types/group.types";
import { ITEMS_PER_PAGE } from "../constants/pagination";

export const useGroupFilters = (groups: Group[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // 필터링된 그룹 목록 계산
  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      const matchesSearch = group.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === "all" || group.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [groups, searchTerm, selectedStatus]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentGroups = filteredGroups.slice(startIndex, endIndex);

  // 검색어 변경 시 1페이지로 리셋
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // 상태 필터 변경 시 1페이지로 리셋
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    // 상태
    searchTerm,
    selectedStatus,
    currentPage,
    // 계산된 값
    filteredGroups,
    currentGroups,
    totalPages,
    // 핸들러
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
  };
};
