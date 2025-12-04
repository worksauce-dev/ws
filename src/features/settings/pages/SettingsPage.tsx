import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { useAuth } from "@/shared/contexts/useAuth";
import {
  MdPerson,
  MdNotifications,
  MdSecurity,
  MdLanguage,
  MdChevronRight,
  MdBusiness,
  MdUploadFile,
  MdCheckCircle,
  MdPending,
} from "react-icons/md";

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security" | "preferences" | "business">("profile");

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const settingsSections = [
    {
      id: "profile",
      title: "프로필",
      icon: <MdPerson className="w-5 h-5" />,
      description: "개인 정보 및 계정 설정",
    },
    {
      id: "business",
      title: "기업 인증",
      icon: <MdBusiness className="w-5 h-5" />,
      description: "기업 회원 인증 및 혜택",
    },
    {
      id: "notifications",
      title: "알림",
      icon: <MdNotifications className="w-5 h-5" />,
      description: "이메일 및 푸시 알림 설정",
    },
    {
      id: "security",
      title: "보안",
      icon: <MdSecurity className="w-5 h-5" />,
      description: "비밀번호 및 보안 설정",
    },
    {
      id: "preferences",
      title: "환경 설정",
      icon: <MdLanguage className="w-5 h-5" />,
      description: "언어, 테마 및 기타 설정",
    },
  ];

  return (
    <DashboardLayout
      title="설정"
      description="계정 및 앱 설정을 관리하세요"
      showBackButton={true}
      onBackClick={handleBackClick}
      breadcrumbs={[
        { label: "대시보드", href: "/dashboard" },
        { label: "설정" },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드바 메뉴 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <nav className="space-y-1">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id as typeof activeTab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeTab === section.id
                        ? "bg-primary-50 text-primary"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    {section.icon}
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-800 mb-2">
                      프로필 정보
                    </h2>
                    <p className="text-sm text-neutral-600">
                      개인 정보를 관리하고 업데이트하세요
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        이름
                      </label>
                      <input
                        type="text"
                        value={user?.user_metadata?.name || ""}
                        readOnly
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        이메일
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        readOnly
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-800"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        disabled
                        className="px-6 py-3 bg-neutral-100 text-neutral-400 rounded-lg cursor-not-allowed"
                      >
                        프로필 수정 (준비 중)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-800 mb-2">
                      알림 설정
                    </h2>
                    <p className="text-sm text-neutral-600">
                      받고 싶은 알림을 선택하세요
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        title: "이메일 알림",
                        description: "새로운 지원자 및 테스트 완료 알림",
                      },
                      {
                        title: "마감일 리마인더",
                        description: "그룹 마감일 3일 전 알림",
                      },
                      {
                        title: "주간 리포트",
                        description: "매주 월요일 채용 현황 요약",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-neutral-800">
                            {item.title}
                          </p>
                          <p className="text-sm text-neutral-600 mt-1">
                            {item.description}
                          </p>
                        </div>
                        <div className="text-sm text-neutral-400">준비 중</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-800 mb-2">
                      보안 설정
                    </h2>
                    <p className="text-sm text-neutral-600">
                      계정 보안을 강화하세요
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button
                      disabled
                      className="w-full flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <div className="text-left">
                        <p className="font-medium text-neutral-800">
                          비밀번호 변경
                        </p>
                        <p className="text-sm text-neutral-600 mt-1">
                          정기적으로 비밀번호를 변경하세요
                        </p>
                      </div>
                      <MdChevronRight className="w-5 h-5 text-neutral-400" />
                    </button>

                    <button
                      disabled
                      className="w-full flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <div className="text-left">
                        <p className="font-medium text-neutral-800">
                          2단계 인증
                        </p>
                        <p className="text-sm text-neutral-600 mt-1">
                          추가 보안 계층 활성화
                        </p>
                      </div>
                      <MdChevronRight className="w-5 h-5 text-neutral-400" />
                    </button>

                    <div className="pt-4 text-sm text-neutral-500">
                      * 보안 기능은 곧 제공될 예정입니다
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "business" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-800 mb-2">
                      기업 인증
                    </h2>
                    <p className="text-sm text-neutral-600">
                      기업 회원으로 인증하고 이메일에 회사명을 표시하세요
                    </p>
                  </div>

                  {/* 혜택 안내 */}
                  <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                    <h3 className="font-semibold text-primary-800 mb-3">
                      기업 인증 혜택
                    </h3>
                    <div className="flex items-start gap-2 text-sm text-primary-700">
                      <MdCheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>
                        지원자에게 발송되는 검사 이메일에 귀사의 회사명이 표시됩니다
                      </span>
                    </div>
                  </div>

                  {/* 기업 정보 입력 폼 */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        회사명 *
                      </label>
                      <input
                        type="text"
                        placeholder="예) 주식회사 워크소스"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-neutral-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        사업자등록번호 *
                      </label>
                      <input
                        type="text"
                        placeholder="예) 123-45-67890"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-neutral-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        대표자명 *
                      </label>
                      <input
                        type="text"
                        placeholder="예) 홍길동"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-neutral-800"
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
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-neutral-800"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            담당자 이메일 *
                          </label>
                          <input
                            type="email"
                            placeholder="예) manager@company.com"
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-neutral-800"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        사업자등록증 *
                      </label>
                      <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary transition-colors duration-200 cursor-pointer">
                        <MdUploadFile className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                        <p className="text-sm text-neutral-700 mb-1">
                          클릭하여 파일 업로드
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
                      <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary transition-colors duration-200 cursor-pointer">
                        <MdUploadFile className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                        <p className="text-sm text-neutral-700 mb-1">
                          클릭하여 파일 업로드
                        </p>
                        <p className="text-xs text-neutral-500">
                          JPG, PNG, PDF (최대 10MB)
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button
                        disabled
                        className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200 disabled:bg-neutral-300 disabled:cursor-not-allowed"
                      >
                        인증 신청 (준비 중)
                      </button>
                    </div>

                    <p className="text-xs text-neutral-500">
                      * 제출하신 정보는 기업 인증 심사를 위해서만 사용되며, 승인까지 1-3 영업일이 소요됩니다.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "preferences" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-800 mb-2">
                      환경 설정
                    </h2>
                    <p className="text-sm text-neutral-600">
                      앱 사용 환경을 개인화하세요
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border border-neutral-200 rounded-lg">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        언어
                      </label>
                      <select
                        disabled
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-800"
                      >
                        <option>한국어</option>
                      </select>
                    </div>

                    <div className="p-4 border border-neutral-200 rounded-lg">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        테마
                      </label>
                      <select
                        disabled
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-800"
                      >
                        <option>라이트 모드</option>
                        <option>다크 모드 (준비 중)</option>
                      </select>
                    </div>

                    <div className="pt-4 text-sm text-neutral-500">
                      * 환경 설정 기능은 곧 제공될 예정입니다
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
    </DashboardLayout>
  );
};
