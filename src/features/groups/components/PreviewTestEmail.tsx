import { format } from "date-fns";
import { MdInfo, MdClose, MdHelpOutline } from "react-icons/md";
import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "@/shared/lib/supabase";

/**
 * XSS 방지를 위한 문자열 새니타이제이션
 */
function sanitize(str: string): string {
  return str.replace(/[<>'"]/g, (char) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[char] || char;
  });
}

/**
 * 이메일 HTML 템플릿 생성 (원본 디자인)
 */
function generateSauceTestEmailTemplate(
  userName: string = "",
  applicantName: string = "",
  testToken: string = "",
  deadline: string = ""
): string {
  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const testUrl = `https://worksauce.kr/test/${testToken}`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>워크소스 소스테스트 안내</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; line-height: 1.6; color: oklch(40.1% 0.012 286); background-color: oklch(98.5% 0.003 286);">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- 로고 섹션 -->
    <div style="background-color: white; padding: 24px; border-radius: 16px 16px 0 0; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
      <a href="https://worksauce.kr" target="_blank" style="text-decoration: none;" rel="noreferrer noopener">
        <img src="https://firebasestorage.googleapis.com/v0/b/worksauce-eee8c.appspot.com/o/%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9%E1%84%89%E1%85%B5%E1%84%8B%E1%85%A1%E1%86%AB1.png?alt=media&token=a3f88230-1d58-4827-8b0d-52dab4c8fd08"
             alt="WorkSauce Logo"
             style="width: 200px; height: auto;"
             loading="lazy">
      </a>
    </div>

    <!-- 메인 콘텐츠 -->
    <div style="background-color: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <!-- 인사말 섹션 -->
      <div style="margin-bottom: 32px;">
        <p style="font-size: 18px; margin-bottom: 24px; color: oklch(40.1% 0.012 286);">
          안녕하세요, <strong style="color: oklch(70.5% 0.213 47.604);">${sanitize(applicantName)}</strong>님.
        </p>
        <p style="margin-bottom: 16px; color: oklch(40.1% 0.012 286);">
          <strong style="color: oklch(40.1% 0.012 286);">[${sanitize(userName)}]</strong>님이 발송한 소스테스트를 보내드립니다.
        </p>
        ${formattedDeadline ? `
        <p style="margin-bottom: 8px; color: oklch(48.6% 0.015 286);">
          소스테스트 진행 가능 기한은
        </p>
        <p style="font-size: 20px; color: oklch(70.5% 0.213 47.604); font-weight: 700; margin: 8px 0;">
          ${formattedDeadline}까지입니다.
        </p>
        <p style="color: oklch(58.7% 0.019 286); font-size: 14px; margin-top: 16px;">
          ⏰ 꼭 기한 내에 진행해 주세요. 미진행으로 인한 책임은 ${sanitize(applicantName)}님께 있습니다.
        </p>
        ` : ''}
      </div>

      <!-- 주의사항 섹션 -->
      <div style="background-color: oklch(97.1% 0.027 85.4); border-left: 4px solid oklch(78.2% 0.137 85.4); border-radius: 8px; padding: 24px; margin: 24px 0;">
        <div style="font-weight: 600; color: oklch(52.8% 0.159 47.604); margin-bottom: 16px; font-size: 16px;">
          📋 소스테스트 진행을 위한 주의사항
        </div>
        <ol style="padding-left: 20px; margin: 0; color: oklch(48.6% 0.015 286); font-size: 14px;">
          <li style="margin-bottom: 12px;">암호화 로그인을 위해 발송받으신 <strong>이메일과 성함</strong>을 정확히 기재해 주세요.</li>
          <li style="margin-bottom: 12px;">소스테스트는 <strong>정해진 정답이 없는 검사</strong>입니다. 편하고 솔직하게 진행해주세요.</li>
          <li style="margin-bottom: 12px;">진행하실 경우 <strong>개인정보처리방침</strong>에 동의하신 것으로 간주됩니다.</li>
          <li style="margin-bottom: 12px;">소스테스트는 <strong>1단계 180개 문항, 2단계 동사 선택</strong>으로 이루어져 있습니다.</li>
          <li style="margin-bottom: 0;">소요시간은 평균 <strong>15~30분 이내</strong>입니다.</li>
        </ol>
      </div>

      <!-- CTA 버튼 -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${testUrl}"
           style="display: inline-block; background-color: oklch(70.5% 0.213 47.604); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(255, 111, 15, 0.25); transition: all 0.2s ease;">
          💼 소스테스트 진행하기
        </a>
      </div>

      <!-- 발신자 정보 -->
      <div style="background-color: oklch(96.2% 0.006 286); border-radius: 8px; padding: 16px; margin-top: 24px;">
        <p style="margin: 0; color: oklch(58.7% 0.019 286); font-size: 14px;">
          본 메일은 <strong>[${sanitize(userName)}]</strong>님의 요청으로 발송되었습니다.<br>
          궁금하신 점은 <strong>[${sanitize(userName)}]</strong>님에게 연락주세요.
        </p>
      </div>
    </div>

    <!-- 푸터 -->
    <div style="text-align: center; margin-top: 24px; color: oklch(58.7% 0.019 286); font-size: 12px;">
      <p style="margin-bottom: 8px;">본 이메일은 발신 전용입니다.</p>
      <p style="margin-bottom: 16px;">
        워크소스에 궁금하신 점은
        <a href="mailto:worksauce.info@gmail.com"
           style="color: oklch(70.5% 0.213 47.604); text-decoration: none; font-weight: 500;"
           rel="noreferrer noopener"
           target="_blank">worksauce.info@gmail.com</a>로
        문의바랍니다.
      </p>
      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid oklch(92.4% 0.011 286);">
        <p style="margin: 0 0 8px 0; color: oklch(48.6% 0.015 286); font-weight: 500;">
          감사합니다.<br>
          워크소스 팀 드림 💼
        </p>
        <p style="margin: 0; color: oklch(58.7% 0.019 286); font-size: 11px;">
          © 2025 워크소스 WorkSauce. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

interface PreviewTestEmailProps {
  user: User | null;
  userProfile: UserProfile | null;
  groupName: string;
  deadline: string;
  applicants: Array<{ name: string; email: string }>;
  showRealName: boolean;
  onToggleRealName: () => void;
  onClose: () => void;
}

const PreviewTestEmail = ({
  user,
  userProfile,
  groupName,
  deadline,
  applicants,
  showRealName,
  onToggleRealName,
  onClose,
}: PreviewTestEmailProps) => {
  // 기업 인증 여부 확인 (user_profiles 테이블에서 조회)
  const isBusinessVerified = userProfile?.business_verified === true;
  const businessName = userProfile?.business_name;

  const getEmailPreview = () => {
    const testToken = "preview-" + Math.random().toString(36).substring(2, 15);

    // 기업회원이면 기업명, 아니면 실명/담당자
    const userName = isBusinessVerified
      ? businessName || "기업명"
      : showRealName
      ? user?.user_metadata?.name || user?.email?.split("@")[0] || "관리자"
      : "담당자";

    const applicantName =
      applicants.length > 0 ? applicants[0].name : "[지원자 이름]";

    return generateSauceTestEmailTemplate(
      userName,
      applicantName,
      testToken,
      deadline || new Date().toISOString()
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">이메일 미리보기</h2>
            <p className="text-sm text-gray-600 mt-1">
              "{groupName}" 그룹의 소스테스트 이메일
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="닫기"
          >
            <MdClose className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* 이메일 미리보기 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div
              className="bg-gray-50"
              dangerouslySetInnerHTML={{ __html: getEmailPreview() }}
            />
          </div>

          {/* 정보 박스 */}
          <div className="mt-6 space-y-3">
            {/* 기업 인증 여부에 따른 발송자 정보 안내 */}
            {isBusinessVerified ? (
              // 기업회원: 기업 인증 완료 안내
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <MdInfo className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-900 mb-2">
                      기업 인증 완료
                    </p>
                    <p className="text-sm text-green-800 leading-relaxed">
                      귀사의 이메일은 기업명 <strong>[{businessName}]</strong>로 발송됩니다.
                      기업 인증을 통해 지원자에게 신뢰할 수 있는 채용 프로세스를 제공합니다.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // 일반 회원: 실명 노출 설정 안내
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <MdHelpOutline className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-900 mb-2">
                      왜 실명이 노출되나요?
                    </p>
                    <p className="text-sm text-amber-800 mb-3 leading-relaxed">
                      회사 또는 채용 담당자를 사칭하는 피싱 메일을 방지하기 위해
                      이메일에 발송자의 실명이 표시됩니다. 이를 통해 지원자가
                      신뢰할 수 있는 이메일인지 확인할 수 있습니다. 회사 인증을
                      진행하시면 회사의 이름으로 표시됩니다.
                    </p>
                    <a
                      href="https://worksauce.kr/company-verification"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm text-amber-900 font-medium hover:text-amber-700 underline decoration-2 underline-offset-2 mb-4 transition-colors"
                    >
                      → 회사인증 바로가기
                    </a>
                    <div className="pt-1 border-t border-amber-200">
                      <label className="flex items-center space-x-2 cursor-pointer py-2">
                        <input
                          type="checkbox"
                          checked={showRealName}
                          onChange={onToggleRealName}
                          className="w-4 h-4 text-primary-600 border-amber-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium text-amber-900">
                          이메일에 내 실명 "
                          {user?.user_metadata?.name ||
                            user?.email?.split("@")[0] ||
                            "관리자"}
                          " 표시하기
                        </span>
                      </label>
                      {!showRealName && (
                        <p className="text-xs text-amber-700 ml-6">
                          ⚠️ 체크 해제 시 "담당자"로 표시됩니다.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 발송 정보 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <MdInfo className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-2">발송 정보</p>
                  <ul className="space-y-1">
                    <li>
                      • 발송자:{" "}
                      {isBusinessVerified
                        ? `[${businessName}]`
                        : showRealName
                        ? user?.user_metadata?.name ||
                          user?.email?.split("@")[0] ||
                          "관리자"
                        : "담당자"}
                      님
                    </li>
                    <li>• 수신자: {applicants.length}명의 지원자</li>
                    <li>
                      • 기한:{" "}
                      {deadline
                        ? format(new Date(deadline), "yyyy.MM.dd")
                        : "미설정"}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {applicants.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  수신자 목록 (미리보기는 첫 번째 지원자 기준)
                </p>
                <div className="max-h-32 overflow-y-auto">
                  <ul className="text-sm text-gray-600 space-y-1">
                    {applicants.map((applicant, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="w-6 text-gray-400">{index + 1}.</span>
                        <span className="font-medium">{applicant.name}</span>
                        <span className="text-gray-400">
                          ({applicant.email})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewTestEmail;
