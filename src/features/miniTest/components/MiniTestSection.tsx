import { miniTestQuestions, type Question } from "../const/miniTestData";

interface MiniTestQuestionProps {
  q: Question;
  qIdx: number;
  answer: number;
  onSelect: (score: number) => void;
}

function MiniTestQuestion({
  q,
  qIdx,
  answer,
  onSelect,
}: MiniTestQuestionProps) {
  return (
    <div className="gap-2 flex flex-col mb-4 last:mb-0">
      <div className="flex items-start">
        <span className="text-orange-500 font-bold mr-2 mt-0.5 text-sm sm:text-base">
          {qIdx + 1}.
        </span>
        <span className="text-gray-900 font-medium text-sm sm:text-base break-words leading-snug">
          {q.text}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-sm text-gray-500 px-1">
          <span>매우 그렇지 않다</span>
          <span>매우 그렇다</span>
        </div>
        <div className="flex gap-2 sm:gap-3 justify-center">
          {[1, 2, 3, 4, 5].map(score => (
            <button
              key={score}
              type="button"
              onClick={() => onSelect(score)}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold border-2 text-sm
              ${
                answer === score
                  ? "bg-orange-500 text-white border-orange-500 scale-110 shadow-md"
                  : "bg-white text-gray-400 border-gray-300 hover:border-orange-400 hover:text-orange-500 hover:scale-105"
              }
              transition-all duration-200`}
              aria-label={`${score}점`}
            >
              {score}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MiniTestSectionProps {
  currentTypeIdx: number;
  miniTestAnswers: number[][];
  onAnswer: (typeIdx: number, qIdx: number, score: number) => void;
  onNext: () => void;
  onFinish: () => void;
  isComplete: boolean;
  isLastType: boolean;
}

export function MiniTestSection({
  currentTypeIdx,
  miniTestAnswers,
  onAnswer,
  onNext,
  onFinish,
  isComplete,
  isLastType,
}: MiniTestSectionProps) {
  const typeBlock = miniTestQuestions[currentTypeIdx];

  return (
    <div className="px-4 py-6 flex items-center justify-center">
      <div className="w-full sm:w-[600px] bg-white rounded-2xl shadow-lg p-6">
        <div className="mb-5 text-center">
          <h2 className="text-xl font-extrabold mb-2 text-orange-600 tracking-tight flex items-center justify-center gap-2">
            문항에 답해주세요
          </h2>
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <span className="text-sm">👉</span>각 문항마다{" "}
            <span className="text-orange-500 font-bold">1~5점</span> 중
            선택해주세요
          </p>

          {/* Progress Bar */}
          <div className="mt-4 mb-2">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-medium text-gray-600">
                유형 진행
              </span>
              <span className="text-xs font-bold text-orange-600">
                {currentTypeIdx + 1} / {miniTestQuestions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-400 h-2 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((currentTypeIdx + 1) / miniTestQuestions.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <section className="bg-gray-50 rounded-xl shadow p-4 border border-gray-100 flex flex-col gap-5">
          {typeBlock.questions.map((q, qIdx) => (
            <MiniTestQuestion
              key={qIdx}
              q={q}
              qIdx={qIdx}
              answer={miniTestAnswers[currentTypeIdx][qIdx]}
              onSelect={score => onAnswer(currentTypeIdx, qIdx, score)}
            />
          ))}
        </section>

        {!isLastType ? (
          <button
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-400 text-white rounded-xl font-bold mt-5 shadow-md hover:scale-105 hover:shadow-lg active:scale-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={onNext}
            disabled={!isComplete}
          >
            다음
          </button>
        ) : (
          <button
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-400 text-white rounded-xl font-bold mt-5 shadow-md hover:scale-105 hover:shadow-lg active:scale-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={onFinish}
            disabled={!isComplete}
          >
            결과 보기
          </button>
        )}
      </div>
    </div>
  );
}
