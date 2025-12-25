import { useState, useEffect } from "react";
import { MdClose, MdArrowForward, MdArrowBack } from "react-icons/md";

interface TourStep {
  target: string; // CSS selector
  title: string;
  description: string;
  placement?: "top" | "bottom" | "left" | "right";
}

interface OnboardingTourProps {
  steps: TourStep[];
  onComplete: () => void;
  onSkip: () => void;
  onMobileMenuToggle?: (isOpen: boolean) => void;
}

export function OnboardingTour({ steps, onComplete, onSkip, onMobileMenuToggle }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetPosition, setTargetPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  // 모바일에서 알림 스텝일 때 메뉴 자동으로 열기
  useEffect(() => {
    const isMobile = window.innerWidth < 640; // sm breakpoint
    const isNotificationStep = step.target === "[data-tour='notification-bell']";

    if (isMobile && isNotificationStep && onMobileMenuToggle) {
      // 알림 스텝에서는 모바일 메뉴 열기
      onMobileMenuToggle(true);

      // 약간의 딜레이 후 모바일 알림 타겟으로 변경
      setTimeout(() => {
        // 타겟을 모바일 알림으로 변경하기 위해 재계산 트리거
        const event = new Event('resize');
        window.dispatchEvent(event);
      }, 100);
    } else if (isMobile && !isNotificationStep && onMobileMenuToggle) {
      // 다른 스텝으로 이동하면 메뉴 닫기
      onMobileMenuToggle(false);
    }
  }, [currentStep, step.target, onMobileMenuToggle]);

  // Calculate target element position
  useEffect(() => {
    const updatePosition = () => {
      const isMobile = window.innerWidth < 640;
      const isNotificationStep = step.target === "[data-tour='notification-bell']";

      // 모바일에서 알림 스텝일 때는 모바일 알림 타겟 사용
      let targetSelector = step.target;
      if (isMobile && isNotificationStep) {
        targetSelector = "[data-tour='notification-bell-mobile']";
      }

      const element = document.querySelector(targetSelector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [step.target]);

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  if (!targetPosition) return null;

  // Calculate tooltip position based on placement
  const getTooltipPosition = () => {
    const placement = step.placement || "bottom";
    const padding = 16;
    const viewportPadding = 8; // 화면 가장자리 여백
    const tooltipWidth = window.innerWidth < 640 ? window.innerWidth - 16 : 384; // mobile: calc(100vw-1rem), desktop: 384px (w-96)

    let position;

    switch (placement) {
      case "top":
        position = {
          top: targetPosition.top - padding,
          left: targetPosition.left + targetPosition.width / 2,
          transform: "translate(-50%, -100%)",
        };
        break;
      case "bottom":
        position = {
          top: targetPosition.top + targetPosition.height + padding,
          left: targetPosition.left + targetPosition.width / 2,
          transform: "translate(-50%, 0)",
        };
        break;
      case "left":
        position = {
          top: targetPosition.top + targetPosition.height / 2,
          left: targetPosition.left - padding,
          transform: "translate(-100%, -50%)",
        };
        break;
      case "right":
        position = {
          top: targetPosition.top + targetPosition.height / 2,
          left: targetPosition.left + targetPosition.width + padding,
          transform: "translate(0, -50%)",
        };
        break;
      default:
        position = {
          top: targetPosition.top + targetPosition.height + padding,
          left: targetPosition.left + targetPosition.width / 2,
          transform: "translate(-50%, 0)",
        };
    }

    // 화면 경계를 벗어나지 않도록 조정
    const halfWidth = tooltipWidth / 2;
    const minLeft = viewportPadding + halfWidth;
    const maxLeft = window.innerWidth - viewportPadding - halfWidth;

    // left 값을 화면 안에 제한
    if (position.left < minLeft) {
      position.left = minLeft;
    } else if (position.left > maxLeft) {
      position.left = maxLeft;
    }

    return position;
  };

  const tooltipPosition = getTooltipPosition();

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[9998] pointer-events-none">
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Spotlight */}
      <div
        className="fixed z-[9999] pointer-events-none transition-all duration-300"
        style={{
          top: `${targetPosition.top - 8}px`,
          left: `${targetPosition.left - 8}px`,
          width: `${targetPosition.width + 16}px`,
          height: `${targetPosition.height + 16}px`,
        }}
      >
        <div className="absolute inset-0 rounded-lg ring-[3px] ring-primary-500 shadow-2xl animate-pulse"></div>
        <div className="absolute inset-0 rounded-lg bg-primary-500/10"></div>
      </div>

      {/* Tooltip */}
      <div
        className="fixed z-[10000] pointer-events-auto transition-all duration-300"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          transform: tooltipPosition.transform,
        }}
      >
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-sm w-[calc(100vw-1rem)] sm:w-96 border border-neutral-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary-600 text-white text-sm font-bold flex-shrink-0">
                {currentStep + 1}
              </span>
              <div className="flex gap-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? "bg-primary-600 w-5 sm:w-6"
                        : index < currentStep
                        ? "bg-primary-400 w-3 sm:w-4"
                        : "bg-neutral-200 w-3 sm:w-4"
                    }`}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="p-1 sm:p-1.5 hover:bg-neutral-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="투어 건너뛰기"
            >
              <MdClose className="w-5 h-5 text-neutral-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-6">
            <h3 className="text-base sm:text-xl font-bold text-neutral-900 mb-1.5 sm:mb-2 break-keep">
              {step.title}
            </h3>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed break-keep">
              {step.description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 sm:px-6 pb-4 sm:pb-5 pt-2 sm:pt-3 border-t border-neutral-100">
            <div>
              {!isFirstStep && (
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <MdArrowBack className="w-4 h-4" />
                  <span className="hidden sm:inline">이전</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleSkip}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                건너뛰기
              </button>
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-lg shadow-md transition-all duration-200"
              >
                {isLastStep ? "완료" : "다음"}
                {!isLastStep && <MdArrowForward className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
