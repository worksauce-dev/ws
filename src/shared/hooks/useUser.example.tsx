/**
 * useUser 훅 사용 예제
 *
 * 이 파일은 useUser 훅의 다양한 사용 방법을 보여줍니다.
 */

import { useUser } from "./useUser";

// ============================================================================
// 예제 1: 기본 사용
// ============================================================================

export const UserGreeting = () => {
  const { userName, isLoading } = useUser();

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return <h1>안녕하세요, {userName}님!</h1>;
};

// ============================================================================
// 예제 2: 관리자 권한 체크
// ============================================================================

export const AdminPanel = () => {
  const { isAdmin, userName } = useUser();

  if (!isAdmin) {
    return <div>관리자 권한이 필요합니다.</div>;
  }

  return (
    <div>
      <h1>관리자 패널</h1>
      <p>환영합니다, {userName} 관리자님</p>
    </div>
  );
};

// ============================================================================
// 예제 3: 기업 회원 여부 확인
// ============================================================================

export const EmailSenderInfo = () => {
  const { isBusinessVerified, businessName, userName } = useUser();

  const senderName = isBusinessVerified && businessName ? businessName : userName;

  return (
    <div>
      <p>발신자: {senderName}</p>
      {isBusinessVerified && <span className="badge">인증된 기업</span>}
    </div>
  );
};

// ============================================================================
// 예제 4: 크레딧 시스템
// ============================================================================

export const CreditDisplay = () => {
  const { credits, userName } = useUser();

  return (
    <div>
      <p>{userName}님의 크레딧</p>
      <p className="text-2xl font-bold">{credits} 크레딧</p>
      {credits < 10 && (
        <p className="text-warning">크레딧이 부족합니다. 충전해주세요.</p>
      )}
    </div>
  );
};

// ============================================================================
// 예제 5: 조건부 렌더링 (복합)
// ============================================================================

export const UserDashboard = () => {
  const {
    userName,
    userEmail,
    isAdmin,
    isBusinessVerified,
    businessName,
    credits,
    isLoading,
  } = useUser();

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>{userName}님의 대시보드</h1>
      <p>이메일: {userEmail}</p>

      {isBusinessVerified && (
        <div className="business-badge">
          <span>인증된 기업</span>
          <span>{businessName}</span>
        </div>
      )}

      <div className="credits">
        <span>보유 크레딧: {credits}</span>
      </div>

      {isAdmin && (
        <div className="admin-section">
          <h2>관리자 기능</h2>
          <button>사용자 관리</button>
          <button>시스템 설정</button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 예제 6: 프로필 새로고침
// ============================================================================

export const ProfileRefreshButton = () => {
  const { refreshProfile, isLoading } = useUser();

  const handleRefresh = async () => {
    await refreshProfile();
    alert("프로필이 업데이트되었습니다!");
  };

  return (
    <button onClick={handleRefresh} disabled={isLoading}>
      {isLoading ? "새로고침 중..." : "프로필 새로고침"}
    </button>
  );
};

// ============================================================================
// 예제 7: 원본 객체 접근 (고급)
// ============================================================================

export const AdvancedUserInfo = () => {
  const { user, userProfile, userName } = useUser();

  return (
    <div>
      <h2>{userName}님의 상세 정보</h2>

      {/* 기본적으로는 userName 등의 간편한 필드 사용 */}
      <p>이름: {userName}</p>

      {/* 필요한 경우 원본 객체에 직접 접근 */}
      <p>User ID: {user?.id}</p>
      <p>계정 생성일: {user?.created_at}</p>

      {userProfile && (
        <>
          <p>프로필 업데이트: {userProfile.updated_at}</p>
          <p>마지막 로그인: {userProfile.last_login_at}</p>
        </>
      )}
    </div>
  );
};

// ============================================================================
// 예제 8: 인증 상태 확인
// ============================================================================

export const AuthenticationGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!isAuthenticated) {
    return <div>로그인이 필요합니다.</div>;
  }

  return <>{children}</>;
};
