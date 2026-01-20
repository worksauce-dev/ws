/**
 * 그룹 생성 진행 상황 모달
 * 그룹 생성과 이메일 발송의 2단계 프로세스를 시각적으로 표시
 */

import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import { MdCheckCircle, MdError } from "react-icons/md";
import { clsx } from "clsx";

export type CreateGroupStep =
  | "creating"
  | "sending"
  | "complete"
  | "error"
  | "email_failed"; // 이메일 전체 실패 상태 추가

interface CreateGroupLoadingModalProps {
  isOpen: boolean;
  currentStep: CreateGroupStep;
  applicantCount: number;
  successCount?: number;
  failedCount?: number;
  errorMessage?: string;
  // 이메일 실패 시 액션 핸들러
  onGoToGroupPage?: () => void;
  onRetryEmail?: () => void;
  onDeleteGroup?: () => void;
}

export const CreateGroupLoadingModal = ({
  isOpen,
  currentStep,
  applicantCount,
  successCount = 0,
  failedCount = 0,
  errorMessage,
  onGoToGroupPage,
  onRetryEmail,
  onDeleteGroup,
}: CreateGroupLoadingModalProps) => {
  const isCreating = currentStep === "creating";
  const isSending = currentStep === "sending";
  const isComplete = currentStep === "complete";
  const isError = currentStep === "error";
  const isEmailFailed = currentStep === "email_failed";

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

        {/* 이메일 전체 실패 시 처리 옵션 */}
        {isEmailFailed && (
          <div className="space-y-4 pt-4 border-t border-neutral-200">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MdError className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">
                    이메일 발송 실패
                  </h4>
                  <p className="text-sm text-yellow-700 mb-2">
                    그룹은 생성되었으나 모든 이메일 발송에 실패했습니다.
                    {errorMessage && (
                      <>
                        <br />
                        <span className="text-xs">{errorMessage}</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-yellow-600">
                    어떻게 처리하시겠습니까?
                  </p>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant="primary"
                onClick={onGoToGroupPage}
                className="w-full"
              >
                그룹 페이지로 이동
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onRetryEmail}
                className="w-full"
              >
                다시 시도
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onDeleteGroup}
                className="w-full text-red-600 hover:text-red-700"
              >
                그룹 삭제
              </Button>
            </div>

            <p className="text-xs text-neutral-500 text-center">
              그룹 페이지로 이동하시면 나중에 이메일을 재발송할 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
