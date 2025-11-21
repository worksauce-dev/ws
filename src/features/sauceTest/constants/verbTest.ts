import type {
  WorkTypeCode,
  WorkTypeInfo,
  Verb,
  VerbTestQuestion,
  VerbCategory,
} from "../types/verbTest.types";
import type { WorkGroup } from "../types/verbTest.types";
import {
  MdPlayArrow,
  MdTrendingUp,
  MdBuild,
  MdChat,
  MdStar,
} from "react-icons/md";

export const WORK_TYPE_INFO: Record<WorkTypeCode, WorkTypeInfo> = {
  SE: {
    code: "SE",
    name: "기준윤리",
    group: "S",
    pair: "SA",
    description: "체계와 원칙을 중시하는 유형",
  },
  SA: {
    code: "SA",
    name: "기준심미",
    group: "S",
    pair: "SE",
    description: "질서와 아름다움을 추구하는 유형",
  },
  AS: {
    code: "AS",
    name: "예술느낌",
    group: "A",
    pair: "AF",
    description: "감성과 직관을 중시하는 유형",
  },
  AF: {
    code: "AF",
    name: "예술융합",
    group: "A",
    pair: "AS",
    description: "창의적 통합을 추구하는 유형",
  },
  UM: {
    code: "UM",
    name: "이해관리",
    group: "U",
    pair: "UR",
    description: "체계적 관리를 중시하는 유형",
  },
  UR: {
    code: "UR",
    name: "이해연구",
    group: "U",
    pair: "UM",
    description: "탐구와 분석을 추구하는 유형",
  },
  CA: {
    code: "CA",
    name: "소통도움",
    group: "C",
    pair: "CH",
    description: "타인 지원에 집중하는 유형",
  },
  CH: {
    code: "CH",
    name: "소통조화",
    group: "C",
    pair: "CA",
    description: "관계 조율을 중시하는 유형",
  },
  EE: {
    code: "EE",
    name: "도전확장",
    group: "E",
    pair: "EG",
    description: "성장과 확대를 추구하는 유형",
  },
  EG: {
    code: "EG",
    name: "도전목표",
    group: "E",
    pair: "EE",
    description: "목표 달성에 집중하는 유형",
  },
} as const;

/** 모든 WorkType 코드 배열 */
export const ALL_WORK_TYPES = Object.keys(WORK_TYPE_INFO) as WorkTypeCode[];

/** 대분류별 그룹 매핑 */
export const WORK_TYPE_GROUPS: Record<WorkGroup, WorkTypeCode[]> = {
  S: ["SE", "SA"],
  A: ["AS", "AF"],
  U: ["UM", "UR"],
  C: ["CA", "CH"],
  E: ["EE", "EG"],
} as const;

/** Phase별 설정 (아이콘, 제목, 설명 등 통합) */
export const PHASE_CONFIG: Record<
  VerbCategory,
  {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle: string;
    context: string;
    instruction: string;
    step: number;
  }
> = {
  start: {
    icon: MdPlayArrow,
    title: "시작",
    subtitle: "Start",
    context: "소스테스트 (SAUCE) 첫번째는 '시작 동사'입니다.",
    instruction:
      "지원자님은 일 또는 아이디어를 진행할 때 어떤 '동사'를 기반으로 시작하나요? 포괄적이지만 자신의 일의 성향을 나타내는 동사를 골라보세요.",
    step: 1,
  },
  advance: {
    icon: MdTrendingUp,
    title: "발전",
    subtitle: "Advance",
    context: "두 번째는 '발전 동사'를 고를 차례입니다.",
    instruction:
      "일 또는 아이디어를 시작하고 구체화,발전시킬 때 어떤 '동사'를 중심으로 하시나요? 정답은 없습니다. 자신에게 익숙한 동사를 골라보세요.",
    step: 2,
  },
  utility: {
    icon: MdBuild,
    title: "활용",
    subtitle: "Utility",
    context: "세 번째는 '기술 동사'입니다.",
    instruction:
      "앞서 시작하고 발전시킨 일을 현실화 시킬 때 어떤 '동사'를 이용하시나요? 가장 본인이 자신있어 하는 동사를 골라보세요.",
    step: 3,
  },
  communicate: {
    icon: MdChat,
    title: "소통",
    subtitle: "Communicate",
    context: "네 번째 '소통 동사'입니다.",
    instruction:
      "'시작-발전-기술 동사로 진행 된 일이나 아이디어를 어떤 방식으로 전달, 소통하고 싶으신가요? 과거의 모습을 생각해보시고 골라보세요.",
    step: 4,
  },
  expert: {
    icon: MdStar,
    title: "전문가",
    subtitle: "Expert",
    context: "마지막입니다. '결과 동사'를 고르시면 됩니다.",
    instruction:
      "모든 과정을 지나 '마지막'이 어떤 모습일 때 가장 만족감이 높으실까요?",
    step: 5,
  },
} as const;

