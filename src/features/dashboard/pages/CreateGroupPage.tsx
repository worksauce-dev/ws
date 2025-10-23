import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdDelete,
  MdPerson,
  MdEmail,
  MdUpload,
  MdFileUpload,
  MdSearch,
  MdClear,
  MdCheckCircle,
} from "react-icons/md";
import { DashboardLayout } from "../DashboardLayout";
import {
  SelectDropdown,
  SearchableSelectDropdown,
} from "@/shared/components/ui/Dropdown";
import { Button } from "@/shared/components/ui/Button";
import { Checkbox } from "@/shared/components/ui/Checkbox";
import { Tooltip } from "@/shared/components/ui/Tooltip";
import { Modal } from "@/shared/components/ui/Modal";
import { useToast } from "@/shared/components/ui/Toast";
import * as XLSX from "xlsx";

interface Applicant {
  id: string;
  name: string;
  email: string;
}

const workTypeKeywords = [
  {
    type: "기준윤리형",
    code: "SE",
    keywords: ["책임감", "원칙주의"],
    description: "규칙과 윤리를 중시하며, 책임감 있게 업무를 수행하는 유형",
  },
  {
    type: "기준심미형",
    code: "SA",
    keywords: ["감성적", "혁신적"],
    description: "심미적 가치를 추구하며, 감성적이고 창의적인 접근을 하는 유형",
  },
  {
    type: "예술느낌형",
    code: "AS",
    keywords: ["독창성", "표현력"],
    description: "독창적인 아이디어로 자신만의 스타일을 표현하는 유형",
  },
  {
    type: "예술융합형",
    code: "AF",
    keywords: ["다양성", "실험정신"],
    description: "다양한 요소를 융합하여 새로운 시도를 하는 실험적 유형",
  },
  {
    type: "이해관리형",
    code: "UM",
    keywords: ["체계적", "신중함"],
    description: "체계적으로 정보를 분석하고 신중하게 관리하는 유형",
  },
  {
    type: "이해연구형",
    code: "UR",
    keywords: ["논리중심", "객관성"],
    description: "논리적 사고로 깊이 있게 연구하고 분석하는 유형",
  },
  {
    type: "소통도움형",
    code: "CA",
    keywords: ["협력적", "감정인지"],
    description: "타인을 배려하고 협력하여 도움을 주는 공감 능력이 뛰어난 유형",
  },
  {
    type: "소통조화형",
    code: "CH",
    keywords: ["중재력", "안정감"],
    description: "갈등을 조율하고 팀의 조화를 이끌어내는 안정적인 유형",
  },
  {
    type: "도전확장형",
    code: "EE",
    keywords: ["모험적", "전략적"],
    description: "새로운 기회를 찾아 전략적으로 확장하는 모험적 유형",
  },
  {
    type: "도전목표형",
    code: "EG",
    keywords: ["추진력", "효율성"],
    description: "명확한 목표를 설정하고 효율적으로 추진하는 실행력 있는 유형",
  },
];

