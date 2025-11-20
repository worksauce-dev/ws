import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdCheckCircle, MdSecurity } from "react-icons/md";
import { Button } from "@/shared/components/ui/Button";
import { useApplicant } from "../hooks/useApplicant";
import { VerifyApplicant } from "../components/VerifyApplicant";
import { TestSession } from "../components/TestSession";

export const SauceTestPage = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [showTestSession, setShowTestSession] = useState(false);
  const { data: applicant, isLoading: isLoadingApplicant } = useApplicant(
    testId!
  );

  const handleVerifySuccess = () => {
    setIsVerified(true);
  };

  // 인증 완료 후 2초 뒤에 테스트 세션으로 전환
  useEffect(() => {
    if (isVerified) {
      const timer = setTimeout(() => {
        setShowTestSession(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVerified]);

  // 테스트 ID가 없는 경우
  if (!testId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-error-100 rounded-full flex items-center justify-center">
            <MdSecurity className="w-10 h-10 text-error-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-800 mb-4">
            유효하지 않은 링크
          </h1>
          <p className="text-neutral-600 mb-8 max-w-md">
            테스트 링크가 올바르지 않습니다.
            <br />
            채용 담당자에게 문의해주세요.
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            홈으로 돌아가기
          </Button>
        </motion.div>
      </div>
    );
  }

  // 지원자 정보 로딩 중
  if (isLoadingApplicant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-neutral-600 text-lg">
            지원자 정보를 불러오는 중...
          </p>
        </motion.div>
      </div>
    );
  }

  // 지원자 정보를 찾을 수 없는 경우
  if (!applicant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-error-100 rounded-full flex items-center justify-center">
            <MdSecurity className="w-10 h-10 text-error-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-800 mb-4">
            지원자 정보를 찾을 수 없습니다
          </h1>
          <p className="text-neutral-600 mb-8 max-w-md">
            유효하지 않은 테스트 링크이거나 만료된 링크입니다.
            <br />
            채용 담당자에게 문의해주세요.
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            홈으로 돌아가기
          </Button>
        </motion.div>
      </div>
    );
  }

  // 테스트 세션 시작
  if (showTestSession) {
    return <TestSession applicant={applicant} testId={testId} />;
  }

  // 검증 완료 후 로딩 화면
  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 bg-success-100 rounded-full flex items-center justify-center"
          >
            <MdCheckCircle className="w-16 h-16 text-success-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-neutral-800 mb-4"
          >
            인증이 완료되었습니다
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-neutral-600 mb-8"
          >
            곧 테스트가 시작됩니다...
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // 인증 폼 화면
  return (
    <VerifyApplicant
      applicant={applicant}
      onVerifySuccess={handleVerifySuccess}
    />
  );
};