/** SAUCE 단계 순서 */
export const PHASE_ORDER: VerbCategory[] = [
  "start",
  "advance",
  "utility",
  "communicate",
  "expert",
] as const;

const VERB_POOL: Record<WorkTypeCode, Verb[]> = {
  SE: [
    { id: "SE-1", text: "인식하다", workType: "SE", category: "start" },
    { id: "SE-2", text: "판정하다", workType: "SE", category: "advance" },
    { id: "SE-3", text: "검토하다", workType: "SE", category: "advance" },
    { id: "SE-4", text: "조직하다", workType: "SE", category: "utility" },
    { id: "SE-5", text: "숙달하다", workType: "SE", category: "utility" },
    { id: "SE-6", text: "안내하다", workType: "SE", category: "communicate" },
    { id: "SE-7", text: "지도하다", workType: "SE", category: "communicate" },
    { id: "SE-8", text: "개선하다", workType: "SE", category: "expert" },
    { id: "SE-9", text: "완수하다", workType: "SE", category: "expert" },
  ],
  SA: [
    { id: "SA-1", text: "기억하다", workType: "SA", category: "start" },
    { id: "SA-2", text: "분류하다", workType: "SA", category: "advance" },
    { id: "SA-3", text: "준비하다", workType: "SA", category: "advance" },
    { id: "SA-4", text: "제작하다", workType: "SA", category: "utility" },
    { id: "SA-5", text: "구현하다", workType: "SA", category: "utility" },
    {
      id: "SA-6",
      text: "의사소통하다",
      workType: "SA",
      category: "communicate",
    },
    { id: "SA-7", text: "공유하다", workType: "SA", category: "communicate" },
    { id: "SA-8", text: "감동시키다", workType: "SA", category: "expert" },
    { id: "SA-9", text: "유지하다", workType: "SA", category: "expert" },
  ],
  AS: [
    { id: "AS-1", text: "느끼다  ", workType: "AS", category: "start" },
    { id: "AS-2", text: "발견하다", workType: "AS", category: "advance" },
    { id: "AS-3", text: "사색하다", workType: "AS", category: "advance" },
    { id: "AS-4", text: "창조하다", workType: "AS", category: "utility" },
    { id: "AS-5", text: "만들다", workType: "AS", category: "utility" },
    { id: "AS-6", text: "공연하다", workType: "AS", category: "communicate" },
    { id: "AS-7", text: "표현하다", workType: "AS", category: "communicate" },
    { id: "AS-8", text: "꿈꾸다", workType: "AS", category: "expert" },
    { id: "AS-9", text: "살다", workType: "AS", category: "expert" },
  ],
  AF: [
    { id: "AF-1", text: "주목하다", workType: "AF", category: "start" },
    { id: "AF-2", text: "상상하다", workType: "AF", category: "advance" },
    { id: "AF-3", text: "구상하다", workType: "AF", category: "advance" },
    { id: "AF-4", text: "융합하다", workType: "AF", category: "utility" },
    { id: "AF-5", text: "연출하다", workType: "AF", category: "utility" },
    { id: "AF-6", text: "전시하다", workType: "AF", category: "communicate" },
    { id: "AF-7", text: "보여주다", workType: "AF", category: "communicate" },
    { id: "AF-8", text: "흥분시키다", workType: "AF", category: "expert" },
    { id: "AF-9", text: "즐겁게하다", workType: "AF", category: "expert" },
  ],
  UM: [
    { id: "UM-1", text: "알다", workType: "UM", category: "start" },
    { id: "UM-2", text: "확인하다", workType: "UM", category: "advance" },
    { id: "UM-3", text: "설계하다", workType: "UM", category: "advance" },
    { id: "UM-4", text: "구축하다", workType: "UM", category: "utility" },
    { id: "UM-5", text: "수정하다", workType: "UM", category: "utility" },
    { id: "UM-6", text: "알리다", workType: "UM", category: "communicate" },
    { id: "UM-7", text: "전달하다", workType: "UM", category: "communicate" },
    { id: "UM-8", text: "해결하다", workType: "UM", category: "expert" },
    { id: "UM-9", text: "안정화시키다", workType: "UM", category: "expert" },
  ],
  UR: [
    { id: "UR-1", text: "탐색하다", workType: "UR", category: "start" },
    { id: "UR-2", text: "연구하다", workType: "UR", category: "advance" },
    { id: "UR-3", text: "검사하다", workType: "UR", category: "advance" },
    { id: "UR-4", text: "기록하다", workType: "UR", category: "utility" },
    { id: "UR-5", text: "개발하다", workType: "UR", category: "utility" },
    { id: "UR-6", text: "발표하다", workType: "UR", category: "communicate" },
    { id: "UR-7", text: "설명하다", workType: "UR", category: "communicate" },
    { id: "UR-8", text: "향상시키다", workType: "UR", category: "expert" },
    { id: "UR-9", text: "정립하다", workType: "UR", category: "expert" },
  ],
  CA: [
    { id: "CA-1", text: "대화하다", workType: "CA", category: "start" },
    { id: "CA-2", text: "공감하다", workType: "CA", category: "advance" },
    { id: "CA-3", text: "파악하다", workType: "CA", category: "advance" },
    { id: "CA-4", text: "구성하다", workType: "CA", category: "utility" },
    { id: "CA-5", text: "찾다", workType: "CA", category: "utility" },
    { id: "CA-6", text: "돕다", workType: "CA", category: "communicate" },
    { id: "CA-7", text: "보호하다", workType: "CA", category: "communicate" },
    { id: "CA-8", text: "영향을 미치다", workType: "CA", category: "expert" },
    { id: "CA-9", text: "회복시키다", workType: "CA", category: "expert" },
  ],
  CH: [
    { id: "CH-1", text: "참여하다", workType: "CH", category: "start" },
    { id: "CH-2", text: "분석하다", workType: "CH", category: "advance" },
    { id: "CH-3", text: "이해하다", workType: "CH", category: "advance" },
    { id: "CH-4", text: "중재하다", workType: "CH", category: "utility" },
    { id: "CH-5", text: "통합하다", workType: "CH", category: "utility" },
    { id: "CH-6", text: "협력하다", workType: "CH", category: "communicate" },
    { id: "CH-7", text: "상담하다", workType: "CH", category: "communicate" },
    { id: "CH-8", text: "웃게하다", workType: "CH", category: "expert" },
    { id: "CH-9", text: "조화롭게하다", workType: "CH", category: "expert" },
  ],
  EE: [
    { id: "EE-1", text: "탐험하다", workType: "EE", category: "start" },
    { id: "EE-2", text: "깨닫다", workType: "EE", category: "advance" },
    { id: "EE-3", text: "기획하다", workType: "EE", category: "advance" },
    { id: "EE-4", text: "경영하다", workType: "EE", category: "utility" },
    { id: "EE-5", text: "확장하다", workType: "EE", category: "utility" },
    { id: "EE-6", text: "가르치다", workType: "EE", category: "communicate" },
    { id: "EE-7", text: "멘토링하다", workType: "EE", category: "communicate" },
    { id: "EE-8", text: "활발하게하다", workType: "EE", category: "expert" },
    { id: "EE-9", text: "성장시키다", workType: "EE", category: "expert" },
  ],
  EG: [
    { id: "EG-1", text: "도전하다", workType: "EG", category: "start" },
    { id: "EG-2", text: "생각하다", workType: "EG", category: "advance" },
    { id: "EG-3", text: "계획하다", workType: "EG", category: "advance" },
    { id: "EG-4", text: "경쟁하다", workType: "EG", category: "utility" },
    { id: "EG-5", text: "향상하다", workType: "EG", category: "utility" },
    { id: "EG-6", text: "홍보하다", workType: "EG", category: "communicate" },
    { id: "EG-7", text: "컨설팅하다", workType: "EG", category: "communicate" },
    { id: "EG-8", text: "성취하다", workType: "EG", category: "expert" },
    { id: "EG-9", text: "빛내다", workType: "EG", category: "expert" },
  ],
};

