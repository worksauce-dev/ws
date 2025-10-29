import { useContext } from "react";
import { ToastContext } from "./toast.context";

/**
 * Toast 컨텍스트를 사용하는 커스텀 훅
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
