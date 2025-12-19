import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { useAuth } from "@/shared/contexts/useAuth";
import { useUserProfile } from "@/shared/hooks/useUserProfile";
import { Navigate } from "react-router-dom";
import { MdPeople, MdAssessment, MdSettings, MdSecurity } from "react-icons/md";

export const AdminPage = () => {
  const { user } = useAuth();
  const { data: userProfile, isLoading } = useUserProfile(user?.id);

  // 로딩 중
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner h-8 w-8 text-primary-500" />
      </div>
    );
  }

  // 관리자가 아닌 경우 대시보드로 리다이렉트
  if (!userProfile?.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  const adminCards = [
    {
      title: "사용자 관리",
      description: "전체 사용자 목록 및 권한 관리",
      icon: MdPeople,
      color: "bg-blue-500",
      count: "-",
    },
    {
      title: "통계 및 리포트",
      description: "플랫폼 사용 통계 및 분석",
      icon: MdAssessment,
      color: "bg-green-500",
      count: "-",
    },
    {
      title: "시스템 설정",
      description: "전역 설정 및 환경 구성",
      icon: MdSettings,
      color: "bg-purple-500",
      count: "-",
    },
    {
      title: "보안 및 로그",
      description: "시스템 로그 및 보안 모니터링",
      icon: MdSecurity,
      color: "bg-red-500",
      count: "-",
    },
  ];

  return (
    <DashboardLayout
      title="관리자 대시보드"
      description="시스템 관리 및 모니터링"
      breadcrumbs={[
        { label: "대시보드", href: "/dashboard" },
        { label: "관리자" },
      ]}
    >
      <div className="space-y-6">
        {/* 안내 메시지 */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MdSecurity className="w-5 h-5 text-primary-600 mt-0.5" />
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
          {adminCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`${card.color} w-10 h-10 rounded-lg flex items-center justify-center`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {card.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {card.description}
                    </p>
                    <div className="text-2xl font-bold text-gray-900">
                      {card.count}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 개발 중 안내 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">
            관리자 기능은 현재 개발 중입니다. 곧 제공될 예정입니다.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};
