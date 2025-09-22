import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/shared/contexts/AuthContext";
import { useAuth } from "@/shared/contexts/useAuth";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";

// Landing Pages
import { LandingPage } from "@/features/landing/pages/LandingPage";

// Auth Pages
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { SignUpPage } from "@/features/auth/pages/SignUpPage";

// Dashboard Pages
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 인증된 사용자를 대시보드로 리다이렉트하는 컴포넌트
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner h-8 w-8 text-primary-500" />
      </div>
    );
  }

  // 이미 로그인된 사용자는 대시보드로 리다이렉트
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <div className="App">
            <Routes>
              {/* 랜딩페이지 - 메인 페이지 */}
              <Route
                path="/"
                element={<LandingPage />} // PublicRoute 제거로 단순화
              />

              {/* 인증 페이지들 - 로그인된 사용자는 대시보드로 리다이렉트 */}
              <Route
                path="/auth/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />

              <Route
                path="/auth/signup"
                element={
                  <PublicRoute>
                    <SignUpPage />
                  </PublicRoute>
                }
              />

              {/* 보호된 페이지들 - 로그인 필요 */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 페이지 - 모든 잘못된 경로는 랜딩페이지로 리다이렉트 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* 토스트 알림 */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  style: {
                    background: "#10b981",
                  },
                },
                error: {
                  style: {
                    background: "#ef4444",
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
