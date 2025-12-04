import { type ReactNode, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdChevronRight,
  MdSettings,
  MdLogout,
  MdKeyboardArrowDown,
  MdAccountBalanceWallet,
  MdAdd,
} from "react-icons/md";
import { useAuth } from "@/shared/contexts/useAuth";

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
}: DashboardHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  // 공통 스타일 클래스
  const linkClassName =
    "text-neutral-600 hover:text-primary transition-colors duration-200";
  const currentClassName = "text-neutral-800 font-medium";

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

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
          <div className="sm:flex hidden items-center min-w-0 flex-1">
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
              <div className="flex items-center gap-3">
                <h1 className="text-2xl lg:text-3xl font-bold text-primary truncate">
                  {title}
                </h1>
                {statusBadge}
              </div>
              {description && (
                <p className="mt-1 lg:mt-2 text-sm lg:text-base text-neutral-600 truncate">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Right Section: Actions + Credits + User Profile */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Actions */}
            {actions && (
              <div className="flex items-center gap-3">{actions}</div>
            )}

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

            {/* User Profile Dropdown */}
            {userProfile && (
              <div
                className="relative pl-4 border-l border-gray-200"
                ref={dropdownRef}
              >
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 h-[52px] px-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  {/* User Info */}
                  <div className="text-left">
                    <p className="text-sm font-medium text-neutral-800 truncate max-w-32">
                      {userProfile.name}
                    </p>
                    <p className="text-xs text-neutral-600 truncate max-w-32">
                      {userProfile.email}
                    </p>
                  </div>
                  <MdKeyboardArrowDown
                    className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate("/dashboard/settings");
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
                      >
                        <MdSettings className="w-4 h-4" />
                        설정
                      </button>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
                      >
                        <MdLogout className="w-4 h-4" />
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
