import { useState } from "react";
import { isValidEmail } from "@/utils/validation";
import { SelectDropdown } from "@/shared/components/ui/Dropdown";

export interface SurveyData {
  q1: number;
  q2: number;
  q3: number;
  feedback: string;
  email: string;
  ageRange: string;
  createdAt: string;
}

interface SurveySectionProps {
  onSubmit?: (data: SurveyData) => void;
  submitSurvey: (data: SurveyData) => Promise<{ success: boolean }>;
}

export function SurveySection({ onSubmit, submitSurvey }: SurveySectionProps) {
  const [email, setEmail] = useState<string>("");
  const [ageRange, setAgeRange] = useState<string>("");
  const [q1, setQ1] = useState<number>(0);
  const [q2, setQ2] = useState<number>(0);
  const [q3, setQ3] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState<string>("");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ageOptions = ["10대", "20대", "30대", "40대", "50대 이상"];

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!isValidEmail(email)) {
        setEmailError("올바른 이메일 형식을 입력해주세요.");
        return;
      }
      setEmailError("");
      setIsSubmitting(true);
      const data: SurveyData = {
        email,
        ageRange,
        q1,
        q2,
        q3,
        feedback,
        createdAt: new Date().toISOString(),
      };
      if (onSubmit) onSubmit(data);
      await submitSurvey(data);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting survey:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    email.trim() !== "" &&
    ageRange.trim() !== "" &&
    agreed &&
    q1 > 0 &&
    q2 > 0 &&
    q3 > 0;

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-8">
      {submitted ? (
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-5xl mb-2">🎉</span>
          <div className="text-orange-600 font-bold text-2xl">
            소중한 의견 감사합니다!
          </div>
          <div className="text-gray-500 text-base">
            더 좋은 워크소스 테스트로 보답할게요 :)
          </div>
        </div>
      ) : (
        <div className="w-full max-w-5xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-100 p-6 sm:p-8">
          {/* 헤더 */}
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">🎁</div>
            <h3 className="text-xl sm:text-2xl font-bold text-orange-600 mb-1">
              설문조사 참여 시 커피 기프티콘 추첨!
            </h3>
            <p className="text-sm text-gray-500">
              소중한 의견을 남겨주시면 추첨을 통해 감사의 마음을 전합니다
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 상단: 사용자 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 이메일 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  📧 이메일
                </label>
                <input
                  type="email"
                  className="w-full border border-orange-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50/30 text-gray-700 placeholder:text-gray-400 text-sm"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                {emailError && (
                  <div className="text-red-500 text-xs mt-1">{emailError}</div>
                )}
              </div>

              {/* 연령대 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  🎂 연령대
                </label>
                <SelectDropdown
                  value={ageRange}
                  placeholder="연령대를 선택하세요"
                  options={ageOptions.map(opt => ({
                    value: opt,
                    label: opt,
                  }))}
                  onChange={value => setAgeRange(value)}
                  className="border-orange-200 focus:ring-orange-400 bg-orange-50/30"
                />
              </div>
            </div>

            {/* 개인정보 동의 */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="privacy-agree"
                className="mt-0.5 accent-orange-500"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                required
              />
              <label
                htmlFor="privacy-agree"
                className="text-xs text-gray-600 select-none cursor-pointer"
              >
                <a
                  href="https://worksauce.gitbook.io/infomation/service/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-orange-500 hover:text-orange-700"
                >
                  개인정보 수집 및 이용
                </a>
                에 동의합니다. (기프티콘 추첨 및 발송 용도)
              </label>
            </div>

            {/* 설문 질문 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Q1 */}
              <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-4 border border-orange-100">
                <div className="text-xs font-semibold text-gray-700 mb-3 leading-tight">
                  🧑‍💼 위 결과가 나의 일하는 모습이나 성향을 잘 반영한다고
                  느끼시나요?
                  {q1 === 0 && <span className="text-red-500 ml-1">*</span>}
                </div>
                <div className="flex justify-between gap-1">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQ1(num)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm border-2 transition-all ${
                        q1 === num
                          ? "bg-orange-500 text-white border-orange-500 shadow-md scale-105"
                          : "bg-white text-gray-400 border-gray-300 hover:border-orange-400 hover:text-orange-500"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 mt-1.5 px-0.5">
                  <span>전혀</span>
                  <span>매우</span>
                </div>
              </div>

              {/* Q2 */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                <div className="text-xs font-semibold text-gray-700 mb-3 leading-tight">
                  🏢 위 결과를 조직관리나 신규 채용 시 참고 자료로 활용할 의향이
                  있으신가요?
                  {q2 === 0 && <span className="text-red-500 ml-1">*</span>}
                </div>
                <div className="flex justify-between gap-1">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQ2(num)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm border-2 transition-all ${
                        q2 === num
                          ? "bg-blue-500 text-white border-blue-500 shadow-md scale-105"
                          : "bg-white text-gray-400 border-gray-300 hover:border-blue-400 hover:text-blue-500"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 mt-1.5 px-0.5">
                  <span>전혀</span>
                  <span>매우</span>
                </div>
              </div>

              {/* Q3 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                <div className="text-xs font-semibold text-gray-700 mb-3 leading-tight">
                  🤝 팀원들이 이런 결과를 서로 공유한다면, 팀워크나 소통에
                  도움이 될 것 같나요?
                  {q3 === 0 && <span className="text-red-500 ml-1">*</span>}
                </div>
                <div className="flex justify-between gap-1">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQ3(num)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm border-2 transition-all ${
                        q3 === num
                          ? "bg-purple-500 text-white border-purple-500 shadow-md scale-105"
                          : "bg-white text-gray-400 border-gray-300 hover:border-purple-400 hover:text-purple-500"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 mt-1.5 px-0.5">
                  <span>전혀</span>
                  <span>매우</span>
                </div>
              </div>
            </div>

            {/* 의견 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                💬 의견 (선택)
              </label>
              <textarea
                className="w-full border border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50/30 text-gray-700 placeholder:text-gray-400 text-sm resize-none"
                placeholder="서비스에 대한 의견이나 개선점을 자유롭게 남겨주세요."
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                rows={2}
              />
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-400 text-white shadow-lg hover:scale-[1.02] hover:shadow-xl active:scale-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>제출 중...</span>
                </>
              ) : (
                "제출하기"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default SurveySection;
