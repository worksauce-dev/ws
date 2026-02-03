/**
 * 크레딧 관리 페이지
 * 크레딧 잔액 확인, 사용 내역 조회, 피드백 설문 참여
 */

import { useState, useMemo } from "react";
import {
  MdAdd,
  MdHistory,
  MdAccountBalanceWallet,
  MdExpandMore,
} from "react-icons/md";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import {
  useMetadata,
  WORKSAUCE_METADATA_PRESETS,
} from "@/shared/hooks/useMetadata";
import { FeedbackSurvey } from "../components/FeedbackSurvey";
import { useCreditBalance, useCreditHistory } from "../hooks/useCredits";
import { useSurveyStatus, useSubmitSurvey } from "../hooks/useFeedbackSurvey";
import type { CreditHistory, FeedbackSurveyData } from "../types/credit.types";

const ITEMS_PER_PAGE = 5;

export const CreditPage = () => {
  useMetadata(WORKSAUCE_METADATA_PRESETS.dashboard);

  // 표시할 내역 개수
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // 크레딧 데이터 조회
  const { data: balance, isLoading: isBalanceLoading } = useCreditBalance();
  const { data: history, isLoading: isHistoryLoading } = useCreditHistory();

  // 설문 상태 및 제출
  const { data: surveyStatus, isLoading: isSurveyLoading } = useSurveyStatus();
  const { mutateAsync: submitSurvey } = useSubmitSurvey();

  // 내역에서 총 적립/사용 계산
  const { totalEarned, totalUsed } = useMemo(() => {
    if (!history) return { totalEarned: 0, totalUsed: 0 };

    return history.reduce(
      (acc, item) => {
        if (item.type === "use") {
          acc.totalUsed += item.amount;
        } else {
          acc.totalEarned += item.amount;
        }
        return acc;
      },
      { totalEarned: 0, totalUsed: 0 }
    );
  }, [history]);

  // 표시할 내역 (페이지네이션)
  const visibleHistory = useMemo(() => {
    if (!history) return [];
    return history.slice(0, visibleCount);
  }, [history, visibleCount]);

  const hasMoreItems = history && history.length > visibleCount;

  // 더 보기 핸들러
  const handleShowMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  // 설문 제출 핸들러
  const handleSurveySubmit = async (data: FeedbackSurveyData) => {
    await submitSurvey(data);
  };

  const getTypeLabel = (type: CreditHistory["type"]) => {
    switch (type) {
      case "use":
        return { text: "사용", color: "text-red-600 bg-red-50" };
      case "charge":
        return { text: "충전", color: "text-blue-600 bg-blue-50" };
      case "reward":
        return { text: "적립", color: "text-green-600 bg-green-50" };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isLoading = isBalanceLoading || isHistoryLoading || isSurveyLoading;

  // 스켈레톤 UI
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-neutral-200" />
        <div className="h-4 w-16 bg-neutral-200 rounded" />
      </div>
      <div className="h-8 w-24 bg-neutral-200 rounded mt-2" />
    </div>
  );

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "대시보드", href: "/dashboard" },
        { label: "크레딧 관리" },
      ]}
    >
      {/* 크레딧 잔액 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <MdAccountBalanceWallet className="w-5 h-5 text-primary-500" />
                </div>
                <span className="text-sm text-neutral-500">보유 크레딧</span>
              </div>
              <p className="text-3xl font-bold text-neutral-900">
                {balance?.credits ?? 0}
                <span className="text-lg font-normal text-neutral-400 ml-1">
                  크레딧
                </span>
              </p>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <MdAdd className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-sm text-neutral-500">총 적립</span>
              </div>
              <p className="text-3xl font-bold text-neutral-900">
                {totalEarned}
                <span className="text-lg font-normal text-neutral-400 ml-1">
                  크레딧
                </span>
              </p>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                  <MdHistory className="w-5 h-5 text-red-500" />
                </div>
                <span className="text-sm text-neutral-500">총 사용</span>
              </div>
              <p className="text-3xl font-bold text-neutral-900">
                {totalUsed}
                <span className="text-lg font-normal text-neutral-400 ml-1">
                  크레딧
                </span>
              </p>
            </div>
          </>
        )}
      </div>

      {/* 피드백 설문 섹션 */}
      {!isSurveyLoading && (
        <div className="mb-6">
          <FeedbackSurvey
            onSubmit={handleSurveySubmit}
            hasCompleted={surveyStatus?.hasCompleted ?? false}
            totalUsed={totalUsed}
          />
        </div>
      )}

      {/* 크레딧 사용 내역 */}
      <div className="bg-white rounded-xl border border-neutral-200">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">사용 내역</h2>
          {history && history.length > 0 && (
            <span className="text-sm text-neutral-500">
              총 {history.length}건
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="flex items-center justify-between animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-6 bg-neutral-200 rounded-full" />
                  <div className="h-4 w-32 bg-neutral-200 rounded" />
                </div>
                <div className="h-4 w-16 bg-neutral-200 rounded" />
              </div>
            ))}
          </div>
        ) : visibleHistory.length > 0 ? (
          <>
            <div className="divide-y divide-neutral-100">
              {visibleHistory.map(item => {
                const typeInfo = getTypeLabel(item.type);
                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}
                      >
                        {typeInfo.text}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          {item.description}
                        </p>
                        {item.relatedGroupName && (
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {item.relatedGroupName}
                            {item.relatedApplicantName &&
                              ` - ${item.relatedApplicantName}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          item.type === "use"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {item.type === "use" ? "-" : "+"}
                        {item.amount}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 더 보기 버튼 */}
            {hasMoreItems && (
              <div className="p-4 border-t border-neutral-100">
                <button
                  onClick={handleShowMore}
                  className="w-full py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  더 보기
                  <MdExpandMore className="w-5 h-5" />
                  <span className="text-neutral-400">
                    ({history!.length - visibleCount}건 남음)
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center">
            <MdHistory className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">
              아직 크레딧 사용 내역이 없습니다.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
