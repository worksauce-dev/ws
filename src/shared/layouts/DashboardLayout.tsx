import { type ReactNode } from "react";
import { DashboardHeader } from "@/shared/layouts/DashboardHeader";
import { DashboardProvider } from "@/shared/layouts/DashboardContext";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface DashboardLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl";
  padding?: "sm" | "md" | "lg";
  onCreditClick?: () => void;
}

export const DashboardLayout = ({
  children,
  breadcrumbs,
  actions,
  maxWidth = "7xl",
  padding = "lg",
  onCreditClick,
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

  return (
    <DashboardProvider onCreditClick={onCreditClick}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <DashboardHeader breadcrumbs={breadcrumbs} actions={actions} />

        {/* Main Content */}
        <div
          className={`${getMaxWidthClass()} mx-auto px-4 sm:px-6 lg:px-8 ${getPaddingClass()}`}
        >
          {children}
        </div>
      </div>
    </DashboardProvider>
  );
};
