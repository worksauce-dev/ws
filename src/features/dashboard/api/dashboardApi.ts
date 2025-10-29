import type { Group } from "@/features/groups/types/group.types";
import { supabase } from "@/shared/lib/supabase";

export const getGroupsWithApplicants = async (): Promise<Group[]> => {
  const { data, error } = await supabase
    .from("groups")
    .select(
      `
      *,
      applicants (
        id,
        name,
        email,
        test_status
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("그룹 목록 조회 실패:", error);
    throw new Error(error.message);
  }

  return data || [];
};
