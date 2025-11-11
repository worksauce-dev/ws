// 응답 옵션 (모든 질문에 공통 적용)
export const ANSWER_OPTIONS = [
  { value: 1, label: "전혀 아니다" },
  { value: 2, label: "아니다" },
  { value: 3, label: "보통이다" },
  { value: 4, label: "그렇다" },
  { value: 5, label: "매우 그렇다" },
] as const;

export type AnswerValue = (typeof ANSWER_OPTIONS)[number]["value"];

// 업무 유형 정의 (10개 유형)
export const WORK_TYPES = {
  SE: { code: "SE", name: "기준윤리형", color: "#3B82F6" },
  SA: { code: "SA", name: "기준심미형", color: "#8B5CF6" },
  AS: { code: "AS", name: "예술느낌형", color: "#EC4899" },
  AF: { code: "AF", name: "예술융합형", color: "#F59E0B" },
  UM: { code: "UM", name: "이해관리형", color: "#10B981" },
  UR: { code: "UR", name: "이해연구형", color: "#2563EB" },
  CA: { code: "CA", name: "소통도움형", color: "#14B8A6" },
  CH: { code: "CH", name: "소통조화형", color: "#06B6D4" },
  EE: { code: "EE", name: "도전확장형", color: "#F97316" },
  EG: { code: "EG", name: "도전목표형", color: "#EF4444" },
} as const;

export type WorkTypeCode = keyof typeof WORK_TYPES;

// 질문 타입
export interface Question {
  id: number;
  text: string;
  workType: WorkTypeCode;
}

