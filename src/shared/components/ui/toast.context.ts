import { createContext } from "react";
import type { ToastContextType } from "./toast.types";

/**
 * Toast Context
 */
export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
