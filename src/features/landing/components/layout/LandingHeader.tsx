import { useState } from "react";
import {
  MdMenu,
  MdClose,
  MdDashboard,
  MdLogout,
  MdBugReport,
  MdPersonRemove,
  MdAdminPanelSettings,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { Logo, UserProfileDropdown } from "@/shared/components/ui";
import type { UserMenuItem } from "@/shared/components/ui";
import { MenuLink } from "@/features/landing/components/ui/MenuLink";
import { MobileMenu } from "@/features/landing/components/ui/MobileMenu";
import { useOutsideClick } from "@/features/landing/hooks/useOutsideClick";
import { useAuth } from "@/shared/contexts/useAuth";
import { useUser } from "@/shared/hooks/useUser";
import { useToast } from "@/shared/components/ui/useToast";
import type { MenuItem } from "@/features/landing/types/landing.types";
import { clsx } from "clsx";

// 메뉴 아이템 설정
const menuItems: MenuItem[] = [
  {
    href: "/mini-test",
    label: "미니 테스트",
  },
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
  const { signOut, forceSignOut, deleteAccount } = useAuth();
  const { userName, userEmail, isAdmin, isAuthenticated } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const isDevelopment = import.meta.env.VITE_ENV === "Dev";

  // 메뉴 외부 클릭 시 닫기
  const menuRef = useOutsideClick(() => setIsMenuOpen(false));

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (!error) {
        showToast("success", "로그아웃 완료", "로그아웃되었습니다");
        navigate("/");
      } else {
        showToast("error", "로그아웃 실패", "로그아웃 중 오류가 발생했습니다");
      }
    } catch (error) {
      console.error("로그아웃 중 오류가 발생했습니다", error);
      showToast("error", "로그아웃 실패", "로그아웃 중 오류가 발생했습니다");
    }
  };

  const handleForceSignOut = async () => {
    try {
      const { error } = await forceSignOut();
      if (!error) {
        showToast("success", "강제 로그아웃 완료", "개발 모드 강제 로그아웃");
        navigate("/");
      } else {
        showToast("error", "강제 로그아웃 실패", "오류가 발생했습니다");
      }
    } catch (error) {
      console.error("강제 로그아웃 중 오류:", error);
      showToast("error", "강제 로그아웃 실패", "오류가 발생했습니다");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "정말로 회원탈퇴 하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      return;
    }

    try {
      const { error } = await deleteAccount();
      if (!error) {
        showToast("success", "회원탈퇴 완료", "회원탈퇴가 완료되었습니다");
        navigate("/");
      } else {
        showToast("error", "회원탈퇴 실패", "회원탈퇴 중 오류가 발생했습니다");
      }
    } catch (error) {
      console.error("회원탈퇴 중 오류:", error);
      showToast("error", "회원탈퇴 실패", "회원탈퇴 중 오류가 발생했습니다");
    }
  };

  // 데스크톱 사용자 드롭다운 메뉴 아이템
  const userMenuItems: UserMenuItem[] = [
    {
      icon: <MdDashboard className="w-4 h-4" />,
      label: "대시보드",
      href: "/dashboard",
    },
    {
      icon: <MdLogout className="w-4 h-4" />,
      label: "로그아웃",
      onClick: handleSignOut,
      divider: "before",
    },
    {
      icon: <MdBugReport className="w-4 h-4" />,
      label: "강제 로그아웃 (DEV)",
      onClick: handleForceSignOut,
      variant: "danger",
      divider: "before",
      hidden: !isDevelopment,
    },
    {
      icon: <MdPersonRemove className="w-4 h-4" />,
      label: "회원탈퇴 (DEV)",
      onClick: handleDeleteAccount,
      variant: "danger",
      hidden: !isDevelopment,
    },
  ];

  return (
    <header className="z-[99] bg-white w-full fixed top-0 shadow-sm py-3">
      <nav className="container mx-auto px-6 flex justify-between items-center">
        {/* 로고 */}
        <Logo className="h-8 w-auto" />

        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex items-center space-x-4">
          {!isAuthenticated ? (
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
                  href: "/mini-test",
                  label: "미니 테스트",
                }}
                isMobile={false}
                onClose={closeMenu}
              />
              {isAdmin && (
                <MenuLink
                  item={{
                    href: "/admin",
                    label: "관리자",
                  }}
                  isMobile={false}
                  onClose={closeMenu}
                />
              )}
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
              <UserProfileDropdown
                user={{
                  name: userName,
                  email: userEmail,
                }}
                menuItems={userMenuItems}
                variant="compact"
              />
            </>
          )}
        </div>

        {/* 모바일 메뉴 */}
        <div className="md:hidden flex items-center space-x-2">
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
                {isAuthenticated ? (
                  // 로그인 상태 모바일 메뉴
                  <>
                    {/* 사용자 정보 */}
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="font-medium text-neutral-900">{userName}</p>
                      <p className="text-sm text-neutral-500">{userEmail}</p>
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

                    <Link
                      to="/mini-test"
                      onClick={closeMenu}
                      className="flex items-center space-x-2 px-4 py-3 text-neutral-700 hover:bg-neutral-50"
                    >
                      <span>미니 테스트</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/dashboard/admin"
                        onClick={closeMenu}
                        className="flex items-center space-x-2 px-4 py-3 text-primary-600 hover:bg-primary-50"
                      >
                        <MdAdminPanelSettings className="w-5 h-5" />
                        <span>관리자</span>
                      </Link>
                    )}

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
                    {/* Development only: Force Logout & Delete Account */}
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
                        <button
                          onClick={handleDeleteAccount}
                          className="w-full flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50"
                        >
                          <MdPersonRemove className="w-5 h-5" />
                          <span>회원탈퇴 (DEV)</span>
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