const positionOptions = [
  // 👩‍💻 개발 / 기술
  { value: "frontend", label: "프론트엔드 개발자" },
  { value: "backend", label: "백엔드 개발자" },
  { value: "fullstack", label: "풀스택 개발자" },
  { value: "mobile", label: "모바일 앱 개발자 (iOS/Android)" },
  { value: "devops", label: "데브옵스 / 클라우드 엔지니어" },
  { value: "data", label: "데이터 분석가 / 데이터 엔지니어" },
  { value: "ai", label: "AI / 머신러닝 엔지니어" },

  // 🧭 기획 / 제품
  { value: "pm", label: "프로덕트 매니저 (PM)" },
  { value: "po", label: "프로덕트 오너 (PO)" },
  { value: "planner", label: "서비스 기획자" },

  // 🎨 디자인
  { value: "designer", label: "UI/UX 디자이너" },
  { value: "graphic", label: "그래픽 / 비주얼 디자이너" },
  { value: "motion", label: "모션 / 영상 디자이너" },

  // 📣 마케팅 / 콘텐츠
  { value: "marketing", label: "마케팅 담당자" },
  { value: "performance", label: "퍼포먼스 마케터" },
  { value: "content", label: "콘텐츠 마케터 / 에디터" },
  { value: "sns", label: "SNS 운영 / 커뮤니티 매니저" },

  // 💼 경영 / 운영
  { value: "operation", label: "운영 매니저 / 서비스 운영 담당자" },
  { value: "strategy", label: "사업 전략 / 기획 담당자" },
  { value: "finance", label: "재무 / 회계 담당자" },
  { value: "legal", label: "법무 / 컴플라이언스 담당자" },

  // 🧑‍🤝‍🧑 HR / 인사
  { value: "hr", label: "인사 담당자 (HR)" },
  { value: "recruiter", label: "리크루터 (채용 담당자)" },
  { value: "organization", label: "조직문화 / 교육 담당자" },

  // 💬 영업 / 고객지원
  { value: "sales", label: "영업 / 파트너십 담당자" },
  { value: "account", label: "어카운트 매니저" },
  { value: "cs", label: "고객지원 (CS) 담당자" },

  // 📚 교육 / 연구 / 엔지니어링
  { value: "education", label: "교육 담당자 / 강사" },
  { value: "research", label: "연구원 / R&D" },
  { value: "engineer", label: "산업 / 기계 / 전자 엔지니어" },

  // 🧩 기타
  { value: "intern", label: "인턴 / 어시스턴트" },
  { value: "freelancer", label: "프리랜서 / 계약직" },
  { value: "other", label: "기타" },
];

