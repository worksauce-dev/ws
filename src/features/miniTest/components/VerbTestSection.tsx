interface QuestionSectionProps {
  currentQuestion: number;
  totalQuestions: number;
  question: string;
  options: { type: string; verb: string; score: number; sort: string }[];
  selectedOptions: number[];
  onSelectOption: (index: number) => void;
  onNext: () => void;
}

export const VerbTestSection = ({
  currentQuestion,
  totalQuestions,
  question,
  options,
  selectedOptions,
  onSelectOption,
  onNext,
}: QuestionSectionProps) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-8 min-h-[640px] flex flex-col justify-center">
      {/* 진행률 & 질문 */}
      <div className="mb-8 text-center">
        <div className="mb-2 text-sm text-orange-400 font-semibold tracking-wide flex items-center justify-center gap-1">
          <span className="text-lg">📝</span>
          <span>
            {currentQuestion} / {totalQuestions}
          </span>
        </div>
        <h2 className="text-2xl font-extrabold mb-2 text-orange-600 tracking-tight flex items-center justify-center gap-2">
          {question}
        </h2>
        <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-1">
          <span className="text-base">👉</span>
          가장 잘 맞는 <span className="text-orange-500 font-bold">2가지</span>
          를 선택해주세요
        </p>
      </div>

      {/* 선택지 */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectOption(index)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-base font-medium text-left flex items-center justify-between min-h-[56px]
              ${
                selectedOptions.includes(index)
                  ? "border-orange-500 bg-orange-50 text-orange-700 shadow-md scale-[1.03]"
                  : "border-gray-200 hover:border-orange-300 bg-white text-gray-800 hover:bg-orange-50 hover:shadow-sm hover:scale-[1.02]"
              }
            `}
            style={{
              transition: "box-shadow 0.2s, transform 0.2s, background 0.2s",
            }}
          >
            <span>{option.verb}</span>
            {selectedOptions.includes(index) && (
              <span className="ml-2 text-orange-500 font-bold text-sm">✔</span>
            )}
          </button>
        ))}
      </div>

      {/* 하단 버튼 */}
      <button
        onClick={onNext}
        disabled={selectedOptions.length !== 2}
        className="w-full py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-400 text-white rounded-xl font-bold mt-8 shadow-md hover:scale-105 hover:shadow-lg active:scale-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-h-[56px]"
      >
        {currentQuestion === totalQuestions ? "미니 테스트 시작" : "다음"}
      </button>
    </div>
  );
};
