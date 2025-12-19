import { SETTINGS_SECTIONS } from "../constants/settingsSections";
import type { SettingsTab } from "../types/settings.types";

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export const SettingsSidebar = ({
  activeTab,
  onTabChange,
}: SettingsSidebarProps) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4">
      <nav className="space-y-1">
        {SETTINGS_SECTIONS.map(section => (
          <button
            key={section.id}
            onClick={() => onTabChange(section.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              activeTab === section.id
                ? "bg-primary-50 text-primary"
                : "text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            {section.icon}
            <span className="text-sm font-medium">{section.title}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
