import { useAuth } from "@/shared/contexts/useAuth";
import { Button } from "@/shared/components/ui/Button";
import toast from "react-hot-toast";

export const DashboardPage = () => {
  const { userProfile, signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("로그아웃에 실패했습니다");
    } else {
      toast.success("로그아웃되었습니다");
    }
  };

  return (
    <div className="page-layout">
      <header className="bg-white border-b border-neutral-200">
        <div className="container">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="heading-3 text-primary-600">워크소스</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="body-small font-medium text-neutral-900">
                  {userProfile?.name}
                </p>
                <p className="caption text-neutral-600">
                  크레딧: {userProfile?.credits || 0}
                </p>
              </div>

              <Button variant="ghost" onClick={handleSignOut}>
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="page-content">
        <div className="max-w-4xl mx-auto">
          {/* 환영 메시지 */}
          <div className="card mb-8">
            <h2 className="heading-2 text-neutral-900 mb-2">
              안녕하세요, {userProfile?.name}님! 👋
            </h2>
            <p className="body-base text-neutral-600">
              워크소스를 통해 더 나은 채용 결정을 내려보세요. 소스테스트를
              활용한 직무 적합성 분석으로 최적의 인재를 찾아드립니다.
            </p>
          </div>

          {/* 빠른 시작 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="card hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h3 className="heading-4 ml-3">후보자 초대</h3>
              </div>
              <p className="body-small text-neutral-600 mb-4">
                새로운 지원자에게 소스테스트를 발송하세요
              </p>
              <Button className="w-full" disabled>
                초대하기 (준비중)
              </Button>
            </div>

            <div className="card hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-secondary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="heading-4 ml-3">분석 결과</h3>
              </div>
              <p className="body-small text-neutral-600 mb-4">
                완료된 테스트 결과와 적합성 분석을 확인하세요
              </p>
              <Button variant="secondary" className="w-full" disabled>
                결과 보기 (준비중)
              </Button>
            </div>

            <div className="card hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-warning-bg rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-warning"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h3 className="heading-4 ml-3">크레딧 충전</h3>
              </div>
              <p className="body-small text-neutral-600 mb-4">
                테스트 발송을 위한 크레딧을 충전하세요
              </p>
              <Button variant="ghost" className="w-full" disabled>
                충전하기 (준비중)
              </Button>
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="card">
            <h3 className="heading-3 text-neutral-900 mb-4">최근 활동</h3>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h4 className="heading-4 text-neutral-600 mb-2">
                아직 활동이 없습니다
              </h4>
              <p className="body-small text-neutral-500">
                첫 번째 후보자를 초대하여 시작해보세요!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
