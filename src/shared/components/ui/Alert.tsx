import type { ReactNode } from "react";
import { MdCheckCircle, MdError, MdWarning, MdInfo, MdClose } from "react-icons/md";
import { clsx } from "clsx";

export type AlertType = "success" | "error" | "warning" | "info";

export interface AlertProps {
  type: AlertType;
  title?: string;
  message: string | ReactNode;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const Alert = ({
  type,
  title,
  message,
  onClose,
  action,
  className,
}: AlertProps) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <MdCheckCircle className="w-5 h-5 text-success-600" />;
      case "error":
        return <MdError className="w-5 h-5 text-error-600" />;
      case "warning":
        return <MdWarning className="w-5 h-5 text-warning-600" />;
      case "info":
        return <MdInfo className="w-5 h-5 text-info-600" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-success-50 border-success-200 text-success-800";
      case "error":
        return "bg-error-50 border-error-200 text-error-800";
      case "warning":
        return "bg-warning-50 border-warning-200 text-warning-800";
      case "info":
        return "bg-info-50 border-info-200 text-info-800";
    }
  };

  const getActionStyles = () => {
    switch (type) {
      case "success":
        return "text-success-700 hover:bg-success-100";
      case "error":
        return "text-error-700 hover:bg-error-100";
      case "warning":
        return "text-warning-700 hover:bg-warning-100";
      case "info":
        return "text-info-700 hover:bg-info-100";
    }
  };

  return (
    <div
      className={clsx(
        "flex items-start gap-3 p-4 rounded-lg border",
        getStyles(),
        className
      )}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm mb-1">{title}</p>}
        <div className="text-sm">{message}</div>
        {action && (
          <button
            onClick={action.onClick}
            className={clsx(
              "mt-3 px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200",
              getActionStyles()
            )}
          >
            {action.label}
          </button>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-white/50 transition-colors duration-200"
          aria-label="닫기"
        >
          <MdClose className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
