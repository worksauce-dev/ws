# useUser 훅 마이그레이션 가이드

## 개요

`useUser` 훅은 `user.user_metadata`와 `userProfile` 데이터 소스를 통합하여 일관된 인터페이스를 제공합니다.

---

## 주요 이점

✅ **일관된 fallback 로직** - 모든 컴포넌트에서 동일한 우선순위 체인 사용
✅ **타입 안전성** - TypeScript 타입 지원으로 오류 방지
✅ **단일 진입점** - 한 곳에서 모든 사용자 정보 접근
✅ **자동 업데이트** - user_profile 변경 시 Realtime으로 자동 반영
✅ **간편한 API** - 직관적인 필드명으로 빠른 개발

---

## 마이그레이션 가이드

### Before (기존 코드)

```tsx
// ❌ 기존 방식 - 두 훅 사용, fallback 로직 중복
import { useAuth } from "@/shared/contexts/useAuth";
import { useUserProfile } from "@/shared/hooks/useUserProfile";

const MyComponent = () => {
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile(user?.id);

  // fallback 로직 중복
  const displayName =
    userProfile?.name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "사용자";

  const isAdmin = userProfile?.is_admin || false;
  const credits = userProfile?.credits || 0;

  return (
    <div>
      <h1>{displayName}님</h1>
      {isAdmin && <AdminPanel />}
      <p>크레딧: {credits}</p>
    </div>
  );
};
```

### After (개선된 코드)

```tsx
// ✅ 개선된 방식 - 단일 훅, 간결한 코드
import { useUser } from "@/shared/hooks/useUser";

const MyComponent = () => {
  const { userName, isAdmin, credits } = useUser();

  return (
    <div>
      <h1>{userName}님</h1>
      {isAdmin && <AdminPanel />}
      <p>크레딧: {credits}</p>
    </div>
  );
};
```

---

## 필드 매핑표

| 기존 코드 | useUser 훅 | 설명 |
|---------|-----------|------|
| `user?.id` | `userId` | 사용자 ID |
| `userProfile?.name \|\| user?.user_metadata?.name` | `userName` | 사용자 이름 (fallback 자동) |
| `userProfile?.email \|\| user?.email` | `userEmail` | 이메일 (fallback 자동) |
| `userProfile?.is_admin \|\| false` | `isAdmin` | 관리자 여부 |
| `userProfile?.business_verified \|\| false` | `isBusinessVerified` | 기업 인증 여부 |
| `userProfile?.business_name` | `businessName` | 기업명 |
| `userProfile?.credits \|\| 0` | `credits` | 크레딧 |
| `!!user` | `isAuthenticated` | 인증 여부 |
| `loading` | `isLoading` | 로딩 상태 |
| `user` | `user` | 원본 user 객체 |
| `userProfile` | `userProfile` | 원본 userProfile 객체 |

---

## 마이그레이션 우선순위

### 1단계: 핵심 컴포넌트 (즉시)

가장 많이 사용되는 컴포넌트부터 마이그레이션:

- ✅ `DashboardPage` - 대시보드 메인
- ✅ `LandingHeader` - 헤더 (사용자 정보 표시)
- ✅ `CreateGroupPage` - 그룹 생성 (이메일 발송자 이름)
- ✅ `AdminPage` - 관리자 권한 체크

### 2단계: 중요 컴포넌트 (1주일 내)

자주 사용되는 컴포넌트:

- `ProfileSection` - 프로필 설정
- `PreviewTestEmail` - 이메일 미리보기
- `DashboardLayout` - 레이아웃
- `DashboardHeader` - 대시보드 헤더

### 3단계: 나머지 컴포넌트 (점진적)

덜 중요하거나 사용 빈도가 낮은 컴포넌트:

- `groupApi.ts` - API 레이어
- `dashboardGreetings.ts` - 유틸리티

---

## 실전 예제

### 예제 1: 간단한 인사말

