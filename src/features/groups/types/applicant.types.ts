import type { Applicant } from "../utils/applicantValidator";

export interface NewApplicantForm {
  name: string;
  email: string;
}

export interface UseApplicantManagerReturn {
  // State
  applicants: Applicant[];
  newApplicant: NewApplicantForm;
  searchTerm: string;
  selectedApplicants: string[];
  filteredApplicants: Applicant[];

  // Actions
  setNewApplicant: React.Dispatch<React.SetStateAction<NewApplicantForm>>;
  setSearchTerm: (term: string) => void;
  handleApplicantInputChange: (field: "name" | "email", value: string) => void;
  addApplicant: () => { success: boolean; error?: string };
  addApplicants: (applicants: Applicant[]) => void;
  removeApplicant: (id: string) => void;
  handleToggleSelect: (id: string) => void;
  handleSelectAllChange: (checked: boolean) => void;
  handleDeleteSelected: () => void;
  getSelectAllState: () => { checked: boolean; indeterminate: boolean };
}
