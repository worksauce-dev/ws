import type { ParseResult } from "../utils/fileParser";

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
