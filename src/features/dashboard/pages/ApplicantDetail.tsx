import { useState } from "react";
import {
  MdArrowBack,
  MdEmail,
  MdPhone,
  MdCalendarToday,
  MdStar,
  MdStarBorder,
  MdFileDownload,
  MdShare,
  MdCheckCircle,
  MdTrendingUp,
  MdGroups,
  MdPsychology,
  MdQuestionAnswer,
  MdLightbulb,
  MdWarning,
  MdThumbUp,
  MdThumbDown,
  MdSchedule,
} from "react-icons/md";

// Types
interface CandidateDetail {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  appliedAt: string;
  testCompletedAt: string;
  status: "recommended" | "filtered" | "pending";
  overallScore: number;
  matchScore: number;
  workType: string;
  isStarred: boolean;
  summary: string;
  avatar?: string;
}

interface WorkTypeAnalysis {
  type: string;
  description: string;
  characteristics: string[];
  strengths: string[];
  weaknesses: string[];
  motivators: string[];
  stressors: string[];
  workStyle: string;
  managementTips: string[];
}

interface TeamSynergy {
  overall: "high" | "medium" | "low";
  score: number;
  roleInTeam: string;
  collaborationStyle: string;
  potentialConflicts: string[];
  synergyOpportunities: string[];
  recommendations: string[];
}

interface InterviewGuide {
  keyQuestions: string[];
  focusAreas: string[];
  redFlags: string[];
  positiveSignals: string[];
}

// Mock data
const mockCandidate: CandidateDetail = {
  id: "1",
  name: "김철수",
  email: "kim.cs@email.com",
  phone: "010-1234-5678",
  position: "Frontend Developer",
  appliedAt: "2024-09-15",
  testCompletedAt: "2024-09-18",
  status: "recommended",
  overallScore: 92,
  matchScore: 95,
  workType: "창조형",
  isStarred: true,
  summary: "창의적 사고가 뛰어난 프론트엔드 적합 인재",
};

const mockWorkTypeAnalysis: WorkTypeAnalysis = {
  type: "창조형",
  description:
    "새로운 아이디어를 창출하고 혁신적인 솔루션을 만들어내는 것을 선호하는 유형입니다.",
  characteristics: [
    "독창적이고 창의적인 사고",
    "새로운 것에 대한 높은 호기심",
    "변화와 도전을 즐김",
    "자유로운 업무 환경 선호",
  ],
  strengths: [
    "혁신적인 아이디어 제시",
    "문제 해결에 대한 독특한 접근",
    "빠른 학습 능력",
    "적응력과 유연성",
  ],
  weaknesses: [
    "루틴한 업무에 대한 낮은 집중력",
    "세부사항 관리 미흡",
    "일정 관리의 어려움",
    "체계적인 문서화 부족",
  ],
  motivators: [
    "새로운 기술 도입 기회",
    "창의적 자유도",
    "도전적인 프로젝트",
    "개인의 아이디어 존중",
  ],
  stressors: [
    "과도한 규칙과 절차",
    "반복적인 업무",
    "창의성 제약",
    "마이크로 매니지먼트",
  ],
  workStyle:
    "자율적이고 창의적인 환경에서 최고의 성과를 발휘하며, 새로운 도전을 통해 동기부여를 받습니다.",
  managementTips: [
    "충분한 자율권과 창의적 자유 제공",
    "새로운 프로젝트나 기술 학습 기회 부여",
    "목표 설정 시 구체적인 방법론보다 결과 중심으로 소통",
    "정기적인 피드백과 아이디어 공유 세션 진행",
  ],
};

