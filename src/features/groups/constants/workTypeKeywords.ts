type WorkTypeName =
  | "기준윤리형"
  | "기준심미형"
  | "예술느낌형"
  | "예술융합형"
  | "이해관리형"
  | "이해연구형"
  | "소통도움형"
  | "소통조화형"
  | "도전확장형"
  | "도전목표형";

export type WorkTypeCode =
  | "SE"
  | "SA"
  | "AS"
  | "AF"
  | "UM"
  | "UR"
  | "CA"
  | "CH"
  | "EE"
  | "EG";

interface WorkTypeKeyword {
  type: WorkTypeName;
  code: WorkTypeCode;
  keywords: string[];
  description: string;
}

export const WORK_TYPE_KEYWORDS: WorkTypeKeyword[] = [
  {
    type: "기준윤리형",
    code: "SE",
    keywords: ["책임감", "원칙주의"],
    description: "규칙과 윤리를 중시하며, 책임감 있게 업무를 수행하는 유형",
  },
  {
    type: "기준심미형",
    code: "SA",
    keywords: ["감성적", "혁신적"],
    description: "심미적 가치를 추구하며, 감성적이고 창의적인 접근을 하는 유형",
  },
  {
    type: "예술느낌형",
    code: "AS",
    keywords: ["독창성", "표현력"],
    description: "독창적인 아이디어로 자신만의 스타일을 표현하는 유형",
  },
  {
    type: "예술융합형",
    code: "AF",
    keywords: ["다양성", "실험정신"],
    description: "다양한 요소를 융합하여 새로운 시도를 하는 실험적 유형",
  },
  {
    type: "이해관리형",
    code: "UM",
    keywords: ["체계적", "신중함"],
    description: "체계적으로 정보를 분석하고 신중하게 관리하는 유형",
  },
  {
    type: "이해연구형",
    code: "UR",
    keywords: ["논리중심", "객관성"],
    description: "논리적 사고로 깊이 있게 연구하고 분석하는 유형",
  },
  {
    type: "소통도움형",
    code: "CA",
    keywords: ["협력적", "감정인지"],
    description: "타인을 배려하고 협력하여 도움을 주는 공감 능력이 뛰어난 유형",
  },
  {
    type: "소통조화형",
    code: "CH",
    keywords: ["중재력", "안정감"],
    description: "갈등을 조율하고 팀의 조화를 이끌어내는 안정적인 유형",
  },
  {
    type: "도전확장형",
    code: "EE",
    keywords: ["모험적", "전략적"],
    description: "새로운 기회를 찾아 전략적으로 확장하는 모험적 유형",
  },
  {
    type: "도전목표형",
    code: "EG",
    keywords: ["추진력", "효율성"],
    description: "명확한 목표를 설정하고 효율적으로 추진하는 실행력 있는 유형",
  },
];
