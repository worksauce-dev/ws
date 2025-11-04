import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastProvider from "@/shared/components/ui/Toast";
import { AuthProvider } from "@/shared/contexts/AuthContext";
import { useAuth } from "@/shared/contexts/useAuth";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { SauceTestPage } from "@/features/sauceTest/page/SauceTestPage";

// Landing Pages
import { LandingPage } from "@/features/landing/pages/LandingPage";

// Auth Pages
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { SignUpPage } from "@/features/auth/pages/SignUpPage";

// Dashboard Pages
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { GroupPage } from "@/features/dashboard/pages/GroupPage";
import { CreateGroupPage } from "@/features/groups/pages/CreateGroupPage";
import { ApplicantDetail } from "@/features/dashboard/pages/ApplicantDetail";

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
        <ToastProvider>
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

                <Route path="/test/:testId" element={<SauceTestPage />} />

                {/* 보호된 페이지들 - 로그인 필요 */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/create-group"
                  element={
                    <ProtectedRoute>
                      <CreateGroupPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/groups/:groupId"
                  element={
                    <ProtectedRoute>
                      <GroupPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/applicant/detail"
                  element={
                    <ProtectedRoute>
                      <ApplicantDetail />
                    </ProtectedRoute>
                  }
                />

                {/* 404 페이지 - 모든 잘못된 경로는 랜딩페이지로 리다이렉트 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
