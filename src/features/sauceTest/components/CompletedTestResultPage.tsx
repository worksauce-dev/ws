import { MdCheckCircle, MdWorkOutline, MdInfo } from "react-icons/md";
import { motion } from "framer-motion";
import { WORK_TYPES, type WorkTypeCode } from "../constants/testQuestions";

interface CompletedTestResultPageProps {
  applicantName: string;
  primaryWorkType: WorkTypeCode;
}

/**
 * 이미 완료된 테스트를 다시 방문했을 때 보여주는 결과 페이지
 * TestResultPage와 유사한 UI를 사용하지만, "이미 완료" 메시지 강조
 */
export const CompletedTestResultPage = ({
  applicantName,
  primaryWorkType,
}: CompletedTestResultPageProps) => {
  const workTypeInfo = WORK_TYPES[primaryWorkType];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Already Completed Notice */}
        <div className="bg-primary-100 border-2 border-primary-300 rounded-xl p-4 mb-6 flex items-start gap-3">
          <MdInfo className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-primary-800 mb-1">
              이미 테스트를 완료하셨습니다
            </p>
            <p className="text-sm text-primary-700">
              {applicantName}님은 이미 소스테스트를 완료하셨어요. 아래에서 결과를 확인하실 수 있어요.
            </p>
          </div>
        </div>

        {/* Success Icon */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 bg-success-100 rounded-full flex items-center justify-center"
          >
            <MdCheckCircle className="w-12 h-12 text-success-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-neutral-800 mb-3"
          >
            테스트 결과
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-neutral-600"
          >
            {applicantName}님의 소스테스트 결과입니다.
          </motion.p>
        </div>

        {/* Result Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border-2 border-primary-200 p-8 mb-6 shadow-lg"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full bg-primary-100">
              <MdWorkOutline className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-sm font-medium text-neutral-600 mb-2">
              {applicantName}님의 업무 유형은
            </p>
            <div
              className="inline-block px-6 py-3 rounded-full text-2xl font-bold mb-4"
              style={{
                backgroundColor: `${workTypeInfo.color}20`,
                color: workTypeInfo.color,
              }}
            >
              {workTypeInfo.name}
            </div>
            <p className="text-base text-neutral-700 leading-relaxed">
              {workTypeInfo.name}은 {getWorkTypeDescription(primaryWorkType)}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-200 my-6"></div>

          {/* Additional Info */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
              <p className="text-neutral-700">
                이 결과는 {applicantName}님의 업무 성향과 강점을 파악하기 위한 것이에요.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
              <p className="text-neutral-700">
                담당자가 {applicantName}님의 결과를 확인한 후 필요시 연락드릴 예정이에요.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
              <p className="text-neutral-700">
                결과에 대한 상세한 분석은 담당자가 확인할 수 있어요.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Info Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white text-center shadow-md"
        >
          <p className="text-lg font-semibold mb-2">결과가 안전하게 전달되었어요</p>
          <p className="text-sm opacity-90">
            테스트 결과는 담당자에게 이미 전달되었어요.
            <br />
            추가 문의사항은 담당자에게 연락해주세요.
          </p>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-neutral-500">이 창을 닫으셔도 돼요.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

// WorkType별 간단한 설명
const getWorkTypeDescription = (workType: WorkTypeCode): string => {
  const descriptions: Record<WorkTypeCode, string> = {
    SE: "윤리적 기준과 원칙을 중요시하며, 체계적이고 책임감 있는 업무 수행을 추구해요.",
    SA: "독창적인 미적 감각을 업무에 적용하며, 예술적 요소를 통해 업무의 가치를 높여요.",
    AS: "창의적이고 독립적인 사고로 새로운 관점에서 문제를 해결하는 것을 즐겨요.",
    AF: "혁신을 추구하고 다양한 분야를 융합하여 새로운 가치를 창출하는 데 강점이 있어요.",
    UM: "논리적이고 체계적인 접근으로 안정적인 업무 관리와 문제 해결에 능숙해요.",
    UR: "지속적인 학습과 깊이 있는 분석을 통해 전문성을 발휘하는 것을 선호해요.",
    CA: "타인과의 소통과 관계 형성에 뛰어나며, 도움을 제공하는 업무에 적합해요.",
    CH: "다양한 이해관계를 조율하고 조화로운 환경을 만드는 데 탁월한 능력을 보여요.",
    EE: "새로운 도전을 즐기고 적극적으로 기회를 포착하여 성과를 창출해요.",
    EG: "명확한 목표를 설정하고 달성하는 과정에서 높은 성과를 내는 데 강점이 있어요.",
  };

  return descriptions[workType];
};
