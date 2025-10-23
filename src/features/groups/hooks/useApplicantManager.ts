import { useState, useCallback, useMemo } from "react";
import {
  type Applicant,
  validateApplicant,
  isDuplicateEmail,
  generateApplicantId,
} from "../utils/applicantValidator";
import {
  type UseApplicantManagerReturn,
  type NewApplicantForm,
} from "../types/applicant.types";

/**
 * 지원자 관리 hook
 * 지원자 추가, 삭제, 검색, 선택 등의 기능을 제공합니다
 */
export const useApplicantManager = (): UseApplicantManagerReturn => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [newApplicant, setNewApplicant] = useState<NewApplicantForm>({
    name: "",
    email: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);

  // 검색된 지원자 목록 (computed)
  const filteredApplicants = useMemo(() => {
    if (!searchTerm) return applicants;

    return applicants.filter(
      applicant =>
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [applicants, searchTerm]);

  // 지원자 입력 필드 변경
  const handleApplicantInputChange = useCallback(
    (field: "name" | "email", value: string) => {
      setNewApplicant(prev => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  // 단일 지원자 추가
  const addApplicant = useCallback((): { success: boolean; error?: string } => {
    const validation = validateApplicant(newApplicant.name, newApplicant.email);

    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    if (isDuplicateEmail(newApplicant.email, applicants)) {
      return { success: false, error: "이미 추가된 이메일입니다." };
    }

    const newApplicantWithId: Applicant = {
      id: generateApplicantId(),
      name: newApplicant.name.trim(),
      email: newApplicant.email.trim(),
    };

    setApplicants(prev => [...prev, newApplicantWithId]);
    setNewApplicant({ name: "", email: "" });

    return { success: true };
  }, [newApplicant, applicants]);

  // 여러 지원자 추가 (Excel 업로드용)
  const addApplicants = useCallback((newApplicants: Applicant[]) => {
    setApplicants(prev => [...prev, ...newApplicants]);
  }, []);

  // 지원자 삭제
  const removeApplicant = useCallback((id: string) => {
    setApplicants(prev => prev.filter(applicant => applicant.id !== id));
    setSelectedApplicants(prev => prev.filter(selectedId => selectedId !== id));
  }, []);

  // 지원자 선택/해제 토글
  const handleToggleSelect = useCallback((id: string) => {
    setSelectedApplicants(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  }, []);

  // 전체 선택/해제
  const handleSelectAllChange = useCallback(
    (checked: boolean) => {
      if (checked) {
        const allFilteredIds = filteredApplicants.map(
          applicant => applicant.id
        );
        setSelectedApplicants(allFilteredIds);
      } else {
        setSelectedApplicants([]);
      }
    },
    [filteredApplicants]
  );

  // 선택된 지원자 삭제
  const handleDeleteSelected = useCallback(() => {
    if (selectedApplicants.length === 0) return;

    setApplicants(prev =>
      prev.filter(applicant => !selectedApplicants.includes(applicant.id))
    );
    setSelectedApplicants([]);
  }, [selectedApplicants]);

  // 전체선택 체크박스 상태 계산
  const getSelectAllState = useCallback((): {
    checked: boolean;
    indeterminate: boolean;
  } => {
    if (filteredApplicants.length === 0) {
      return { checked: false, indeterminate: false };
    }

    const selectedFilteredCount = filteredApplicants.filter(applicant =>
      selectedApplicants.includes(applicant.id)
    ).length;

    if (selectedFilteredCount === 0) {
      return { checked: false, indeterminate: false };
    } else if (selectedFilteredCount === filteredApplicants.length) {
      return { checked: true, indeterminate: false };
    } else {
      return { checked: false, indeterminate: true };
    }
  }, [filteredApplicants, selectedApplicants]);

  return {
    // State
    applicants,
    newApplicant,
    searchTerm,
    selectedApplicants,
    filteredApplicants,

    // Actions
    setNewApplicant,
    setSearchTerm,
    handleApplicantInputChange,
    addApplicant,
    addApplicants,
    removeApplicant,
    handleToggleSelect,
    handleSelectAllChange,
    handleDeleteSelected,
    getSelectAllState,
  };
};
