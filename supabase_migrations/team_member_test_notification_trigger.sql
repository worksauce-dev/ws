/**
 * 팀원 테스트 완료 시 알림 생성 트리거
 *
 * team_members 테이블의 test_status가 'completed'로 변경되면
 * 해당 팀을 생성한 사용자에게 알림을 생성합니다.
 */

-- 트리거 함수 생성
CREATE OR REPLACE FUNCTION notify_team_member_test_completed()
RETURNS TRIGGER AS $$
DECLARE
  team_owner_id UUID;
  team_name_var TEXT;
BEGIN
  -- test_status가 completed로 변경되었을 때만 실행
  IF NEW.test_status = 'completed' AND (OLD.test_status IS NULL OR OLD.test_status != 'completed') THEN

    -- 팀 소유자 ID와 팀 이름 조회
    SELECT user_id, name INTO team_owner_id, team_name_var
    FROM teams
    WHERE id = NEW.team_id;

    -- 팀 소유자에게 알림 생성
    IF team_owner_id IS NOT NULL THEN
      INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        data,
        is_read,
        created_at
      ) VALUES (
        team_owner_id,
        'team_member_test_completed',
        '팀원 테스트 완료',
        NEW.name || '님이 소스테스트를 완료했습니다.',
        jsonb_build_object(
          'team_id', NEW.team_id,
          'team_name', team_name_var,
          'team_member_id', NEW.id,
          'team_member_name', NEW.name
        ),
        false,
        NOW()
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성 (기존 트리거가 있다면 삭제 후 재생성)
DROP TRIGGER IF EXISTS on_team_member_test_completed ON team_members;

CREATE TRIGGER on_team_member_test_completed
  AFTER UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION notify_team_member_test_completed();

-- 권한 설정 (anon 사용자도 team_members 업데이트 가능하도록)
-- 이미 설정되어 있을 수 있지만 명시적으로 추가
COMMENT ON TRIGGER on_team_member_test_completed ON team_members IS
  '팀원이 테스트를 완료하면 팀 소유자에게 알림을 생성합니다.';
