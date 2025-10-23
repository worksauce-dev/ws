import type { TimeOfDay } from "@/shared/types/greeting.types";
import type { UserProfile } from "../lib/supabase";

/**
 * 현재 시간대를 반환합니다.
 */
const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
};

/**
 * 배열에서 랜덤으로 하나의 요소를 선택합니다.
 */
const randomPick = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * 사용자 컨텍스트에 따라 적절한 그리팅 메시지를 생성합니다.
 */
export const generateGreeting = (userProfile: UserProfile): string => {
  const { name, created_at } = userProfile;

  // 신규 사용자
  if (
    new Date(created_at).getTime() >
    new Date().getTime() - 1000 * 60 * 60 * 24 * 30
  ) {
    const greetings = [
      "워크소스에 오신 것을 환영합니다! 첫 번째 소스테스트를 발송해보세요.",
      "안녕하세요! 지원자의 직무실행유형을 파악할 준비가 되셨나요?",
      "시작이 반이에요! 지금 바로 테스트를 발송하고 인사이트를 받아보세요.",
    ];
    return randomPick(greetings);
  }

  // 완료된 결과가 있는 경우 (우선순위 높음)
  //   if (completedResults > 0) {
  //     const greetings = [
  //       `새로운 테스트 결과 ${completedResults}건을 확인해보세요!`,
  //       "분석이 완료된 지원자 프로필을 검토할 시간이에요.",
  //       `${completedResults}명의 직무실행유형 분석이 준비되었습니다.`,
  //     ];
  //     return randomPick(greetings);
  //   }

  // 대기 중인 테스트가 있는 경우
  //   if (pendingTests > 0) {
  //     const greetings = [
  //       `${pendingTests}명의 지원자가 테스트를 진행 중입니다.`,
  //       "발송한 테스트의 응답을 기다리는 중이에요. 곧 결과를 확인할 수 있습니다.",
  //       "지원자들의 응답이 도착하는 대로 알려드릴게요.",
  //     ];
  //     return randomPick(greetings);
  //   }

  // 총 테스트가 10건 이상인 경우 가끔 성과 메시지 표시
  //   if (totalTestsSent >= 10 && Math.random() > 0.7) {
  //     const greetings = [
  //       `이번 달 ${totalTestsSent}명의 지원자를 평가하셨네요. 훌륭해요!`,
  //       `누적 테스트 ${totalTestsSent}건 달성! 채용 인사이트가 쌓이고 있어요.`,
  //       `벌써 ${totalTestsSent}건의 테스트를 진행하셨어요. 대단해요!`,
  //     ];
  //     return randomPick(greetings);
  //   }

  // 기본: 시간대별 인사
  const timeOfDay = getTimeOfDay();
  const timeBasedGreetings = {
    morning: [
      `좋은 아침이에요, ${name}님! 오늘도 최적의 인재를 찾아보세요.`,
      `새로운 하루를 시작해볼까요, ${name}님?`,
      "활기찬 아침이에요! 채용 현황을 확인해보세요.",
    ],
    afternoon: [
      `안녕하세요, ${name}님! 채용 현황을 확인해보세요.`,
      `오늘도 수고하고 계시네요, ${name}님!`,
      "점심은 드셨나요? 잠깐 대시보드를 확인해보세요.",
    ],
    evening: [
      `수고 많으셨어요, ${name}님! 오늘의 채용 활동을 정리해보세요.`,
      "하루 마무리하시나요? 최종 현황을 체크해보세요.",
      `오늘도 고생하셨어요, ${name}님!`,
    ],
  };

  return randomPick(timeBasedGreetings[timeOfDay]);
};

// /**
//  * 부가 설명 메시지를 생성합니다.
//  */
// export const generateSubGreeting = (context: GreetingContext): string | null => {
//   if (context.completedResults > 0) {
//     return "확인하지 않은 새로운 결과가 있습니다.";
//   }

//   if (context.pendingTests > 0) {
//     return `${context.pendingTests}건의 테스트가 진행 중입니다.`;
//   }

//   if (context.isNewUser) {
//     return "첫 테스트를 발송하고 지원자를 분석해보세요.";
//   }

//   return null;
// };

// // 기존 함수와의 호환성을 위한 alias
// export const getGreeting = generateGreeting;
// export const getSubGreeting = generateSubGreeting;
