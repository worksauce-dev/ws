import { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { clsx } from "clsx";

export interface DropdownItem {
  id: string;
  label: string;
  value?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  placement?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  className?: string;
  menuClassName?: string;
  onItemSelect?: (item: DropdownItem) => void;
  disabled?: boolean;
  closeOnItemClick?: boolean;
}

export const Dropdown = ({
  trigger,
  items,
  placement = "bottom-left",
  className,
  menuClassName,
  onItemSelect,
  disabled = false,
  closeOnItemClick = true,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;

    if (item.onClick) {
      item.onClick();
    }

    if (onItemSelect) {
      onItemSelect(item);
    }

    if (closeOnItemClick) {
      setIsOpen(false);
    }
  };

  const getPlacementClasses = () => {
    switch (placement) {
      case "bottom-left":
        return "top-full left-0 mt-2";
      case "bottom-right":
        return "top-full right-0 mt-2";
      case "top-left":
        return "bottom-full left-0 mb-2";
      case "top-right":
        return "bottom-full right-0 mb-2";
      default:
        return "top-full left-0 mt-2";
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={clsx("relative inline-block w-full", className)}
    >
      {/* Trigger */}
      <div
        onClick={handleTriggerClick}
        className={clsx(
          "cursor-pointer",
          disabled && "cursor-not-allowed opacity-50"
        )}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleTriggerClick();
          }
        }}
      >
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={clsx(
            "absolute z-50 min-w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1",
            getPlacementClasses(),
            menuClassName
          )}
          role="menu"
        >
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={clsx(
                "flex items-center px-4 py-2 text-sm cursor-pointer transition-colors duration-150",
                item.disabled
                  ? "text-neutral-400 cursor-not-allowed"
                  : "text-neutral-700 hover:bg-neutral-50",
                item.className
              )}
              role="menuitem"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleItemClick(item);
                }
              }}
            >
              {item.icon && (
                <span className="flex-shrink-0 mr-3 text-neutral-500">
                  {item.icon}
                </span>
              )}
              <span className="flex-1">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Simple Select Dropdown Component
interface SelectDropdownProps {
  value?: string;
  placeholder?: string;
  options: ReadonlyArray<{
    readonly value: string;
    readonly label: string;
    readonly disabled?: boolean;
  }>;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

export const SelectDropdown = ({
  value,
  placeholder = "선택해주세요",
  options,
  onChange,
  className,
  disabled = false,
  error = false,
}: SelectDropdownProps) => {
  const selectedOption = options.find(option => option.value === value);

  const items: DropdownItem[] = options.map(option => ({
    id: option.value,
    label: option.label,
    value: option.value,
    disabled: option.disabled,
    onClick: () => onChange?.(option.value),
  }));

  const trigger = (
    <div
      className={clsx(
        "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm bg-white transition-colors duration-200",
        error
          ? "border-red-300 focus:ring-red-500"
          : "border-neutral-300 focus:ring-primary",
        disabled
          ? "bg-neutral-50 cursor-not-allowed"
          : "hover:border-neutral-400",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={clsx(
            selectedOption ? "text-neutral-800" : "text-neutral-500"
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <MdKeyboardArrowDown className="w-4 h-4 text-neutral-500 flex-shrink-0" />
      </div>
    </div>
  );

  return (
    <Dropdown
      trigger={trigger}
      items={items}
      disabled={disabled}
      menuClassName="w-full"
      closeOnItemClick={true}
    />
  );
};

// 검색 가능한 SelectDropdown 컴포넌트
interface SearchableSelectDropdownProps {
  value?: string;
  placeholder?: string;
  options: ReadonlyArray<{
    readonly value: string;
    readonly label: string;
    readonly disabled?: boolean;
  }>;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  maxHeight?: string;
}

export const SearchableSelectDropdown = ({
  value,
  placeholder = "선택해주세요",
  options,
  onChange,
  className,
  disabled = false,
  error = false,
  maxHeight = "max-h-60",
}: SearchableSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(option => option.value === value);

  // 검색어로 필터링된 옵션들
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // 드롭다운이 열릴 때 검색 입력에 포커스
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option: { value: string; label: string; disabled?: boolean }) => {
    if (option.disabled) return;

    onChange?.(option.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div ref={dropdownRef} className={clsx("relative w-full", className)}>
      {/* Trigger */}
      <div
        onClick={handleTriggerClick}
        className={clsx(
          "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none text-sm bg-white transition-colors duration-200 cursor-pointer",
          error
            ? "border-red-300 focus:ring-red-500"
            : "border-neutral-300 focus:ring-primary",
          disabled
            ? "bg-neutral-50 cursor-not-allowed"
            : "hover:border-neutral-400"
        )}
      >
        <div className="flex items-center justify-between">
          <span
            className={clsx(
              selectedOption ? "text-neutral-800" : "text-neutral-500"
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <MdKeyboardArrowDown className="w-4 h-4 text-neutral-500 flex-shrink-0" />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full bg-white rounded-lg shadow-lg border border-neutral-200 mt-2">
          {/* 검색 입력 */}
          <div className="p-3 border-b border-neutral-200">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="검색..."
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none"
              />
            </div>
          </div>

          {/* 옵션 리스트 */}
          <div className={clsx("overflow-y-auto", maxHeight)}>
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-neutral-500 text-center">
                검색 결과가 없습니다
              </div>
            ) : (
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  onClick={() => handleOptionClick(option)}
                  className={clsx(
                    "px-4 py-3 text-sm cursor-pointer transition-colors duration-150",
                    option.disabled
                      ? "text-neutral-400 cursor-not-allowed"
                      : "text-neutral-700 hover:bg-neutral-50",
                    value === option.value && "bg-primary-50 text-primary-700"
                  )}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Export as named exports
export { Dropdown as default };
