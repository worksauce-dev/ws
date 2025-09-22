import { clsx } from "clsx";
import { MenuLink } from "./MenuLink";
import type { MobileMenuProps } from "@/features/landing/types/landing.types";

export const MobileMenu = ({ isOpen, onClose, menuItems }: MobileMenuProps) => {
  return (
    <>
      {/* 반투명 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-10 animate-in fade-in duration-300"
          onClick={onClose}
          style={{ backdropFilter: "blur(4px)" }}
        />
      )}

      {/* 드롭다운 메뉴 */}
      <div
        className={clsx(
          "absolute right-0 top-14 bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden w-64 z-20",
          "shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-neutral-100",
          "origin-top-right transition-all duration-300",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
        )}
      >
        {/* 상단 그라데이션 헤더 */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-400 px-6 py-4">
          <h3 className="text-white font-semibold text-lg">메뉴</h3>
          <div className="w-8 h-1 bg-white/30 rounded-full mt-2"></div>
        </div>

        {/* 메뉴 아이템들 */}
        <div className="py-2">
          {menuItems.map((item, index) => (
            <MenuLink
              key={index}
              item={item}
              isMobile={true}
              onClose={onClose}
            />
          ))}
        </div>

        {/* 하단 장식 */}
        <div className="px-6 py-4 bg-neutral-50/80 border-t border-neutral-100">
          <p className="text-xs text-neutral-500 text-center">WORKSAUCE</p>
        </div>
      </div>
    </>
  );
};
