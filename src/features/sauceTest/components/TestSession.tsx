import { useState, useEffect } from "react";
import { VerbTest } from "./verbTest/VerbTest";
import StatementTest from "./statementTest/StatementTest";
import type { Applicant } from "../types/test";
import type { VerbCategory } from "../types/verbTest.types";

interface TestSessionProps {
  applicant: Applicant;
  testId: string;
}

// 동사 테스트 결과 타입
export interface VerbTestResult {
  selectionHistory: Record<VerbCategory, string[]>;
}

export const TestSession = ({ applicant, testId }: TestSessionProps) => {
  const [currentTest, setCurrentTest] = useState<"verb" | "statement">("verb");
  const [verbTestResult, setVerbTestResult] = useState<VerbTestResult | null>(
    null
  );

  // 컴포넌트 마운트 시 로컬스토리지에서 전체 상태 복원 (개발 모드 전용)
  useEffect(() => {
    if (import.meta.env.VITE_ENV !== "Production") {
      const savedSession = localStorage.getItem("testSession_full");
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          console.log("저장된 세션 발견:", parsed);
          // 필요시 여기서 상태 복원 가능
          // setCurrentTest(parsed.currentTest);
          // setVerbTestResult(parsed.verbTestResult);
        } catch (error) {
          console.error("저장된 세션 복원 실패:", error);
        }
      }
    }
  }, []);

  // 동사 테스트 완료 핸들러
  const handleVerbTestComplete = (result: VerbTestResult) => {
    console.log("VerbTest completed with result:", result);
    setVerbTestResult(result);
    setCurrentTest("statement");

    // 개발 모드: VerbTest 결과 자동 저장
    if (import.meta.env.VITE_ENV !== "Production") {
      const sessionData = {
        currentTest: "statement",
        verbTestResult: result,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("testSession_full", JSON.stringify(sessionData));
      console.log("VerbTest 결과 자동 저장됨:", sessionData);
    }
  };

  // 전체 테스트 리셋 (개발 모드 전용)
  const handleReset = () => {
    setCurrentTest("verb");
    setVerbTestResult(null);
    localStorage.removeItem("testSession_full");
    localStorage.removeItem("statementTest_progress");
    console.log("로컬스토리지 초기화됨");
  };

  // 동사 테스트 중
  if (currentTest === "verb") {
    return (
      <VerbTest applicant={applicant} onComplete={handleVerbTestComplete} />
    );
  }

  // 문항 테스트
  return <StatementTest onReset={handleReset} />;
};
