import {
  MdPerson,
  MdEmail,
  MdSearch,
  MdClear,
  MdDelete,
  MdAdd,
} from "react-icons/md";
import { Button } from "@/shared/components/ui/Button";
import { Checkbox } from "@/shared/components/ui/Checkbox";
import { useToast } from "@/shared/components/ui/Toast";
import { FileUploadZone } from "./FileUploadZone";
import {
  formatParseResultMessage,
  MAX_FILE_SIZE,
  formatFileSize,
} from "../utils/fileParser";
import type { UseApplicantManagerReturn } from "../types/applicant.types";
import type { UseFileUploadReturn } from "../types/fileUpload.types";

interface ApplicantManagerProps {
  applicantManager: UseApplicantManagerReturn;
  fileUpload: UseFileUploadReturn;
}

export const ApplicantManager = ({
  applicantManager,
  fileUpload,
}: ApplicantManagerProps) => {
  const { showToast } = useToast();

  // 지원자 추가
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
      `${applicantManager.newApplicant.name}님이 추가되었습니다.`
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

  const selectAllState = applicantManager.getSelectAllState();

  return (
    <div className="xl:col-span-1">
      <div className="bg-white rounded-xl p-6 border border-neutral-200 sticky top-8">
        <h2 className="text-lg font-semibold text-neutral-800 mb-6">
          지원자 관리
        </h2>

        {/* 지원자 추가 폼 */}
        <div className="space-y-4 mb-6">
          <FileUploadZone
            fileUpload={fileUpload}
            onFileUpload={handleFileUploadComplete}
            onDrop={handleDropComplete}
          />

          {/* 구분선 */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-neutral-200" />
            <span className="px-3 text-xs text-neutral-500 bg-white">또는</span>
            <div className="flex-1 border-t border-neutral-200" />
          </div>

          {/* 개별 추가 폼 */}
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
            variant="primary"
            size="md"
            className="w-full"
          >
            <MdAdd className="w-4 h-4 mr-2" />
            지원자 추가
          </Button>
        </div>

        {/* 지원자 목록 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium text-neutral-800">
              지원자 목록
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
            <div className="text-center py-6 bg-neutral-50 rounded-lg">
              <MdPerson className="w-6 h-6 mx-auto mb-2 text-neutral-400" />
              <p className="text-sm text-neutral-600">
                추가된 지원자가 없습니다
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                지원자를 추가해보세요
              </p>
            </div>
          ) : (
            <>
              {/* 검색 및 필터 컨트롤 */}
              <div className="space-y-3 mb-4">
                {/* 검색바 */}
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    value={applicantManager.searchTerm}
                    onChange={e =>
                      applicantManager.setSearchTerm(e.target.value)
                    }
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
              </div>

              {/* 결과 요약 */}
              <div className="text-xs text-neutral-600 mb-3 px-1">
                <span>
                  총 {applicantManager.applicants.length}명 중{" "}
                  {applicantManager.filteredApplicants.length}명 표시
                </span>
              </div>

              {/* 지원자 리스트 */}
              <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-hide">
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

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-1">
            💡 Excel 파일 형식 안내
          </h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• 첫 번째 행에 헤더가 있어야 합니다</li>
            <li>• 헤더: '이름', '이메일' (또는 'name', 'email')</li>
            <li>• 최대 파일 크기: {formatFileSize(MAX_FILE_SIZE)}</li>
            <li>• 중복 이메일은 자동으로 제외됩니다</li>
            <li>• 테스트 링크가 자동 발송됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
