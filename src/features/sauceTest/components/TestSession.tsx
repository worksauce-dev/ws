import { useState, useEffect } from "react";
import { MdSave } from "react-icons/md";
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

const isDev = import.meta.env.VITE_ENV !== "Production";

export const TestSession = ({ applicant, testId }: TestSessionProps) => {
  const [currentTest, setCurrentTest] = useState<"verb" | "statement">("verb");
  const [verbTestResult, setVerbTestResult] = useState<VerbTestResult | null>(
    null
  );
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  // 컴포넌트 마운트 시 로컬스토리지에서 전체 상태 복원 (개발 모드 전용)
  useEffect(() => {
    if (import.meta.env.VITE_ENV !== "Production") {
      const savedSession = localStorage.getItem("testSession_full");
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          console.log("저장된 세션 발견:", parsed);

          // testId가 일치하는 경우에만 상태 복원
          if (parsed.testId === testId) {
            setCurrentTest(parsed.currentTest);
            setVerbTestResult(parsed.verbTestResult);
            console.log("✅ 같은 테스트 세션 복원됨:", testId);
          } else {
            console.log("⚠️ 다른 테스트 세션이므로 복원하지 않음:", {
              saved: parsed.testId,
              current: testId,
            });
            // 다른 테스트의 세션이므로 초기화
            localStorage.removeItem("testSession_full");
          }
        } catch (error) {
          console.error("저장된 세션 복원 실패:", error);
        }
      }
    }
  }, [testId]);

  // 동사 테스트 완료 핸들러
  const handleVerbTestComplete = (result: VerbTestResult) => {
    console.log("VerbTest completed with result:", result);
    setVerbTestResult(result);
    setCurrentTest("statement");

    // 개발 모드: VerbTest 결과 자동 저장
    if (import.meta.env.VITE_ENV !== "Production") {
      const sessionData = {
        testId: testId, // testId 추가
        currentTest: "statement",
        verbTestResult: result,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("testSession_full", JSON.stringify(sessionData));
      console.log("VerbTest 결과 자동 저장됨:", sessionData);
    }
  };

  // 통합 임시 저장 핸들러
  const handleSave = () => {
    if (!isDev) return;

    const sessionData = {
      testId,
      currentTest,
      verbTestResult,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("testSession_full", JSON.stringify(sessionData));
    console.log("💾 테스트 세션 임시 저장:", sessionData);

    // 저장 메시지 표시
    setShowSaveMessage(true);
    setTimeout(() => {
      setShowSaveMessage(false);
    }, 2000);
  };

  // 전체 테스트 리셋 (개발 모드 전용)
  const handleReset = () => {
    setCurrentTest("verb");
    setVerbTestResult(null);
    localStorage.removeItem("testSession_full");
    localStorage.removeItem("statementTest_progress");
    localStorage.removeItem(`verbTest_${testId}`);
    console.log("로컬스토리지 초기화됨 (testId:", testId, ")");
  };

  // 동사 테스트 중
  if (currentTest === "verb") {
    return (
      <>
        {/* 저장 완료 메시지 */}
        {showSaveMessage && (
          <div className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in px-4">
            <div className="bg-success-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-lg flex items-center gap-2">
              <MdSave className="w-5 h-5" />
              <span className="text-sm md:text-base font-medium">
                진행 상황이 저장되었습니다
              </span>
            </div>
          </div>
        )}
        <VerbTest
          applicant={applicant}
          testId={testId}
          onComplete={handleVerbTestComplete}
          onSave={isDev ? handleSave : undefined}
          onReset={isDev ? handleReset : undefined}
        />
      </>
    );
  }

  // 문항 테스트
  return (
    <>
      {/* 저장 완료 메시지 */}
      {showSaveMessage && (
        <div className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in px-4">
          <div className="bg-success-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-lg flex items-center gap-2">
            <MdSave className="w-5 h-5" />
            <span className="text-sm md:text-base font-medium">
              진행 상황이 저장되었습니다
            </span>
          </div>
        </div>
      )}
      <StatementTest
        onSave={isDev ? handleSave : undefined}
        onReset={isDev ? handleReset : undefined}
      />
    </>
  );
};
