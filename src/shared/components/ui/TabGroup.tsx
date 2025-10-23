import { clsx } from "clsx";

export interface Tab {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface TabGroupProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: "primary" | "secondary";
}

export const TabGroup = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = "primary",
}: TabGroupProps) => {
  const isPrimary = variant === "primary";

  return (
    <div
      className={clsx(
        "inline-flex rounded-lg p-1 ",
        isPrimary ? "bg-white" : "bg-neutral-100",
        className
      )}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          className={clsx(
            "inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200",
            isPrimary
              ? activeTab === tab.id
                ? "bg-primary-500 text-white shadow-sm"
                : "text-neutral-600 hover:bg-primary-50"
              : activeTab === tab.id
                ? "bg-primary-500 text-white shadow-sm"
                : "text-neutral-600 hover:bg-white",
            tab.disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
          {tab.label}
          {tab.count !== undefined && ` (${tab.count})`}
        </button>
      ))}
    </div>
  );
};
