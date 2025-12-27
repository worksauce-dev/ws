import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { MdCheckCircle, MdEmail, MdSecurity } from "react-icons/md";
import { useToast } from "@/shared/components/ui/useToast";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Logo } from "@/shared/components/ui/Logo";
import { type Applicant } from "../types/test";
import {
  updateEmailOpenedAt,
  updateTestStatusToInProgress,
} from "../api/testApi";
import { getTestLabels } from "../constants/testLabels";

// 폼 검증 스키마
const verifySchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
});

type VerifyFormData = z.infer<typeof verifySchema>;

interface VerifyApplicantProps {
  applicant: Applicant;
  onVerifySuccess: () => void;
}

export const VerifyApplicant = ({
  applicant,
  onVerifySuccess,
}: VerifyApplicantProps) => {
  const { showToast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);

  // 컨텍스트별 레이블 가져오기
  const labels = getTestLabels(applicant.context);

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
  });

  // 폼 제출 핸들러 - 지원자 정보 검증
  const onSubmit = async (data: VerifyFormData) => {
    setIsVerifying(true);

    // 입력된 이름과 이메일이 DB의 지원자 정보와 일치하는지 검증
    const isNameMatch = data.name.trim() === applicant.name.trim();
    const isEmailMatch =
      data.email.trim().toLowerCase() === applicant.email.trim().toLowerCase();

    // 검증 시뮬레이션을 위한 약간의 지연
    await new Promise(resolve => setTimeout(resolve, 800));

    setIsVerifying(false);

    if (isNameMatch && isEmailMatch) {
      // 이메일 열람 시간 기록
      await updateEmailOpenedAt(applicant.id);

      // 테스트 상태를 'in_progress'로 업데이트
      await updateTestStatusToInProgress(applicant.id);

      // 성공 시 바로 다음 단계로 이동 (토스트 없음)
      onVerifySuccess();
    } else {
      // 실패 시에만 토스트로 에러 표시
      if (!isNameMatch && !isEmailMatch) {
        showToast("error", "인증 실패", "이름과 이메일이 일치하지 않습니다.");
      } else if (!isNameMatch) {
        showToast("error", "인증 실패", "이름이 일치하지 않습니다.");
      } else {
        showToast("error", "인증 실패", "이메일이 일치하지 않습니다.");
      }
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto flex items-start md:items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        {/* 상단 로고 및 제목 */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Logo className="mx-auto mb-6" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-neutral-800 mb-3">
              워크소스 테스트에 오신 것을 환영합니다
            </h1>
            <p className="text-neutral-600 text-lg">
              본인 인증 후 테스트를 시작해주세요
            </p>
          </motion.div>
        </div>

        {/* 인증 폼 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden"
        >
          {/* 카드 헤더 */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <MdSecurity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-xl">본인 인증</h2>
                <p className="text-primary-100 text-sm">
                  성함과 이메일을 입력해주세요
                </p>
              </div>
            </div>
          </div>

          {/* 폼 내용 */}
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 이름 입력 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Input
                  id="name"
                  type="text"
                  label="이름"
                  placeholder="홍길동"
                  error={errors.name?.message}
                  isRequired
                  {...register("name")}
                />
              </motion.div>

              {/* 이메일 입력 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Input
                  id="email"
                  type="email"
                  label="이메일"
                  placeholder="example@worksauce.kr"
                  error={errors.email?.message}
                  isRequired
                  {...register("email")}
                />
              </motion.div>

              {/* 안내 문구 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-primary-50 border border-primary-200 rounded-lg p-4"
              >
                <div className="flex gap-3">
                  <MdEmail className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-neutral-700">
                    테스트 링크를 받으신{" "}
                    <strong className="font-semibold text-neutral-800">
                      이메일 주소와 이름을{" "}
                    </strong>
                    정확히 입력해주세요.
                  </p>
                </div>
              </motion.div>

              {/* 제출 버튼 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full shadow-lg hover:shadow-xl transition-shadow"
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      인증 중...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <MdCheckCircle className="w-5 h-5" />
                      인증 후 테스트 시작
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.div>

        {/* 하단 안내 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center space-y-4"
        >
          {/* 지원 안내 */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg px-6 py-4 border border-neutral-200">
            <p className="text-sm text-neutral-600">
              문제가 발생했나요?{" "}
              <a
                href="mailto:support@worksauce.kr"
                className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center gap-1 transition-colors"
              >
                support@worksauce.kr
                <span className="text-xs">↗</span>
              </a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