export const CreateGroupPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    position: "",
    experienceLevel: "",
    preferredWorkTypes: [] as string[],
    deadline: "",
    autoReminder: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [newApplicant, setNewApplicant] = useState({
    name: "",
    email: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 검색 및 필터링 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);

  // 드래그앤드롭 상태
  const [isDragOver, setIsDragOver] = useState(false);

  // 커스텀 포지션 모달 상태
  const [isCustomPositionModalOpen, setIsCustomPositionModalOpen] =
    useState(false);
  const [customPosition, setCustomPosition] = useState("");
  const [customPositionList, setCustomPositionList] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWorkTypeChange = (type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferredWorkTypes: checked
        ? [...prev.preferredWorkTypes, type]
        : prev.preferredWorkTypes.filter(t => t !== type),
    }));
  };

  const handlePositionChange = (value: string) => {
    if (value === "__custom__") {
      setIsCustomPositionModalOpen(true);
    } else {
      handleInputChange("position", value);
    }
  };

  const handleAddCustomPosition = () => {
    if (!customPosition.trim()) {
      showToast("warning", "포지션명 입력 필요", "포지션명을 입력해주세요.");
      return;
    }

    // 커스텀 포지션을 리스트에 추가
    const newPosition = {
      value: customPosition.trim(),
      label: customPosition.trim(),
    };
    setCustomPositionList(prev => [...prev, newPosition]);

    // 폼 데이터에 설정
    handleInputChange("position", newPosition.value);

    // 모달 닫기 및 입력 초기화
    setIsCustomPositionModalOpen(false);
    setCustomPosition("");

    showToast("success", "포지션 추가 완료", `"${newPosition.label}" 포지션이 추가되었습니다.`);
  };

  const handleApplicantInputChange = (
    field: "name" | "email",
    value: string
  ) => {
    setNewApplicant(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addApplicant = () => {
    if (!newApplicant.name.trim()) {
      showToast("warning", "이름 입력 필요", "지원자 이름을 입력해주세요.");
      return;
    }

    if (!newApplicant.email.trim()) {
      showToast("warning", "이메일 입력 필요", "지원자 이메일을 입력해주세요.");
      return;
    }

    if (!isValidEmail(newApplicant.email)) {
      showToast("error", "이메일 형식 오류", "올바른 이메일 주소를 입력해주세요.");
      return;
    }

    if (applicants.some(applicant => applicant.email === newApplicant.email)) {
      showToast("warning", "중복된 이메일", "이미 추가된 이메일입니다.");
      return;
    }

    const newApplicantWithId: Applicant = {
      id: Date.now().toString(),
      name: newApplicant.name.trim(),
      email: newApplicant.email.trim(),
    };

    setApplicants(prev => [...prev, newApplicantWithId]);
    setNewApplicant({ name: "", email: "" });

    showToast("success", "지원자 추가 완료", `${newApplicantWithId.name}님이 추가되었습니다.`);
  };

  const removeApplicant = (id: string) => {
    setApplicants(prev => prev.filter(applicant => applicant.id !== id));
  };

  async function processFiles(files: FileList | File[]) {
    const file = (Array.isArray(files) ? files : Array.from(files))[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls)$/)) {
      showToast("error", "파일 형식 오류", "Excel 파일만 업로드 가능합니다 (.xlsx, .xls)");
      return;
    }

    setIsUploading(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      }) as string[][];

      if (jsonData.length < 2) {
        showToast(
          "error",
          "데이터 없음",
          "Excel 파일에 데이터가 없습니다. 최소 2행(헤더 + 데이터)이 필요합니다."
        );
        return;
      }

      // 첫 번째 행을 헤더로 확인
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
        showToast(
          "error",
          "컬럼 누락",
          "Excel 파일에 '이름'과 '이메일' 컬럼이 필요합니다. 예: '이름', '이메일' 또는 'name', 'email'"
        );
        return;
      }

      const newApplicants: Applicant[] = [];
      const duplicateEmails: string[] = [];
      const invalidRows: number[] = [];

      // 데이터 행 처리 (헤더 제외)
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        const name = row[nameColumnIndex]?.toString().trim();
        const email = row[emailColumnIndex]?.toString().trim();

        if (!name || !email) {
          invalidRows.push(i + 1);
          continue;
        }

        if (!isValidEmail(email)) {
          invalidRows.push(i + 1);
          continue;
        }

        // 기존 지원자나 새로 추가될 지원자와 중복 확인
        if (
          applicants.some(applicant => applicant.email === email) ||
          newApplicants.some(applicant => applicant.email === email)
        ) {
          duplicateEmails.push(email);
          continue;
        }

        newApplicants.push({
          id: `${Date.now()}-${i}`,
          name,
          email,
        });
      }

      // 결과 알림
      if (newApplicants.length > 0) {
        setApplicants(prev => [...prev, ...newApplicants]);

        let message = `${newApplicants.length}명의 지원자가 추가되었습니다.`;
        if (duplicateEmails.length > 0) {
          message += ` 중복 ${duplicateEmails.length}개 제외.`;
        }
        if (invalidRows.length > 0) {
          message += ` 잘못된 데이터 ${invalidRows.length}개 제외.`;
        }

        showToast("success", "Excel 업로드 완료", message, 6000);
      } else {
        showToast(
          "warning",
          "업로드 실패",
          "추가된 지원자가 없습니다. 파일 내용을 확인해주세요."
        );
      }
    } catch (error) {
      console.error("Excel 파일 처리 중 오류:", error);
      showToast(
        "error",
        "파일 처리 실패",
        "Excel 파일을 읽는 중 오류가 발생했습니다. 파일 형식을 확인해주세요."
      );
    } finally {
      setIsUploading(false);
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;
    await processFiles(files);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // 드래그앤드롭 이벤트 핸들러들
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver && !isUploading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 드롭 영역을 완전히 벗어났을 때만 상태 변경
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (isUploading) return;

    const files = Array.from(e.dataTransfer.files);
    const excelFile = files.find(file => file.name.match(/\.(xlsx|xls)$/));

    if (!excelFile) {
      showToast("error", "파일 형식 오류", "Excel 파일(.xlsx, .xls)만 업로드 가능합니다.");
      return;
    }

    // 기존 파일 업로드 로직 재사용 (이벤트 모킹 대신 파일 배열 직접 전달)
    await processFiles([excelFile]);
  };

  // 필터링 및 검색 로직
  const filteredApplicants = applicants.filter(applicant => {
    // 검색어 필터링만
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // 벌크 선택 함수들
  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      const allFilteredIds = filteredApplicants.map(applicant => applicant.id);
      setSelectedApplicants(allFilteredIds);
    } else {
      setSelectedApplicants([]);
    }
  };

  // 전체선택 체크박스 상태 계산
  const getSelectAllState = () => {
    if (filteredApplicants.length === 0)
      return { checked: false, indeterminate: false };

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
  };

  const selectAllState = getSelectAllState();

  const handleToggleSelect = (id: string) => {
    setSelectedApplicants(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedApplicants.length === 0) return;

    if (
      confirm(
        `선택된 ${selectedApplicants.length}명의 지원자를 삭제하시겠습니까?`
      )
    ) {
      setApplicants(prev =>
        prev.filter(applicant => !selectedApplicants.includes(applicant.id))
      );
      setSelectedApplicants([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 폼 유효성 검사
    if (!formData.name.trim()) {
      showToast("warning", "그룹명 입력 필요", "그룹명을 입력해주세요.");
      return;
    }

    if (!formData.position) {
      showToast("warning", "포지션 선택 필요", "모집 포지션을 선택해주세요.");
      return;
    }

    if (!formData.deadline) {
      showToast("warning", "마감일 선택 필요", "마감일을 선택해주세요.");
      return;
    }

    if (applicants.length === 0) {
      showToast("warning", "지원자 추가 필요", "최소 1명 이상의 지원자를 추가해주세요.");
      return;
    }

    // TODO: 실제 그룹 생성 API 호출

    try {
      console.log("그룹 생성 중:", formData);
      setIsSubmitting(true);

      // 3초의 가짜 딜레이 (로딩 상태 테스트용)
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log("그룹 생성 완료 (가짜 성공)");

      // 성공 토스트
      showToast("success", "그룹 생성 완료", "채용 그룹이 성공적으로 생성되었습니다.");

      // 대시보드로 이동
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      console.error("그룹 생성 중 오류:", error);

      // 네트워크 오류 또는 서버 오류
      showToast(
        "error",
        "그룹 생성 실패",
        "그룹 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="새 채용 그룹 생성"
      description="새로운 채용 그룹을 생성하고 지원자들을 효과적으로 관리해보세요"
      showBackButton
      onBackClick={handleBackClick}
      breadcrumbs={[
        { label: "워크소스", href: "/" },
        { label: "대시보드", href: "/dashboard" },
        { label: "새 그룹 생성" },
      ]}
    >
      <div className="max-w-7xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-24" // ✅ 하단 padding 추가
        >
          {/* 좌측: 그룹 설정 (기본 정보 + 모집 정보 + 테스트 설정) */}
          <div className="xl:col-span-2 space-y-8">
            {/* 기본 정보 섹션 */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-800 mb-6">
                기본 정보
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    그룹명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => handleInputChange("name", e.target.value)}
                    placeholder="예: 2024년 3월 신입 개발자 채용"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    설명
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={e =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="채용 그룹에 대한 간단한 설명을 입력해주세요"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 모집 정보 섹션 */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-800 mb-6">
                모집 정보
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      모집 포지션 <span className="text-red-500">*</span>
                    </label>
                    <SearchableSelectDropdown
                      value={formData.position}
                      placeholder="포지션을 선택해주세요"
                      maxHeight="max-h-64"
                      options={[
                        ...customPositionList,
                        ...positionOptions,
                        {
                          value: "__custom__",
                          label: "+ 직접 추가하기",
                        },
                      ]}
                      onChange={handlePositionChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      경력 수준
                    </label>
                    <SelectDropdown
                      value={formData.experienceLevel}
                      placeholder="경력 수준을 선택해주세요"
                      options={[
                        { value: "entry", label: "신입 (0-1년)" },
                        { value: "junior", label: "주니어 (1-3년)" },
                        { value: "mid", label: "중급 (3-5년)" },
                        { value: "senior", label: "시니어 (5년 이상)" },
                        { value: "lead", label: "리드/매니저급" },
                        { value: "any", label: "경력 무관" },
                      ]}
                      onChange={value =>
                        handleInputChange("experienceLevel", value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    선호하는 유형 키워드
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {workTypeKeywords.map(type => {
                      const isSelected = formData.preferredWorkTypes.includes(
                        type.code
                      );
                      return (
                        <Tooltip
                          key={type.code}
                          content={type.description}
                          placement="top"
                        >
                          <div
                            onClick={() =>
                              handleWorkTypeChange(type.code, !isSelected)
                            }
                            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? "border-primary-500 bg-primary-50"
                                : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                            }`}
                          >
                            {/* 체크 아이콘 */}
                            {isSelected && (
                              <MdCheckCircle className="absolute top-3 right-3 w-5 h-5 text-primary-500" />
                            )}

                            <div className="flex flex-col pr-6">
                              <span
                                className={`text-sm font-medium ${
                                  isSelected
                                    ? "text-primary-700"
                                    : "text-neutral-800"
                                }`}
                              >
                                {type.type}
                              </span>
                              <span
                                className={`text-xs mt-0.5 ${
                                  isSelected
                                    ? "text-primary-600"
                                    : "text-neutral-500"
                                }`}
                              >
                                {type.keywords.join(" • ")}
                              </span>
                            </div>
                          </div>
                        </Tooltip>
                      );
                    })}
                  </div>
                  <p className="text-xs text-neutral-500 mt-3">
                    *선택하지 않으면 모든 유형을 대상으로 합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 테스트 설정 섹션 */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-800 mb-6">
                테스트 설정
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    마감일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={e =>
                      handleInputChange("deadline", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm text-neutral-800"
                    required
                  />
                  {/* 빠른 선택 버튼 */}
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 7);
                        handleInputChange(
                          "deadline",
                          date.toISOString().split("T")[0]
                        );
                      }}
                      className="text-xs px-3 py-1.5 rounded-md bg-neutral-50 text-neutral-600 hover:bg-neutral-100 transition-colors duration-200"
                    >
                      +7일
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 14);
                        handleInputChange(
                          "deadline",
                          date.toISOString().split("T")[0]
                        );
                      }}
                      className="text-xs px-3 py-1.5 rounded-md bg-neutral-50 text-neutral-600 hover:bg-neutral-100 transition-colors duration-200"
                    >
                      +14일
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 30);
                        handleInputChange(
                          "deadline",
                          date.toISOString().split("T")[0]
                        );
                      }}
                      className="text-xs px-3 py-1.5 rounded-md bg-neutral-50 text-neutral-600 hover:bg-neutral-100 transition-colors duration-200"
                    >
                      +30일
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    자동 리마인더
                  </label>
                  <SelectDropdown
                    value={formData.autoReminder}
                    placeholder="자동 리마인더 기능은 아직 준비중이에요."
                    options={[
                      { value: "on", label: "활성화 (권장)" },
                      { value: "off", label: "비활성화" },
                    ]}
                    disabled={true}
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  💡 테스트 설정 안내
                </h3>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>
                    • 테스트 기간은 지원자가 테스트를 완료할 수 있는 기간입니다
                  </li>
                  <li>
                    • 자동 리마인더를 활성화하면 미완료 지원자에게 알림을
                    보냅니다
                  </li>
                  <li>• 설정은 그룹 생성 후에도 언제든 변경할 수 있습니다</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 우측: 지원자 관리 섹션 */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-neutral-200 sticky top-8">
              <h2 className="text-lg font-semibold text-neutral-800 mb-6">
                지원자 관리
              </h2>

              {/* 지원자 추가 폼 */}
              <div className="space-y-4 mb-6">
                {/* Excel 파일 업로드 섹션 - 드래그앤드롭 지원 */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`p-4 rounded-lg border-2 border-dashed transition-all duration-200 ${
                    isDragOver
                      ? "bg-blue-100 border-blue-400 border-solid"
                      : isUploading
                        ? "bg-gray-50 border-gray-300"
                        : "bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
                  }`}
                >
                  <div className="text-center">
                    <MdFileUpload
                      className={`w-8 h-8 mx-auto mb-2 transition-colors duration-200 ${
                        isDragOver
                          ? "text-blue-700"
                          : isUploading
                            ? "text-gray-400"
                            : "text-blue-600"
                      }`}
                    />
                    <h4
                      className={`text-sm font-medium mb-1 transition-colors duration-200 ${
                        isDragOver
                          ? "text-blue-900"
                          : isUploading
                            ? "text-gray-600"
                            : "text-blue-800"
                      }`}
                    >
                      {isDragOver
                        ? "Excel 파일을 여기에 놓으세요"
                        : "Excel 파일로 일괄 추가"}
                    </h4>
                    <p
                      className={`text-xs mb-3 transition-colors duration-200 ${
                        isDragOver
                          ? "text-blue-700"
                          : isUploading
                            ? "text-gray-500"
                            : "text-blue-600"
                      }`}
                    >
                      {isDragOver
                        ? "Excel 파일(.xlsx, .xls)을 드롭하여 업로드"
                        : "Excel 파일(.xlsx, .xls)을 드래그하거나 클릭하여 업로드하세요"}
                    </p>

                    {!isDragOver && (
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        disabled={isUploading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200 flex items-center justify-center text-sm font-medium mx-auto"
                      >
                        {isUploading ? (
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
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* 구분선 */}
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-neutral-200" />
                  <span className="px-3 text-xs text-neutral-500 bg-white">
                    또는
                  </span>
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
                      value={newApplicant.name}
                      onChange={e =>
                        handleApplicantInputChange("name", e.target.value)
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
                      value={newApplicant.email}
                      onChange={e =>
                        handleApplicantInputChange("email", e.target.value)
                      }
                      placeholder="example@email.com"
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={addApplicant}
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
                  {applicants.length > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      {/* 전체선택 체크박스 */}
                      <div className="flex items-center gap-1.5 h-6">
                        <Checkbox
                          checked={selectAllState.checked}
                          ref={el => {
                            if (el)
                              el.indeterminate = selectAllState.indeterminate;
                          }}
                          onChange={handleSelectAllChange}
                          label={
                            <span className="text-neutral-600">
                              전체선택 ({filteredApplicants.length})
                            </span>
                          }
                          title="표시된 모든 지원자 선택/해제"
                          className="w-4 h-4"
                        />
                      </div>

                      {/* 선택된 개수 표시 */}
                      {selectedApplicants.length > 0 && (
                        <span className="flex items-center h-6 px-2 bg-primary-50 text-primary font-medium rounded">
                          {selectedApplicants.length}명
                        </span>
                      )}

                      {/* 선택 삭제 버튼 */}
                      {selectedApplicants.length > 0 && (
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

                {applicants.length === 0 ? (
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
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          placeholder="이름 또는 이메일로 검색"
                          className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm"
                        />
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm("")}
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
                        총 {applicants.length}명 중 {filteredApplicants.length}
                        명 표시
                      </span>
                    </div>

                    {/* 지원자 리스트 */}
                    <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-hide">
                      {filteredApplicants.length === 0 ? (
                        <div className="text-center py-4 text-neutral-500 text-sm">
                          검색 조건에 맞는 지원자가 없습니다
                        </div>
                      ) : (
                        filteredApplicants.map(applicant => (
                          <div
                            key={applicant.id}
                            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                              selectedApplicants.includes(applicant.id)
                                ? "bg-primary-50 border border-primary-200"
                                : "bg-neutral-50 hover:bg-neutral-100"
                            }`}
                          >
                            {/* 체크박스 */}
                            <input
                              type="checkbox"
                              checked={selectedApplicants.includes(
                                applicant.id
                              )}
                              onChange={() => handleToggleSelect(applicant.id)}
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
                              onClick={() => removeApplicant(applicant.id)}
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
                  <li>• 중복 이메일은 자동으로 제외됩니다</li>
                  <li>• 테스트 링크가 자동 발송됩니다</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="xl:col-span-1">
            {/* ... 기존 지원자 관리 섹션 그대로 유지 ... */}
          </div>
        </form>

        {/* ✅ 하단 고정 액션바 */}
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-neutral-200 px-6 py-4 flex justify-end gap-3 shadow-sm z-50">
          <Button
            type="button"
            onClick={handleBackClick}
            variant="outline"
            size="md"
          >
            취소
          </Button>
          <Button
            type="submit"
            form="create-group-form"
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting ? "그룹 생성중..." : "그룹 생성하기"}
          </Button>
        </div>
      </div>

      {/* 커스텀 포지션 추가 모달 */}
      <Modal
        isOpen={isCustomPositionModalOpen}
        onClose={() => {
          setIsCustomPositionModalOpen(false);
          setCustomPosition("");
        }}
        title="직접 포지션 추가"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              포지션명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customPosition}
              onChange={e => setCustomPosition(e.target.value)}
              placeholder="예: 블록체인 개발자"
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm text-neutral-800"
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomPosition();
                }
              }}
              autoFocus
            />
            <p className="text-xs text-neutral-500 mt-2">
              목록에 없는 포지션을 직접 추가할 수 있습니다.
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsCustomPositionModalOpen(false);
                setCustomPosition("");
              }}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleAddCustomPosition}
            >
              추가
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};
