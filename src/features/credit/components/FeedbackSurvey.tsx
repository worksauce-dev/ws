/**
 * 피드백 설문조사 컴포넌트
 * 설문 완료 시 10크레딧 보상
 */

import { useState } from "react";
import { MdStar, MdStarBorder, MdCardGiftcard, MdCheckCircle } from "react-icons/md";
import { useToast } from "@/shared/components/ui/useToast";
import type {
  FeedbackSurveyData,
  UsageContext,
  UsefulFeature,
  ImprovementArea,
} from "../types/credit.types";

interface FeedbackSurveyProps {
  onSubmit: (data: FeedbackSurveyData) => Promise<void>;
  hasCompleted: boolean;
  totalUsed: number; // 총 사용한 크레딧
}

// 옵션 라벨 정의
const USAGE_CONTEXT_OPTIONS: { value: UsageContext; label: string }[] = [
  { value: "new_hire", label: "신규 채용 (신입)" },
  { value: "intern", label: "인턴/수습 채용" },
  { value: "experienced", label: "경력직 채용" },
  { value: "internal_transfer", label: "내부 이동/배치" },
  { value: "team_building", label: "팀 빌딩/조직 구성" },
  { value: "other", label: "기타" },
];

const USEFUL_FEATURE_OPTIONS: { value: UsefulFeature; label: string }[] = [
  { value: "ai_analysis", label: "AI 직무 매칭 분석" },
  { value: "work_type_result", label: "실행유형 테스트 결과" },
  { value: "interview_guide", label: "면접 가이드" },
  { value: "group_management", label: "그룹 관리 기능" },
  { value: "applicant_comparison", label: "지원자 비교 기능" },
  { value: "other", label: "기타" },
];

const IMPROVEMENT_AREA_OPTIONS: { value: ImprovementArea; label: string }[] = [
  { value: "ai_accuracy", label: "AI 분석 정확도" },
  { value: "ui_ux", label: "사용 편의성 (UI/UX)" },
  { value: "speed", label: "로딩/처리 속도" },
  { value: "features", label: "기능 부족" },
  { value: "price", label: "가격/크레딧 정책" },
  { value: "other", label: "기타" },
];

const NPS_LABELS = [
  "전혀 추천하지 않음",
  "",
  "",
  "",
  "",
  "보통",
  "",
  "",
  "",
  "",
  "적극 추천",
];

const REQUIRED_CREDITS = 3;