const mockTeamSynergy: TeamSynergy = {
  overall: "high",
  score: 88,
  roleInTeam: "혁신 주도자",
  collaborationStyle: "아이디어 제안 중심의 적극적 참여",
  potentialConflicts: [
    "체계적인 업무 프로세스를 중시하는 팀원과의 갈등 가능성",
    "세부 일정 관리에서 팀과의 불일치 발생 가능",
  ],
  synergyOpportunities: [
    "기존 팀의 안정성과 창의성의 균형 달성",
    "새로운 기술 도입의 촉매 역할",
    "팀 내 혁신 문화 조성",
  ],
  recommendations: [
    "체계적인 팀원과 페어로 배치하여 상호 보완",
    "프로젝트 초기 기획 단계에 적극 참여시키기",
    "정기적인 브레인스토밍 세션의 리더 역할 부여",
  ],
};

const mockInterviewGuide: InterviewGuide = {
  keyQuestions: [
    "과거에 가장 혁신적이라고 생각하는 프로젝트나 솔루션을 소개해주세요.",
    "새로운 기술을 학습할 때 어떤 방식으로 접근하시나요?",
    "팀 프로젝트에서 의견 충돌이 있을 때 어떻게 해결하시나요?",
    "반복적인 업무를 효율적으로 처리하는 본인만의 방법이 있나요?",
  ],
  focusAreas: [
    "창의적 문제 해결 능력",
    "새로운 기술에 대한 학습 의지",
    "팀워크 및 소통 능력",
    "프로젝트 관리 및 일정 준수 능력",
  ],
  redFlags: [
    "변화에 대한 강한 거부감",
    "체계적인 업무 방식에 대한 이해 부족",
    "팀 규칙이나 프로세스 무시 경향",
  ],
  positiveSignals: [
    "구체적인 혁신 사례와 성과 제시",
    "학습에 대한 열정과 계획",
    "팀워크의 중요성에 대한 이해",
  ],
};

