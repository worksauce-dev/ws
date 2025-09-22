import { Link } from "react-router-dom";
import { clsx } from "clsx";
import type { MenuLinkProps } from "@/features/landing/types/landing.types";

export const MenuLink = ({ item, isMobile, onClose }: MenuLinkProps) => {
  const baseClasses = "block transition-all duration-200";

  const mobileClasses = clsx(
    baseClasses,
    "py-4 px-6 text-base w-full text-left text-neutral-700",
    "hover:bg-primary-50 hover:text-primary-600 hover:translate-x-2 group"
  );

  const desktopClasses = clsx(
    baseClasses,
    "py-2 px-4 rounded-md text-neutral-800",
    "hover:bg-primary-500 hover:text-white hover:scale-105 active:scale-95"
  );

  const linkClasses = isMobile ? mobileClasses : desktopClasses;

  const linkContent = (
    <span className="flex items-center justify-between">
      {item.label}
      {isMobile && (
        <svg
          className={clsx(
            "w-4 h-4 opacity-40 group-hover:opacity-70 transition-all duration-200",
            item.isExternal ? "" : "group-hover:translate-x-1"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {item.isExternal ? (
            // 외부 링크 아이콘
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          ) : (
            // 오른쪽 화살표 아이콘
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          )}
        </svg>
      )}
    </span>
  );

  if (item.isExternal) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className={linkClasses}
      >
        {linkContent}
      </a>
    );
  }

  return (
    <Link to={item.href} onClick={onClose} className={linkClasses}>
      {linkContent}
    </Link>
  );
};