export const FeedbackSurvey = ({
  onSubmit,
  hasCompleted,
  totalUsed,
}: FeedbackSurveyProps) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const canParticipate = totalUsed >= REQUIRED_CREDITS;

  // 폼 상태
  const [formData, setFormData] = useState<Partial<FeedbackSurveyData>>({
    aiSatisfaction: 0,
    usageContexts: [],
    usefulFeatures: [],
    improvementAreas: [],
    featureRequest: "",
    npsScore: -1,
    additionalFeedback: "",
  });

  // 이미 완료한 경우
  if (hasCompleted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <MdCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          설문 참여 완료
        </h3>
        <p className="text-green-600 text-sm">
          소중한 피드백 감사합니다. 보상 크레딧이 지급되었습니다.
        </p>
      </div>
    );
  }

  // 접힌 상태 (배너)
  if (!isExpanded) {
    return (
      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <MdCardGiftcard className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">
                피드백 설문 참여하고 10크레딧 받기
              </h3>
              <p className="text-sm text-neutral-500 mt-0.5">
                서비스 개선을 위한 소중한 의견을 들려주세요
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            {canParticipate ? (
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="px-5 py-2.5 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
              >
                <MdCardGiftcard className="w-4 h-4" />
                참여하기
              </button>
            ) : (
              <>
                <button
                  type="button"
                  disabled
                  className="px-5 py-2.5 bg-neutral-200 text-neutral-400 text-sm font-medium rounded-lg cursor-not-allowed flex items-center gap-2"
                >
                  <MdCardGiftcard className="w-4 h-4" />
                  참여하기
                </button>
                <p className="text-xs text-neutral-500">
                  {REQUIRED_CREDITS}크레딧 사용 후 참여 가능 (현재 {totalUsed}크레딧 사용)
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 별점 컴포넌트
  const StarRating = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-1 transition-transform hover:scale-110"
        >
          {star <= value ? (
            <MdStar className="w-8 h-8 text-yellow-400" />
          ) : (
            <MdStarBorder className="w-8 h-8 text-neutral-300" />
          )}
        </button>
      ))}
    </div>
  );

  // 체크박스 그룹 컴포넌트
  const CheckboxGroup = <T extends string>({
    options,
    selected,
    onChange,
  }: {
    options: { value: T; label: string }[];
    selected: T[];
    onChange: (values: T[]) => void;
  }) => (
    <div className="grid grid-cols-2 gap-2">
      {options.map(option => (
        <label
          key={option.value}
          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
            selected.includes(option.value)
              ? "border-primary-500 bg-primary-50"
              : "border-neutral-200 hover:border-neutral-300"
          }`}
        >
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={e => {
              if (e.target.checked) {
                onChange([...selected, option.value]);
              } else {
                onChange(selected.filter(v => v !== option.value));
              }
            }}
            className="sr-only"
          />
          <div
            className={`w-4 h-4 rounded border flex items-center justify-center ${
              selected.includes(option.value)
                ? "bg-primary-500 border-primary-500"
                : "border-neutral-300"
            }`}
          >
            {selected.includes(option.value) && (
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span className="text-sm text-neutral-700">{option.label}</span>
        </label>
      ))}
    </div>
  );

  // NPS 스케일 컴포넌트
  const NPSScale = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div>
      <div className="flex justify-between mb-2">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
              value === score
                ? score <= 6
                  ? "bg-red-500 text-white"
                  : score <= 8
                    ? "bg-yellow-500 text-white"
                    : "bg-green-500 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {score}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-neutral-500">
        <span>{NPS_LABELS[0]}</span>
        <span>{NPS_LABELS[5]}</span>
        <span>{NPS_LABELS[10]}</span>
      </div>
    </div>
  );

  // 유효성 검사
  const validateForm = (): string | null => {
    if (!formData.aiSatisfaction || formData.aiSatisfaction === 0) {
      return "AI 분석 만족도를 선택해주세요.";
    }
    if (!formData.usageContexts?.length) {
      return "사용 상황을 최소 1개 선택해주세요.";
    }
    if (!formData.usefulFeatures?.length) {
      return "유용했던 기능을 최소 1개 선택해주세요.";
    }
    if (!formData.featureRequest || formData.featureRequest.length < 20) {
      return "추가 기능 요청을 20자 이상 작성해주세요.";
    }
    if (formData.npsScore === undefined || formData.npsScore < 0) {
      return "추천 의향 점수를 선택해주세요.";
    }
    return null;
  };

  // 제출 핸들러
  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      showToast("warning", "입력 확인", error);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData as FeedbackSurveyData);
      showToast(
        "success",
        "설문 완료!",
        "소중한 피드백 감사합니다. 10크레딧이 지급되었습니다."
      );
    } catch {
      showToast("error", "제출 실패", "잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 설문 스텝 정의
  const steps = [
    {
      title: "AI 분석 만족도",
      description: "워크소스의 AI 직무 매칭 분석 결과에 얼마나 만족하시나요?",
      content: (
        <div className="flex flex-col items-center py-4">
          <StarRating
            value={formData.aiSatisfaction || 0}
            onChange={v => setFormData(prev => ({ ...prev, aiSatisfaction: v }))}
          />
          <p className="text-sm text-neutral-500 mt-2">
            {formData.aiSatisfaction === 1 && "매우 불만족"}
            {formData.aiSatisfaction === 2 && "불만족"}
            {formData.aiSatisfaction === 3 && "보통"}
            {formData.aiSatisfaction === 4 && "만족"}
            {formData.aiSatisfaction === 5 && "매우 만족"}
          </p>
        </div>
      ),
    },
    {
      title: "사용 상황",
      description: "워크소스를 주로 어떤 상황에서 사용하시나요? (복수 선택 가능)",
      content: (
        <div className="space-y-3">
          <CheckboxGroup
            options={USAGE_CONTEXT_OPTIONS}
            selected={formData.usageContexts || []}
            onChange={values =>
              setFormData(prev => ({ ...prev, usageContexts: values }))
            }
          />
          {formData.usageContexts?.includes("other") && (
            <input
              type="text"
              placeholder="기타 사용 상황을 입력해주세요"
              value={formData.usageContextOther || ""}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  usageContextOther: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          )}
        </div>
      ),
    },
    {
      title: "유용했던 기능",
      description: "가장 유용하게 사용하신 기능은 무엇인가요? (복수 선택 가능)",
      content: (
        <div className="space-y-3">
          <CheckboxGroup
            options={USEFUL_FEATURE_OPTIONS}
            selected={formData.usefulFeatures || []}
            onChange={values =>
              setFormData(prev => ({ ...prev, usefulFeatures: values }))
            }
          />
          {formData.usefulFeatures?.includes("other") && (
            <input
              type="text"
              placeholder="기타 유용했던 기능을 입력해주세요"
              value={formData.usefulFeatureOther || ""}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  usefulFeatureOther: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          )}
        </div>
      ),
    },
    {
      title: "개선 필요 부분",
      description: "개선이 필요하다고 느끼신 부분이 있으신가요? (복수 선택 가능)",
      content: (
        <div className="space-y-3">
          <CheckboxGroup
            options={IMPROVEMENT_AREA_OPTIONS}
            selected={formData.improvementAreas || []}
            onChange={values =>
              setFormData(prev => ({ ...prev, improvementAreas: values }))
            }
          />
          {formData.improvementAreas?.includes("other") && (
            <input
              type="text"
              placeholder="기타 개선 필요 부분을 입력해주세요"
              value={formData.improvementAreaOther || ""}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  improvementAreaOther: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          )}
        </div>
      ),
    },
    {
      title: "기능 요청",
      description:
        "워크소스에 추가되었으면 하는 기능이 있다면 알려주세요. (필수, 최소 20자)",
      content: (
        <div>
          <textarea
            placeholder="예: 지원자들의 테스트 결과를 한눈에 비교할 수 있는 대시보드가 있으면 좋겠습니다..."
            value={formData.featureRequest || ""}
            onChange={e =>
              setFormData(prev => ({ ...prev, featureRequest: e.target.value }))
            }
            rows={4}
            className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
          />
          <p
            className={`text-xs mt-1 ${
              (formData.featureRequest?.length || 0) >= 20
                ? "text-green-600"
                : "text-neutral-400"
            }`}
          >
            {formData.featureRequest?.length || 0}/20자 (최소)
          </p>
        </div>
      ),
    },
    {
      title: "추천 의향",
      description:
        "워크소스를 동료나 지인에게 추천할 의향이 얼마나 되시나요? (NPS)",
      content: (
        <NPSScale
          value={formData.npsScore ?? -1}
          onChange={v => setFormData(prev => ({ ...prev, npsScore: v }))}
        />
      ),
    },
    {
      title: "추가 의견",
      description: "그 외 전하고 싶은 의견이 있으시면 자유롭게 작성해주세요. (선택)",
      content: (
        <textarea
          placeholder="서비스 이용 경험, 불편했던 점, 칭찬하고 싶은 점 등 자유롭게 작성해주세요..."
          value={formData.additionalFeedback || ""}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              additionalFeedback: e.target.value,
            }))
          }
          rows={4}
          className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
        />
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
      {/* 헤더 */}
      <div className="px-6 py-4 border-b border-neutral-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <MdCardGiftcard className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">
                피드백 설문 참여하고 10크레딧 받기
              </h3>
              <p className="text-sm text-neutral-500">
                소중한 의견을 들려주세요
              </p>
            </div>
          </div>
          <div className="text-sm text-primary-600 font-medium">
            {currentStep + 1} / {steps.length}
          </div>
        </div>

        {/* 프로그레스 바 */}
        <div className="mt-4 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="p-6">
        <h4 className="text-lg font-medium text-neutral-900 mb-1">
          {currentStepData.title}
        </h4>
        <p className="text-sm text-neutral-600 mb-4">
          {currentStepData.description}
        </p>

        {currentStepData.content}

        {/* 네비게이션 */}
        <div className="flex justify-between mt-6 pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>

          {isLastStep ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  제출 중...
                </>
              ) : (
                <>
                  <MdCardGiftcard className="w-4 h-4" />
                  제출하고 10크레딧 받기
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))
              }
              className="px-6 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
