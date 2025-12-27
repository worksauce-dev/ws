# Supabase Database Migrations

이 디렉토리에는 Supabase 데이터베이스에 적용해야 할 SQL 마이그레이션 파일들이 포함되어 있습니다.

## 📋 마이그레이션 파일 목록

### 1. `team_member_test_notification_trigger.sql`
**목적**: 팀원이 소스테스트를 완료하면 팀 소유자에게 자동으로 알림을 생성합니다.

**기능**:
- `team_members` 테이블의 `test_status`가 `completed`로 변경될 때 트리거 실행
- 해당 팀의 소유자(`user_id`)를 조회
- `notifications` 테이블에 새 알림 생성
- Realtime 구독을 통해 실시간으로 알림 전달

**알림 내용**:
- **제목**: "팀원 테스트 완료"
- **메시지**: "{팀원 이름}님이 소스테스트를 완료했습니다."
- **타입**: `team_member_test_completed`
- **데이터**: `team_id`, `team_name`, `team_member_id`, `team_member_name`

---

### 2. `remove_current_team_composition_from_groups.sql`
**목적**: `groups` 테이블에서 불필요한 `current_team_composition` 컬럼을 제거합니다.

**배경**:
- 기존에는 그룹 생성 시 팀을 선택하여 `current_team_composition`에 저장
- 이 방식은 한 그룹당 하나의 팀만 비교 가능한 비효율적인 구조
- 개선: 지원자 상세 페이지에서 여러 팀을 자유롭게 선택하여 비교 가능

**변경사항**:
- `groups` 테이블에서 `current_team_composition` JSONB 컬럼 제거
- 팀 적합도 분석은 `ApplicantDetailPage`에서 팀 선택 드롭다운으로 처리
- 더 유연하고 직관적인 UX 제공

**실행 방법**:
```sql
ALTER TABLE groups DROP COLUMN IF EXISTS current_team_composition;
```

---

## 🚀 설치 방법

### Supabase Dashboard에서 실행

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. 왼쪽 사이드바에서 **SQL Editor** 클릭
4. **New Query** 버튼 클릭
5. 마이그레이션 파일 내용을 복사하여 붙여넣기
6. **Run** 버튼 클릭하여 실행

### Supabase CLI에서 실행 (선택사항)

```bash
# 1. Supabase CLI 설치 (아직 안했다면)
npm install -g supabase

# 2. 프로젝트 링크
supabase link --project-ref your-project-ref

# 3. 마이그레이션 실행
supabase db push
```

---

## ✅ 테스트 방법

### 1. 트리거 설치 확인

```sql
-- 트리거가 생성되었는지 확인
SELECT
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_team_member_test_completed';
```

예상 결과:
```
trigger_name                    | event_manipulation | event_object_table
--------------------------------|--------------------|---------------------
on_team_member_test_completed   | UPDATE             | team_members
```

### 2. 알림 생성 테스트

팀원이 실제로 소스테스트를 완료하면:

1. ✅ `team_members` 테이블의 `test_status`가 `completed`로 업데이트
2. ✅ 트리거 자동 실행
3. ✅ `notifications` 테이블에 새 레코드 생성
4. ✅ Realtime 구독을 통해 프론트엔드에 즉시 전달
5. ✅ 토스트 알림 표시 + 알림벨 카운트 업데이트

### 3. 수동 테스트 (개발용)

```sql
-- 테스트용 팀원 test_status를 completed로 변경
UPDATE team_members
SET test_status = 'completed'
WHERE id = 'your-team-member-id';

-- 알림이 생성되었는지 확인
SELECT * FROM notifications
WHERE type = 'team_member_test_completed'
ORDER BY created_at DESC
LIMIT 5;
```

---

## 🔧 문제 해결

### 트리거가 실행되지 않는 경우

1. **RLS 정책 확인**: `notifications` 테이블에 INSERT 권한이 있는지 확인
   ```sql
   -- notifications 테이블의 RLS 정책 확인
   SELECT * FROM pg_policies WHERE tablename = 'notifications';
   ```

2. **함수 권한 확인**: `SECURITY DEFINER`로 설정되어 있어야 함
   ```sql
   -- 함수 정보 확인
   SELECT
     proname,
     prosecdef
   FROM pg_proc
   WHERE proname = 'notify_team_member_test_completed';
   ```

3. **로그 확인**: Supabase Dashboard의 Logs 탭에서 에러 확인

### 알림이 실시간으로 표시되지 않는 경우

1. **Realtime 활성화 확인**:
   - Supabase Dashboard → Database → Replication
   - `notifications` 테이블이 Realtime 활성화 되어 있는지 확인

2. **프론트엔드 구독 확인**:
   - 브라우저 콘솔에서 `🔔 Setting up notification subscription` 로그 확인
   - `useNotifications` 훅이 제대로 마운트되었는지 확인

---

## 📝 참고사항

- 이 트리거는 **team_members** 테이블에만 적용됩니다.
- **applicants** 테이블은 별도로 처리됩니다 (기존 시스템).
- 트리거는 `test_status`가 `completed`로 **처음 변경될 때만** 실행됩니다.
- 동일한 팀원이 여러 번 `completed`로 변경되어도 중복 알림이 생성되지 않습니다.

---

## 🗑️ 트리거 삭제 (롤백)

만약 트리거를 제거하고 싶다면:

```sql
-- 트리거 삭제
DROP TRIGGER IF EXISTS on_team_member_test_completed ON team_members;

-- 함수 삭제
DROP FUNCTION IF EXISTS notify_team_member_test_completed();
```
