import { type ReactNode } from "react";
import { DashboardHeader } from "@/shared/layouts/DashboardHeader";
import { useAuth } from "@/shared/contexts/useAuth";
import type { UserProfile } from "@/shared/lib/supabase";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  showBackButton?: boolean;
  onBackClick?: () => void;
  actions?: ReactNode;
  statusBadge?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl";
  padding?: "sm" | "md" | "lg";
  credits?: number;
  onCreditClick?: () => void;
  creditsLoading?: boolean;
}

export const DashboardLayout = ({
  children,
  title,
  description,
  breadcrumbs,
  showBackButton = false,
  onBackClick,
  actions,
  statusBadge,
  maxWidth = "7xl",
  padding = "lg",
  credits,
  onCreditClick,
  creditsLoading = false,
}: DashboardLayoutProps) => {
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case "sm":
        return "max-w-sm";
      case "md":
        return "max-w-md";
      case "lg":
        return "max-w-lg";
      case "xl":
        return "max-w-xl";
      case "2xl":
        return "max-w-2xl";
      case "7xl":
        return "max-w-7xl";
      default:
        return "max-w-7xl";
    }
  };

  const getPaddingClass = () => {
    switch (padding) {
      case "sm":
        return "py-4";
      case "md":
        return "py-6";
      case "lg":
        return "py-8";
      default:
        return "py-8";
    }
  };

  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // user 데이터를 userProfile 형태로 변환
  const userProfile: UserProfile = {
    id: user.id,
    created_at: user.created_at,
    updated_at: user.updated_at ?? user.created_at,
    email_verified: Boolean(user.user_metadata?.email_verified),
    name: (user.user_metadata?.name as string | undefined) ?? "사용자",
    email: user.email ?? "",
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        showBackButton={showBackButton}
        onBackClick={onBackClick}
        actions={actions}
        statusBadge={statusBadge}
        userProfile={userProfile}
        credits={credits}
        onCreditClick={onCreditClick}
        creditsLoading={creditsLoading}
      />

      {/* Main Content */}
      <div
        className={`${getMaxWidthClass()} mx-auto px-4 sm:px-6 lg:px-8 ${getPaddingClass()}`}
      >
        {children}
      </div>
    </div>
  );
};