```tsx
// Before
const { user, userProfile } = useAuth();
const name = userProfile?.name || user?.user_metadata?.name || "사용자";

return <h1>안녕하세요, {name}님!</h1>;

// After
const { userName } = useUser();

return <h1>안녕하세요, {userName}님!</h1>;
```

### 예제 2: 관리자 체크

```tsx
// Before
const { user } = useAuth();
const { data: userProfile } = useUserProfile(user?.id);
const isAdmin = userProfile?.is_admin || false;

if (!isAdmin) return <div>권한 없음</div>;

// After
const { isAdmin } = useUser();

if (!isAdmin) return <div>권한 없음</div>;
```

### 예제 3: 기업 회원 이메일 발송자

```tsx
// Before
const { user } = useAuth();
const { data: userProfile } = useUserProfile(user?.id);

let senderName = "담당자";
if (userProfile?.business_verified && userProfile?.business_name) {
  senderName = userProfile.business_name;
} else {
  senderName = user?.user_metadata?.name || user?.email?.split("@")[0] || "관리자";
}

// After
const { isBusinessVerified, businessName, userName } = useUser();

const senderName = isBusinessVerified && businessName ? businessName : userName;
```

### 예제 4: 로딩 상태 처리

```tsx
// Before
const { loading: authLoading } = useAuth();
const { isLoading: profileLoading } = useUserProfile(user?.id);

if (authLoading || profileLoading) return <Spinner />;

// After
const { isLoading } = useUser();

if (isLoading) return <Spinner />;
```

---

## 주의사항

### 1. 원본 객체 접근이 필요한 경우

특수한 경우에는 원본 객체에 직접 접근 가능:

```tsx
const { user, userProfile, userName } = useUser();

// 대부분의 경우 userName 사용
<h1>{userName}님</h1>

// 특수한 경우에만 원본 객체 접근
<p>User ID: {user?.id}</p>
<p>Created: {user?.created_at}</p>
```

### 2. useUserProfile 훅과의 차이

- `useUserProfile`: React Query 기반, 5분 캐싱
- `useUser`: AuthContext 기반, Realtime 자동 업데이트

**권장**: 대부분의 경우 `useUser` 사용, 독립적인 데이터 패칭이 필요한 경우에만 `useUserProfile` 사용

### 3. refreshProfile 호출

프로필을 수동으로 새로고침해야 하는 경우:

```tsx
const { refreshProfile } = useUser();

const handleUpdate = async () => {
  // 프로필 업데이트 API 호출
  await updateProfile(...);

  // 수동 새로고침 (보통 불필요 - Realtime이 자동 처리)
  await refreshProfile();
};
```

---

## 체크리스트

마이그레이션 전 확인 사항:

- [ ] `useUser` 훅 임포트 추가
- [ ] 기존 `useAuth`, `useUserProfile` 호출 제거
- [ ] fallback 로직 제거 (useUser가 자동 처리)
- [ ] 타입 에러 확인
- [ ] 로딩 상태 처리 확인
- [ ] 테스트 및 동작 확인

---

## 문제 해결

### Q: 원본 user 객체가 필요한 경우는?

A: `useUser`의 `user`, `userProfile` 필드로 접근 가능합니다.

```tsx
const { user, userProfile, userName } = useUser();
```

### Q: 성능 영향은?

A: 오히려 개선됩니다. 중복 조회가 없고, Realtime 업데이트로 불필요한 리렌더링 방지합니다.

### Q: 기존 코드와 혼용 가능한가?

A: 네, 점진적 마이그레이션 가능합니다. 기존 `useAuth`와 함께 사용해도 문제없습니다.

---

## 추가 리소스

- [useUser.ts](../src/shared/hooks/useUser.ts) - 소스 코드
- [useUser.example.tsx](../src/shared/hooks/useUser.example.tsx) - 사용 예제
- [AuthContext.tsx](../src/shared/contexts/AuthContext.tsx) - AuthContext 구현

---

## 피드백

마이그레이션 중 문제가 발생하거나 개선 사항이 있다면 이슈를 등록해주세요!
