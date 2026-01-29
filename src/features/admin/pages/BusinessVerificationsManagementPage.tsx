import { useCallback } from "react";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { useUser } from "@/shared/hooks/useUser";
import { Navigate, useNavigate } from "react-router-dom";
import { MdChevronLeft } from "react-icons/md";
import toast from "react-hot-toast";
import {
  useMetadata,
  WORKSAUCE_METADATA_PRESETS,
} from "@/shared/hooks/useMetadata";

// Hooks
import {
  useAllBusinessVerifications,
  useApproveBusinessVerification,
} from "../hooks/useBusinessVerifications";
import { useVerificationFilters } from "../hooks/useVerificationFilters";
import { useRejectModal } from "../hooks/useRejectModal";

// Components
import { VerificationStatsCards } from "../components/VerificationStatsCards";
import { VerificationFilters } from "../components/VerificationFilters";
import { VerificationTable } from "../components/VerificationTable";
import { RejectVerificationModal } from "../components/RejectVerificationModal";

// API
import { getSignedUrl } from "@/features/settings/api/businessApi";

// Types
import type { BusinessVerification } from "@/features/settings/types/business.types";

export const BusinessVerificationsManagementPage = () => {
  useMetadata(WORKSAUCE_METADATA_PRESETS.adminBusinessVerifications);

  const { isAdmin, isLoading: userLoading } = useUser();
  const { data: verifications, isLoading: verificationsLoading } =
    useAllBusinessVerifications();
  const approveMutation = useApproveBusinessVerification();
  const navigate = useNavigate();

  // 필터링 훅
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    filteredVerifications,
    stats,
  } = useVerificationFilters(verifications);

  // 거부 모달 훅
  const rejectModal = useRejectModal();

  // 승인 핸들러
  const handleApprove = useCallback(
    (verification: BusinessVerification) => {
      if (
        confirm(`${verification.company_name}의 기업 인증을 승인하시겠습니까?`)
      ) {
        approveMutation.mutate(verification.id);
      }
    },
    [approveMutation]
  );

  // 문서 보기 핸들러
  const handleViewDocument = useCallback(async (filePath: string) => {
    try {
      const { url, error } = await getSignedUrl(filePath, 3600);

      if (error || !url) {
        toast.error(error || "파일을 불러올 수 없습니다.");
        return;
      }

      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("View document error:", err);
      toast.error("파일을 불러오는 중 오류가 발생했습니다.");
    }
  }, []);

  // 관리자가 아닌 경우 리다이렉트
  if (!userLoading && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // 로딩 중
  if (userLoading || verificationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner h-8 w-8 text-primary-500" />
      </div>
    );
  }

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "대시보드", href: "/dashboard" },
        { label: "관리자", href: "/admin" },
        { label: "기업 인증 관리" },
      ]}
    >
      <div className="space-y-6">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => navigate("/admin")}
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <MdChevronLeft className="w-5 h-5" />
          관리자 대시보드로 돌아가기
        </button>

        {/* 통계 카드 */}
        <VerificationStatsCards stats={stats} />

        {/* 필터 및 검색 */}
        <VerificationFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        {/* 테이블 */}
        <VerificationTable
          verifications={filteredVerifications}
          onApprove={handleApprove}
          onReject={rejectModal.openModal}
          onViewDocument={handleViewDocument}
          isApproving={approveMutation.isPending}
          isRejecting={rejectModal.isPending}
        />
      </div>

      {/* 거부 모달 */}
      <RejectVerificationModal
        isOpen={rejectModal.isOpen}
        onClose={rejectModal.closeModal}
        verification={rejectModal.selectedVerification}
        rejectionReason={rejectModal.rejectionReason}
        onReasonChange={rejectModal.setRejectionReason}
        onConfirm={rejectModal.handleConfirm}
        isPending={rejectModal.isPending}
      />
    </DashboardLayout>
  );
};
