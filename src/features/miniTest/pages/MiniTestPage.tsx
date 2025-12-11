import { useState } from "react";
import { motion } from "framer-motion";
import { MdArrowForward, MdPsychology, MdWork } from "react-icons/md";
import { LandingHeader } from "@/features/landing/components/layout/LandingHeader";
import { Logo } from "@/shared/components/ui/Logo";

export const MiniTestPage = () => {
  const [hasStarted, setHasStarted] = useState(false);

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-info-50">
        <LandingHeader />

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Logo className="mx-auto mb-8 h-12" />

              <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6">
                나의 직무 유형 알아보기
              </h1>

              <p className="text-xl text-neutral-600 mb-4">
                MBTI처럼 간단하게! 5분이면 충분해요
              </p>

              <p className="text-lg text-neutral-500">
                워크소스 미니 테스트로 당신의 직무 성향을 발견하세요
              </p>
            </motion.div>

            {/* 특징 카드 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <MdPsychology className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  10가지 직무 유형
                </h3>
                <p className="text-neutral-600">
                  기준윤리형부터 성장확장형까지, 다양한 직무 유형 중 당신의 유형을 찾아보세요
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mb-4">
                  <MdWork className="w-6 h-6 text-success-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  맞춤 커리어 가이드
                </h3>
                <p className="text-neutral-600">
                  당신의 강점, 발전 가능성, 추천 직무까지 상세한 분석을 제공합니다
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                <div className="w-12 h-12 bg-info-100 rounded-full flex items-center justify-center mb-4">
                  <MdArrowForward className="w-6 h-6 text-info-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  단 5분 소요
                </h3>
                <p className="text-neutral-600">
                  간단한 질문에 답하면 바로 결과를 확인할 수 있어요
                </p>
              </div>
            </motion.div>

            {/* CTA 버튼 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center"
            >
              <button
                onClick={() => setHasStarted(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary-500 text-white text-lg font-semibold rounded-xl hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>테스트 시작하기</span>
                <MdArrowForward className="w-6 h-6" />
              </button>

              <p className="mt-4 text-sm text-neutral-500">
                회원가입 없이 바로 시작할 수 있어요
              </p>
            </motion.div>

            {/* 미리보기 섹션 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-16 bg-white rounded-xl p-8 border border-neutral-200 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-neutral-800 mb-6 text-center">
                이런 걸 알 수 있어요
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">나의 주요 강점</p>
                    <p className="text-sm text-neutral-600">업무에서 발휘되는 핵심 역량</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">업무 스타일</p>
                    <p className="text-sm text-neutral-600">나만의 일하는 방식과 특징</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">추천 직무</p>
                    <p className="text-sm text-neutral-600">적합한 직무와 포지션 제안</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">발전 가능성</p>
                    <p className="text-sm text-neutral-600">성장할 수 있는 방향과 기회</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // 테스트 진행 화면 (추후 구현)
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-info-50">
      <LandingHeader />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl p-8 border border-neutral-200 shadow-sm text-center">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">
              테스트 준비 중
            </h2>
            <p className="text-neutral-600 mb-6">
              곧 미니 테스트를 시작할 수 있습니다!
            </p>
            <button
              onClick={() => setHasStarted(false)}
              className="px-6 py-3 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
