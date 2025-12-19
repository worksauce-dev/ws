import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { SettingsSidebar } from "../components/SettingsSidebar";
import { ProfileSection } from "../components/ProfileSection";
import { BusinessSection } from "../components/BusinessSection";
import { NotificationsSection } from "../components/NotificationsSection";
import type { SettingsTab } from "../types/settings.types";

export const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection />;
      case "business":
        return <BusinessSection />;
      case "notifications":
        return <NotificationsSection />;
      default:
        return <ProfileSection />;
    }
  };

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
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* 메인 컨텐츠 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
