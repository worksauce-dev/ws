import { MdGroups, MdLightbulb, MdCheckCircle } from "react-icons/md";
import type { WorkTypeDefinition } from "@/features/groups/constants/workTypeDefinitions.types";

interface TeamSynergyTabProps {
  workTypeData: WorkTypeDefinition;
}

export const TeamSynergyTab = ({ workTypeData }: TeamSynergyTabProps) => {
  return (
    <div
      role="tabpanel"
      id="team-panel"
      aria-labelledby="team-tab"
      className="space-y-6"
    >
      {/* 팀워크 스타일 소개 */}
      <div className="bg-gradient-to-r from-primary-50 to-info-50 rounded-xl p-6 border border-primary-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <MdGroups className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary mb-2">
              {workTypeData.name}의 팀워크 스타일
            </h3>
            <p className="text-neutral-700 leading-relaxed">
              이 유형은 다음과 같은 방식으로 팀에 기여하며 협업합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 팀워크 스타일 3가지 */}
      <div className="space-y-4">
        {workTypeData.teamworkStyle.map((style, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-xl border-2 border-primary-100 hover:border-primary-200 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-neutral-800 text-lg leading-relaxed">
                  {style}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 관리 팁 */}
      <div>
        <h4 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
          <MdLightbulb className="w-5 h-5 text-info" />
          효과적인 협업을 위한 관리 팁
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {workTypeData.managementTips.map((tip, index) => (
            <div
              key={index}
              className="p-4 bg-info-50 rounded-lg border border-info-100"
            >
              <div className="flex items-start gap-2">
                <MdCheckCircle className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                <span className="text-info-700 leading-relaxed">{tip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
