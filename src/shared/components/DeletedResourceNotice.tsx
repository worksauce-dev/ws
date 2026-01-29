/**
 * 삭제된 리소스 안내 컴포넌트
 * 그룹 또는 지원자가 삭제되었을 때 표시되는 UI
 */

import { MdInfoOutline, MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface DeletedResourceNoticeProps {
  resourceType: "group" | "applicant";
  title?: string;
  message?: string;
  showDashboardButton?: boolean;
}

export const DeletedResourceNotice = ({
  resourceType,
  title,
  message,
  showDashboardButton = true,
}: DeletedResourceNoticeProps) => {
  const navigate = useNavigate();

  // 기본 메시지 설정
  const defaultTitle =
    resourceType === "group"
      ? "채용 그룹을 찾을 수 없습니다"
      : "지원자를 찾을 수 없습니다";

  const defaultMessage =
    resourceType === "group"
      ? "이 채용 그룹은 삭제되었거나 존재하지 않습니다."
      : "이 지원자는 삭제되었거나 속한 채용 그룹이 삭제되었습니다.";

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-[500px] px-4">
      <div className="max-w-md w-full">
        {/* 아이콘 */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center">
            <MdInfoOutline className="w-12 h-12 text-neutral-400" />
          </div>
        </div>

        {/* 제목 */}
        <h2 className="text-2xl font-bold text-center text-neutral-800 mb-3">
          {title || defaultTitle}
        </h2>

        {/* 설명 */}
        <p className="text-center text-neutral-600 mb-8">
          {message || defaultMessage}
        </p>

        {/* 상세 설명 */}
        <div className="bg-neutral-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-neutral-700 leading-relaxed">
            {resourceType === "group" ? (
              <>
                이 페이지에 접근하신 이유는 다음과 같을 수 있습니다:
                <ul className="list-disc list-inside mt-2 space-y-1 text-neutral-600">
                  <li>채용 그룹이 삭제되었습니다</li>
                  <li>잘못된 링크를 통해 접근하셨습니다</li>
                  <li>권한이 없는 그룹입니다</li>
                </ul>
              </>
            ) : (
              <>
                이 페이지에 접근하신 이유는 다음과 같을 수 있습니다:
                <ul className="list-disc list-inside mt-2 space-y-1 text-neutral-600">
                  <li>지원자가 삭제되었습니다</li>
                  <li>속한 채용 그룹이 삭제되었습니다</li>
                  <li>잘못된 링크를 통해 접근하셨습니다</li>
                </ul>
              </>
            )}
          </p>
        </div>

        {/* 액션 버튼 */}
        {showDashboardButton && (
          <button
            onClick={handleDashboard}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            <MdDashboard className="w-5 h-5" />
            <span>대시보드로 이동</span>
          </button>
        )}
      </div>
    </div>
  );
};
