import { type ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdChevronRight,
  MdSettings,
  MdLogout,
  MdAccountBalanceWallet,
  MdAdd,
  MdMenu,
  MdClose,
  MdNotifications,
} from "react-icons/md";
import { clsx } from "clsx";
import { useAuth } from "@/shared/contexts/useAuth";
import { UserProfileDropdown } from "@/shared/components/ui";
import type { UserMenuItem } from "@/shared/components/ui";
import { NotificationBell } from "@/shared/components/NotificationBell";
import { useOutsideClick } from "@/features/landing/hooks/useOutsideClick";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface UserProfile {
  name: string;
  email: string;
}

interface DashboardHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  showBackButton?: boolean;
  onBackClick?: () => void;
  actions?: ReactNode;
  statusBadge?: ReactNode;
  userProfile?: UserProfile;
  credits?: number;
  onCreditClick?: () => void;
  creditsLoading?: boolean;
  isMobileMenuOpen?: boolean;
  onMobileMenuToggle?: (isOpen: boolean) => void;
}

export const DashboardHeader = ({
  title,
  description,
  breadcrumbs,
  showBackButton = false,
  onBackClick,
  actions,
  statusBadge,
  userProfile,
  credits,
  onCreditClick,
  creditsLoading = false,
  isMobileMenuOpen: externalIsMobileMenuOpen,
  onMobileMenuToggle,
}: DashboardHeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [internalIsMobileMenuOpen, setInternalIsMobileMenuOpen] = useState(false);

  // 외부에서 제어하는 경우 외부 state 사용, 아니면 내부 state 사용
  const isMobileMenuOpen = externalIsMobileMenuOpen ?? internalIsMobileMenuOpen;
  const setIsMobileMenuOpen = (isOpen: boolean) => {
    if (onMobileMenuToggle) {
      onMobileMenuToggle(isOpen);
    } else {
      setInternalIsMobileMenuOpen(isOpen);
    }
  };

  // 메뉴 외부 클릭 시 닫기
  const menuRef = useOutsideClick(() => setIsMobileMenuOpen(false));

  // 공통 스타일 클래스
  const linkClassName =
    "text-neutral-600 hover:text-primary transition-colors duration-200";
  const currentClassName = "text-neutral-800 font-medium";

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    try {
      await signOut();
      closeMobileMenu();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const handleSettingsClick = () => {
    navigate("/dashboard/settings");
    closeMobileMenu();
  };

  const handleCreditClickMobile = () => {
    if (onCreditClick) {
      onCreditClick();
      closeMobileMenu();
    }
  };

  // 사용자 드롭다운 메뉴 아이템 (데스크톱)
  const userMenuItems: UserMenuItem[] = [
    {
      icon: <MdSettings className="w-4 h-4" />,
      label: "설정",
      onClick: () => navigate("/dashboard/settings"),
    },
    {
      icon: <MdLogout className="w-4 h-4" />,
      label: "로그아웃",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="py-3 border-b border-gray-100">
            <nav className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && (
                    <MdChevronRight className="w-4 h-4 text-neutral-400 mx-2" />
                  )}

                  {/* href가 있으면 Link, onClick만 있으면 button, 둘 다 없으면 span */}
                  {item.href ? (
                    <Link to={item.href} className={linkClassName}>
                      {item.label}
                    </Link>
                  ) : item.onClick ? (
                    <button onClick={item.onClick} className={linkClassName}>
                      {item.label}
                    </button>
                  ) : (
                    <span className={currentClassName}>{item.label}</span>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}

        {/* Main Header */}
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center min-w-0 flex-1">
            {/* Back Button */}
            {showBackButton && (
              <button
                onClick={onBackClick}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-shrink-0"
              >
                <MdArrowBack className="w-5 h-5 text-neutral-500" />
              </button>
            )}

            {/* Title Section */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-primary truncate">
                  {title}
                </h1>
                {statusBadge}
              </div>
              {description && (
                <p className="mt-1 lg:mt-2 text-xs sm:text-sm lg:text-base text-neutral-600 truncate">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Right Section: Desktop - Full Menu / Mobile - Hamburger */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Actions (항상 표시) */}
            {actions && (
              <div className="flex items-center gap-2 sm:gap-3">{actions}</div>
            )}

            {/* Desktop Only: Credits + Notification + Profile */}
            <div className="hidden sm:flex items-center gap-4">
              {/* Credits Display */}
              {(credits !== undefined || creditsLoading) && (
                <div className="pl-4 border-l border-gray-200">
                  {creditsLoading ? (
                    <div className="flex items-center gap-2 h-[52px] px-3">
                      <div className="w-4 h-4 bg-neutral-200 rounded animate-pulse" />
                      <div className="flex items-baseline gap-1">
                        <div className="h-3 w-10 bg-neutral-200 rounded animate-pulse" />
                        <div className="h-4 w-12 bg-neutral-200 rounded animate-pulse" />
                      </div>
                      <div className="w-4 h-4 bg-neutral-200 rounded animate-pulse" />
                    </div>
                  ) : (
                    <button
                      onClick={onCreditClick}
                      className="flex items-center gap-2 h-[52px] px-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      disabled={!onCreditClick}
                    >
                      <MdAccountBalanceWallet className="w-4 h-4 text-neutral-600" />
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-neutral-600 font-medium">
                          크레딧
                        </span>
                        <span className="text-sm font-semibold text-neutral-800">
                          {credits?.toLocaleString()}
                        </span>
                      </div>
                      {onCreditClick && (
                        <MdAdd className="w-4 h-4 text-neutral-500" />
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Notification Bell */}
              <div className="pl-4 border-l border-gray-200" data-tour="notification-bell">
                <NotificationBell />
              </div>

              {/* User Profile Dropdown */}
              {userProfile && (
                <UserProfileDropdown
                  user={{
                    name: userProfile.name,
                    email: userProfile.email,
                  }}
                  menuItems={userMenuItems}
                  variant="desktop"
                  className="pl-4 border-l border-gray-200"
                />
              )}
            </div>

            {/* Mobile Only: Hamburger Menu */}
            <div className="sm:hidden relative" ref={menuRef}>
              <button
                className={clsx(
                  "flex items-center justify-center w-10 h-10 rounded-full",
                  "transition-all duration-200 hover:scale-105 active:scale-95",
                  isMobileMenuOpen
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                )}
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
              >
                {isMobileMenuOpen ? (
                  <MdClose className="w-5 h-5" />
                ) : (
                  <MdMenu className="w-6 h-6" />
                )}
              </button>

              {/* 모바일 드롭다운 메뉴 */}
              {isMobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg py-2 z-50">
                  {/* 사용자 정보 */}
                  {userProfile && (
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="font-medium text-neutral-900 truncate">
                        {userProfile.name}
                      </p>
                      <p className="text-sm text-neutral-500 truncate">
                        {userProfile.email}
                      </p>
                    </div>
                  )}

                  {/* 크레딧 (클릭 가능한 경우만) */}
                  {credits !== undefined && onCreditClick && (
                    <button
                      onClick={handleCreditClickMobile}
                      className="w-full flex items-center justify-between px-4 py-3 text-neutral-700 hover:bg-neutral-50"
                    >
                      <div className="flex items-center space-x-2">
                        <MdAccountBalanceWallet className="w-5 h-5" />
                        <span>크레딧</span>
                      </div>
                      <span className="font-semibold text-neutral-800">
                        {credits.toLocaleString()}
                      </span>
                    </button>
                  )}

                  {/* 크레딧 (읽기 전용) */}
                  {credits !== undefined && !onCreditClick && (
                    <div className="flex items-center justify-between px-4 py-3 text-neutral-700">
                      <div className="flex items-center space-x-2">
                        <MdAccountBalanceWallet className="w-5 h-5" />
                        <span>크레딧</span>
                      </div>
                      <span className="font-semibold text-neutral-800">
                        {credits.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* 알림 */}
                  <div className="px-4 py-3 border-t border-neutral-100" data-tour="notification-bell-mobile">
                    <div className="flex items-center space-x-2 text-neutral-700">
                      <MdNotifications className="w-5 h-5" />
                      <span>알림</span>
                    </div>
                  </div>

                  <hr className="my-1" />

                  {/* 설정 */}
                  <button
                    onClick={handleSettingsClick}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-neutral-700 hover:bg-neutral-50"
                  >
                    <MdSettings className="w-5 h-5" />
                    <span>설정</span>
                  </button>

                  {/* 로그아웃 */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-neutral-700 hover:bg-neutral-50"
                  >
                    <MdLogout className="w-5 h-5" />
                    <span>로그아웃</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
