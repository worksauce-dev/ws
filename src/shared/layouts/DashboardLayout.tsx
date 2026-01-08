import { type ReactNode } from "react";
import { DashboardHeader } from "@/shared/layouts/DashboardHeader";
import { useUser } from "@/shared/hooks/useUser";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  statusBadge?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl";
  padding?: "sm" | "md" | "lg";
  onCreditClick?: () => void;
  creditsLoading?: boolean;
  isMobileMenuOpen?: boolean;
  onMobileMenuToggle?: (isOpen: boolean) => void;
}

export const DashboardLayout = ({
  children,
  title,
  description,
  breadcrumbs,
  actions,
  statusBadge,
  maxWidth = "7xl",
  padding = "lg",
  onCreditClick,
  creditsLoading = false,
  isMobileMenuOpen,
  onMobileMenuToggle,
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

  const { userName, userEmail, isAuthenticated, credits } = useUser();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader
        title={title || ""}
        description={description}
        breadcrumbs={breadcrumbs}
        actions={actions}
        statusBadge={statusBadge}
        userProfile={{
          name: userName,
          email: userEmail,
        }}
        credits={credits}
        onCreditClick={onCreditClick}
        creditsLoading={creditsLoading}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={onMobileMenuToggle}
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