// 동사 테스트 5문항
export const VERB_TEST_QUESTIONS: VerbTestQuestion[] = [
  {
    id: 1,
    phase: "start",
    context: "소스테스트 (SAUCE) 첫번째는 ‘시작 동사’입니다.",
    instruction:
      "지원자님은 일 또는 아이디어를 진행할 때 어떤 ‘동사’를 기반으로 시작하나요? 포괄적이지만 자신의 일의 성향을 나타내는 동사를 골라보세요.",
    selectCount: 2,
    verbs: [
      VERB_POOL.SE[0],
      VERB_POOL.SE[1],
      VERB_POOL.SA[0],
      VERB_POOL.SA[1],
      VERB_POOL.AS[0],
      VERB_POOL.AS[1],
      VERB_POOL.AF[0],
      VERB_POOL.AF[1],
      VERB_POOL.UM[0],
      VERB_POOL.UM[1],
      VERB_POOL.UR[0],
      VERB_POOL.UR[1],
      VERB_POOL.CA[0],
      VERB_POOL.CA[1],
      VERB_POOL.CH[0],
      VERB_POOL.CH[1],
      VERB_POOL.EE[0],
      VERB_POOL.EE[1],
      VERB_POOL.EG[0],
      VERB_POOL.EG[1],
    ],
  },
  {
    id: 2,
    phase: "advance",
    context: "두 번째는 ‘발전 동사’를 고를 차례입니다.",
    instruction:
      "일 또는 아이디어를 시작하고 구체화,발전시킬 때 어떤 ‘동사’를 중심으로 하시나요? 정답은 없습니다. 자신에게 익숙한 동사를 골라보세요. ",
    selectCount: 2,
    verbs: [
      VERB_POOL.SE[2],
      VERB_POOL.SE[3],
      VERB_POOL.SA[2],
      VERB_POOL.SA[3],
      VERB_POOL.AS[2],
      VERB_POOL.AS[3],
      VERB_POOL.AF[2],
      VERB_POOL.AF[3],
      VERB_POOL.UM[2],
      VERB_POOL.UM[3],
      VERB_POOL.UR[2],
      VERB_POOL.UR[3],
      VERB_POOL.CA[2],
      VERB_POOL.CA[3],
      VERB_POOL.CH[2],
      VERB_POOL.CH[3],
      VERB_POOL.EE[2],
      VERB_POOL.EE[3],
      VERB_POOL.EG[2],
      VERB_POOL.EG[3],
    ],
  },
  {
    id: 3,
    phase: "utility",
    context: "세 번째는 ‘기술 동사’입니다.",
    instruction:
      "앞서 시작하고 발전시킨 일을 현실화 시킬 때 어떤 ‘동사’를 이용하시나요? 가장 본인이 자신있어 하는 동사를 골라보세요.",
    selectCount: 2,
    verbs: [
      VERB_POOL.SE[4],
      VERB_POOL.SE[5],
      VERB_POOL.SA[4],
      VERB_POOL.SA[5],
      VERB_POOL.AS[4],
      VERB_POOL.AS[5],
      VERB_POOL.AF[4],
      VERB_POOL.AF[5],
      VERB_POOL.UM[4],
      VERB_POOL.UM[5],
      VERB_POOL.UR[4],
      VERB_POOL.UR[5],
      VERB_POOL.CA[4],
      VERB_POOL.CA[5],
      VERB_POOL.CH[4],
      VERB_POOL.CH[5],
      VERB_POOL.EE[4],
      VERB_POOL.EE[5],
      VERB_POOL.EG[4],
      VERB_POOL.EG[5],
    ],
  },
  {
    id: 4,
    phase: "communicate",
    context: "네 번째 ‘소통 동사’입니다.",
    instruction:
      "‘시작-발전-기술 동사로 진행 된 일이나 아이디어를 어떤 방식으로 전달, 소통하고 싶으신가요? 과거의 모습을 생각해보시고 골라보세요.",
    selectCount: 2,
    verbs: [
      VERB_POOL.SE[6],
      VERB_POOL.SE[7],
      VERB_POOL.SA[6],
      VERB_POOL.SA[7],
      VERB_POOL.AS[6],
      VERB_POOL.AS[7],
      VERB_POOL.AF[6],
      VERB_POOL.AF[7],
      VERB_POOL.UM[6],
      VERB_POOL.UM[7],
      VERB_POOL.UR[6],
      VERB_POOL.UR[7],
      VERB_POOL.CA[6],
      VERB_POOL.CA[7],
      VERB_POOL.CH[6],
      VERB_POOL.CH[7],
      VERB_POOL.EE[6],
      VERB_POOL.EE[7],
      VERB_POOL.EG[6],
      VERB_POOL.EG[7],
    ],
  },
  {
    id: 5,
    phase: "expert",
    context: "마지막입니다. ‘결과 동사’를 고르시면 됩니다.",
    instruction:
      "모든 과정을 지나 ‘마지막’이 어떤 모습일 때 가장 만족감이 높으실까요?",
    selectCount: 2,
    verbs: [
      VERB_POOL.SE[8],
      VERB_POOL.SE[9],
      VERB_POOL.SA[8],
      VERB_POOL.SA[9],
      VERB_POOL.AS[8],
      VERB_POOL.AS[9],
      VERB_POOL.AF[8],
      VERB_POOL.AF[9],
      VERB_POOL.UM[8],
      VERB_POOL.UM[9],
      VERB_POOL.UR[8],
      VERB_POOL.UR[9],
      VERB_POOL.CA[8],
      VERB_POOL.CA[9],
      VERB_POOL.CH[8],
      VERB_POOL.CH[9],
      VERB_POOL.EE[8],
      VERB_POOL.EE[9],
      VERB_POOL.EG[8],
      VERB_POOL.EG[9],
    ],
  },
];

export const ALL_VERBS = Object.values(VERB_POOL).flat();

// Export
export { VERB_POOL };
