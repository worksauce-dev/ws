/**
 * FAQ 섹션
 * 자주 묻는 질문과 답변을 아코디언 형태로 표시
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdExpandMore } from "react-icons/md";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "정말 무료인가요? 숨겨진 비용은 없나요?",
    answer:
      "네, 베타 버전에서는 완전히 무료로 시작할 수 있습니다. 카드 등록이나 결제 정보 입력 없이 바로 사용 가능합니다. 기본 기능은 무료로 제공되며, 추후 프리미엄 기능이 필요한 경우에만 선택적으로 유료 플랜을 이용하실 수 있습니다.",
  },
  {
    question: "테스트는 얼마나 걸리나요?",
    answer:
      "지원자가 소스테스트를 완료하는 데는 약 20-30분 정도 소요됩니다. 채용 담당자는 지원자 이메일을 추가하는 데 30초, 결과 확인은 즉시 가능합니다. 전체 프로세스가 매우 간단하고 빠릅니다.",
  },
  {
    question: "개인정보는 안전한가요?",
    answer:
      "물론입니다. 모든 데이터는 암호화되어 안전하게 저장되며, 개인정보 보호법을 준수합니다. 수집된 정보는 채용 목적으로만 사용되며, 제3자와 공유되지 않습니다. 또한 언제든지 데이터 삭제를 요청하실 수 있습니다.",
  },
  {
    question: "어떤 회사들이 사용하나요?",
    answer:
      "스타트업부터 중소기업까지 다양한 규모의 회사에서 사용하고 있습니다. 특히 데이터 기반으로 채용 결정을 내리고 싶은 HR 담당자분들과 팀 문화를 중요하게 생각하는 스타트업에서 많이 활용하고 계십니다.",
  },
  {
    question: "언제든지 해지할 수 있나요?",
    answer:
      "네, 언제든지 계정을 삭제하거나 서비스 이용을 중단하실 수 있습니다. 위약금이나 해지 수수료는 전혀 없으며, 설정 페이지에서 몇 번의 클릭만으로 간단하게 처리됩니다.",
  },
  {
    question: "지원자가 테스트를 거부하면 어떻게 하나요?",
    answer:
      "테스트는 선택사항이며 강제가 아닙니다. 다만 대부분의 지원자들은 자신의 강점을 객관적으로 보여줄 수 있는 기회로 받아들입니다. 테스트는 5-10분 정도로 짧고 간단하며, 지원자에게도 자신의 직무 적합성을 확인할 수 있는 유용한 도구입니다.",
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
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
            자주 묻는 질문
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            궁금하신 점이 있으신가요? 여기서 답을 찾아보세요
          </p>
        </motion.div>

        {/* FAQ 아코디언 */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:border-primary-300 transition-colors duration-200"
            >
              {/* 질문 버튼 */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-neutral-800 pr-8">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <MdExpandMore className="w-6 h-6 text-neutral-500" />
                </motion.div>
              </button>

              {/* 답변 */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-neutral-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* 추가 문의 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-neutral-600 mb-4">다른 질문이 있으신가요?</p>
          <a
            href="https://worksauce.gitbook.io/help"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-200"
          >
            도움말 센터 방문하기 →
          </a>
        </motion.div>
      </div>
    </section>
  );
};
