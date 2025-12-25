import {
  MdQuestionAnswer,
  MdThumbUp,
  MdWarning,
  MdCheckCircle,
} from "react-icons/md";
import type { WorkTypeData } from "@/features/groups/types/workType.types";

interface InterviewGuideTabProps {
  workTypeData: WorkTypeData;
}

export const InterviewGuideTab = ({
  workTypeData,
}: InterviewGuideTabProps) => {
  return (
    <div
      role="tabpanel"
      id="interview-panel"
      aria-labelledby="interview-tab"
      className="space-y-4 sm:space-y-6"
    >
      {/* 추천 면접 질문 */}
      <div>
        <h4 className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4 flex items-center gap-2">
          <MdQuestionAnswer className="w-4 h-4 sm:w-5 sm:h-5" />
          추천 면접 질문
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {workTypeData.interview.questions.map((item, index) => (
            <div
              key={index}
              className="p-4 sm:p-5 bg-white border-2 border-primary-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-100 text-primary font-bold text-xs sm:text-sm flex items-center justify-center">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-primary-50 text-primary text-xs font-semibold mb-1 sm:mb-2">
                    {item.category}
                  </span>
                  <p className="text-sm sm:text-base text-neutral-800 font-medium leading-relaxed">
                    {item.question}
                  </p>
                </div>
              </div>

              <div className="ml-9 sm:ml-11 pl-3 sm:pl-4 border-l-2 border-primary-100">
                <p className="text-xs sm:text-sm text-primary-600 leading-relaxed">
                  <span className="font-semibold">✓ </span>
                  {item.lookFor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 긍정적 신호 & 주의 신호 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-success mb-3 sm:mb-4 flex items-center gap-2">
            <MdThumbUp className="w-4 h-4 sm:w-5 sm:h-5" />
            긍정적 신호
          </h4>
          <div className="space-y-2">
            {workTypeData.interview.greenFlags.map((signal, index) => (
              <div
                key={index}
                className="p-2.5 sm:p-3 bg-success-50 rounded-lg border border-success-100"
              >
                <div className="flex items-start gap-2">
                  <MdThumbUp className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-success-700 leading-relaxed">
                    {signal}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-base sm:text-lg font-semibold text-error mb-3 sm:mb-4 flex items-center gap-2">
            <MdWarning className="w-4 h-4 sm:w-5 sm:h-5" />
            주의 신호
          </h4>
          <div className="space-y-2">
            {workTypeData.interview.redFlags.map((flag, index) => (
              <div
                key={index}
                className="p-2.5 sm:p-3 bg-error-50 rounded-lg border border-error-100"
              >
                <div className="flex items-start gap-2">
                  <MdWarning className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-error-700 leading-relaxed">{flag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 면접 체크리스트 */}
      <div className="bg-neutral-50 rounded-xl p-4 sm:p-6 border border-neutral-200 no-pdf">
        <h4 className="text-base sm:text-lg font-semibold text-neutral-800 mb-3 sm:mb-4 flex items-center gap-2">
          <MdCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          면접 진행 체크리스트
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {workTypeData.interview.questions.slice(0, 6).map((item, index) => (
            <label
              key={index}
              className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-primary-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm sm:text-base text-neutral-700 font-medium">
                {item.category} 확인
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
