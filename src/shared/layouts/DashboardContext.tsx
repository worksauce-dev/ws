/**
 * DashboardContext
 *
 * 대시보드 전역 상태를 관리하는 Context
 * - Props Drilling 제거: Layout → Header 간 props 전달 불필요
 * - 단일 데이터 소스: useUser()를 한 곳에서만 호출
 * - 모바일 메뉴 상태: Context 내부에서 관리
 */

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useMemo,
} from "react";
import { useUser } from "@/shared/hooks/useUser";

interface DashboardContextValue {
  // 사용자 정보 (useUser에서)
  userName: string;
  userEmail: string;
  credits: number;
  isLoading: boolean;

  // 모바일 메뉴 상태 (내부 관리)
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;

  // 크레딧 클릭 핸들러 (외부 주입)
  onCreditClick?: () => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

interface DashboardProviderProps {
  children: ReactNode;
  onCreditClick?: () => void;
}

export const DashboardProvider = ({
  children,
  onCreditClick,
}: DashboardProviderProps) => {
  const { userName, userEmail, credits, isLoading } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const value = useMemo<DashboardContextValue>(
    () => ({
      // 사용자 정보
      userName,
      userEmail,
      credits,
      isLoading,

      // 모바일 메뉴 상태
      isMobileMenuOpen,
      setIsMobileMenuOpen,

      // 외부 핸들러
      onCreditClick,
    }),
    [userName, userEmail, credits, isLoading, isMobileMenuOpen, onCreditClick]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

/**
 * 대시보드 Context 사용 훅
 *
 * @example
 * ```tsx
 * const { userName, credits, isMobileMenuOpen } = useDashboard();
 * ```
 *
 * @throws DashboardProvider 외부에서 호출 시 에러
 */
export const useDashboard = (): DashboardContextValue => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }

  return context;
};
