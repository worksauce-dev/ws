import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import type { BusinessVerification } from "@/features/settings/types/business.types";

interface RejectVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verification: BusinessVerification | null;
  rejectionReason: string;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export const RejectVerificationModal = ({
  isOpen,
  onClose,
  verification,
  rejectionReason,
  onReasonChange,
  onConfirm,
  isPending,
}: RejectVerificationModalProps) => {
  if (!verification) return null;

  const isValid = rejectionReason.trim().length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="기업 인증 거부" size="sm">
      <div className="space-y-4">
        <p className="text-sm text-neutral-600">
          {verification.company_name}의 인증을 거부하시겠습니까?
        </p>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            거부 사유 *
          </label>
          <textarea
            value={rejectionReason}
            onChange={e => onReasonChange(e.target.value)}
            placeholder="거부 사유를 입력해주세요..."
            rows={4}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            취소
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending || !isValid}
            isLoading={isPending}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            거부
          </Button>
        </div>
      </div>
    </Modal>
  );
};
