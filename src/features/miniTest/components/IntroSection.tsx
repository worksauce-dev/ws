"use client";
import { motion } from "framer-motion";
import { MdPsychology, MdWork, MdArrowForward } from "react-icons/md";

interface IntroSectionProps {
  onStart: () => void;
}

export const IntroSection = ({ onStart }: IntroSectionProps) => {
  return (
    <div className="max-w-5xl mx-auto pt-32 px-4">
      {/* Hero Section with colorful gradient background */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center overflow-hidden mb-8"
      >
        {/* 컬러풀한 그라데이션 배경 - 단순화 */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-pink-300 via-yellow-200 to-orange-300 rounded-full opacity-20 blur-3xl z-0" />

        <div className="relative z-10">
          {/* 타이틀 */}
          <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-orange-100 text-orange-500 text-4xl mb-4 shadow-sm animate-bounce">
            <span>🧭</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-orange-600 tracking-tight flex items-center gap-2 flex-wrap justify-center">
            <span>나의</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-yellow-400 animate-gradientMove bg-[length:200%_200%]">
              직무 유형
            </span>
            <span>찾기 🔮</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-3">
            나만의 강점과 일 스타일,
            <br />
            <span className="font-bold text-orange-500">유형</span>으로
            알아보세요!
          </p>

          <p className="text-sm text-gray-500 mb-6">
            MBTI처럼 간단하게! 5분이면 충분해요
          </p>

          {/* 시작 버튼 */}
          <button
            onClick={onStart}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-400 text-white rounded-xl font-bold text-lg shadow-md hover:scale-105 hover:shadow-lg active:scale-100 transition-all duration-200 animate-[pulse_3s_ease-in-out_infinite] hover:animate-none mb-6 min-h-[56px]"
          >
            <span>🚀</span>
            <span>지금 바로 시작하기</span>
          </button>

          <p className="text-sm text-gray-500">
            회원가입 없이 바로 시작할 수 있어요
          </p>
        </div>
      </motion.div>

      {/* 특징 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <MdPsychology className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">
            10가지 직무 유형
          </h3>
          <p className="text-neutral-600 text-sm">
            다양한 직무 유형 중 당신의 유형을 찾아보세요
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
            <MdWork className="w-6 h-6 text-pink-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">
            맞춤 커리어 가이드
          </h3>
          <p className="text-neutral-600 text-sm">
            발전 가능성, 추천 직무까지 상세한 분석을 제공해요
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <MdArrowForward className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">
            단 5분 소요
          </h3>
          <p className="text-neutral-600 text-sm">
            간단한 질문에 답하면 바로 결과를 확인할 수 있어요
          </p>
        </div>
      </motion.div>
    </div>
  );
};
