/**
 * 그룹 그리드 컴포넌트
 */

import type { Group } from "@/features/groups/types/group.types";
import type { DropdownItem } from "@/shared/components/ui/Dropdown";
import { GroupCard } from "./GroupCard";

interface GroupsGridProps {
  groups: Group[];
  onGroupClick: (groupId: string) => void;
  onMenuAction: (groupId: string, item: DropdownItem) => void;
}

export const GroupsGrid = ({
  groups,
  onGroupClick,
  onMenuAction,
}: GroupsGridProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
      {groups.map(group => (
        <GroupCard
          key={group.id}
          group={group}
          onClick={onGroupClick}
          onMenuAction={onMenuAction}
        />
      ))}
    </div>
  );
};