// 질문 데이터 (유형별로 객체로 관리)
export const QUESTIONS_BY_TYPE: Record<WorkTypeCode, Question[]> = {
  SE: [
    {
      id: 1,
      text: "나는 업무 시 윤리적 기준과 원칙을 가장 중요하게 여긴다.",
      workType: "SE",
    },
    {
      id: 2,
      text: "나는 업무 상황에서 옳고 그름을 구분하는 것이 자연스럽다.",
      workType: "SE",
    },
    {
      id: 3,
      text: "나는 체계적인 루틴과 절차를 따르며 업무한다.",
      workType: "SE",
    },
    {
      id: 4,
      text: "나는 부당한 상황에 강한 거부감을 느끼고 목소리를 낸다.",
      workType: "SE",
    },
    {
      id: 5,
      text: "나는 문제점을 끝까지 해결하려고 노력한다.",
      workType: "SE",
    },
    {
      id: 6,
      text: "나는 원칙을 고수하는 것이 나의 직업윤리라고 생각한다.",
      workType: "SE",
    },
    {
      id: 7,
      text: "나에게 책임감과 꾸준함은 가장 중요한 직업적 덕목이다.",
      workType: "SE",
    },
    {
      id: 8,
      text: "나는 공정성을 중시하며 평등한 환경을 만들려고 노력한다.",
      workType: "SE",
    },
    {
      id: 9,
      text: "나는 체계적이고 조직적인 방법으로 업무를 관리한다.",
      workType: "SE",
    },
    {
      id: 10,
      text: "나는 항상 최상의 결과를 도출하려고 노력한다.",
      workType: "SE",
    },
  ],
  SA: [
    {
      id: 1,
      text: "나는 업무 수행 시 나만의 독창적 미적 기준을 적용한다.",
      workType: "SA",
    },
    {
      id: 2,
      text: "나는 직무와 관련된 특별한 의미를 지닌 유/무형의 소중한 자료나 작품을 수집한다.",
      workType: "SA",
    },
    {
      id: 3,
      text: "나는 예술적 요소를 통해 업무 결과물의 품질과 가치를 한층 높이는 데 기여한다.",
      workType: "SA",
    },
    {
      id: 4,
      text: "나는 내 직무 분야의 단순한 실행을 넘어 기획, 평가 등 혁신적 영역으로 확장하고 싶어한다.",
      workType: "SA",
    },
    {
      id: 5,
      text: "나는 업무의 표면적인 완성도를 넘어, 그 이면에 있는 본질과 가치를 탐구하는 것에 큰 의미를 둔다.",
      workType: "SA",
    },
    {
      id: 6,
      text: "나는 직장 환경, 자연, 그리고 다양한 분야의 예술에서 업무에 대한 영감을 얻는다.",
      workType: "SA",
    },
    {
      id: 7,
      text: "나는 업무 수행 시 참신하고 독창적인 아이디어를 끊임없이 만들어내려고 노력한다.",
      workType: "SA",
    },
    {
      id: 8,
      text: "나는 긍정적 에너지와 영감을 동료들과 적극적으로 나누며 함께 성장하고자 한다.",
      workType: "SA",
    },
    {
      id: 9,
      text: "나는 예술적 감각을 통해 업무의 완성도를 높이는 것에 관심이 있다.",
      workType: "SA",
    },
    {
      id: 10,
      text: "나는 감성적 직관을 활용하여 업무 관련 문제를 독창적으로 해결하는 것을 즐긴다.",
      workType: "SA",
    },
  ],
  AS: [
    {
      id: 1,
      text: "나는 열린 마음으로 다양한 아이디어를 수용하고 창의적 행동을 실천한다.",
      workType: "AS",
    },
    {
      id: 2,
      text: "나는 직업적 정체성에 대한 근본적 질문이 내 업무 방식에 큰 영향을 미친다고 생각한다.",
      workType: "AS",
    },
    {
      id: 3,
      text: "나에게는 업무 중 혼자만의 시간을 갖고 조용히 생각할 수 있는 환경이 매우 중요하다.",
      workType: "AS",
    },
    {
      id: 4,
      text: "나는 내 아이디어와 감정을 구체적으로 표현하고 실현할 때 가장 큰 성취감을 느낀다.",
      workType: "AS",
    },
    {
      id: 5,
      text: "나는 독립적으로 업무를 수행하여 결과물을 만들어낼 때 깊은 만족감을 느낀다.",
      workType: "AS",
    },
    {
      id: 6,
      text: "나는 통찰력을 바탕으로 팀에 혁신적인 업무 방향성을 제시한다.",
      workType: "AS",
    },
    {
      id: 7,
      text: "나는 남들이 보지 못하는 각도에서 업무 문제를 바라보고 새로운 해결책을 제안한다.",
      workType: "AS",
    },
    {
      id: 8,
      text: "나는 프로젝트에 신선한 변화와 창의적 가치를 더하는 것을 중요하게 여긴다.",
      workType: "AS",
    },
    {
      id: 9,
      text: "나는 업무 중 내 감정을 진솔하게 표현하며 소통한다.",
      workType: "AS",
    },
    {
      id: 10,
      text: "나는 동료와 깊은 신뢰 관계를 구축하여 건강한 업무 문화를 조성하려 노력한다.",
      workType: "AS",
    },
  ],
  AF: [
    {
      id: 1,
      text: "나는 업무에서 새로운 것을 창조하고 혁신을 추구하는 것에 강한 열망을 가지고 있다.",
      workType: "AF",
    },
    {
      id: 2,
      text: "나는 다양한 분야의 사람들과 네트워크를 구축하며 새로운 아이디어와 영감을 얻는 것을 중요하게 생각한다.",
      workType: "AF",
    },
    {
      id: 3,
      text: "나는 업무 아이디어를 기획하고 구체화하여 실현시키는 과정에서 큰 만족감을 느낀다.",
      workType: "AF",
    },
    {
      id: 4,
      text: "나는 실험적이고 관행을 깨는 새로운 업무 방식을 시도하는 것에 두려움이 없고 오히려 흥분을 느낀다.",
      workType: "AF",
    },
    {
      id: 5,
      text: "나는 나만의 고유한 업무 기술과 독특한 전문성을 개발하고 확립하는 것이 중요하다고 생각한다.",
      workType: "AF",
    },
    {
      id: 6,
      text: "나는 사회적, 역사적 맥락을 고려하여 내 업무 결과물이 조직과 사회에서 어떻게 인식되는지 고민한다.",
      workType: "AF",
    },
    {
      id: 7,
      text: "나는 일시적 성과보다 지속 가능하고 장기적으로 발전할 수 있는 업무 구조를 만드는 것을 중요하게 생각한다.",
      workType: "AF",
    },
    {
      id: 8,
      text: "나는 업무 환경의 변화와 다양한 감정의 흐름을 자연스럽게 받아들이며 팀의 유연성 향상에 기여한다.",
      workType: "AF",
    },
    {
      id: 9,
      text: "나는 각 팀원의 고유한 특성을 소중히 여기고 동료의 강점을 발굴하여 활용한다.",
      workType: "AF",
    },
    {
      id: 10,
      text: "나는 업무에서 팀의 다양성과 창의력을 바탕으로 집단의 시너지를 만들어내는 것을 중요하게 생각한다.",
      workType: "AF",
    },
  ],
  UM: [
    {
      id: 1,
      text: "나는 업무 전 충분한 정보를 확보하여 안정적인 결정을 내린다.",
      workType: "UM",
    },
    {
      id: 2,
      text: "나는 문제 해결 시 논리적 접근을 통해 인과관계를 중요하게 고려한다.",
      workType: "UM",
    },
    {
      id: 3,
      text: "나는 나만의 계획과 매뉴얼로 체계적이고 효율적으로 업무한다.",
      workType: "UM",
    },
    {
      id: 4,
      text: "나는 업무 리스크를 미리 파악하고 관리하여 잠재적 문제에 대비한다.",
      workType: "UM",
    },
    {
      id: 5,
      text: "나는 새로운 방식보다 기존 방식을 관리하고 개선하는 데 더 능숙하다.",
      workType: "UM",
    },
    {
      id: 6,
      text: "나는 업무 문제 해결을 위해 끈기 있게 노력하며 포기하지 않는다.",
      workType: "UM",
    },
    {
      id: 7,
      text: "나는 업무 자기관리를 위해 다양한 영역에서 성장 방법을 찾는다.",
      workType: "UM",
    },
    {
      id: 8,
      text: "나는 순간적 대처보다 신중한 접근과 깊이 있는 분석을 선호한다.",
      workType: "UM",
    },
    {
      id: 9,
      text: "나의 가장 큰 강점은 성실함과 안정감이며, 조직에 충실하고 신뢰받는 것을 중요하게 생각한다.",
      workType: "UM",
    },
    {
      id: 10,
      text: "나는 체계적이고 조직적인 방법으로 업무를 관리하여 최상의 결과를 도출한다.",
      workType: "UM",
    },
  ],
  UR: [
    {
      id: 1,
      text: "나는 새로운 지식과 정보를 습득하며 지속적인 학습과 성장이 요구되는 업무에서 만족감을 느낀다.",
      workType: "UR",
    },
    {
      id: 2,
      text: "나는 세부사항에 주의를 기울여 최고 품질의 결과물을 만드는 일의 방식을 추구한다.",
      workType: "UR",
    },
    {
      id: 3,
      text: "나는 감정 표현이 적고 객관성을 유지해야 하는 업무 환경에서 편안함을 느낀다.",
      workType: "UR",
    },
    {
      id: 4,
      text: "나는 독립적이고 자율적인 업무 진행 방식을 선호하며, 타인에 대한 의존도가 낮은 업무를 선호한다.",
      workType: "UR",
    },
    {
      id: 5,
      text: "나는 스스로 문제를 해결하고 결정을 내리는 업무 방식을 선호한다.",
      workType: "UR",
    },
    {
      id: 6,
      text: "나는 분석적이고 논리적인 사고가 요구되는 문제 해결 중심의 직무를 선호한다.",
      workType: "UR",
    },
    {
      id: 7,
      text: "나는 정보 수집과 정리, 체계적인 자료 분류가 중요한 의사결정 과정을 포함하는 직무를 선호한다.",
      workType: "UR",
    },
    {
      id: 8,
      text: "나는 깊이 있는 의사소통과 내면적 탐구가 요구되는 직무에 적합하다.",
      workType: "UR",
    },
    {
      id: 9,
      text: "나는 복잡한 아이디어나 개념을 다루며 다양한 주제에 대해 깊이 있는 연구가 필요한 직무에 적합하다.",
      workType: "UR",
    },
    {
      id: 10,
      text: "나는 독립적인 업무 공간에서 전문성 개발이 중요시되는 직무를 선호한다.",
      workType: "UR",
    },
  ],
  CA: [
    {
      id: 1,
      text: "나는 다양한 그룹과 쉽게 공감대를 형성하고 개인 간 관계 형성이 중요한 업무에서 뛰어난 성과를 낼 수 있다.",
      workType: "CA",
    },
    {
      id: 2,
      text: "나는 깊고 의미 있는 관계 구축이 필요한 직무에 특별한 재능을 가지고 있다.",
      workType: "CA",
    },
    {
      id: 3,
      text: "나는 적극적인 의사소통이 요구되는 업무 환경에서 좋은 평가를 받는다.",
      workType: "CA",
    },
    {
      id: 4,
      text: "나는 타인에게 도움을 제공하고 지원하는 것이 주요 업무인 직무를 선호한다.",
      workType: "CA",
    },
    {
      id: 5,
      text: "나는 고객 중심의 업무 방식을 선호하며, 타인의 감정에 민감하게 반응하는 직무에 적합하다.",
      workType: "CA",
    },
    {
      id: 6,
      text: "나는 문제 해결을 위한 다양한 방안을 제시하는 업무에 능숙하다.",
      workType: "CA",
    },
    {
      id: 7,
      text: "나는 상대방의 반응을 파악하고 비언어적 의사소통이 중요한 업무에서 뛰어난 성과를 낸다.",
      workType: "CA",
    },
    {
      id: 8,
      text: "나는 좋은 첫인상 형성과 고객 서비스 관련 업무에서 뛰어난 성과를 낼 수 있다.",
      workType: "CA",
    },
    {
      id: 9,
      text: "나는 팀 내 화합을 이끌고 타인의 잠재력 개발 및 갈등 중재 업무에서 뛰어난 능력을 발휘한다.",
      workType: "CA",
    },
    {
      id: 10,
      text: "나는 다양한 이해관계자들과의 협력이 필요한 프로젝트 중심의 업무를 즐긴다.",
      workType: "CA",
    },
  ],
  CH: [
    {
      id: 1,
      text: "나는 개인과 공동체를 포괄적으로 이해하고 안정감 있는 업무 환경을 조성하는 데 능숙하다.",
      workType: "CH",
    },
    {
      id: 2,
      text: "나는 신뢰 구축과 상황에 따른 적절한 의사소통이 필요한 직무에 적합하다.",
      workType: "CH",
    },
    {
      id: 3,
      text: "나는 다양한 이해관계의 균형을 유지하고 조직 내 중재 역할이 필요한 업무에서 뛰어난 능력을 발휘한다.",
      workType: "CH",
    },
    {
      id: 4,
      text: "나는 다양한 의견을 조율하고 경청과 공감 능력이 중요한 직무에 적합하다.",
      workType: "CH",
    },
    {
      id: 5,
      text: "나는 신중한 의사결정이 요구되고 장기적인 프로젝트나 끈기가 필요한 업무를 선호한다.",
      workType: "CH",
    },
    {
      id: 6,
      text: "나는 팀의 사기를 높이고 발전적인 환경을 조성하는 리더십 역할에 적합하다.",
      workType: "CH",
    },
    {
      id: 7,
      text: "나는 혁신적인 해결책을 도출하고 갈등 관리와 중재가 주요한 업무에 적극적으로 참여한다.",
      workType: "CH",
    },
    {
      id: 8,
      text: "나는 팀 협력을 촉진하고 다양한 이해관계자들의 요구를 조율하는 프로젝트 관리 업무에 능숙하다.",
      workType: "CH",
    },
    {
      id: 9,
      text: "나는 고객 서비스 분야와 조직 내 부서 간 소통을 원활하게 하는 직무에 적합하다.",
      workType: "CH",
    },
    {
      id: 10,
      text: "나는 조직의 장기적 안정과 성장을 위한 전략 수립 업무에 흥미가 있다.",
      workType: "CH",
    },
  ],
  EE: [
    {
      id: 1,
      text: "나는 새로운 접근법을 시도하고 지속적인 도전과 성장이 요구되는 직무에 적합하다.",
      workType: "EE",
    },
    {
      id: 2,
      text: "나는 경쟁적인 업무 환경에서 명확한 목표 설정과 달성을 통해 뛰어난 성과를 낼 수 있다.",
      workType: "EE",
    },
    {
      id: 3,
      text: "나는 기획력을 바탕으로 아이디어를 실현하고 사업을 확장하는 프로젝트 중심의 업무를 선호한다.",
      workType: "EE",
    },
    {
      id: 4,
      text: "나는 트렌드와 환경 변화에 민감하게 대응하고 전략적 사고가 필요한 관리자급 업무에 적합하다.",
      workType: "EE",
    },
    {
      id: 5,
      text: "나는 협업을 통한 성과 창출과 신속한 문제 해결 및 의사결정이 요구되는 업무 환경을 선호한다.",
      workType: "EE",
    },
    {
      id: 6,
      text: "나는 새로운 시장 진출이나 창업 및 신규 사업 개발과 관련된 직무에 도전적이다.",
      workType: "EE",
    },
    {
      id: 7,
      text: "나는 다양한 프로젝트를 동시에 관리하며 성과 중심 직무에서 뛰어난 능력을 발휘할 수 있다.",
      workType: "EE",
    },
    {
      id: 8,
      text: "나는 리더십이 요구되는 팀 관리 직무에 적합하다.",
      workType: "EE",
    },
    {
      id: 9,
      text: "나는 혁신적인 개발 프로젝트를 주도하고 전략적 비즈니스 기획 업무를 선호한다.",
      workType: "EE",
    },
    {
      id: 10,
      text: "나는 이해관계자 설득과 협상이 중요한 업무에서 뛰어난 성과를 낼 수 있다.",
      workType: "EE",
    },
  ],
  EG: [
    {
      id: 1,
      text: "나는 지속적인 자기 계발과 성장이 요구되는 직무를 선호한다.",
      workType: "EG",
    },
    {
      id: 2,
      text: "나는 명확한 목표 설정과 달성 과정을 통해 높은 성과를 내는 업무에 적합하다.",
      workType: "EG",
    },
    {
      id: 3,
      text: "나는 높은 수준의 자기관리가 요구되는 자율적인 업무 환경을 선호한다.",
      workType: "EG",
    },
    {
      id: 4,
      text: "나는 성과 중심의 평가 시스템과 경쟁적인 업무 환경에서 뛰어난 실적을 낼 수 있다.",
      workType: "EG",
    },
    {
      id: 5,
      text: "나는 논리적 설득이 필요한 협상이나 제안 업무에 능숙하다.",
      workType: "EG",
    },
    {
      id: 6,
      text: "나는 팀원들의 성과를 인정하고 격려하는 리더십 역할에 적합하다.",
      workType: "EG",
    },
    {
      id: 7,
      text: "나는 엄격한 일정 관리와 업무 효율성 향상이 중요한 직무에서 탁월한 능력을 발휘한다.",
      workType: "EG",
    },
    {
      id: 8,
      text: "나는 조직의 비전을 명확히 전달하는 커뮤니케이션 업무에 적합하다.",
      workType: "EG",
    },
    {
      id: 9,
      text: "나는 프로젝트 관리와 전략 수립 및 실행을 통해 조직 성과를 극대화하는 업무에 적합하다.",
      workType: "EG",
    },
    {
      id: 10,
      text: "나는 새로운 비즈니스 기회 발굴과 조직의 대외 이미지 관리 업무에 관심이 있다.",
      workType: "EG",
    },
  ],
};

// 전체 질문 배열 (100개 완성)
export const ALL_QUESTIONS = Object.values(QUESTIONS_BY_TYPE).flat();

// 질문 섞기 헬퍼 함수
export const shuffleQuestions = (): Question[] => {
  return [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
};

// 특정 유형의 질문 가져오기
export const getQuestionsByType = (type: WorkTypeCode): Question[] => {
  return QUESTIONS_BY_TYPE[type];
};

// 총 질문 수 상수
export const TOTAL_QUESTIONS = ALL_QUESTIONS.length;
export const QUESTIONS_PER_TYPE = 10;
export const TOTAL_WORK_TYPES = Object.keys(WORK_TYPES).length;
