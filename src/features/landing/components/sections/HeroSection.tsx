import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Lottie from "react-lottie-player";
import HeroAnimation from "@/features/landing/assets/animations/Hero.json";

export const HeroSection = () => {
  return (
    <section className="h-screen w-full flex items-center snap-start">
      <div className="container mx-auto px-6 lg:px-8 pt-20">
        <div className="flex flex-col md:flex-row items-center">
          {/* 텍스트 영역 */}
          <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="heading-1 text-neutral-800 mb-6 md:mb-8"
            >
              채용부터
              <br className="md:hidden" />
              <span className="hidden md:inline">&nbsp;</span>
              조직 문화까지
              <br />
              <span className="text-primary-500 mt-2 md:mt-3 inline-block">
                HR 진단키트, 워크소스
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="body-large text-neutral-600 mb-12 leading-relaxed"
            >
              객관적인 데이터 기반으로 인재를 선발하고
              <br />
              조직의 성장을 이끌어 보세요.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                to="/auth/signup"
                className="btn-primary inline-block px-8 py-3 rounded-full font-bold hover:scale-105 transition-all duration-base"
              >
                무료로 시작하기
              </Link>
            </motion.div>
          </div>

          {/* 애니메이션 영역 */}
          <div className="md:w-1/2 w-full flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center items-center w-[90%] max-h-[70vh]"
            >
              <Lottie
                loop
                animationData={HeroAnimation}
                play
                className="w-full h-auto"
                aria-label="워크소스 HR 진단 프로세스 애니메이션"
                role="img"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
