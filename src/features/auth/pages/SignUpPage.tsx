import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/shared/contexts/useAuth";
import { usePageSEO, WORKSAUCE_SEO_PRESETS } from "@/shared/hooks/usePageSEO";
import { SignupFlow } from "@/features/auth/components/SignUpFlow";

export const SignUpPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // SEO 설정
  usePageSEO(WORKSAUCE_SEO_PRESETS.signup);

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="spinner h-8 w-8 text-primary-500" />
      </div>
    );
  }

  return <SignupFlow />;
};
