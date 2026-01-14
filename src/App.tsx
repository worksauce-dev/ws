import { lazy, Suspense } from "react";
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
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

// Lazy-loaded Pages
const LandingPage = lazy(() =>
  import("@/features/landing/pages/LandingPage").then(module => ({
    default: module.LandingPage,
  }))
);
const LoginPage = lazy(() =>
  import("@/features/auth/pages/LoginPage").then(module => ({
    default: module.LoginPage,
  }))
);
const SignUpPage = lazy(() =>
  import("@/features/auth/pages/SignUpPage").then(module => ({
    default: module.SignUpPage,
  }))
);
const DashboardPage = lazy(() =>
  import("@/features/dashboard/pages/DashboardPage").then(module => ({
    default: module.DashboardPage,
  }))
);
const GroupPage = lazy(() =>
  import("@/features/groups/pages/GroupPage").then(module => ({
    default: module.GroupPage,
  }))
);
const CreateGroupPage = lazy(() =>
  import("@/features/groups/pages/CreateGroupPage").then(module => ({
    default: module.CreateGroupPage,
  }))
);
const ApplicantDetailPage = lazy(() =>
  import("@/features/applicants/pages/ApplicantDetailPage").then(module => ({
    default: module.ApplicantDetailPage,
  }))
);
const SettingsPage = lazy(() =>
  import("@/features/settings/pages/SettingsPage").then(module => ({
    default: module.SettingsPage,
  }))
);
const SauceTestPage = lazy(() =>
  import("@/features/sauceTest/page/SauceTestPage").then(module => ({
    default: module.SauceTestPage,
  }))
);
const MiniTestPage = lazy(() =>
  import("@/features/miniTest/pages/MiniTestPage").then(module => ({
    default: module.MiniTestPage,
  }))
);
const AdminPage = lazy(() =>
  import("@/features/admin/pages/AdminPage").then(module => ({
    default: module.AdminPage,
  }))
);
const SurveysManagementPage = lazy(() =>
  import("@/features/admin/pages/SurveysManagementPage").then(module => ({
    default: module.SurveysManagementPage,
  }))
);
const BusinessVerificationsManagementPage = lazy(() =>
  import(
    "@/features/admin/pages/BusinessVerificationsManagementPage"
  ).then(module => ({
    default: module.BusinessVerificationsManagementPage,
  }))
);
// 팀 관리 기능 - MVP 범위에서 제외 (Phase 5 이후 재활성화 예정)
// const TeamsPage = lazy(() =>
//   import("@/features/teams/pages/TeamsPage").then(module => ({
//     default: module.TeamsPage,
//   }))
// );

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

// 로딩 스피너 컴포넌트
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="spinner h-8 w-8 text-primary-500" />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <SpeedInsights />
          <Analytics />
          <Router
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <div className="App">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* 랜딩페이지 - 메인 페이지 */}
                  <Route
                    path="/"
                    element={<LandingPage />} // PublicRoute 제거로 단순화
                  />

                  {/* 미니 테스트 - 누구나 접근 가능 */}
                  <Route path="/mini-test" element={<MiniTestPage />} />

                  <Route path="/test/:testToken" element={<SauceTestPage />} />

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
                    path="/dashboard/groups/:groupId/applicants/:applicantId"
                    element={
                      <ProtectedRoute>
                        <ApplicantDetailPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/settings"
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* 팀 관리 기능 - MVP 범위에서 제외 (Phase 5 이후 재활성화 예정) */}
                  {/* <Route
                    path="/dashboard/teams"
                    element={
                      <ProtectedRoute>
                        <TeamsPage />
                      </ProtectedRoute>
                    }
                  /> */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/surveys"
                    element={
                      <ProtectedRoute>
                        <SurveysManagementPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/business-verifications"
                    element={
                      <ProtectedRoute>
                        <BusinessVerificationsManagementPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 페이지 - 모든 잘못된 경로는 랜딩페이지로 리다이렉트 */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
