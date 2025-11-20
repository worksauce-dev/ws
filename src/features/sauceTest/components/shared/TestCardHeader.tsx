import { MdLightbulb, MdSave, MdRefresh } from "react-icons/md";

const isDev = import.meta.env.VITE_ENV !== "Production";

interface TestCardHeaderProps {
  // 제목 영역
  title: string;
  subtitle?: string;

  // 질문/지시문 영역
  questionText: string;

  // 버튼들
  onSave?: () => void;
  onReset?: () => void;
  extraButtons?: React.ReactNode;

  // 스타일링
  icon?: React.ReactNode;
}

export const TestCardHeader = ({
  title,
  subtitle,
  questionText,
  onSave,
  onReset,
  extraButtons,
  icon = <MdLightbulb className="w-4 h-4 md:w-5 md:h-5 text-white" />,
}: TestCardHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600">
      {/* 상단: 메타 정보 */}
      <div className="px-4 md:px-8 pt-4 md:pt-6 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm md:text-base">
                {title}
              </h2>
              {subtitle && (
                <p className="text-white/80 text-xs">{subtitle}</p>
              )}
            </div>
          </div>

          {/* 우측 버튼 영역 */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* 추가 버튼 (자동진행 토글 등) */}
            {extraButtons}

            {/* 개발 모드 전용: 임시저장/리셋 버튼 */}
            {isDev && onSave && (
              <button
                onClick={onSave}
                className="flex items-center gap-1 text-xs md:text-sm text-white/90 hover:text-white transition-colors px-2 md:px-3 py-1 rounded-md hover:bg-white/10 border border-white/30"
                title="현재까지의 진행 상황을 임시 저장합니다"
              >
                <MdSave className="w-4 h-4" />
                <span className="hidden sm:inline">임시저장</span>
              </button>
            )}

            {isDev && onReset && (
              <button
                onClick={onReset}
                className="flex items-center gap-1 text-xs md:text-sm text-white/60 hover:text-white transition-colors px-2 md:px-3 py-1 rounded-md hover:bg-white/10 border border-white/20"
                title="전체 테스트 리셋 (개발 모드)"
              >
                <MdRefresh className="w-4 h-4" />
                <span className="hidden sm:inline">리셋 (DEV)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 하단: 질문 텍스트 */}
      <div className="px-4 md:px-8 py-4 md:py-6">
        <p className="text-white text-lg md:text-2xl font-medium leading-relaxed">
          {questionText}
        </p>
      </div>
    </div>
  );
};
