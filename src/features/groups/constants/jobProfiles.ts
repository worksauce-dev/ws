/**
 * 직무별 이상적 유형 프로필 데이터베이스
 *
 * 주요 직무에 대한 역량 프로필을 정의합니다.
 * 각 직무는 POSITION_OPTIONS의 value와 매칭됩니다.
 *
 * WorkTypeCode 매핑:
 * - UR (이해연구형): 분석, 연구, 논리적 사고
 * - UM (이해관리형): 체계적 관리, 프로세스 운영
 * - EE (도전확장형): 빠른 실행, 확장, 도전
 * - EG (도전목표형): 목표 지향, 성과 추진
 * - CA (소통도움형): 협력, 도움, 팀워크
 * - CH (소통조화형): 조율, 화합, 관계 구축
 * - AS (예술느낌형): 감성적 창의성
 * - AF (예술융합형): 창의적 융합
 * - SE (기준윤리형): 원칙, 기준, 윤리
 * - SA (기준심미형): 품질, 심미성, 완성도
 */

import type { JobProfile } from "../types/jobProfile.types";

export const JOB_PROFILES: Record<string, JobProfile> = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 개발 직군
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  frontend: {
    jobId: "frontend",
    jobTitle: "프론트엔드 개발자",
    description: "사용자 인터페이스 및 사용자 경험 구현 전문가",
    competencies: [
      {
        workType: "AF",
        weight: "critical",
        minScore: 70,
        optimalScore: 85,
        description: "UI/UX 개선 및 창의적 구현",
        interviewCheckpoints: [
          "사용자 경험 개선 사례",
          "UI 컴포넌트 설계 철학",
          "디자인 시스템 구축 경험",
        ],
      },
      {
        workType: "UR",
        weight: "important",
        minScore: 65,
        optimalScore: 80,
        description: "성능 최적화 및 브라우저 호환성",
        interviewCheckpoints: [
          "프론트엔드 성능 최적화 경험",
          "브라우저 이슈 디버깅 경험",
        ],
      },
      {
        workType: "CA",
        weight: "important",
        minScore: 65,
        optimalScore: 75,
        description: "디자이너, 백엔드 개발자와의 협업",
        interviewCheckpoints: [
          "디자이너와의 협업 방식",
          "API 스펙 논의 경험",
        ],
      },
    ],
    hiringGuidance:
      "창의성과 기술력을 모두 갖춘 개발자를 선호합니다. 디자이너와의 협업 경험을 반드시 확인하세요.",
  },

  backend: {
    jobId: "backend",
    jobTitle: "백엔드 개발자",
    description: "시스템 설계 및 구현을 담당하는 개발자",
    competencies: [
      {
        workType: "UR",
        weight: "critical",
        minScore: 70,
        optimalScore: 85,
        description: "시스템 설계, 알고리즘 최적화, 문제 해결",
        interviewCheckpoints: [
          "복잡한 시스템 설계 경험",
          "알고리즘 문제 해결 방식",
          "코드 리뷰 및 품질 관리 경험",
        ],
      },
      {
        workType: "EE",
        weight: "important",
        minScore: 65,
        optimalScore: 80,
        description: "빠른 프로토타이핑 및 실행력",
        interviewCheckpoints: [
          "프로젝트 데드라인 준수 경험",
          "MVP 개발 경험",
        ],
      },
      {
        workType: "CA",
        weight: "important",
        minScore: 60,
        optimalScore: 75,
        description: "팀 협업 및 기술 커뮤니케이션",
        interviewCheckpoints: [
          "크로스팀 협업 경험",
          "기술 문서 작성 능력",
          "코드 리뷰 커뮤니케이션 방식",
        ],
      },
    ],
    hiringGuidance:
      "분석력과 실행력이 균형있게 갖춰진 개발자를 선호합니다. 협업 능력은 면접에서 구체적인 경험을 통해 검증하세요.",
  },

  mobile: {
    jobId: "mobile",
    jobTitle: "모바일 앱 개발자 (iOS/Android)",
    description: "모바일 플랫폼에 최적화된 앱 개발 전문가",
    competencies: [
      {
        workType: "AF",
        weight: "critical",
        minScore: 70,
        optimalScore: 85,
        description: "네이티브 플랫폼 UI/UX 구현",
        interviewCheckpoints: [
          "플랫폼별 UI 가이드라인 준수 경험",
          "사용자 경험 개선 사례",
          "반응형 디자인 구현 경험",
        ],
      },
      {
        workType: "UR",
        weight: "critical",
        minScore: 70,
        optimalScore: 85,
        description: "모바일 플랫폼 이해 및 성능 최적화",
        interviewCheckpoints: [
          "앱 성능 최적화 경험 (메모리, 배터리)",
          "네이티브/크로스플랫폼 기술 선택 경험",
          "플랫폼 API 활용 사례",
        ],
      },
      {
        workType: "EE",
        weight: "important",
        minScore: 65,
        optimalScore: 80,
        description: "빠른 기능 개발 및 배포",
        interviewCheckpoints: [
          "앱 스토어 배포 프로세스 경험",
          "핫픽스/긴급 패치 경험",
        ],
      },
    ],
    hiringGuidance:
      "플랫폼 이해도와 UI 구현 능력이 모두 중요합니다. 앱 배포 및 유지보수 경험을 확인하세요.",
  },

  fullstack: {
    jobId: "fullstack",
    jobTitle: "풀스택 개발자",
    description: "프론트엔드와 백엔드를 모두 다루는 개발자",
    competencies: [
      {
        workType: "UR",
        weight: "critical",
        minScore: 70,
        optimalScore: 85,
        description: "전체 시스템 아키텍처 이해",
        interviewCheckpoints: [
          "엔드투엔드 기능 개발 경험",
          "프론트-백엔드 연동 설계 경험",
          "데이터베이스 스키마 설계 경험",
        ],
      },
      {
        workType: "EE",
        weight: "critical",
        minScore: 70,
        optimalScore: 85,
        description: "빠른 프로토타이핑 및 MVP 개발",
        interviewCheckpoints: [
          "단독으로 서비스 런칭 경험",
          "다양한 기술 스택 활용 경험",
        ],
      },
      {
        workType: "AF",
        weight: "important",
        minScore: 65,
        optimalScore: 80,
        description: "UI/UX 감각",
        interviewCheckpoints: ["프론트엔드 UI 개선 사례"],
      },
    ],
    hiringGuidance:
      "전체 시스템을 이해하고 빠르게 구현할 수 있는 능력이 핵심입니다. 실제 서비스 런칭 경험을 확인하세요.",
  },

  devops: {
    jobId: "devops",
    jobTitle: "데브옵스 / 클라우드 엔지니어",
    description: "인프라 자동화 및 클라우드 운영 전문가",
    competencies: [
      {
        workType: "UM",
        weight: "critical",
        minScore: 75,
        optimalScore: 90,
        description: "체계적인 인프라 관리 및 자동화",
        interviewCheckpoints: [
          "CI/CD 파이프라인 구축 경험",
          "인프라 코드화(IaC) 경험",
          "모니터링 시스템 구축 경험",
        ],
      },
      {
        workType: "UR",
        weight: "critical",
        minScore: 70,
        optimalScore: 85,
        description: "장애 분석 및 근본 원인 파악",
        interviewCheckpoints: [
          "대규모 장애 대응 경험",
          "성능 병목 분석 및 해결 사례",
        ],
      },
      {
        workType: "EE",
        weight: "important",
        minScore: 65,
        optimalScore: 80,
        description: "신기술 도입 및 인프라 개선",
        interviewCheckpoints: ["클라우드 마이그레이션 경험", "새로운 도구 도입 사례"],
      },
    ],
    hiringGuidance:
      "체계성과 분석력이 모두 중요합니다. 실제 장애 대응 및 자동화 경험을 반드시 확인하세요.",
  },

  ai: {
    jobId: "ai",
    jobTitle: "AI / 머신러닝 엔지니어",
    description: "AI 모델 개발 및 서비스화 전문가",
    competencies: [
      {
        workType: "UR",
        weight: "critical",
        minScore: 80,
        optimalScore: 95,
        description: "수학/통계 기반 모델 설계 및 분석",
        interviewCheckpoints: [
          "모델 성능 개선 경험",
          "하이퍼파라미터 튜닝 방법론",
          "논문 구현 경험",
        ],
      },
      {
        workType: "EE",
        weight: "important",
        minScore: 70,
        optimalScore: 85,
        description: "빠른 실험 및 프로토타이핑",
        interviewCheckpoints: [
          "다양한 모델 실험 경험",
          "A/B 테스트 설계 및 분석",
        ],
      },
      {
        workType: "UM",
        weight: "important",
        minScore: 65,
        optimalScore: 80,
        description: "MLOps 및 모델 운영 관리",
        interviewCheckpoints: ["모델 배포 및 모니터링 경험", "데이터 파이프라인 구축"],
      },
    ],
    hiringGuidance:
      "분석력과 실험 능력이 핵심입니다. 실제 프로덕션 모델 운영 경험을 확인하세요.",
  },

  data: {
    jobId: "data",
    jobTitle: "데이터 분석가",
    description: "데이터 기반 인사이트 도출 및 의사결정 지원",
    competencies: [
      {
        workType: "UR",
        weight: "critical",
        minScore: 75,
        optimalScore: 90,
        description: "데이터 분석, 통계 해석, 인사이트 도출",
        interviewCheckpoints: [
          "데이터 분석 프로젝트 성과 사례",
          "통계 방법론 이해도",
          "가설 검증 프로세스",
        ],
      },
      {
        workType: "EE",
        weight: "important",
        minScore: 65,
        optimalScore: 80,
        description: "분석 결과를 실제 액션으로 전환",
        interviewCheckpoints: [
          "분석 결과가 비즈니스 임팩트로 이어진 사례",
          "데이터 기반 의사결정 경험",
        ],
      },
      {
        workType: "CA",
        weight: "important",
        minScore: 60,
        optimalScore: 75,
        description: "비기술 팀원에게 인사이트 전달",
        interviewCheckpoints: [
          "데이터 시각화 경험",
          "비기술 이해관계자 커뮤니케이션 방식",
          "리포트 작성 능력",
        ],
      },
    ],
    hiringGuidance:
      "분석력이 가장 중요하지만, 인사이트를 실행으로 연결하는 능력도 확인하세요. 소통 능력은 면접에서 검증하세요.",
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 디자인 직군
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  designer: {
    jobId: "designer",
    jobTitle: "UI/UX 디자이너",
    description: "사용자 경험 설계 및 리서치 전문가",
    competencies: [
      {
        workType: "AF",
        weight: "critical",
        minScore: 80,
        optimalScore: 90,
        description: "사용자 중심 창의적 솔루션 설계",
        interviewCheckpoints: [
          "포트폴리오 프로젝트의 UX 프로세스",
          "사용자 페인 포인트 해결 사례",
          "프로토타입 제작 도구 및 방법론",
        ],
      },
      {
        workType: "UR",
        weight: "important",
        minScore: 70,
        optimalScore: 85,
        description: "사용자 리서치 및 데이터 기반 의사결정",
        interviewCheckpoints: [
          "사용자 리서치 방법론",
          "데이터 분석 및 인사이트 도출 경험",
          "A/B 테스트 경험",
        ],
      },
      {
        workType: "CA",
        weight: "important",
        minScore: 65,
        optimalScore: 75,
        description: "개발자, 기획자와의 협업",
        interviewCheckpoints: [
          "개발팀과의 협업 방식",
          "디자인 시스템 구축 경험",
        ],
      },
    ],
    hiringGuidance:
      "창의성과 사용자 리서치 능력이 핵심입니다. 포트폴리오에서 UX 프로세스를 반드시 확인하세요.",
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 기획/전략 직군
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  pm: {
    jobId: "pm",
    jobTitle: "프로덕트 매니저 (PM)",
    description: "제품 전략 수립 및 로드맵 관리",
    competencies: [
      {
        workType: "UR",
        weight: "critical",
        minScore: 75,
        optimalScore: 90,
        description: "데이터 기반 의사결정 및 전략 수립",
        interviewCheckpoints: [
          "제품 성과 지표 설정 및 분석 경험",
          "시장 분석 및 경쟁사 분석 능력",
          "우선순위 결정 기준",
        ],
      },
      {
        workType: "CH",
        weight: "critical",
        minScore: 75,
        optimalScore: 85,
        description: "이해관계자 조율 및 팀 커뮤니케이션",
        interviewCheckpoints: [
          "멀티 이해관계자 프로젝트 경험",
          "개발팀과의 협업 방식",
          "갈등 해결 사례",
        ],
      },
      {
        workType: "EE",
        weight: "important",
        minScore: 70,
        optimalScore: 85,
        description: "빠른 제품 실행 및 런칭",
        interviewCheckpoints: [
          "제품 출시 경험",
          "MVP 개발 및 검증 경험",
        ],
      },
    ],
    hiringGuidance:
      "분석력과 소통 능력이 모두 중요합니다. 이해관계자 조율 경험을 반드시 확인하세요.",
  },

  planner: {
    jobId: "planner",
    jobTitle: "서비스 기획자",
    description: "프로젝트 일정 및 리소스 관리",
    competencies: [
      {
        workType: "UM",
        weight: "critical",
        minScore: 75,
        optimalScore: 90,
        description: "체계적인 프로젝트 관리 및 리스크 관리",
        interviewCheckpoints: [
          "프로젝트 관리 방법론 (Agile, Waterfall 등)",
          "리스크 관리 사례",
          "이슈 트래킹 시스템 활용 경험",
        ],
      },
      {
        workType: "CH",
        weight: "critical",
        minScore: 75,
        optimalScore: 85,
        description: "팀원 및 이해관계자 커뮤니케이션",
        interviewCheckpoints: [
          "멀티팀 프로젝트 경험",
          "갈등 해결 및 조율 능력",
        ],
      },
      {
        workType: "EG",
        weight: "important",
        minScore: 70,
        optimalScore: 80,
        description: "데드라인 내 프로젝트 완수",
        interviewCheckpoints: [
          "데드라인 준수 경험",
          "우선순위 조정 경험",
        ],
      },
    ],
    hiringGuidance:
      "체계성과 소통 능력이 핵심입니다. 리스크 관리 경험을 반드시 확인하세요.",
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 마케팅/영업 직군
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  marketing: {
    jobId: "marketing",
    jobTitle: "마케팅 담당자",
    description: "마케팅 전략 수립 및 캠페인 실행",
    competencies: [
      {
        workType: "AF",
        weight: "critical",
        minScore: 75,
        optimalScore: 90,
        description: "창의적인 캠페인 기획 및 실행",
        interviewCheckpoints: [
          "성공적인 마케팅 캠페인 사례",
          "브랜드 포지셔닝 전략",
          "크리에이티브 컨셉 개발 경험",
        ],
      },
      {
        workType: "UR",
        weight: "important",
        minScore: 70,
        optimalScore: 85,
        description: "데이터 기반 마케팅 성과 분석",
        interviewCheckpoints: [
          "마케팅 성과 지표 분석 경험",
          "ROI 측정 및 최적화 경험",
        ],
      },
      {
        workType: "CA",
        weight: "important",
        minScore: 65,
        optimalScore: 80,
        description: "팀 협업 및 외부 파트너 관리",
        interviewCheckpoints: [
          "대행사 협업 경험",
          "크로스팀 프로젝트 경험",
        ],
      },
    ],
    hiringGuidance:
      "창의성과 데이터 분석 능력을 모두 갖춘 마케터를 선호합니다. 성과 측정 경험을 확인하세요.",
  },

  sales: {
    jobId: "sales",
    jobTitle: "영업 담당자",
    description: "고객 발굴 및 세일즈 클로징",
    competencies: [
      {
        workType: "CH",
        weight: "critical",
        minScore: 80,
        optimalScore: 95,
        description: "고객 커뮤니케이션 및 설득력",
        interviewCheckpoints: [
          "세일즈 프로세스 설명",
          "어려운 고객 설득 사례",
          "관계 구축 능력",
        ],
      },
      {
        workType: "EG",
        weight: "critical",
        minScore: 75,
        optimalScore: 90,
        description: "빠른 실행력 및 목표 달성 추진력",
        interviewCheckpoints: [
          "목표 달성 경험",
          "파이프라인 관리 방식",
          "거절 극복 방법",
        ],
      },
      {
        workType: "UR",
        weight: "important",
        minScore: 60,
        optimalScore: 75,
        description: "고객 니즈 분석 및 솔루션 제안",
        interviewCheckpoints: [
          "고객 니즈 파악 방법",
          "맞춤형 제안 경험",
        ],
      },
    ],
    hiringGuidance:
      "소통 능력과 실행력이 모두 중요합니다. 실제 세일즈 성과와 고객 관계 구축 능력을 확인하세요.",
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 운영/관리 직군
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  hr: {
    jobId: "hr",
    jobTitle: "인사 담당자 (HR)",
    description: "채용, 인사 제도 운영 및 조직문화 관리",
    competencies: [
      {
        workType: "CA",
        weight: "critical",
        minScore: 80,
        optimalScore: 90,
        description: "구성원 커뮤니케이션 및 관계 관리",
        interviewCheckpoints: [
          "조직문화 개선 사례",
          "구성원 갈등 조율 경험",
          "면접 및 후보자 커뮤니케이션 방식",
        ],
      },
      {
        workType: "UM",
        weight: "important",
        minScore: 75,
        optimalScore: 85,
        description: "체계적인 인사 프로세스 관리",
        interviewCheckpoints: [
          "채용 프로세스 설계 경험",
          "인사 제도 운영 경험",
          "컴플라이언스 관리 경험",
        ],
      },
      {
        workType: "UR",
        weight: "important",
        minScore: 65,
        optimalScore: 80,
        description: "데이터 기반 인사 의사결정",
        interviewCheckpoints: [
          "인사 데이터 분석 경험",
          "이직률 분석 및 개선 사례",
        ],
      },
    ],
    hiringGuidance:
      "소통 능력과 체계성이 모두 중요합니다. 조직문화 개선 경험을 반드시 확인하세요.",
  },

  cs: {
    jobId: "cs",
    jobTitle: "고객지원 (CS) 담당자",
    description: "고객 문의 응대 및 문제 해결",
    competencies: [
      {
        workType: "CA",
        weight: "critical",
        minScore: 80,
        optimalScore: 95,
        description: "고객 응대 및 공감 능력",
        interviewCheckpoints: [
          "어려운 고객 응대 사례",
          "고객 만족도 향상 경험",
          "멀티채널 응대 경험",
        ],
      },
      {
        workType: "UM",
        weight: "important",
        minScore: 70,
        optimalScore: 85,
        description: "체계적인 이슈 관리 및 문서화",
        interviewCheckpoints: [
          "티켓 시스템 활용 경험",
          "FAQ 작성 및 관리 경험",
        ],
      },
      {
        workType: "UR",
        weight: "important",
        minScore: 65,
        optimalScore: 75,
        description: "문제 분석 및 해결",
        interviewCheckpoints: [
          "복잡한 이슈 해결 경험",
          "개선 제안 경험",
        ],
      },
    ],
    hiringGuidance:
      "공감 능력과 커뮤니케이션이 가장 중요합니다. 어려운 상황 대처 능력을 확인하세요.",
  },
};

/**
 * 직무 ID로 직무 프로필 조회
 */
export const getJobProfile = (jobId: string): JobProfile | null => {
  return JOB_PROFILES[jobId] || null;
};

/**
 * 모든 직무 ID 목록
 */
export const ALL_JOB_IDS = Object.keys(JOB_PROFILES);

/**
 * 직무 프로필이 존재하는지 확인
 */
export const hasJobProfile = (jobId: string): boolean => {
  return jobId in JOB_PROFILES;
};
