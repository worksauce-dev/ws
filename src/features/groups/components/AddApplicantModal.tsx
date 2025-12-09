import React from "react";
import {
  MdPerson,
  MdEmail,
  MdSearch,
  MdClear,
  MdDelete,
  MdAdd,
} from "react-icons/md";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import { Checkbox } from "@/shared/components/ui/Checkbox";
import { useToast } from "@/shared/components/ui/useToast";
import { FileUploadZone } from "./FileUploadZone";
import { useApplicantManager } from "../hooks/useApplicantManager";
import { useFileUpload } from "../hooks/useFileUpload";
import { useAddApplicants } from "../hooks/useAddApplicants";
import {
  formatParseResultMessage,
  MAX_FILE_SIZE,
  formatFileSize,
} from "../utils/fileParser";
import { supabase } from "@/shared/lib/supabase";

interface AddApplicantModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
}

/**
 * 지원자 추가 모달
 *
 * 기능:
 * - Excel 파일 업로드로 일괄 추가
 * - 개별 수동 입력
 * - 중복 이메일 자동 필터링
 * - 검색 및 선택 삭제
 */
export const AddApplicantModal = ({
  isOpen,
  onClose,
  groupId,
}: AddApplicantModalProps) => {
  const { showToast } = useToast();
  const applicantManager = useApplicantManager();
  const fileUpload = useFileUpload(applicantManager.applicants);

  // 모달이 열릴 때마다 상태 초기화
  React.useEffect(() => {
    if (isOpen) {
      console.log("🔓 [AddApplicantModal] 모달 열림, 상태 초기화");
      console.log(
        "📊 [AddApplicantModal] 현재 지원자 수:",
        applicantManager.applicants.length
      );
      applicantManager.clearApplicants();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const addApplicantsMutation = useAddApplicants(groupId, {
    onSuccess: () => {
      // 성공 시 모달 닫고 리스트 초기화
      console.log("🎉 [AddApplicantModal] 지원자 추가 성공, 모달 닫기");
      onClose();
    },
  });

  // 지원자 추가 (개별)
  const handleAddApplicant = () => {
    const result = applicantManager.addApplicant();

    if (!result.success) {
      const errorType = result.error?.includes("형식") ? "error" : "warning";
      showToast(
        errorType,
        errorType === "error" ? "이메일 형식 오류" : "입력 오류",
        result.error!
      );
      return;
    }

    showToast(
      "success",
      "지원자 추가 완료",
      `${applicantManager.newApplicant.name}님이 목록에 추가되었습니다.`
    );
  };

  // 파일 업로드 처리
  const handleFileUploadComplete = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const result = await fileUpload.handleFileUpload(event);
    if (!result) return;

    if (!result.success || result.applicants.length === 0) {
      showToast(
        "warning",
        "업로드 실패",
        result.error || "파일 내용을 확인해주세요."
      );
      return;
    }

    applicantManager.addApplicants(result.applicants);
    const message = formatParseResultMessage(result);
    showToast("success", "Excel 업로드 완료", message, 6000);
  };

  // 드롭 처리
  const handleDropComplete = async (e: React.DragEvent) => {
    const result = await fileUpload.handleDrop(e);
    if (!result) return;

    if (!result.success || result.applicants.length === 0) {
      showToast(
        "error",
        "업로드 실패",
        result.error || "파일 내용을 확인해주세요."
      );
      return;
    }

    applicantManager.addApplicants(result.applicants);
    const message = formatParseResultMessage(result);
    showToast("success", "Excel 업로드 완료", message, 6000);
  };

  // 선택된 지원자 삭제
  const handleDeleteSelected = () => {
    if (applicantManager.selectedApplicants.length === 0) return;

    if (
      confirm(
        `선택된 ${applicantManager.selectedApplicants.length}명의 지원자를 삭제하시겠습니까?`
      )
    ) {
      applicantManager.handleDeleteSelected();
    }
  };

  // 지원자 추가 제출
  const handleSubmit = async () => {
    if (applicantManager.applicants.length === 0) {
      showToast("warning", "추가할 지원자 없음", "추가할 지원자가 없습니다.");
      return;
    }

    console.log(
      "📤 [AddApplicantModal] 제출 전 중복 체크:",
      applicantManager.applicants.length,
      "명"
    );

    // 제출 전 중복 체크
    try {
      const { data: existingApplicants, error } = await supabase
        .from("applicants")
        .select("email")
        .eq("group_id", groupId);

      if (error) {
        console.error("중복 체크 실패:", error);
        showToast("error", "오류", "중복 확인 중 오류가 발생했습니다.");
        return;
      }

      // 기존 이메일 목록 (소문자로 변환)
      const existingEmails = new Set(
        (existingApplicants || []).map(a => a.email.toLowerCase())
      );

      // 중복된 이메일 찾기
      const duplicateApplicants = applicantManager.applicants.filter(a =>
        existingEmails.has(a.email.toLowerCase())
      );

      if (duplicateApplicants.length > 0) {
        // 중복 이메일이 있는 경우
        const duplicateEmails = duplicateApplicants
          .map(a => a.email)
          .join("\n");

        const allDuplicate =
          duplicateApplicants.length === applicantManager.applicants.length;

        if (allDuplicate) {
          // 모두 중복인 경우
          showToast(
            "error",
            "중복된 이메일",
            `모든 지원자가 이미 등록되어 있습니다.\n\n중복된 이메일:\n${duplicateEmails}`
          );
          return;
        } else {
          // 일부만 중복인 경우
          const confirmMessage = `⚠️ 다음 이메일은 이미 등록되어 있습니다:\n\n${duplicateEmails}\n\n중복을 제외한 ${applicantManager.applicants.length - duplicateApplicants.length}명만 추가하시겠습니까?`;

          if (!window.confirm(confirmMessage)) {
            return; // 취소
          }

          // 중복 제외하고 제출
          const newApplicants = applicantManager.applicants.filter(
            a => !existingEmails.has(a.email.toLowerCase())
          );

          console.log(
            "📤 [AddApplicantModal] 중복 제외 후 제출:",
            newApplicants.length,
            "명"
          );

          addApplicantsMutation.mutate(
            newApplicants.map(a => ({
              name: a.name,
              email: a.email,
            }))
          );
          return;
        }
      }

      // 중복이 없으면 바로 제출
      console.log(
        "📤 [AddApplicantModal] 중복 없음, 제출:",
        applicantManager.applicants.length,
        "명"
      );

      addApplicantsMutation.mutate(
        applicantManager.applicants.map(a => ({
          name: a.name,
          email: a.email,
        }))
      );
    } catch (error) {
      console.error("중복 체크 오류:", error);
      showToast("error", "오류", "처리 중 오류가 발생했습니다.");
    }
  };

  // 모달 닫기 핸들러 (초기화 포함)
  const handleClose = () => {
    console.log("🚪 [AddApplicantModal] 모달 닫기, 상태 초기화");
    applicantManager.clearApplicants();
    onClose();
  };

  const selectAllState = applicantManager.getSelectAllState();

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="지원자 추가하기" size="lg">
      <div className="space-y-6">
        {/* Excel 업로드 섹션 */}
        <div>
          <FileUploadZone
            fileUpload={fileUpload}
            onFileUpload={handleFileUploadComplete}
            onDrop={handleDropComplete}
          />
        </div>

        {/* 구분선 */}
        <div className="flex items-center">
          <div className="flex-1 border-t border-neutral-200" />
          <span className="px-3 text-xs text-neutral-500 bg-white">또는</span>
          <div className="flex-1 border-t border-neutral-200" />
        </div>

        {/* 개별 추가 폼 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              지원자 이름
            </label>
            <div className="relative">
              <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={applicantManager.newApplicant.name}
                onChange={e =>
                  applicantManager.handleApplicantInputChange(
                    "name",
                    e.target.value
                  )
                }
                placeholder="예: 홍길동"
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              지원자 이메일
            </label>
            <div className="relative">
              <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                value={applicantManager.newApplicant.email}
                onChange={e =>
                  applicantManager.handleApplicantInputChange(
                    "email",
                    e.target.value
                  )
                }
                placeholder="example@email.com"
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm"
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleAddApplicant}
            variant="secondary"
            size="md"
            className="w-full"
          >
            <MdAdd className="w-4 h-4 mr-2" />
            목록에 추가
          </Button>
        </div>

        {/* 지원자 목록 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium text-neutral-800">
              추가될 지원자 목록
            </h3>

            {/* 선택 관련 컨트롤들 */}
            {applicantManager.applicants.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                {/* 전체선택 체크박스 */}
                <div className="flex items-center gap-1.5 h-6">
                  <Checkbox
                    checked={selectAllState.checked}
                    ref={el => {
                      if (el) el.indeterminate = selectAllState.indeterminate;
                    }}
                    onChange={applicantManager.handleSelectAllChange}
                    label={
                      <span className="text-neutral-600">
                        전체선택 ({applicantManager.filteredApplicants.length})
                      </span>
                    }
                    title="표시된 모든 지원자 선택/해제"
                    className="w-4 h-4"
                  />
                </div>

                {/* 선택된 개수 표시 */}
                {applicantManager.selectedApplicants.length > 0 && (
                  <span className="flex items-center h-6 px-2 bg-primary-50 text-primary font-medium rounded">
                    {applicantManager.selectedApplicants.length}명
                  </span>
                )}

                {/* 선택 삭제 버튼 */}
                {applicantManager.selectedApplicants.length > 0 && (
                  <Button
                    type="button"
                    onClick={handleDeleteSelected}
                    variant="primary"
                    size="sm"
                    className="flex items-center h-6 px-2 bg-red-500 hover:bg-red-600 focus-visible:ring-red-500 text-white text-xs rounded"
                  >
                    <MdDelete className="w-3 h-3 mr-1" />
                    삭제
                  </Button>
                )}
              </div>
            )}
          </div>

          {applicantManager.applicants.length === 0 ? (
            <div className="text-center py-8 bg-neutral-50 rounded-lg">
              <MdPerson className="w-8 h-8 mx-auto mb-2 text-neutral-400" />
              <p className="text-sm text-neutral-600">추가할 지원자가 없습니다</p>
              <p className="text-xs text-neutral-500 mt-1">
                Excel 파일을 업로드하거나 개별로 추가해주세요
              </p>
            </div>
          ) : (
            <>
              {/* 검색바 */}
              <div className="relative mb-3">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={applicantManager.searchTerm}
                  onChange={e => applicantManager.setSearchTerm(e.target.value)}
                  placeholder="이름 또는 이메일로 검색"
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm"
                />
                {applicantManager.searchTerm && (
                  <button
                    onClick={() => applicantManager.setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  >
                    <MdClear className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* 결과 요약 */}
              <div className="text-xs text-neutral-600 mb-3 px-1">
                <span>
                  총 {applicantManager.applicants.length}명 중{" "}
                  {applicantManager.filteredApplicants.length}명 표시
                </span>
              </div>

              {/* 지원자 리스트 */}
              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                {applicantManager.filteredApplicants.length === 0 ? (
                  <div className="text-center py-4 text-neutral-500 text-sm">
                    검색 조건에 맞는 지원자가 없습니다
                  </div>
                ) : (
                  applicantManager.filteredApplicants.map(applicant => (
                    <div
                      key={applicant.id}
                      className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                        applicantManager.selectedApplicants.includes(
                          applicant.id
                        )
                          ? "bg-primary-50 border border-primary-200"
                          : "bg-neutral-50 hover:bg-neutral-100"
                      }`}
                    >
                      {/* 체크박스 */}
                      <input
                        type="checkbox"
                        checked={applicantManager.selectedApplicants.includes(
                          applicant.id
                        )}
                        onChange={() =>
                          applicantManager.handleToggleSelect(applicant.id)
                        }
                        className="mr-3 rounded border-gray-300 text-primary focus:ring-primary"
                      />

                      {/* 지원자 정보 */}
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-neutral-800 truncate">
                            {applicant.name}
                          </p>
                          <p className="text-xs text-neutral-600 truncate">
                            {applicant.email}
                          </p>
                        </div>
                      </div>

                      {/* 개별 삭제 버튼 */}
                      <button
                        type="button"
                        onClick={() =>
                          applicantManager.removeApplicant(applicant.id)
                        }
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 flex-shrink-0"
                        title="지원자 삭제"
                      >
                        <MdDelete className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* 안내 메시지 */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-1">
            💡 Excel 파일 형식 안내
          </h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• 첫 번째 행에 헤더가 있어야 합니다</li>
            <li>• 헤더: '이름', '이메일' (또는 'name', 'email')</li>
            <li>• 최대 파일 크기: {formatFileSize(MAX_FILE_SIZE)}</li>
            <li>• 중복 이메일은 자동으로 제외됩니다</li>
          </ul>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
          <Button
            type="button"
            onClick={handleClose}
            variant="secondary"
            size="md"
            disabled={addApplicantsMutation.isPending}
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            variant="primary"
            size="md"
            disabled={
              addApplicantsMutation.isPending ||
              applicantManager.applicants.length === 0
            }
          >
            {addApplicantsMutation.isPending
              ? "추가 중..."
              : `${applicantManager.applicants.length}명 추가하기`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
