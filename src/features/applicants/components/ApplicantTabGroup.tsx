import type { IconType } from "react-icons";
import {
  MdPsychology,
  MdGroups,
  MdQuestionAnswer,
  MdWorkOutline,
} from "react-icons/md";

export type ApplicantTabId = "analysis" | "team" | "interview" | "jobmatch";

interface TabConfig {
  id: ApplicantTabId;
  label: string;
  shortLabel: string;
  icon: IconType;
}

const TAB_CONFIG: TabConfig[] = [
  { id: "analysis", label: "직무유형 분석", shortLabel: "분석", icon: MdPsychology },
  { id: "team", label: "팀워크 스타일", shortLabel: "팀워크", icon: MdGroups },
  { id: "interview", label: "면접 가이드", shortLabel: "면접", icon: MdQuestionAnswer },
  { id: "jobmatch", label: "직무 적합도", shortLabel: "직무", icon: MdWorkOutline },
];

interface ApplicantTabGroupProps {
  activeTab: ApplicantTabId;
  onTabChange: (tabId: ApplicantTabId) => void;
}

export const ApplicantTabGroup = ({
  activeTab,
  onTabChange,
}: ApplicantTabGroupProps) => {
  return (
    <div
      className="flex rounded-xl p-1.5 bg-neutral-100 w-fit"
      role="tablist"
    >
      {TAB_CONFIG.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${tab.id}-panel`}
            id={`${tab.id}-tab`}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 sm:px-5 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "bg-white text-primary shadow-md scale-[1.02]"
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800"
            }`}
          >
            <div className="flex flex-row sm:flex-col items-center gap-1.5 sm:gap-1">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">
                <span className="sm:hidden">{tab.shortLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
