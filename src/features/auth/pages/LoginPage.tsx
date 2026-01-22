import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MdRefresh } from "react-icons/md";
import { useToast } from "@/shared/components/ui/useToast";
import { useAuth } from "@/shared/contexts/useAuth";
import { usePageSEO, WORKSAUCE_SEO_PRESETS } from "@/shared/hooks/usePageSEO";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Logo } from "@/shared/components/ui/Logo";

// 폼 검증 스키마
const loginSchema = z.object({
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const { signIn, user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // SEO 설정
  usePageSEO(WORKSAUCE_SEO_PRESETS.login);

  // 로그인 후 리다이렉트할 경로
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur", // 필드 포커스 해제 시 검증
  });

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    if (user && !authLoading) {
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, from]);

  const onSubmit = async (data: LoginFormData) => {
    const { error } = await signIn(data.email, data.password);

    if (error) {
      // Supabase 에러 메시지에 따른 한글 에러 처리
      let errorMessage = "로그인에 실패했습니다";

      if (error.message === "Invalid login credentials") {
        errorMessage =
          "등록되지 않은 이메일이거나 비밀번호가 일치하지 않습니다";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "이메일 인증이 완료되지 않았습니다";
      } else if (error.message.includes("User not found")) {
        errorMessage = "가입되지 않은 이메일입니다";
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "올바르지 않은 이메일 형식입니다";
      } else if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        errorMessage = "네트워크 오류가 발생했습니다. 다시 시도해주세요";
      }

      showToast("error", "로그인 실패", errorMessage);
    } else {
      showToast("success", "로그인 성공", "로그인되었습니다");
      navigate(from, { replace: true });
    }
  };

  // 소셜 로그인 핸들러 (추후 구현)
  const handleSocialLogin = (provider: "kakao" | "google") => {
    showToast("info", "준비 중", `${provider} 로그인은 준비 중입니다`);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner h-8 w-8 text-primary-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* 로고 섹션 */}
        <div className="text-center flex flex-col items-center gap-2 mb-8">
          <Logo />
          <p className="body-small text-neutral-500">
            워크소스에 오신 것을 환영합니다
          </p>
        </div>

        {/* 로그인 박스 */}
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h2 className="heading-3 text-center text-neutral-900 mb-6">
                로그인
              </h2>
            </div>

            <Input
              {...register("email")}
              type="email"
              label="이메일"
              placeholder="이메일을 입력해주세요"
              error={errors.email?.message}
              autoComplete="email"
              isRequired
            />

            <Input
              {...register("password")}
              type="password"
              label="비밀번호"
              placeholder="비밀번호를 입력해주세요"
              error={errors.password?.message}
              autoComplete="current-password"
              isRequired
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting && <MdRefresh className="mr-2 animate-spin" />}
              {isSubmitting ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          {/* 소셜 로그인 (추후 구현) */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">또는</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                variant="ghost"
                className="w-full border border-neutral-300"
                onClick={() => handleSocialLogin("kakao")}
                disabled
              >
                카카오톡으로 계속하기 (준비중)
              </Button>
            </div>
          </div>

          {/* 회원가입 링크 */}
          <div className="mt-6 text-center">
            <p className="body-small text-neutral-600">
              아직 계정이 없으신가요?{" "}
              <Link
                to="/auth/signup"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>

        {/* 푸터 */}
        <div className="mt-6 text-center space-y-2">
          <div className="caption text-neutral-500">
            계정 관련 문의:{" "}
            <a
              href="mailto:worksauce@worksauce.kr"
              className="text-primary-600 hover:text-primary-500"
            >
              worksauce@worksauce.kr
            </a>
          </div>

          <div className="caption text-neutral-400 space-x-4">
            <a
              href="https://worksauce.gitbook.io/infomation/service/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-600"
            >
              이용약관
            </a>
            <span>•</span>
            <a
              href="https://worksauce.gitbook.io/infomation/service/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-600"
            >
              개인정보처리방침
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};
