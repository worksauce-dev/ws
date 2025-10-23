import * as XLSX from "xlsx";
import {
  type Applicant,
  generateApplicantId,
  validateApplicantSafe,
} from "./applicantValidator";

export interface ParseResult {
  success: boolean;
  applicants: Applicant[];
  duplicateEmails: string[];
  invalidRows: number[];
  error?: string;
}

// 파일 업로드 제한 상수
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
];

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 변환
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

/**
 * Excel 파일을 파싱하여 지원자 목록을 추출합니다
 */
export const parseExcelFile = async (
  file: File,
  existingApplicants: Applicant[]
): Promise<ParseResult> => {
  try {
    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        applicants: [],
        duplicateEmails: [],
        invalidRows: [],
        error: `파일 크기가 너무 큽니다. 최대 ${formatFileSize(MAX_FILE_SIZE)}까지 업로드 가능합니다. (현재: ${formatFileSize(file.size)})`,
      };
    }

    // MIME 타입 검증
    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        applicants: [],
        duplicateEmails: [],
        invalidRows: [],
        error: "Excel 파일만 업로드 가능합니다 (.xlsx, .xls)",
      };
    }

    // 파일 확장자 검증 (추가 안전장치)
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      return {
        success: false,
        applicants: [],
        duplicateEmails: [],
        invalidRows: [],
        error: "Excel 파일만 업로드 가능합니다 (.xlsx, .xls)",
      };
    }

    // 파일 읽기
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
    }) as string[][];

    // 데이터 검증
    if (jsonData.length < 2) {
      return {
        success: false,
        applicants: [],
        duplicateEmails: [],
        invalidRows: [],
        error:
          "Excel 파일에 데이터가 없습니다. 최소 2행(헤더 + 데이터)이 필요합니다.",
      };
    }

    // 헤더 찾기
    const headers = jsonData[0].map(header => header?.toLowerCase().trim());
    const nameColumnIndex = headers.findIndex(
      header =>
        header.includes("이름") ||
        header.includes("name") ||
        header.includes("성명")
    );
    const emailColumnIndex = headers.findIndex(
      header =>
        header.includes("이메일") ||
        header.includes("email") ||
        header.includes("메일")
    );

    if (nameColumnIndex === -1 || emailColumnIndex === -1) {
      return {
        success: false,
        applicants: [],
        duplicateEmails: [],
        invalidRows: [],
        error:
          "Excel 파일에 '이름'과 '이메일' 컬럼이 필요합니다. 예: '이름', '이메일' 또는 'name', 'email'",
      };
    }

    // 데이터 파싱
    const newApplicants: Applicant[] = [];
    const duplicateEmails: string[] = [];
    const invalidRows: number[] = [];

    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      const name = row[nameColumnIndex]?.toString().trim() || "";
      const email = row[emailColumnIndex]?.toString().trim() || "";

      // Zod를 사용한 유효성 검사
      const validation = validateApplicantSafe(name, email);

      if (!validation.success) {
        invalidRows.push(i + 1);
        continue;
      }

      // 중복 확인 (기존 지원자 + 새로 추가될 지원자)
      if (
        existingApplicants.some(
          applicant =>
            applicant.email.toLowerCase() ===
            validation.data.email.toLowerCase()
        ) ||
        newApplicants.some(
          applicant =>
            applicant.email.toLowerCase() ===
            validation.data.email.toLowerCase()
        )
      ) {
        duplicateEmails.push(validation.data.email);
        continue;
      }

      newApplicants.push({
        id: generateApplicantId(),
        name: validation.data.name,
        email: validation.data.email,
      });
    }

    return {
      success: true,
      applicants: newApplicants,
      duplicateEmails,
      invalidRows,
    };
  } catch (error) {
    console.error("Excel 파일 처리 중 오류:", error);
    return {
      success: false,
      applicants: [],
      duplicateEmails: [],
      invalidRows: [],
      error:
        "Excel 파일을 읽는 중 오류가 발생했습니다. 파일 형식을 확인해주세요.",
    };
  }
};

/**
 * 파싱 결과를 사용자 친화적인 메시지로 변환
 */
export const formatParseResultMessage = (result: ParseResult): string => {
  if (!result.success || result.applicants.length === 0) {
    return (
      result.error || "추가된 지원자가 없습니다. 파일 내용을 확인해주세요."
    );
  }

  let message = `${result.applicants.length}명의 지원자가 추가되었습니다.`;

  if (result.duplicateEmails.length > 0) {
    message += ` 중복 ${result.duplicateEmails.length}개 제외.`;
  }

  if (result.invalidRows.length > 0) {
    message += ` 잘못된 데이터 ${result.invalidRows.length}개 제외.`;
  }

  return message;
};
