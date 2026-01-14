import { MdGroups, MdLightbulb, MdCheckCircle } from "react-icons/md";
import type { WorkTypeData } from "@/features/groups/types/workType.types";

interface TeamSynergyTabProps {
  workTypeData: WorkTypeData;
}

export const TeamSynergyTab = ({ workTypeData }: TeamSynergyTabProps) => {
  return (
    <div
      role="tabpanel"
      id="team-panel"
      aria-labelledby="team-tab"
      className="space-y-4 sm:space-y-6"
    >
      {/* 팀워크 스타일 소개 */}
      <div className="bg-gradient-to-r from-primary-50 to-info-50 rounded-xl p-4 sm:p-6 border border-primary-100">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <MdGroups className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-xl font-bold text-primary mb-1 sm:mb-2">
              {workTypeData.name}의 팀워크 스타일
            </h3>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
              이 유형은 다음과 같은 방식으로 팀에 기여하며 협업합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 팀워크 스타일 3가지 */}
      <div className="space-y-3 sm:space-y-4">
        {workTypeData.teamworkStyle.map((style, index) => (
          <div
            key={index}
            className="p-4 sm:p-6 bg-white rounded-xl border-2 border-primary-100 hover:border-primary-200 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary font-bold text-base sm:text-lg">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-neutral-800 text-sm sm:text-lg leading-relaxed">
                  {style}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 관리 팁 */}
      <div>
        <h4 className="text-base sm:text-lg font-semibold text-neutral-800 mb-3 sm:mb-4 flex items-center gap-2">
          <MdLightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-info" />
          효과적인 협업을 위한 관리 팁
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
          {workTypeData.managementTips.map((tip, index) => (
            <div
              key={index}
              className="p-3 sm:p-4 bg-info-50 rounded-lg border border-info-100"
            >
              <div className="flex items-start gap-2">
                <MdCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-info flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-info-700 leading-relaxed">
                  {tip}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
