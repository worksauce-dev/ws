import { useState } from "react";
import { Link } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";
import { clsx } from "clsx";
import { useOutsideClick } from "@/features/landing/hooks/useOutsideClick";

export interface UserMenuItem {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "danger";
  divider?: "before" | "after";
  hidden?: boolean;
}

interface UserProfileDropdownProps {
  user: {
    name: string;
    email: string;
  };
  menuItems: UserMenuItem[];
  className?: string;
  variant?: "desktop" | "compact";
}

export const UserProfileDropdown = ({
  user,
  menuItems,
  className,
  variant = "desktop",
}: UserProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useOutsideClick(() => setIsOpen(false));

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const visibleItems = menuItems.filter(item => !item.hidden);

  return (
    <div className={clsx("relative", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={toggleDropdown}
        className={clsx(
          "flex items-center gap-2 px-2 rounded-lg transition-colors duration-200",
          variant === "desktop"
            ? "h-[52px] hover:bg-gray-100"
            : "px-3 py-2 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500",
          isOpen && "bg-neutral-100"
        )}
      >
        {/* User Info */}
        <div className="text-left">
          <p
            className={clsx(
              "font-medium truncate",
              variant === "desktop"
                ? "text-sm text-neutral-800 max-w-32"
                : "text-sm text-neutral-900"
            )}
          >
            {user.name}
          </p>
          <p
            className={clsx(
              "text-xs truncate",
              variant === "desktop"
                ? "text-neutral-600 max-w-32"
                : "text-neutral-500"
            )}
          >
            {user.email}
          </p>
        </div>
        <MdKeyboardArrowDown
          className={clsx(
            "w-4 h-4 text-neutral-500 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={clsx(
            "absolute right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg z-50",
            variant === "desktop" ? "w-48 top-full" : "w-48"
          )}
        >
          <div className="py-1">
            {visibleItems.map((item, index) => {
              const isDanger = item.variant === "danger";
              const showDividerBefore =
                item.divider === "before" ||
                (index > 0 && visibleItems[index - 1]?.divider === "after");

              return (
                <div key={index}>
                  {showDividerBefore && <hr className="my-1" />}

                  {item.href ? (
                    <Link
                      to={item.href}
                      onClick={closeDropdown}
                      className={clsx(
                        "w-full flex items-center space-x-2 px-4 py-2 text-sm transition-colors duration-200",
                        isDanger
                          ? "text-red-600 hover:bg-red-50"
                          : "text-neutral-700 hover:bg-neutral-50"
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        item.onClick?.();
                        closeDropdown();
                      }}
                      className={clsx(
                        "w-full flex items-center space-x-2 px-4 py-2 text-sm transition-colors duration-200",
                        isDanger
                          ? "text-red-600 hover:bg-red-50"
                          : "text-neutral-700 hover:bg-neutral-50"
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  )}

                  {item.divider === "after" && <hr className="my-1" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
