/**
 * Drawer 컴포넌트
 * 우측에서 슬라이딩되는 패널
 */

import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  headerActions?: React.ReactNode;
}

const DRAWER_WIDTHS = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export const Drawer = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = "lg",
  headerActions,
}: DrawerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // 열기/닫기 애니메이션 관리
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // 다음 프레임에서 애니메이션 시작 (CSS transition을 위해)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      // 애니메이션이 끝난 후 DOM에서 제거
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // transition duration과 동일
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <>
      {/* 백드롭 */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 드로어 패널 */}
      <div
        className={`fixed top-0 right-0 bottom-0 ${DRAWER_WIDTHS[size]} w-full bg-white shadow-2xl z-50 flex flex-col transition-all duration-300`}
        style={{
          transform: isAnimating ? "translateX(0)" : "translateX(100%)",
          transitionTimingFunction: isAnimating
            ? "cubic-bezier(0.32, 0.72, 0, 1)"
            : "cubic-bezier(0.4, 0, 1, 1)",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* 헤더 */}
        <div className="px-6 py-5 border-b border-neutral-200 bg-white sticky top-0 z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2
                id="drawer-title"
                className="text-xl font-bold text-neutral-800 truncate"
              >
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-neutral-500 mt-1 truncate">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* 헤더 액션 버튼 */}
              {headerActions}
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="닫기"
              >
                <MdClose className="w-6 h-6 text-neutral-600" />
              </button>
            </div>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </>
  );
};