export const ApplicantDetail = () => {
  const [isStarred, setIsStarred] = useState(mockCandidate.isStarred);
  const [activeTab, setActiveTab] = useState<"analysis" | "team" | "interview">(
    "analysis"
  );

  const handleBackClick = () => {
    console.log("Navigate back to dashboard");
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-warning";
    if (score >= 70) return "text-info";
    return "text-error";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-success-100";
    if (score >= 80) return "bg-warning-100";
    if (score >= 70) return "bg-info-100";
    return "bg-error-100";
  };

  const getRecommendationBadge = (status: string) => {
    switch (status) {
      case "recommended":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success">
            <MdThumbUp className="w-4 h-4 mr-1" />
            강력 추천
          </span>
        );
      case "filtered":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-error-100 text-error">
            <MdThumbDown className="w-4 h-4 mr-1" />
            부적합
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-warning-100 text-warning">
            <MdSchedule className="w-4 h-4 mr-1" />
            검토 중
          </span>
        );
    }
  };

  const getSynergyColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-success";
      case "medium":
        return "text-warning";
      case "low":
        return "text-error";
      default:
        return "text-neutral-600";
    }
  };

  const getSynergyBgColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-success-100";
      case "medium":
        return "bg-warning-100";
      case "low":
        return "bg-error-100";
      default:
        return "bg-neutral-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackClick}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <MdArrowBack className="w-5 h-5 text-neutral-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-800">
                  지원자 상세 분석
                </h1>
                <p className="text-sm text-neutral-600 mt-1">
                  소스테스트 결과 기반 채용 의사결정 지원
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center px-4 py-2 rounded-lg font-medium border border-neutral-200 text-neutral-700 transition-colors duration-200 hover:bg-gray-50">
                <MdShare className="w-4 h-4 mr-2" />
                공유하기
              </button>
              <button className="inline-flex items-center px-4 py-2 rounded-lg font-medium border border-neutral-200 text-neutral-700 transition-colors duration-200 hover:bg-gray-50">
                <MdFileDownload className="w-4 h-4 mr-2" />
                리포트 다운로드
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 종합 평가 헤더 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* 프로필 이미지 */}
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {mockCandidate.name[0]}
                </span>
              </div>

              {/* 기본 정보 */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-neutral-800">
                    {mockCandidate.name}
                  </h2>
                  <button
                    onClick={() => setIsStarred(!isStarred)}
                    className="p-1 rounded hover:bg-gray-200 transition-colors duration-200"
                  >
                    {isStarred ? (
                      <MdStar className="w-6 h-6 text-warning" />
                    ) : (
                      <MdStarBorder className="w-6 h-6 text-neutral-500" />
                    )}
                  </button>
                  {getRecommendationBadge(mockCandidate.status)}
                </div>

                <div className="flex items-center gap-6 text-neutral-600 mb-3">
                  <div className="flex items-center gap-2">
                    <MdEmail className="w-4 h-4" />
                    <span>{mockCandidate.email}</span>
                  </div>
                  {mockCandidate.phone && (
                    <div className="flex items-center gap-2">
                      <MdPhone className="w-4 h-4" />
                      <span>{mockCandidate.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MdCalendarToday className="w-4 h-4" />
                    <span>
                      지원일:{" "}
                      {new Date(mockCandidate.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary-100 text-primary text-sm font-medium">
                    {mockCandidate.position}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-info-100 text-info text-sm font-medium">
                    {mockCandidate.workType}
                  </span>
                </div>
              </div>
            </div>

            {/* 점수 영역 */}
            <div className="flex gap-6">
              <div className="text-center">
                <div
                  className={`w-24 h-24 rounded-full ${getScoreBgColor(mockCandidate.overallScore)} flex items-center justify-center mb-2`}
                >
                  <span
                    className={`text-2xl font-bold ${getScoreColor(mockCandidate.overallScore)}`}
                  >
                    {mockCandidate.overallScore}
                  </span>
                </div>
                <p className="text-sm font-medium text-neutral-700">
                  종합 점수
                </p>
              </div>
              <div className="text-center">
                <div
                  className={`w-24 h-24 rounded-full ${getScoreBgColor(mockCandidate.matchScore)} flex items-center justify-center mb-2`}
                >
                  <span
                    className={`text-2xl font-bold ${getScoreColor(mockCandidate.matchScore)}`}
                  >
                    {mockCandidate.matchScore}%
                  </span>
                </div>
                <p className="text-sm font-medium text-neutral-700">
                  직무 적합도
                </p>
              </div>
            </div>
          </div>

          {/* 한줄 요약 */}
          <div className="mt-6 p-4 bg-primary-50 rounded-lg">
            <div className="flex items-center gap-2">
              <MdLightbulb className="w-5 h-5 text-primary" />
              <span className="font-medium text-primary">한줄 요약</span>
            </div>
            <p className="text-neutral-800 mt-1">{mockCandidate.summary}</p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-xl border border-neutral-200 mb-6">
          <div className="px-6 py-4 border-b border-neutral-200">
            <div className="flex rounded-lg p-1 bg-neutral-50 w-fit">
              <button
                onClick={() => setActiveTab("analysis")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeTab === "analysis"
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-white"
                }`}
              >
                <MdPsychology className="w-4 h-4 mr-2 inline" />
                직무실행유형 분석
              </button>
              <button
                onClick={() => setActiveTab("team")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeTab === "team"
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-white"
                }`}
              >
                <MdGroups className="w-4 h-4 mr-2 inline" />팀 시너지 분석
              </button>
              <button
                onClick={() => setActiveTab("interview")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeTab === "interview"
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-white"
                }`}
              >
                <MdQuestionAnswer className="w-4 h-4 mr-2 inline" />
                면접 가이드
              </button>
            </div>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="p-6">
            {activeTab === "analysis" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 유형 설명 */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-3">
                      {mockWorkTypeAnalysis.type} 특성
                    </h3>
                    <p className="text-neutral-600 mb-4">
                      {mockWorkTypeAnalysis.description}
                    </p>
                    <div className="space-y-3">
                      {mockWorkTypeAnalysis.characteristics.map(
                        (item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <MdCheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-neutral-700">{item}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-3">
                      업무 스타일
                    </h4>
                    <p className="text-neutral-600 p-3 bg-info-50 rounded-lg">
                      {mockWorkTypeAnalysis.workStyle}
                    </p>
                  </div>
                </div>

                {/* 강점 & 약점 */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
                      <MdTrendingUp className="w-4 h-4" />
                      주요 강점
                    </h4>
                    <div className="space-y-2">
                      {mockWorkTypeAnalysis.strengths.map((strength, index) => (
                        <div
                          key={index}
                          className="p-2 bg-success-50 rounded-lg"
                        >
                          <span className="text-success-700">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-warning mb-3 flex items-center gap-2">
                      <MdWarning className="w-4 h-4" />
                      주의 사항
                    </h4>
                    <div className="space-y-2">
                      {mockWorkTypeAnalysis.weaknesses.map(
                        (weakness, index) => (
                          <div
                            key={index}
                            className="p-2 bg-warning-50 rounded-lg"
                          >
                            <span className="text-warning-700">{weakness}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* 동기 요소 & 스트레스 요인 */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-primary mb-3">
                        동기 부여 요소
                      </h4>
                      <div className="space-y-2">
                        {mockWorkTypeAnalysis.motivators.map(
                          (motivator, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 bg-primary-50 rounded-lg"
                            >
                              <MdThumbUp className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-primary-700">
                                {motivator}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-error mb-3">
                        스트레스 요인
                      </h4>
                      <div className="space-y-2">
                        {mockWorkTypeAnalysis.stressors.map(
                          (stressor, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 bg-error-50 rounded-lg"
                            >
                              <MdThumbDown className="w-4 h-4 text-error flex-shrink-0" />
                              <span className="text-error-700">{stressor}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 관리 팁 */}
                <div className="lg:col-span-2">
                  <h4 className="font-semibold text-neutral-800 mb-3">
                    효과적인 관리 방법
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mockWorkTypeAnalysis.managementTips.map((tip, index) => (
                      <div key={index} className="p-3 bg-neutral-50 rounded-lg">
                        <span className="text-neutral-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "team" && (
              <div className="space-y-6">
                {/* 팀 시너지 점수 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div
                      className={`w-20 h-20 rounded-full ${getSynergyBgColor(mockTeamSynergy.overall)} flex items-center justify-center mb-3 mx-auto`}
                    >
                      <span
                        className={`text-xl font-bold ${getSynergyColor(mockTeamSynergy.overall)}`}
                      >
                        {mockTeamSynergy.score}%
                      </span>
                    </div>
                    <p className="font-medium text-neutral-800">
                      팀 시너지 점수
                    </p>
                    <p className="text-sm text-neutral-600">
                      {mockTeamSynergy.overall === "high"
                        ? "높음"
                        : mockTeamSynergy.overall === "medium"
                          ? "보통"
                          : "낮음"}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-info-100 flex items-center justify-center mb-3 mx-auto">
                      <MdGroups className="w-8 h-8 text-info" />
                    </div>
                    <p className="font-medium text-neutral-800">팀 내 역할</p>
                    <p className="text-sm text-neutral-600">
                      {mockTeamSynergy.roleInTeam}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mb-3 mx-auto">
                      <MdTrendingUp className="w-8 h-8 text-success" />
                    </div>
                    <p className="font-medium text-neutral-800">협업 스타일</p>
                    <p className="text-sm text-neutral-600">
                      {mockTeamSynergy.collaborationStyle}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 시너지 기회 */}
                  <div>
                    <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
                      <MdThumbUp className="w-4 h-4" />
                      시너지 기회
                    </h4>
                    <div className="space-y-3">
                      {mockTeamSynergy.synergyOpportunities.map(
                        (opportunity, index) => (
                          <div
                            key={index}
                            className="p-3 bg-success-50 rounded-lg"
                          >
                            <span className="text-success-700">
                              {opportunity}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* 잠재적 갈등 */}
                  <div>
                    <h4 className="font-semibold text-warning mb-3 flex items-center gap-2">
                      <MdWarning className="w-4 h-4" />
                      주의할 점
                    </h4>
                    <div className="space-y-3">
                      {mockTeamSynergy.potentialConflicts.map(
                        (conflict, index) => (
                          <div
                            key={index}
                            className="p-3 bg-warning-50 rounded-lg"
                          >
                            <span className="text-warning-700">{conflict}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* 추천 사항 */}
                <div>
                  <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                    <MdLightbulb className="w-4 h-4" />팀 운영 추천 사항
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mockTeamSynergy.recommendations.map(
                      (recommendation, index) => (
                        <div
                          key={index}
                          className="p-3 bg-primary-50 rounded-lg"
                        >
                          <span className="text-primary-700">
                            {recommendation}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "interview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 핵심 질문 */}
                  <div>
                    <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                      <MdQuestionAnswer className="w-4 h-4" />
                      추천 면접 질문
                    </h4>
                    <div className="space-y-3">
                      {mockInterviewGuide.keyQuestions.map(
                        (question, index) => (
                          <div
                            key={index}
                            className="p-3 bg-primary-50 rounded-lg"
                          >
                            <span className="font-medium text-primary mr-2">
                              Q{index + 1}.
                            </span>
                            <span className="text-neutral-700">{question}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* 집중 영역 */}
                  <div>
                    <h4 className="font-semibold text-info mb-3 flex items-center gap-2">
                      <MdLightbulb className="w-4 h-4" />
                      확인 포인트
                    </h4>
                    <div className="space-y-2">
                      {mockInterviewGuide.focusAreas.map((area, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-info-50 rounded-lg"
                        >
                          <MdCheckCircle className="w-4 h-4 text-info flex-shrink-0" />
                          <span className="text-info-700">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 긍정 신호 */}
                  <div>
                    <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
                      <MdThumbUp className="w-4 h-4" />
                      긍정적 신호
                    </h4>
                    <div className="space-y-2">
                      {mockInterviewGuide.positiveSignals.map(
                        (signal, index) => (
                          <div
                            key={index}
                            className="p-3 bg-success-50 rounded-lg"
                          >
                            <span className="text-success-700">{signal}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* 위험 신호 */}
                  <div>
                    <h4 className="font-semibold text-error mb-3 flex items-center gap-2">
                      <MdWarning className="w-4 h-4" />
                      주의 신호
                    </h4>
                    <div className="space-y-2">
                      {mockInterviewGuide.redFlags.map((flag, index) => (
                        <div key={index} className="p-3 bg-error-50 rounded-lg">
                          <span className="text-error-700">{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 면접 체크리스트 */}
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h4 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                    <MdCheckCircle className="w-5 h-5" />
                    면접 진행 체크리스트
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-neutral-700">
                          창의적 문제해결 사례 확인
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-neutral-700">
                          학습 의지 및 방법 평가
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-neutral-700">
                          팀워크 경험 및 스타일 확인
                        </span>
                      </label>
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-neutral-700">
                          프로젝트 관리 능력 검증
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-neutral-700">
                          기술적 깊이 및 폭 평가
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-neutral-700">
                          문화적 적합성 확인
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-1">
                다음 단계
              </h3>
              <p className="text-neutral-600">
                분석 결과를 바탕으로 채용 의사결정을 진행하세요.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-6 py-2 rounded-lg font-medium border border-error text-error transition-colors duration-200 hover:bg-error-50">
                불합격 처리
              </button>
              <button className="px-6 py-2 rounded-lg font-medium border border-warning text-warning transition-colors duration-200 hover:bg-warning-50">
                추가 면접 일정
              </button>
              <button className="px-6 py-2 rounded-lg font-medium bg-primary-500 text-white transition-colors duration-200 hover:bg-primary-600">
                최종 합격 처리
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
