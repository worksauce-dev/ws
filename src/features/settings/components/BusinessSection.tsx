import { useState, useRef, useEffect } from "react";
import {
  MdUploadFile,
  MdCheckCircle,
  MdError,
  MdOpenInNew,
} from "react-icons/md";
import toast from "react-hot-toast";
import {
  useBusinessVerificationStatus,
  useCreateBusinessVerification,
} from "../hooks/useBusinessVerification";
import { getSignedUrl } from "../api/businessApi";
import type { BusinessVerificationFormData } from "../types/business.types";

export const BusinessSection = () => {
  const { data: verification, isLoading: isLoadingStatus } =
    useBusinessVerificationStatus();
  const { mutate: submitVerification, isPending } =
    useCreateBusinessVerification();

  const [formData, setFormData] = useState<BusinessVerificationFormData>({
    company_name: "",
    business_number: "",
    ceo_name: "",
    manager_name: "",
    manager_email: "",
    business_registration_doc: null,
    employment_certificate: null,
  });

  // 인증 데이터가 있으면 폼에 채우기
  useEffect(() => {
    if (verification) {
      setFormData({
        company_name: verification.company_name,
        business_number: verification.business_number,
        ceo_name: verification.ceo_name,
        manager_name: verification.manager_name,
        manager_email: verification.manager_email,
        business_registration_doc: null,
        employment_certificate: null,
      });
    }
  }, [verification]);

  const businessRegInputRef = useRef<HTMLInputElement>(null);
  const employmentCertInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    field: keyof BusinessVerificationFormData,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (
    field: "business_registration_doc" | "employment_certificate",
    file: File | null
  ) => {
    if (file) {
      // 파일 크기 체크 (10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("파일 크기는 10MB를 초과할 수 없습니다.");
        return;
      }

      // 파일 형식 체크
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("JPG, PNG, PDF 파일만 업로드 가능합니다.");
        return;
      }
    }

    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = () => {
    // 유효성 검사
    if (
      !formData.company_name ||
      !formData.business_number ||
      !formData.ceo_name ||
      !formData.manager_name ||
      !formData.manager_email ||
      !formData.business_registration_doc ||
      !formData.employment_certificate
    ) {
      toast.error("모든 필수 항목을 입력해주세요.");
      return;
    }

    // 이메일 형식 체크
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.manager_email)) {
      toast.error("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    submitVerification(formData);
  };

  // 로딩 스켈레톤 렌더링
  const renderLoadingSkeleton = () => {
    return (
      <div className="space-y-6 animate-pulse">
        {/* 상태 카드 스켈레톤 */}
        <div className="bg-neutral-100 rounded-lg h-24" />

        {/* 폼 필드 스켈레톤 */}
        <div className="space-y-4">
          <div className="h-10 bg-neutral-100 rounded-lg" />
          <div className="h-10 bg-neutral-100 rounded-lg" />
          <div className="h-10 bg-neutral-100 rounded-lg" />
          <div className="h-32 bg-neutral-100 rounded-lg" />
        </div>
      </div>
    );
  };

  // 인증 상태에 따른 UI 렌더링
  const renderVerificationStatus = () => {
    if (!verification) {
      return null;
    }

    const statusConfig = {
      pending: {
        icon: <MdCheckCircle className="w-5 h-5 text-green-500" />,
        title: "인증 심사 중",
        description:
          "제출하신 서류를 검토 중입니다. 승인까지 1-3 영업일이 소요됩니다.",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      },
      approved: {
        icon: <MdCheckCircle className="w-5 h-5 text-green-500" />,
        title: "인증 완료",
        description: "기업 회원으로 인증되었습니다.",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      },
      rejected: {
        icon: <MdError className="w-5 h-5 text-red-500" />,
        title: "인증 거부됨",
        description:
          verification.rejection_reason ||
          "인증이 거부되었습니다. 다시 신청해주세요.",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      },
    };

    const config = statusConfig[verification.status];

    return (
      <div
        className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 mb-6`}
      >
        <div className="flex items-start gap-3">
          {config.icon}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-neutral-800 mb-1">
              {config.title}
            </h3>
            <p className="text-sm text-neutral-600">{config.description}</p>
          </div>
        </div>
      </div>
    );
  };

  // pending 상태일 때는 폼 비활성화
  const isFormDisabled =
    verification?.status === "pending" || verification?.status === "approved";

  // 서류 보기 핸들러
  const handleViewDocument = async (filePath: string) => {
    try {
      const { url, error } = await getSignedUrl(filePath, 3600);
      if (error || !url) {
        toast.error(error || "파일을 불러올 수 없습니다.");
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("View document error:", err);
      toast.error("파일을 불러오는 중 오류가 발생했습니다.");
    }
  };

  // 승인된 경우 정보 카드 렌더링
  const renderApprovedInfo = () => {
    if (!verification || verification.status !== "approved") return null;

    return (
      <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">
          인증된 기업 정보
        </h3>

        {/* 기업 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">
              회사명
            </label>
            <p className="text-neutral-900 font-medium">
              {verification.company_name}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">
              사업자등록번호
            </label>
            <p className="text-neutral-900 font-medium">
              {verification.business_number}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">
              대표자명
            </label>
            <p className="text-neutral-900 font-medium">
              {verification.ceo_name}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">
              담당자 이름
            </label>
            <p className="text-neutral-900 font-medium">
              {verification.manager_name}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-600 mb-1">
              담당자 이메일
            </label>
            <p className="text-neutral-900 font-medium">
              {verification.manager_email}
            </p>
          </div>
        </div>

        {/* 서류 보기 */}
        <div className="pt-4 border-t border-neutral-200">
          <label className="block text-sm font-medium text-neutral-600 mb-3">
            제출 서류
          </label>
          <div className="flex flex-wrap gap-3">
            {verification.business_registration_doc_url && (
              <button
                onClick={() =>
                  handleViewDocument(
                    verification.business_registration_doc_url!
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
              >
                <MdOpenInNew className="w-4 h-4" />
                사업자등록증 보기
              </button>
            )}
            {verification.employment_certificate_url && (
              <button
                onClick={() =>
                  handleViewDocument(verification.employment_certificate_url!)
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
              >
                <MdOpenInNew className="w-4 h-4" />
                재직증명서 보기
              </button>
            )}
          </div>
        </div>

        {/* 인증 일시 */}
        {verification.verified_at && (
          <div className="pt-4 border-t border-neutral-200">
            <label className="block text-sm font-medium text-neutral-600 mb-1">
              인증 일시
            </label>
            <p className="text-sm text-neutral-700">
              {new Date(verification.verified_at).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-800 mb-2">기업 인증</h2>
        <p className="text-sm text-neutral-600">
          기업 회원으로 인증하고 이메일에 회사명을 표시하세요
        </p>
      </div>

      {isLoadingStatus ? (
        renderLoadingSkeleton()
      ) : (
        <>
          {renderVerificationStatus()}
          {renderApprovedInfo()}

          {/* 승인된 경우 폼 숨김 */}
          {verification?.status === "approved" ? null : (
        <>
          {/* 기업 정보 입력 폼 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                회사명 *
              </label>
              <input
                type="text"
                placeholder="예) 주식회사 워크소스"
                value={formData.company_name}
                onChange={e =>
                  handleInputChange("company_name", e.target.value)
                }
                disabled={isFormDisabled}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-neutral-800 disabled:bg-neutral-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                사업자등록번호 *
              </label>
              <input
                type="text"
                placeholder="예) 123-45-67890"
                value={formData.business_number}
                onChange={e =>
                  handleInputChange("business_number", e.target.value)
                }
                disabled={isFormDisabled}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-neutral-800 disabled:bg-neutral-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                대표자명 *
              </label>
              <input
                type="text"
                placeholder="예) 홍길동"
                value={formData.ceo_name}
                onChange={e => handleInputChange("ceo_name", e.target.value)}
                disabled={isFormDisabled}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-neutral-800 disabled:bg-neutral-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <h3 className="text-sm font-semibold text-neutral-800 mb-4">
                담당자 정보
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    담당자 이름 *
                  </label>
                  <input
                    type="text"
                    placeholder="예) 김담당"
                    value={formData.manager_name}
                    onChange={e =>
                      handleInputChange("manager_name", e.target.value)
                    }
                    disabled={isFormDisabled}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-neutral-800 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    담당자 이메일 *
                  </label>
                  <input
                    type="email"
                    placeholder="예) manager@company.com"
                    value={formData.manager_email}
                    onChange={e =>
                      handleInputChange("manager_email", e.target.value)
                    }
                    disabled={isFormDisabled}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-neutral-800 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                사업자등록증 *
              </label>
              <input
                ref={businessRegInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={e =>
                  handleFileUpload(
                    "business_registration_doc",
                    e.target.files?.[0] || null
                  )
                }
                disabled={isFormDisabled}
                className="hidden"
              />
              <div
                onClick={() =>
                  !isFormDisabled && businessRegInputRef.current?.click()
                }
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                  isFormDisabled
                    ? "border-neutral-200 bg-neutral-50 cursor-not-allowed"
                    : "border-neutral-300 hover:border-primary cursor-pointer"
                }`}
              >
                <MdUploadFile className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-sm text-neutral-700 mb-1">
                  {formData.business_registration_doc
                    ? formData.business_registration_doc.name
                    : "클릭하여 파일 업로드"}
                </p>
                <p className="text-xs text-neutral-500">
                  JPG, PNG, PDF (최대 10MB)
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                재직증명서 *
              </label>
              <input
                ref={employmentCertInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={e =>
                  handleFileUpload(
                    "employment_certificate",
                    e.target.files?.[0] || null
                  )
                }
                disabled={isFormDisabled}
                className="hidden"
              />
              <div
                onClick={() =>
                  !isFormDisabled && employmentCertInputRef.current?.click()
                }
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                  isFormDisabled
                    ? "border-neutral-200 bg-neutral-50 cursor-not-allowed"
                    : "border-neutral-300 hover:border-primary cursor-pointer"
                }`}
              >
                <MdUploadFile className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-sm text-neutral-700 mb-1">
                  {formData.employment_certificate
                    ? formData.employment_certificate.name
                    : "클릭하여 파일 업로드"}
                </p>
                <p className="text-xs text-neutral-500">
                  JPG, PNG, PDF (최대 10MB)
                </p>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={isFormDisabled || isPending}
                className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200 disabled:bg-green-500 disabled:cursor-not-allowed"
              >
                {isPending
                  ? "신청 중..."
                  : isFormDisabled
                    ? "인증 신청 완료"
                    : "인증 신청"}
              </button>
            </div>

            <p className="text-xs text-neutral-500">
              * 제출하신 정보는 기업 인증 심사를 위해서만 사용되며, 승인까지 1-3
              영업일이 소요됩니다.
            </p>
          </div>
        </>
      )}
        </>
      )}
    </div>
  );
};
