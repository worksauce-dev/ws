import { useState, useCallback, type ReactNode } from "react";
import {
  MdCheckCircle,
  MdError,
  MdWarning,
  MdInfo,
  MdClose,
} from "react-icons/md";
import { clsx } from "clsx";
import type { Toast, ToastType } from "./toast.types";
import { ToastContext } from "./toast.context";

interface ToastProviderProps {
  children: ReactNode;
}

const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    // 애니메이션을 위해 먼저 isRemoving을 true로 설정
    setToasts(prev =>
      prev.map(toast =>
        toast.id === id ? { ...toast, isRemoving: true } : toast
      )
    );

    // 애니메이션이 끝난 후 실제로 제거 (300ms = 애니메이션 duration)
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, duration = 5000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: Toast = {
        id,
        type,
        title,
        message,
        duration,
        isRemoving: false,
      };

      setToasts(prev => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const getIcon = () => {
    switch (toast.type) {
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
    switch (toast.type) {
      case "success":
        return "bg-success-50 border-success-200";
      case "error":
        return "bg-error-50 border-error-200";
      case "warning":
        return "bg-warning-50 border-warning-200";
      case "info":
        return "bg-info-50 border-info-200";
    }
  };

  return (
    <div
      className={clsx(
        "pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-lg",
        toast.isRemoving ? "animate-slide-out-right" : "animate-slide-in-right",
        getStyles()
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-neutral-800">{toast.title}</p>
        {toast.message && (
          <p className="text-sm text-neutral-600 mt-1">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors duration-200"
        aria-label="닫기"
      >
        <MdClose className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ToastProvider;
