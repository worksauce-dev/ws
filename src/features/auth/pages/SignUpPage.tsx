import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { useAuth } from "@/shared/contexts/useAuth";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { usePageSEO, WORKSAUCE_SEO_PRESETS } from "@/shared/hooks/usePageSEO";
import type { SignUpData } from "../types/auth.types";

// 폼 검증 스키마
const signUpSchema = z
  .object({
    email: z.string().email("올바른 이메일 주소를 입력해주세요"),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "영문 대소문자와 숫자를 포함해야 합니다"
      ),
    confirmPassword: z.string(),
    name: z
      .string()
      .min(2, "이름은 2자 이상이어야 합니다")
      .max(50, "이름은 50자 이하여야 합니다"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpPage = () => {
  const { signUp, user, loading } = useAuth();
  const navigate = useNavigate();

  // SEO 설정
  usePageSEO(WORKSAUCE_SEO_PRESETS.signup);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const onSubmit = async (data: SignUpFormData) => {
    const signUpData: SignUpData = {
      email: data.email,
      password: data.password,
      name: data.name,
      termsAccepted: true,
      privacyAccepted: true,
    };
    const { error } = await signUp(signUpData);

    if (error) {
      if (error.message.includes("User already registered")) {
        toast.error("이미 등록된 이메일입니다");
      } else {
        toast.error("회원가입에 실패했습니다");
      }
    } else {
      toast.success("회원가입이 완료되었습니다. 이메일을 확인해주세요.");
      navigate("/auth/login");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner h-8 w-8 text-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* 로고 영역 */}
        <div className="text-center">
          <h1 className="heading-2 text-primary-600">워크소스</h1>
          <p className="caption mt-2">직무실행유형 검사를 활용한 채용 플랫폼</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h2 className="heading-3 text-center text-neutral-900">
                회원가입
              </h2>
            </div>

            <Input
              {...register("name")}
              type="text"
              label="이름"
              placeholder="이름을 입력해주세요"
              error={errors.name?.message}
              autoComplete="organization"
              isRequired
            />

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
              placeholder="8자 이상, 영문 대소문자와 숫자 포함"
              error={errors.password?.message}
              autoComplete="new-password"
              isRequired
            />

            <Input
              {...register("confirmPassword")}
              type="password"
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력해주세요"
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
              isRequired
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              회원가입
            </Button>

            <div className="text-center">
              <p className="body-small text-neutral-600">
                이미 계정이 있으신가요?{" "}
                <Link
                  to="/auth/login"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  로그인
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
