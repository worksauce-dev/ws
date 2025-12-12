-- Mini Test 설문조사 테이블 생성
-- 사용자의 테스트 결과에 대한 피드백과 만족도를 수집합니다.

CREATE TABLE IF NOT EXISTS mini_test_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  age_range TEXT NOT NULL,
  q1 INTEGER NOT NULL CHECK (q1 >= 1 AND q1 <= 5),
  q2 INTEGER NOT NULL CHECK (q2 >= 1 AND q2 <= 5),
  q3 INTEGER NOT NULL CHECK (q3 >= 1 AND q3 <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스 추가 (이메일과 생성일자 기준 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_mini_test_surveys_email ON mini_test_surveys(email);
CREATE INDEX IF NOT EXISTS idx_mini_test_surveys_created_at ON mini_test_surveys(created_at DESC);

-- RLS (Row Level Security) 활성화
ALTER TABLE mini_test_surveys ENABLE ROW LEVEL SECURITY;

-- 정책: 누구나 설문 제출 가능 (INSERT)
CREATE POLICY "Anyone can insert surveys"
ON mini_test_surveys
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 정책: 인증된 사용자는 모든 설문 조회 가능 (관리자용)
CREATE POLICY "Authenticated users can view all surveys"
ON mini_test_surveys
FOR SELECT
TO authenticated
USING (true);

-- 코멘트 추가
COMMENT ON TABLE mini_test_surveys IS '미니 테스트 설문조사 응답 데이터';
COMMENT ON COLUMN mini_test_surveys.email IS '응답자 이메일 (기프티콘 발송용)';
COMMENT ON COLUMN mini_test_surveys.age_range IS '응답자 연령대 (10대, 20대, 30대, 40대, 50대 이상)';
COMMENT ON COLUMN mini_test_surveys.q1 IS '결과가 일하는 모습/성향 반영 정도 (1-5점)';
COMMENT ON COLUMN mini_test_surveys.q2 IS '조직관리/채용 시 참고 의향 (1-5점)';
COMMENT ON COLUMN mini_test_surveys.q3 IS '팀워크/소통 도움 가능성 (1-5점)';
COMMENT ON COLUMN mini_test_surveys.feedback IS '자유 의견 (선택사항)';
