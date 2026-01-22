import { useState, useCallback, useMemo } from "react";
import { MdEmail } from "react-icons/md";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import type { SignupStepProps } from "@/features/auth/types/auth.types";

export const NameStep = ({
  onNext,
  formData,
  setFormData,
}: SignupStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateName = useCallback((name: string): boolean => {
    if (!name.trim()) {
      setErrors(prev => ({ ...prev, name: "이름을 입력해주세요" }));
      return false;
    }
    if (name.trim().length < 2) {
      setErrors(prev => ({
        ...prev,
        name: "이름은 최소 2자 이상 입력해주세요",
      }));
      return false;
    }
    if (name.trim().length > 50) {
      setErrors(prev => ({ ...prev, name: "이름은 50자 이하로 입력해주세요" }));
      return false;
    }
    setErrors(prev => ({ ...prev, name: "" }));
    return true;
  }, []);

  const handleNext = useCallback(() => {
    if (validateName(formData.name)) {
      onNext();
    }
  }, [validateName, formData.name, onNext]);

  const handleNameChange = useCallback(
    (value: string) => {
      setFormData({ name: value });
      // 실시간 에러 제거
      if (errors.name && value.trim()) {
        setErrors(prev => ({ ...prev, name: "" }));
      }
    },
    [setFormData, errors.name]
  );

  return (
    <div className="space-y-6">
      {/* 동적 인사말 */}
      <div className="text-center">
        <h1 className="text-xl font-semibold text-neutral-900 mb-2 transition-all duration-500 ease-in-out">
          {useMemo(
            () =>
              formData.name.trim()
                ? `안녕하세요 ${formData.name.trim()}님! 👋`
                : "안녕하세요! 👋",
            [formData.name]
          )}
        </h1>
        <p className="text-neutral-600 text-sm">
          워크소스에서 사용할 이름을 입력해주세요
        </p>
      </div>
      {/* 이름 입력 필드 */}
      <div className="space-y-4">
        <Input
          id="name"
          type="text"
          placeholder="이름을 입력하세요"
          value={formData.name}
          onChange={e => handleNameChange(e.target.value)}
          error={errors.name}
          maxLength={50}
          className="text-center text-lg font-medium py-4 border-2 border-neutral-200 focus:border-primary-500 transition-colors duration-200"
          autoFocus
          onKeyDown={useCallback(
            (e: React.KeyboardEvent) => {
              if (e.key === "Enter" && !errors.name && formData.name.trim()) {
                handleNext();
              }
            },
            [handleNext, errors.name, formData.name]
          )}
        />
      </div>
      {/* 개선된 이름 노출 안내 - 정보 제공 톤으로 변경 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <div className="flex items-start space-x-3">
          <div>
            <div className="text-blue-700 text-sm leading-relaxed space-y-2">
              <p>
                검사 이메일을 보내실 때
                <span className="font-medium bg-blue-100 px-1.5 py-0.5 rounded text-blue-800 mx-1">
                  "{formData.name.trim() || "입력한 이름"}"
                </span>
                으로 표시됩니다.
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                <span className="text-xs text-blue-600">
                  비즈니스 회원으로 전환하면 회사명으로 변경돼요
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 미리보기 카드 추가 (선택사항) */}
      {
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-neutral-500 mb-2 flex items-center">
            <MdEmail className="w-3.5 h-3.5 mr-1.5" />
            이메일 미리보기
          </div>
          <div className="bg-neutral-50 rounded-lg p-3">
            <div className="text-sm">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-neutral-600">발신자:</span>
                <span className="font-medium text-neutral-900">WorkSauce</span>
              </div>
              <div className="text-neutral-500 text-xs">
                제목: {[formData.name.trim()]}님이 보내신 소스테스트를
                시작해주세요!
              </div>
            </div>
          </div>
        </div>
      }

      {/* 다음 단계 버튼 */}
      <Button
        onClick={handleNext}
        variant="primary"
        disabled={!formData.name.trim() || formData.name.trim().length < 2 || !!errors.name}
        className="w-full"
      >
        다음 단계로 →
      </Button>
    </div>
  );
};
