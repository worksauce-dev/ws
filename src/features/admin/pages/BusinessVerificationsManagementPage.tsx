import { useState, useMemo } from "react";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { useAuth } from "@/shared/contexts/useAuth";
import { useUserProfile } from "@/shared/hooks/useUserProfile";
import { Navigate, useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdCheckCircle,
  MdCancel,
  MdPending,
  MdChevronLeft,
  MdOpenInNew,
} from "react-icons/md";
import {
  useAllBusinessVerifications,
  useApproveBusinessVerification,
  useRejectBusinessVerification,
} from "../hooks/useBusinessVerifications";
import { getSignedUrl } from "@/features/settings/api/businessApi";
import toast from "react-hot-toast";
import type { BusinessVerification } from "@/features/settings/types/business.types";
import {
  usePageSEO,
  WORKSAUCE_SEO_PRESETS,
} from "@/shared/hooks/usePageSEO";

export const BusinessVerificationsManagementPage = () => {
  usePageSEO(WORKSAUCE_SEO_PRESETS.adminBusinessVerifications);
  const { user } = useAuth();
  const { data: userProfile, isLoading: profileLoading } = useUserProfile(
    user?.id
  );
  const { data: verifications, isLoading } = useAllBusinessVerifications();
  const approveMutation = useApproveBusinessVerification();
  const rejectMutation = useRejectBusinessVerification();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "company">("date");

  // 거부 모달 상태
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedVerification, setSelectedVerification] =
    useState<BusinessVerification | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

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
  const stats = useMemo(() => {
    if (!verifications) {
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      };
    }

    return {
      total: verifications.length,
      pending: verifications.filter(v => v.status === "pending").length,
      approved: verifications.filter(v => v.status === "approved").length,
      rejected: verifications.filter(v => v.status === "rejected").length,
    };
  }, [verifications]);

  const handleApprove = (verification: BusinessVerification) => {
    if (
      confirm(`${verification.company_name}의 기업 인증을 승인하시겠습니까?`)
    ) {
      approveMutation.mutate(verification.id);
    }
  };

  const handleReject = (verification: BusinessVerification) => {
    setSelectedVerification(verification);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = () => {
    if (!selectedVerification || !rejectionReason.trim()) {
      alert("거부 사유를 입력해주세요.");
      return;
    }

    rejectMutation.mutate(
      {
        verificationId: selectedVerification.id,
        reason: rejectionReason,
      },
      {
        onSuccess: () => {
          setRejectModalOpen(false);
          setSelectedVerification(null);
          setRejectionReason("");
        },
      }
    );
  };

  const handleViewDocument = async (filePath: string) => {
    try {
      const { url, error } = await getSignedUrl(filePath, 3600); // 1시간 유효

      if (error || !url) {
        toast.error(error || "파일을 불러올 수 없습니다.");
        return;
      }

      // 새 탭에서 열기
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("View document error:", err);
      toast.error("파일을 불러오는 중 오류가 발생했습니다.");
    }
  };

  const getStatusBadge = (status: BusinessVerification["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
            <MdPending className="w-3 h-3" />
            대기 중
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
            <MdCheckCircle className="w-3 h-3" />
            승인
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
            <MdCancel className="w-3 h-3" />
            거부
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 관리자가 아닌 경우 리다이렉트
  if (!profileLoading && !userProfile?.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  // 로딩 중
  if (profileLoading || isLoading) {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-neutral-200 rounded-lg p-4">
            <p className="text-sm text-neutral-600">총 신청</p>
            <p className="text-2xl font-bold text-neutral-900 mt-1">
              {stats.total}
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700">대기 중</p>
            <p className="text-2xl font-bold text-yellow-900 mt-1">
              {stats.pending}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700">승인</p>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {stats.approved}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">거부</p>
            <p className="text-2xl font-bold text-red-900 mt-1">
              {stats.rejected}
            </p>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="회사명, 이메일, 사업자번호로 검색..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none"
              />
            </div>

            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={e =>
                setStatusFilter(
                  e.target.value as "all" | "pending" | "approved" | "rejected"
                )
              }
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none"
            >
              <option value="all">전체 상태</option>
              <option value="pending">대기 중</option>
              <option value="approved">승인</option>
              <option value="rejected">거부</option>
            </select>

            {/* 정렬 */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as "date" | "company")}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none"
            >
              <option value="date">최신순</option>
              <option value="company">회사명순</option>
            </select>
          </div>

          <div className="mt-3 text-sm text-neutral-600">
            {filteredVerifications.length}개의 신청 표시 중
          </div>
        </div>

        {/* 테이블 */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap">
                    회사명
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap">
                    사업자번호
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap">
                    담당자
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap">
                    상태
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap">
                    신청일
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap">
                    서류
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider whitespace-nowrap">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredVerifications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-neutral-500"
                    >
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredVerifications.map(verification => (
                    <tr
                      key={verification.id}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-900">
                          {verification.company_name}
                        </div>
                        <div className="text-xs text-neutral-500">
                          대표: {verification.ceo_name}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-700">
                        {verification.business_number}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900">
                          {verification.manager_name}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {verification.manager_email}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(verification.status)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-700">
                        {formatDate(verification.created_at)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {verification.business_registration_doc_url && (
                            <button
                              onClick={() =>
                                handleViewDocument(
                                  verification.business_registration_doc_url!
                                )
                              }
                              className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 hover:underline"
                            >
                              <MdOpenInNew className="w-3 h-3" />
                              사업자등록증
                            </button>
                          )}
                          {verification.employment_certificate_url && (
                            <button
                              onClick={() =>
                                handleViewDocument(
                                  verification.employment_certificate_url!
                                )
                              }
                              className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 hover:underline"
                            >
                              <MdOpenInNew className="w-3 h-3" />
                              재직증명서
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {verification.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(verification)}
                              disabled={approveMutation.isPending}
                              className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              승인
                            </button>
                            <button
                              onClick={() => handleReject(verification)}
                              disabled={rejectMutation.isPending}
                              className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              거부
                            </button>
                          </div>
                        ) : verification.status === "rejected" &&
                          verification.rejection_reason ? (
                          <button
                            onClick={() => {
                              alert(
                                `거부 사유:\n${verification.rejection_reason}`
                              );
                            }}
                            className="text-xs text-neutral-600 hover:text-neutral-900 underline"
                          >
                            거부 사유 보기
                          </button>
                        ) : (
                          <span className="text-xs text-neutral-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 거부 모달 */}
      {rejectModalOpen && selectedVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-2">
              기업 인증 거부
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              {selectedVerification.company_name}의 인증을 거부하시겠습니까?
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                거부 사유 *
              </label>
              <textarea
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="거부 사유를 입력해주세요..."
                rows={4}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={rejectMutation.isPending || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {rejectMutation.isPending ? "처리 중..." : "거부"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

