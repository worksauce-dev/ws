import { useState } from "react";
import {
  MdMenu,
  MdClose,
  MdPerson,
  MdDashboard,
  MdLogout,
  MdBugReport,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/shared/components/ui";
import { MenuLink } from "@/features/landing/components/ui/MenuLink";
import { MobileMenu } from "@/features/landing/components/ui/MobileMenu";
import { useOutsideClick } from "@/features/landing/hooks/useOutsideClick";
import { useAuth } from "@/shared/contexts/useAuth";
import type { MenuItem } from "@/features/landing/types/landing.types";
import { clsx } from "clsx";
import toast from "react-hot-toast";

// 메뉴 아이템 설정
const menuItems: MenuItem[] = [
  {
    href: "https://worksauce.gitbook.io/infomation",
    label: "도움말",
    isExternal: true,
  },
  {
    href: "/auth/login",
    label: "로그인 / 회원가입",
  },
];

export const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, signOut, forceSignOut } = useAuth();
  const navigate = useNavigate();
  const isDevelopment = import.meta.env.VITE_ENV === "Dev";

  // 메뉴 외부 클릭 시 닫기
  const menuRef = useOutsideClick(() => setIsMenuOpen(false));
  const userMenuRef = useOutsideClick(() => setIsUserMenuOpen(false));

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const closeUserMenu = () => setIsUserMenuOpen(false);

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (!error) {
        toast.success("로그아웃되었습니다");
        navigate("/");
        closeUserMenu();
      } else {
        toast.error("로그아웃 중 오류가 발생했습니다");
      }
    } catch (error) {
      console.error("로그아웃 중 오류가 발생했습니다", error);
      toast.error("로그아웃 중 오류가 발생했습니다");
    }
  };

  const handleForceSignOut = async () => {
    try {
      const { error } = await forceSignOut();
      if (!error) {
        toast.success("강제 로그아웃 완료");
        navigate("/");
        closeUserMenu();
      } else {
        toast.error("강제 로그아웃 실패");
      }
    } catch (error) {
      console.error("강제 로그아웃 중 오류:", error);
      toast.error("강제 로그아웃 실패");
    }
  };

  return (
    <header className="z-[99] bg-white w-full fixed top-0 shadow-sm py-3">
      <nav className="container mx-auto px-6 flex justify-between items-center">
        {/* 로고 */}
        <Logo className="h-8 w-auto" />

        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            // 로그아웃 상태: 기존 메뉴
            <div className="flex space-x-1">
              {menuItems.map((item, index) => (
                <MenuLink
                  key={index}
                  item={item}
                  isMobile={false}
                  onClose={closeMenu}
                />
              ))}
            </div>
          ) : (
            // 로그인 상태: 사용자 메뉴
            <>
              <MenuLink
                item={{
                  href: "https://worksauce.gitbook.io/infomation",
                  label: "도움말",
                  isExternal: true,
                }}
                isMobile={false}
                onClose={closeMenu}
              />

              {/* 사용자 프로필 드롭다운 */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className={clsx(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors",
                    "hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500",
                    isUserMenuOpen ? "bg-neutral-100" : ""
                  )}
                >
                  <div className="text-left">
                    <p className="text-sm font-medium text-neutral-900">
                      {user.user_metadata?.name ||
                        user.email?.split("@")[0] ||
                        "사용자"}
                    </p>
                    <p className="text-xs text-neutral-500">{user.email}</p>
                  </div>
                </button>

                {/* 드롭다운 메뉴 */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-50">
                    <Link
                      to="/dashboard"
                      onClick={closeUserMenu}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      <MdDashboard className="w-4 h-4" />
                      <span>대시보드</span>
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      <MdLogout className="w-4 h-4" />
                      <span>로그아웃</span>
                    </button>
                    {/* Development only: Force Logout */}
                    {isDevelopment && (
                      <>
                        <hr className="my-1" />
                        <button
                          onClick={handleForceSignOut}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <MdBugReport className="w-4 h-4" />
                          <span>강제 로그아웃 (DEV)</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* 모바일 메뉴 */}
        <div className="md:hidden flex items-center space-x-2">
          {/* 로그인된 사용자의 프로필 아이콘 (모바일) */}
          {user && (
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <MdPerson className="w-4 h-4 text-primary-600" />
            </div>
          )}

          <div className="relative" ref={menuRef}>
            {/* 햄버거 메뉴 버튼 */}
            <button
              className={clsx(
                "flex items-center justify-center w-10 h-10 rounded-full",
                "transition-all duration-200 hover:scale-105 active:scale-95",
                isMenuOpen
                  ? "bg-primary-500 text-white"
                  : "text-neutral-600 hover:text-primary-500 hover:bg-primary-50"
              )}
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
              {isMenuOpen ? (
                <MdClose className="w-5 h-5" />
              ) : (
                <MdMenu className="w-6 h-6" />
              )}
            </button>

            {/* 모바일 드롭다운 메뉴 */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg py-2 z-50">
                {user ? (
                  // 로그인 상태 모바일 메뉴
                  <>
                    {/* 사용자 정보 */}
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="font-medium text-neutral-900">
                        {user.user_metadata?.name ||
                          user.email?.split("@")[0] ||
                          "사용자"}
                      </p>
                      <p className="text-sm text-neutral-500">{user.email}</p>
                    </div>

                    {/* 메뉴 항목 */}
                    <Link
                      to="/dashboard"
                      onClick={closeMenu}
                      className="flex items-center space-x-2 px-4 py-3 text-neutral-700 hover:bg-neutral-50"
                    >
                      <MdDashboard className="w-5 h-5" />
                      <span>대시보드</span>
                    </Link>

                    <a
                      href="https://worksauce.gitbook.io/infomation"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMenu}
                      className="flex items-center space-x-2 px-4 py-3 text-neutral-700 hover:bg-neutral-50"
                    >
                      <span>도움말</span>
                    </a>

                    <hr className="my-1" />

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-neutral-700 hover:bg-neutral-50"
                    >
                      <MdLogout className="w-5 h-5" />
                      <span>로그아웃</span>
                    </button>
                    {/* Development only: Force Logout */}
                    {isDevelopment && (
                      <>
                        <hr className="my-1" />
                        <button
                          onClick={handleForceSignOut}
                          className="w-full flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50"
                        >
                          <MdBugReport className="w-5 h-5" />
                          <span>강제 로그아웃 (DEV)</span>
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  // 로그아웃 상태 모바일 메뉴
                  <MobileMenu
                    isOpen={true}
                    onClose={closeMenu}
                    menuItems={menuItems}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
