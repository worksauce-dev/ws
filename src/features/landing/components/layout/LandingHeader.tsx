import { useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import { Logo } from "@/shared/components/ui";
import { MenuLink } from "@/features/landing/components/ui/MenuLink";
import { MobileMenu } from "@/features/landing/components/ui/MobileMenu";
import { useOutsideClick } from "@/features/landing/hooks/useOutsideClick";
import type { MenuItem } from "@/features/landing/types/landing.types";
import { clsx } from "clsx";

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

  // 메뉴 외부 클릭 시 닫기
  const menuRef = useOutsideClick(() => setIsMenuOpen(false));

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="z-[99] bg-white w-full fixed top-0 shadow-sm py-3">
      <nav className="container mx-auto px-6 flex justify-between items-center">
        {/* 로고 */}
        <Logo className="h-8 w-auto" />

        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex space-x-1">
          {menuItems.map((item, index) => (
            <MenuLink
              key={index}
              item={item}
              isMobile={false}
              onClose={closeMenu}
            />
          ))}
        </div>

        {/* 모바일 메뉴 */}
        <div className="md:hidden relative" ref={menuRef}>
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
          <MobileMenu
            isOpen={isMenuOpen}
            onClose={closeMenu}
            menuItems={menuItems}
          />
        </div>
      </nav>
    </header>
  );
};
