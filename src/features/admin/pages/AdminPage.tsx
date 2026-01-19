import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { useUser } from "@/shared/hooks/useUser";
import { Navigate, useNavigate } from "react-router-dom";
import {
  MdPeople,
  MdAssessment,
  MdQuiz,
  MdSettings,
  MdSecurity,
  MdChevronRight,
  MdBusiness,
} from "react-icons/md";
import { useSurveys } from "../hooks/useSurveys";
import { useAllBusinessVerifications } from "../hooks/useBusinessVerifications";
import {
  usePageSEO,
  WORKSAUCE_SEO_PRESETS,
} from "@/shared/hooks/usePageSEO";

export const AdminPage = () => {
  usePageSEO(WORKSAUCE_SEO_PRESETS.admin);
  const { isAdmin, isLoading } = useUser();
  const { data: surveys } = useSurveys();
  const { data: verifications } = useAllBusinessVerifications();
  const navigate = useNavigate();

  // 관리자가 아닌 경우 대시보드로 리다이렉트
  if (!isLoading && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // 로딩 중
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner h-8 w-8 text-primary-500" />
      </div>
    );
  }

  // 통계 계산
  const surveysCount = surveys?.length || 0;
  const avgRating = surveys
    ? surveys.reduce((sum, s) => sum + (s.q1 + s.q2 + s.q3) / 3, 0) /
      (surveysCount || 1)
    : 0;

  const verificationsCount = verifications?.length || 0;
  const pendingVerifications =
    verifications?.filter(v => v.status === "pending").length || 0;

  const adminCards = [
    {
      id: "surveys",
      title: "설문조사 관리",
      description: "미니 테스트 설문조사 응답 현황 및 관리",
      icon: MdQuiz,
      color: "bg-blue-500",
      stats: [
        { label: "총 응답", value: surveysCount },
        { label: "평균 평점", value: `${avgRating.toFixed(1)}/5.0` },
      ],
      enabled: true,
      path: "/admin/surveys",
    },
    {
      id: "business-verifications",
      title: "기업 인증 관리",
      description: "기업 회원 인증 신청 검토 및 승인/거부",
      icon: MdBusiness,
      color: "bg-emerald-500",
      stats: [
        { label: "총 신청", value: verificationsCount },
        { label: "대기 중", value: pendingVerifications },
      ],
      enabled: true,
      path: "/admin/business-verifications",
    },
    {
      id: "users",
      title: "사용자 관리",
      description: "전체 사용자 목록 및 권한 관리",
      icon: MdPeople,
      color: "bg-green-500",
      stats: [{ label: "준비중", value: "-" }],
      enabled: false,
    },
    {
      id: "analytics",
      title: "통계 및 리포트",
      description: "플랫폼 사용 통계 및 분석",
      icon: MdAssessment,
      color: "bg-purple-500",
      stats: [{ label: "준비중", value: "-" }],
      enabled: false,
    },
    {
      id: "settings",
      title: "시스템 설정",
      description: "전역 설정 및 환경 구성",
      icon: MdSettings,
      color: "bg-orange-500",
      stats: [{ label: "준비중", value: "-" }],
      enabled: false,
    },
  ];

  const handleCardClick = (card: (typeof adminCards)[0]) => {
    if (card.enabled && card.path) {
      navigate(card.path);
    }
  };

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "대시보드", href: "/dashboard" },
        { label: "관리자" },
      ]}
    >
      <div className="space-y-6">
        {/* 안내 메시지 */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MdSecurity className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-primary-900">관리자 권한</h3>
              <p className="text-sm text-primary-700 mt-1">
                이 페이지는 관리자만 접근할 수 있습니다. 시스템 관리 기능을
                안전하게 사용하세요.
              </p>
            </div>
          </div>
        </div>

        {/* 관리자 기능 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminCards.map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`bg-white border border-neutral-200 rounded-xl p-6 transition-all duration-200 ${
                  card.enabled
                    ? "hover:shadow-lg hover:border-primary-200 cursor-pointer group"
                    : "opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {card.title}
                        </h3>
                        {!card.enabled && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-600 rounded">
                            개발 예정
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-neutral-600 mb-4">
                      {card.description}
                    </p>

                    {/* 통계 */}
                    <div className="flex gap-4">
                      {card.stats.map((stat, idx) => (
                        <div
                          key={idx}
                          className="bg-neutral-50 rounded-lg px-3 py-2"
                        >
                          <p className="text-xs text-neutral-600">
                            {stat.label}
                          </p>
                          <p className="text-lg font-bold text-neutral-900 mt-0.5">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {card.enabled && (
                    <MdChevronRight className="w-6 h-6 text-neutral-400 group-hover:text-primary-600 transition-colors mt-1 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 추가 정보 */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
          <h4 className="font-semibold text-neutral-900 mb-2">개발 로드맵</h4>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>설문조사 관리 시스템 구축 완료</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>기업 인증 관리 시스템 구축 완료</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neutral-400 mt-0.5">○</span>
              <span>신규 사용자 추이 그래프 (예정)</span>
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};
