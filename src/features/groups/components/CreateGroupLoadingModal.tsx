/**
 * 그룹 생성 진행 상황 모달
 * 그룹 생성과 이메일 발송의 2단계 프로세스를 시각적으로 표시
 */

import { Modal } from "@/shared/components/ui/Modal";
import { MdCheckCircle, MdError } from "react-icons/md";
import { clsx } from "clsx";

export type CreateGroupStep = "creating" | "sending" | "complete" | "error";

interface CreateGroupLoadingModalProps {
  isOpen: boolean;
  currentStep: CreateGroupStep;
  applicantCount: number;
  successCount?: number;
  failedCount?: number;
  errorMessage?: string;
}

export const CreateGroupLoadingModal = ({
  isOpen,
  currentStep,
  applicantCount,
  successCount = 0,
  failedCount = 0,
  errorMessage,
}: CreateGroupLoadingModalProps) => {
  const isCreating = currentStep === "creating";
  const isSending = currentStep === "sending";
  const isComplete = currentStep === "complete";
  const isError = currentStep === "error";

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // 진행 중에는 닫기 불가
      title="채용 그룹 생성 중"
    >
      <div className="space-y-6 py-4">
        {/* 단계 1: 그룹 생성 */}
        <div className="flex items-start gap-4">
          {/* 아이콘 */}
          <div className="flex-shrink-0 mt-1">
            {isCreating ? (
              <div className="w-6 h-6 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
            ) : isError && currentStep === "error" ? (
              <MdError className="w-6 h-6 text-red-500" />
            ) : (
              <MdCheckCircle className="w-6 h-6 text-green-500" />
            )}
          </div>

          {/* 내용 */}
          <div className="flex-1">
            <h3
              className={clsx(
                "font-medium text-neutral-800 mb-1",
                isCreating && "text-primary-600"
              )}
            >
              1. 채용 그룹 생성
            </h3>
            <p className="text-sm text-neutral-600">
              {isCreating
                ? "그룹 정보를 저장하고 있습니다..."
                : isError && currentStep === "error"
                  ? "그룹 생성 중 오류가 발생했습니다"
                  : "그룹 생성이 완료되었습니다"}
            </p>
          </div>
        </div>

        {/* 단계 2: 이메일 발송 */}
        <div className="flex items-start gap-4">
          {/* 아이콘 */}
          <div className="flex-shrink-0 mt-1">
            {isSending ? (
              <div className="w-6 h-6 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
            ) : isComplete || (isError && successCount > 0) ? (
              <MdCheckCircle
                className={clsx(
                  "w-6 h-6",
                  failedCount > 0 ? "text-yellow-500" : "text-green-500"
                )}
              />
            ) : (
              <div className="w-6 h-6 border-3 border-neutral-300 rounded-full" />
            )}
          </div>

          {/* 내용 */}
          <div className="flex-1">
            <h3
              className={clsx(
                "font-medium text-neutral-800 mb-1",
                isSending && "text-primary-600"
              )}
            >
              2. 소스테스트 이메일 발송
            </h3>
            <p className="text-sm text-neutral-600">
              {isSending ? (
                <>
                  {applicantCount}명의 지원자에게 이메일을 발송하고 있습니다...
                  <br />
                  <span className="text-xs text-neutral-500">
                    ({successCount}/{applicantCount} 완료)
                  </span>
                </>
              ) : isComplete ? (
                failedCount > 0 ? (
                  <span className="text-yellow-600">
                    {successCount}명 발송 완료, {failedCount}명 발송 실패
                  </span>
                ) : (
                  `${applicantCount}명 모두에게 이메일을 발송했습니다`
                )
              ) : isError && successCount > 0 ? (
                <span className="text-yellow-600">
                  {successCount}명 발송 완료, {failedCount}명 발송 실패
                </span>
              ) : isCreating ? (
                "그룹 생성 후 이메일을 발송합니다"
              ) : (
                "대기 중"
              )}
            </p>
          </div>
        </div>

        {/* 오류 메시지 */}
        {isError && errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <MdError className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800 mb-1">오류 발생</h4>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* 진행률 바 */}
        {(isCreating || isSending) && (
          <div className="space-y-2">
            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 transition-all duration-500 ease-out"
                style={{
                  width: isCreating
                    ? "30%"
                    : isSending
                      ? `${30 + (successCount / applicantCount) * 70}%`
                      : "100%",
                }}
              />
            </div>
            <p className="text-xs text-neutral-500 text-center">
              {isCreating
                ? "30% 완료"
                : isSending
                  ? `${Math.round(30 + (successCount / applicantCount) * 70)}% 완료`
                  : "100% 완료"}
            </p>
          </div>
        )}

        {/* 안내 메시지 */}
        {(isCreating || isSending) && (
          <p className="text-xs text-neutral-500 text-center">
            잠시만 기다려주세요. 창을 닫지 마세요.
          </p>
        )}
      </div>
    </Modal>
  );
};
