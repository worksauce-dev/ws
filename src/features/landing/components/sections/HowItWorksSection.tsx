/**
 * How It Works 섹션
 * 워크소스 사용 방법을 3단계로 간단하게 설명
 */

import { motion } from "framer-motion";
import { MdPersonAdd, MdEmail, MdAssessment } from "react-icons/md";

interface Step {
  number: string;
  title: string;
  description: string;
  time: string;
  icon: JSX.Element;
}

const steps: Step[] = [
  {
    number: "01",
    title: "지원자 추가",
    description: "이메일만 입력하면 준비 완료",
    time: "30초",
    icon: <MdPersonAdd className="w-8 h-8" />,
  },
  {
    number: "02",
    title: "테스트 자동 발송",
    description: "지원자가 편한 시간에 응답",
    time: "5분",
    icon: <MdEmail className="w-8 h-8" />,
  },
  {
    number: "03",
    title: "결과 확인",
    description: "직무 적합성 리포트 즉시 확인",
    time: "즉시",
    icon: <MdAssessment className="w-8 h-8" />,
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-6">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            3단계로 시작하는 간편한 채용
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            복잡한 설정 없이 바로 시작할 수 있어요
          </p>
        </motion.div>

        {/* 단계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* 연결선 (데스크톱에서만 표시) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-primary-200 -z-10" />
              )}

              {/* 카드 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                {/* 아이콘 배지 */}
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-6 mx-auto">
                  {step.icon}
                </div>

                {/* 단계 번호 */}
                <div className="text-center mb-4">
                  <span className="inline-block px-4 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold">
                    STEP {step.number}
                  </span>
                </div>

                {/* 제목 */}
                <h3 className="text-xl font-bold text-neutral-800 text-center mb-3">
                  {step.title}
                </h3>

                {/* 설명 */}
                <p className="text-neutral-600 text-center mb-4">
                  {step.description}
                </p>

                {/* 소요 시간 */}
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-neutral-500">소요 시간:</span>
                  <span className="font-semibold text-primary-600">
                    {step.time}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-neutral-600 mb-6">
            지금 바로 시작하고 채용의 효율을 경험해보세요
          </p>
          <a
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            무료로 시작하기
          </a>
        </motion.div>
      </div>
    </section>
  );
};
