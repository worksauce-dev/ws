import { type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
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
import { UserProfileDropdown, Logo } from "@/shared/components/ui";
import type { UserMenuItem } from "@/shared/components/ui";
import { NotificationBell } from "@/shared/components/NotificationBell";
import { useOutsideClick } from "@/features/landing/hooks/useOutsideClick";
import { useDashboard } from "@/shared/layouts/DashboardContext";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface DashboardHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
}

export const DashboardHeader = ({
  breadcrumbs,
  actions,
}: DashboardHeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  // Context에서 대시보드 전역 상태 가져오기
  const {
    userName,
    userEmail,
    credits,
    isLoading: creditsLoading,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    onCreditClick,
  } = useDashboard();

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
        {/* Main Header */}
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center min-w-0 flex-1">
            {/* Logo  */}
            <Logo variant="header" linkTo="/" className="mr-4 flex-shrink-0" />
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm flex-1 ml-4">
              {breadcrumbs?.map((item, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && (
                    <MdChevronRight className="w-4 h-4 text-neutral-400 mx-2" />
                  )}

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
              )) ?? null}
            </nav>
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
                <div className="pl-4 border-l border-gray-200" data-tour="credits">
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
              <div
                className="pl-4 border-l border-gray-200"
                data-tour="notification-bell"
              >
                <NotificationBell />
              </div>

              {/* User Profile Dropdown */}
              <UserProfileDropdown
                user={{
                  name: userName,
                  email: userEmail,
                }}
                menuItems={userMenuItems}
                variant="desktop"
                className="pl-4 border-l border-gray-200"
              />
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
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="font-medium text-neutral-900 truncate">
                      {userName}
                    </p>
                    <p className="text-sm text-neutral-500 truncate">
                      {userEmail}
                    </p>
                  </div>

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
                  <div
                    className="px-4 py-3 border-t border-neutral-100"
                    data-tour="notification-bell-mobile"
                  >
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
