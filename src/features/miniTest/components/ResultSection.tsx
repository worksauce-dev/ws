import { MdRefresh } from "react-icons/md";
import { motion } from "framer-motion";
import { SurveySection, type SurveyData } from "../components/SurveySection";
import {
  SAUCE_TYPES,
  SAUCE_EMOJIS,
  SAUCE_COMMENTS,
} from "../const/miniTestData";
import type { AIResult } from "../types/aiResult";

interface ResultSectionProps {
  finalType: string;
  onRestart: () => void;
  submitSurvey: (survey: SurveyData) => Promise<{ success: boolean }>;
  requestId: string | null;
  isProcessingResult: boolean;
  aiResult: AIResult | null;
  webhookError: string | null;
}

// --- 결과 요약 섹션 (100vh 최적화) ---
function ResultSummarySection({
  finalResult,
  emoji,
  comment,
  onRestart,
}: {
  finalResult: (typeof SAUCE_TYPES)[keyof typeof SAUCE_TYPES];
  emoji: string;
  comment: string;
  onRestart: () => void;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto"
      >
        <div className="relative mb-6">
          <div
            className={`absolute left-1/2 -translate-x-1/2 -top-8 w-24 h-24 rounded-full blur-xl opacity-50 z-0 bg-gradient-to-br ${finalResult.color}`}
          ></div>
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-5xl sm:text-6xl mb-3 drop-shadow-lg"
            >
              {emoji}
            </motion.div>
            <div className="flex flex-col items-center text-center">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-sm font-medium text-gray-400 mb-2"
              >
                당신의 워크소스는
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-orange-500 to-pink-500 animate-gradient drop-shadow-lg mb-2"
              >
                {finalResult.name}
              </motion.span>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-base sm:text-lg font-bold text-orange-600 mb-4"
              >
                {finalResult.tagline}
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-1.5 mb-4 max-w-sm"
        >
          {finalResult.traits.slice(0, 4).map((trait, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 border border-orange-200"
            >
              {trait}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="text-sm sm:text-base font-semibold text-pink-600 mb-6 text-center px-4"
        >
          {comment}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1 }}
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-400 to-orange-400 text-white font-bold shadow-lg hover:from-pink-500 hover:to-orange-500 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-200 mb-6"
        >
          <MdRefresh className="text-lg" />
          <span className="text-sm sm:text-base">다시 테스트하기</span>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="flex-shrink-0 mb-4"
      >
        <span className="flex items-center gap-1 text-orange-600 font-semibold text-sm animate-bounce">
          <span className="text-base">⬇️</span> 아래로 스크롤하세요
        </span>
      </motion.div>
    </div>
  );
}

// --- 키워드 헤더 섹션 ---
function KeywordsHeaderSection({ aiResult }: { aiResult: AIResult }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl mx-auto text-center"
      >
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {aiResult.keywords.map((keyword: string, idx: number) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 rounded-full text-sm font-medium shadow-sm"
            >
              {keyword}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-2xl sm:text-3xl text-gray-800 font-bold leading-relaxed"
        >
          {aiResult.one_liner}
        </motion.p>
      </motion.div>
    </div>
  );
}

// --- 스토리 섹션 ---
function StorySection({ aiResult }: { aiResult: AIResult }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg border border-orange-100"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
            📖
          </div>
          <h3 className="text-2xl font-bold text-gray-800">당신의 이야기</h3>
        </motion.div>

        <div className="space-y-4 text-gray-700 leading-relaxed">
          {aiResult.type_description.map((paragraph: string, idx: number) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
              className="text-base leading-relaxed"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// --- 성장 가이드 섹션 ---
function GrowthSection({ aiResult }: { aiResult: AIResult }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg border border-purple-100"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
            💡
          </div>
          <h3 className="text-2xl font-bold text-gray-800">성장 가이드</h3>
        </motion.div>

        <div className="space-y-4">
          {aiResult.advice.map((adviceText: string, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
              className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-400"
            >
              <p className="text-base text-gray-700 leading-relaxed">
                {adviceText}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// --- 닮은 인물 섹션 ---
function CharactersSection({ aiResult }: { aiResult: AIResult }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg border border-yellow-100"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-2xl">
            🌟
          </div>
          <h3 className="text-2xl font-bold text-gray-800">닮은 인물</h3>
        </motion.div>

        <div className="space-y-6">
          {aiResult.example_characters.map((character, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + idx * 0.15, duration: 0.5 }}
              className="p-6 bg-yellow-50 rounded-xl border border-yellow-200"
            >
              <h4 className="font-bold text-xl text-gray-800 mb-3">
                {character.name}
              </h4>
              <p className="text-base text-gray-600 leading-relaxed">
                {character.context}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// --- 처리 상태 섹션 (100vh 최적화) ---
function ProcessingStatusSection({
  isProcessingResult,
  webhookError,
}: {
  isProcessingResult: boolean;
  webhookError: string | null;
}) {
  if (isProcessingResult) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm mx-auto text-center"
        >
          <div className="animate-spin w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-6"></div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold text-orange-600 mb-3"
          >
            더 자세한 분석을 준비하고 있어요
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-sm mb-6 leading-relaxed"
          >
            잠시만 기다려주세요...
            <br />
            맞춤형 인사이트를 생성 중입니다
          </motion.p>
          <div className="flex justify-center space-x-1">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (webhookError) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, type: "spring" }}
            className="text-4xl mb-4"
          >
            🔄
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg font-bold text-orange-600 mb-3"
          >
            추가 분석 중 문제가 발생했습니다
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-sm mb-4 leading-relaxed"
          >
            기본 분석 결과는 위에서 확인하실 수 있습니다
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-4"
          >
            <p className="text-xs text-blue-700 leading-relaxed">
              💡 더 자세한 맞춤 분석은 잠시 후 다시 시도해 주세요
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return null;
}

export function ResultSection({
  finalType,
  onRestart,
  submitSurvey,
  isProcessingResult,
  aiResult,
  webhookError,
}: ResultSectionProps) {
  const finalResult = SAUCE_TYPES[finalType as keyof typeof SAUCE_TYPES];
  const emoji = SAUCE_EMOJIS[finalType] || "🍽️";
  const comment = SAUCE_COMMENTS[finalType] || "나만의 소스를 발견했어요!";

  return (
    <div
      className="overflow-y-auto h-screen snap-y w-full max-w-4xl mx-auto hide-scrollbar"
      style={{
        scrollSnapType: "y proximity",
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch"
      }}
    >
      {/* 결과 요약 섹션 */}
      <section
        className="h-screen pt-16"
        style={{ scrollSnapAlign: "start", scrollSnapStop: "normal" }}
      >
        <ResultSummarySection
          finalResult={finalResult}
          emoji={emoji}
          comment={comment}
          onRestart={onRestart}
        />
      </section>

      {aiResult ? (
        <>
          {/* 키워드 헤더 섹션 */}
          <section
            className="h-screen"
            style={{ scrollSnapAlign: "start", scrollSnapStop: "normal" }}
          >
            <KeywordsHeaderSection aiResult={aiResult} />
          </section>

          {/* 스토리 섹션 */}
          <section
            className="h-screen"
            style={{ scrollSnapAlign: "start", scrollSnapStop: "normal" }}
          >
            <StorySection aiResult={aiResult} />
          </section>

          {/* 강점 섹션 */}
          {/* <section className="h-screen" style={{ scrollSnapAlign: "start", scrollSnapStop: "normal" }}>
            <StrengthsSection aiResult={aiResult} />
          </section> */}

          {/* 성장 가이드 섹션 */}
          <section
            className="h-screen"
            style={{ scrollSnapAlign: "start", scrollSnapStop: "normal" }}
          >
            <GrowthSection aiResult={aiResult} />
          </section>

          {/* 닮은 인물 섹션 */}
          {aiResult.example_characters &&
            aiResult.example_characters.length > 0 && (
              <section
                className="h-screen"
                style={{ scrollSnapAlign: "start", scrollSnapStop: "normal" }}
              >
                <CharactersSection aiResult={aiResult} />
              </section>
            )}

          {/* 설문 섹션 */}
          <section
            className="h-screen"
            style={{ scrollSnapAlign: "start", scrollSnapStop: "normal" }}
          >
            <SurveySection submitSurvey={submitSurvey} />
          </section>
        </>
      ) : (
        <section
          className="h-screen"
          style={{ scrollSnapAlign: "start", scrollSnapStop: "normal" }}
        >
          <ProcessingStatusSection
            isProcessingResult={isProcessingResult}
            webhookError={webhookError || "결과를 불러올 수 없습니다"}
          />
        </section>
      )}
    </div>
  );
}
