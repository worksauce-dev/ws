import { useState, useRef, useCallback } from "react";
import { type Applicant } from "../utils/applicantValidator";
import { parseExcelFile, type ParseResult } from "../utils/fileParser";

export interface UseFileUploadReturn {
  // State
  isUploading: boolean;
  isDragOver: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;

  // Actions
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<ParseResult | null>;
  handleUploadClick: () => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => Promise<ParseResult | null>;
}

/**
 * 파일 업로드 hook
 * Excel 파일 업로드 및 드래그앤드롭 처리
 */
export const useFileUpload = (
  existingApplicants: Applicant[]
): UseFileUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 처리 (공통 로직)
  const processFiles = useCallback(
    async (files: FileList | File[]): Promise<ParseResult | null> => {
      const file = (Array.isArray(files) ? files : Array.from(files))[0];
      if (!file) return null;

      setIsUploading(true);

      try {
        const result = await parseExcelFile(file, existingApplicants);
        return result;
      } finally {
        setIsUploading(false);
        // 파일 input 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [existingApplicants]
  );

  // 파일 업로드 버튼 클릭
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 파일 input 변경
  const handleFileUpload = useCallback(
    async (
      event: React.ChangeEvent<HTMLInputElement>
    ): Promise<ParseResult | null> => {
      const files = event.target.files;
      if (!files) return null;
      return await processFiles(files);
    },
    [processFiles]
  );

  // 드래그 오버
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragOver && !isUploading) {
        setIsDragOver(true);
      }
    },
    [isDragOver, isUploading]
  );

  // 드래그 나가기
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 자식 요소로 이동하는 경우 무시
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  // 드롭
  const handleDrop = useCallback(
    async (e: React.DragEvent): Promise<ParseResult | null> => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (isUploading) return null;

      const files = Array.from(e.dataTransfer.files);
      const excelFile = files.find(file => file.name.match(/\.(xlsx|xls)$/));

      if (!excelFile) {
        return {
          success: false,
          applicants: [],
          duplicateEmails: [],
          invalidRows: [],
          error: "Excel 파일(.xlsx, .xls)만 업로드 가능합니다.",
        };
      }

      return await processFiles([excelFile]);
    },
    [isUploading, processFiles]
  );

  return {
    isUploading,
    isDragOver,
    fileInputRef,
    handleFileUpload,
    handleUploadClick,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};
