/**
 * 그룹 조회 에러 UI 컴포넌트
 */

import { useNavigate } from "react-router-dom";

interface ErrorDisplayProps {
  error: Error;
  onRetry?: () => void;
}

/**
 * 에러 타입 판별 함수
 */
const getErrorType = (error: Error) => {
  const message = error.message.toLowerCase();

  // 인증 에러
  if (
    message.includes("jwt") ||
    message.includes("expired") ||
    message.includes("permission") ||
    message.includes("unauthorized")
  ) {
    return "auth";
  }

  // 네트워크 에러
  if (
    message.includes("fetch") ||
    message.includes("network") ||
    message.includes("connection")
  ) {
    return "network";
  }

  // 타임아웃 에러
  if (message.includes("timeout")) {
    return "timeout";
  }

  // 데이터베이스 에러
  if (
    message.includes("relation") ||
    message.includes("does not exist") ||
    message.includes("column")
  ) {
    return "database";
  }

  // 기타 에러
  return "unknown";
};

/**
 * 통합 에러 컴포넌트
 */
export const GroupsErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  const errorType = getErrorType(error);

  switch (errorType) {
    case "auth":
      return <AuthError onRetry={onRetry} />;
    case "network":
      return <NetworkError onRetry={onRetry} />;
    case "timeout":
      return <TimeoutError onRetry={onRetry} />;
    case "database":
      return <DatabaseError />;
    default:
      return <UnknownError error={error} onRetry={onRetry} />;
  }
};

/**
 * 1. 인증 에러 (로그인 만료)
 */
const AuthError = ({ onRetry }: { onRetry?: () => void }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12 px-4">
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
          <span className="text-3xl">🔒</span>
        </div>
        <h3 className="text-xl font-semibold text-neutral-800 mb-2">
          세션이 만료되었습니다
        </h3>
        <p className="text-neutral-600 mb-6">
          보안을 위해 로그인이 필요합니다.
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={() => navigate("/auth/login")}
          className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
        >
          로그인하기
        </button>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * 2. 네트워크 에러 (연결 문제)
 */
const NetworkError = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <div className="text-center py-12 px-4">
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-3xl">📡</span>
        </div>
        <h3 className="text-xl font-semibold text-neutral-800 mb-2">
          네트워크 연결 오류
        </h3>
        <p className="text-neutral-600 mb-2">인터넷 연결을 확인해주세요.</p>
        <p className="text-sm text-neutral-500">
          Wi-Fi 또는 데이터 연결 상태를 확인하고 다시 시도해주세요.
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
        >
          다시 시도
        </button>
      )}
    </div>
  );
};

/**
 * 3. 타임아웃 에러 (느린 응답)
 */
const TimeoutError = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <div className="text-center py-12 px-4">
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
          <span className="text-3xl">⏱️</span>
        </div>
        <h3 className="text-xl font-semibold text-neutral-800 mb-2">
          응답 시간 초과
        </h3>
        <p className="text-neutral-600 mb-2">서버 응답이 지연되고 있습니다.</p>
        <p className="text-sm text-neutral-500">잠시 후 다시 시도해주세요.</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
        >
          다시 시도
        </button>
      )}
    </div>
  );
};

/**
 * 4. 데이터베이스 에러 (설정 문제)
 */
const DatabaseError = () => {
  return (
    <div className="text-center py-12 px-4">
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-3xl">🗄️</span>
        </div>
        <h3 className="text-xl font-semibold text-neutral-800 mb-2">
          데이터베이스 오류
        </h3>
        <p className="text-neutral-600 mb-2">
          데이터베이스 설정에 문제가 있습니다.
        </p>
        <p className="text-sm text-neutral-500">관리자에게 문의해주세요.</p>
      </div>

      <button
        onClick={() => (window.location.href = "mailto:worksauce@worksauce.kr")}
        className="px-6 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
      >
        지원팀 문의
      </button>
    </div>
  );
};

/**
 * 5. 알 수 없는 에러
 */
const UnknownError = ({ error, onRetry }: ErrorDisplayProps) => {
  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="text-center py-12 px-4">
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-xl font-semibold text-neutral-800 mb-2">
          오류가 발생했습니다
        </h3>
        <p className="text-neutral-600 mb-4">
          일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>

        {/* 개발 환경에서만 에러 메시지 표시 */}
        {isDevelopment && (
          <div className="max-w-md mx-auto mb-6">
            <details className="text-left">
              <summary className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700">
                개발자 정보 (프로덕션에서는 숨겨짐)
              </summary>
              <div className="mt-2 p-4 bg-neutral-50 rounded-lg text-xs text-neutral-700 font-mono overflow-auto">
                <div className="mb-2">
                  <strong>Message:</strong> {error.message}
                </div>
                {error.stack && (
                  <div>
                    <strong>Stack:</strong>
                    <pre className="mt-1 whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            다시 시도
          </button>
        )}
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          페이지 새로고침
        </button>
      </div>
    </div>
  );
};

/**
 * 컴팩트 에러 배너 (인라인용)
 */
export const GroupsErrorBanner = ({ error, onRetry }: ErrorDisplayProps) => {
  const errorType = getErrorType(error);

  const getErrorMessage = () => {
    switch (errorType) {
      case "auth":
        return "로그인이 필요합니다";
      case "network":
        return "네트워크 연결을 확인해주세요";
      case "timeout":
        return "응답 시간이 초과되었습니다";
      case "database":
        return "데이터베이스 오류가 발생했습니다";
      default:
        return "오류가 발생했습니다";
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-red-600 text-xl">⚠️</span>
          <div>
            <p className="text-sm font-medium text-red-800">
              {getErrorMessage()}
            </p>
            <p className="text-xs text-red-600 mt-0.5">{error.message}</p>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
};
