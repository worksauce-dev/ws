/**
 * 팀 삭제 확인 모달 컴포넌트
 * 팀 삭제 전 확인을 위한 모달
 */

import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import { MdWarning } from "react-icons/md";

interface TeamDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const TeamDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: TeamDeleteModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="팀 삭제" size="sm">
      <div className="space-y-6">
        {/* 경고 아이콘 */}
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 bg-error-100 rounded-full">
            <div className="flex items-center justify-center w-12 h-12 bg-error-200 rounded-full">
              <MdWarning className="w-7 h-7 text-error-600" />
            </div>
          </div>
        </div>

        {/* 메시지 */}
        <div className="text-center space-y-3">
          <h3 className="text-lg font-semibold text-neutral-800">
            정말로 이 팀을 삭제하시겠습니까?
          </h3>
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-sm text-error-700 leading-relaxed">
              <span className="font-semibold">삭제된 팀과 팀원 정보는 복구할 수 없습니다.</span>
              <br />
              모든 테스트 결과와 팀 구성 데이터가 영구적으로 삭제됩니다.
            </p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onConfirm}
            disabled={isDeleting}
            isLoading={isDeleting}
            className="flex-1 bg-error-500 hover:bg-error-600 focus:ring-error-500"
          >
            {isDeleting ? "삭제 중..." : "삭제하기"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
