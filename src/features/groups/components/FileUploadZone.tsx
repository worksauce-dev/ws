import { MdFileUpload, MdUpload } from "react-icons/md";
import type { UseFileUploadReturn } from "../types/fileUpload.types";

interface FileUploadZoneProps {
  fileUpload: UseFileUploadReturn;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onDrop: (e: React.DragEvent) => Promise<void>;
}

export const FileUploadZone = ({
  fileUpload,
  onFileUpload,
  onDrop,
}: FileUploadZoneProps) => {
  return (
    <div
      onDragOver={fileUpload.handleDragOver}
      onDragLeave={fileUpload.handleDragLeave}
      onDrop={onDrop}
      className={`p-4 rounded-lg border-2 border-dashed transition-all duration-200 ${
        fileUpload.isDragOver
          ? "bg-blue-100 border-blue-400 border-solid"
          : fileUpload.isUploading
            ? "bg-gray-50 border-gray-300"
            : "bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
      }`}
    >
      <div className="text-center">
        <MdFileUpload
          className={`w-8 h-8 mx-auto mb-2 transition-colors duration-200 ${
            fileUpload.isDragOver
              ? "text-blue-700"
              : fileUpload.isUploading
                ? "text-gray-400"
                : "text-blue-600"
          }`}
        />
        <h4
          className={`text-sm font-medium mb-1 transition-colors duration-200 ${
            fileUpload.isDragOver
              ? "text-blue-900"
              : fileUpload.isUploading
                ? "text-gray-600"
                : "text-blue-800"
          }`}
        >
          {fileUpload.isDragOver
            ? "Excel 파일을 여기에 놓으세요"
            : "Excel 파일로 일괄 추가"}
        </h4>
        <p
          className={`text-xs mb-3 transition-colors duration-200 ${
            fileUpload.isDragOver
              ? "text-blue-700"
              : fileUpload.isUploading
                ? "text-gray-500"
                : "text-blue-600"
          }`}
        >
          {fileUpload.isDragOver
            ? "Excel 파일(.xlsx, .xls)을 드롭하여 업로드"
            : "Excel 파일(.xlsx, .xls)을 드래그하거나 클릭하여 업로드하세요"}
        </p>

        {!fileUpload.isDragOver && (
          <button
            type="button"
            onClick={fileUpload.handleUploadClick}
            disabled={fileUpload.isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200 flex items-center justify-center text-sm font-medium mx-auto"
          >
            {fileUpload.isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                처리중...
              </>
            ) : (
              <>
                <MdUpload className="w-4 h-4 mr-2" />
                Excel 파일 선택
              </>
            )}
          </button>
        )}

        <input
          ref={fileUpload.fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={onFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};
