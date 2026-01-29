import { clsx } from "clsx";
import { MdCheck } from "react-icons/md";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const StepIndicator = ({
  currentStep,
  totalSteps,
  className,
}: StepIndicatorProps) => {
  return (
    <div
      className={clsx("relative flex items-center justify-center", className)}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`진행 단계: ${currentStep}/${totalSteps}`}
    >
      {/* 배경 연결선 */}
      <div className="absolute inset-0 flex items-center">
        <div className="h-0.5 w-full bg-neutral-200" />
      </div>

      {/* 진행된 연결선 */}
      <div className="absolute inset-0 flex items-center">
        <div
          className={clsx("h-0.5 bg-primary-500 transition-all duration-300")}
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
        />
      </div>

      {/* 단계들 */}
      <div className="relative z-10 flex w-full justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;
          const isUpcoming = step > currentStep;

          return (
            <div
              key={step}
              className={clsx(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white text-sm font-medium text-neutral-500 transition-colors",
                {
                  "border-primary-500 bg-primary-500 ": isActive || isCompleted,
                  "border-neutral-200 bg-white ": isUpcoming,
                }
              )}
              aria-current={isActive ? "step" : undefined}
            >
              {isCompleted ? (
                <MdCheck className="h-5 w-5" aria-hidden="true" />
              ) : (
                step
              )}
            </div>
          );
        })}
      </div>

      {/* 스크린 리더용 현재 상태 안내 */}
      <div className="sr-only">
        현재 {currentStep}단계 진행 중, 총 {totalSteps}단계
      </div>
    </div>
  );
};

StepIndicator.displayName = "StepIndicator";

export { StepIndicator };
export type { StepIndicatorProps };
