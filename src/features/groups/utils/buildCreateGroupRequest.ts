/**
 * CreateGroupRequest 객체 생성 유틸리티
 */

import type { CreateGroupRequest, GroupFormData } from "../types/group.types";
import type { Applicant } from "../types/applicant.types";

interface BuildRequestParams {
  userId: string;
  formData: GroupFormData;
  applicants: Applicant[];
}

/**
 * 폼 데이터와 지원자 목록으로 CreateGroupRequest 객체 생성
 */
export const buildCreateGroupRequest = ({
  userId,
  formData,
  applicants,
}: BuildRequestParams): CreateGroupRequest => {
  return {
    user_id: userId,
    name: formData.name,
    description: formData.description,
    position: formData.position,
    experience_level: formData.experienceLevel,
    preferred_work_types: formData.preferredWorkTypes,
    deadline: formData.deadline,
    auto_reminder: formData.autoReminder === "yes",
    status: "active",
    applicants: applicants.map(app => ({
      name: app.name,
      email: app.email,
    })),
  };
};
