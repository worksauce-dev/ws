import { forwardRef } from "react";
import { clsx } from "clsx";
import type { PasswordStrengthIndicatorProps } from "@/features/auth/types/password.types";

const PasswordStrengthIndicator = forwardRef<
  HTMLDivElement,
  PasswordStrengthIndicatorProps
>(
  (
    { password, strength, className, showRequirements = true, ...props },
    ref
  ) => {
    // 강도별 색상 및 텍스트 설정
    const getStrengthConfig = (strengthLevel: string) => {
      switch (strengthLevel) {
        case "empty":
          return {
            color: "bg-neutral-200",
            text: "",
            textColor: "text-neutral-500",
            description: "비밀번호를 입력해주세요",
          };
        case "weak":
          return {
            color: "bg-error",
            text: "약함",
            textColor: "text-error",
            description: "더 강한 비밀번호를 사용해주세요",
          };
        case "medium":
          return {
            color: "bg-warning",
            text: "보통",
            textColor: "text-warning",
            description: "좋습니다! 더 강하게 만들 수 있어요",
          };
        case "strong":
          return {
            color: "bg-success",
            text: "강함",
            textColor: "text-success",
            description: "안전한 비밀번호네요!",
          };
        default:
          return {
            color: "bg-neutral-200",
            text: "",
            textColor: "text-neutral-500",
            description: "비밀번호를 입력해주세요",
          };
      }
    };

    const isEmpty = !password;

    const config = getStrengthConfig(isEmpty ? "empty" : strength.strength);
    const progressPercentage = isEmpty ? 0 : (strength.score / 5) * 100;

    return (
      <div ref={ref} className={clsx("space-y-3", className)} {...props}>
        {/* 진행바 및 강도 텍스트 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-700">
              비밀번호 강도
            </span>
            {config.text && (
              <span className={clsx("text-sm font-medium", config.textColor)}>
                {config.text}
              </span>
            )}
          </div>

          {/* 진행바 */}
          <div className="relative w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className={clsx(
                "h-full transition-all duration-300 ease-out rounded-full",
                config.color
              )}
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`비밀번호 강도: ${config.text}`}
            />
          </div>

          {/* 강도 설명 */}
          {config.description && (
            <p className={clsx("text-xs", config.textColor)}>
              {config.description}
            </p>
          )}
        </div>

        {/* 요구사항 체크리스트 */}
        {showRequirements && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-neutral-700">
              비밀번호 요구사항
            </h4>
            <div className="grid grid-cols-1 gap-1.5">
              <RequirementItem
                met={strength.checks.length}
                text="최소 8자 이상"
              />
              <RequirementItem
                met={strength.checks.lowercase}
                text="영문 소문자 포함"
              />
              <RequirementItem
                met={strength.checks.uppercase}
                text="영문 대문자 포함"
              />
              <RequirementItem met={strength.checks.number} text="숫자 포함" />
              <RequirementItem
                met={strength.checks.special}
                text="특수문자 포함"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

PasswordStrengthIndicator.displayName = "PasswordStrengthIndicator";

export { PasswordStrengthIndicator };

// 내부 컴포넌트: 개별 요구사항 아이템
interface RequirementItemProps {
  met: boolean;
  text: string;
}

const RequirementItem = ({ met, text }: RequirementItemProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div
        className={clsx(
          "w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-200",
          met
            ? "bg-success text-white"
            : "bg-neutral-100 border border-neutral-300"
        )}
        aria-hidden="true"
      >
        {met ? (
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
        )}
      </div>
      <span
        className={clsx(
          "text-sm transition-colors duration-200",
          met ? "text-success font-medium" : "text-neutral-500"
        )}
      >
        {text}
      </span>
    </div>
  );
};
