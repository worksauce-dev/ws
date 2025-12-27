/**
 * 테스트 컨텍스트별 UI 텍스트 레이블
 */

import type { TestContext } from "../types/test";

interface TestLabels {
  subject: string; // "지원자님" vs "팀원님"
  subjectShort: string; // "지원자" vs "팀원"
  organizer: string; // "채용 담당자" vs "팀 관리자"
  purpose: string; // "채용 과정의 일환으로" vs "팀 분석을 위해"
  purposeDetail: string; // 상세 목적 설명
  contact: string; // 문의 대상
}

export const TEST_LABELS: Record<TestContext, TestLabels> = {
  recruitment: {
    subject: "지원자님",
    subjectShort: "지원자",
    organizer: "채용 담당자",
    purpose: "채용 과정의 일환으로",
    purposeDetail: "귀하의 직무 적합성을 평가하기 위해",
    contact: "채용 담당자에게 문의해주세요",
  },
  team: {
    subject: "팀원님",
    subjectShort: "팀원",
    organizer: "팀 관리자",
    purpose: "팀 분석을 위해",
    purposeDetail: "팀의 협업 역량을 파악하기 위해",
    contact: "팀 관리자에게 문의해주세요",
  },
};

/**
 * 컨텍스트에 맞는 레이블을 가져옵니다
 */
export function getTestLabels(context?: TestContext): TestLabels {
  return TEST_LABELS[context || "recruitment"];
}
