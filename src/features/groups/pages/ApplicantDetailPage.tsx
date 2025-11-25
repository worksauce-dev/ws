import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { useGroupDetail } from "../hooks/useGroupDetail";

export const ApplicantDetailPage = () => {
  const { groupId, applicantId } = useParams<{
    groupId: string;
    applicantId: string;
  }>();
  const navigate = useNavigate();

  // 그룹 상세 정보 조회 (지원자 데이터 포함)
  const { data, isLoading, isError, error } = useGroupDetail(groupId || "");

  // 현재 지원자 찾기
  const currentApplicant = data?.applicants?.find(
    a => a.id === applicantId
  );

  const handleBackClick = () => {
    navigate(`/dashboard/groups/${groupId}`);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <DashboardLayout title="로딩 중..." description="">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-neutral-600 text-lg">
              지원자 정보를 불러오는 중...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // 에러 상태
  if (isError || !data?.group || !currentApplicant) {
    return (
      <DashboardLayout title="오류" description="">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-error text-lg mb-4">
              {error?.message || "지원자를 찾을 수 없습니다."}
            </p>
            <button
              onClick={handleBackClick}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
            >
              그룹 페이지로 돌아가기
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={currentApplicant.name}
      description={currentApplicant.email}
      showBackButton={true}
      onBackClick={handleBackClick}
      breadcrumbs={[
        { label: "대시보드", href: "/dashboard" },
        { label: data.group.name, href: `/dashboard/groups/${groupId}` },
        { label: currentApplicant.name },
      ]}
    >
      <div className="space-y-6">
        {/* 기본 정보 카드 */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <h2 className="text-xl font-semibold mb-4 text-neutral-800">
            기본 정보
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-600 mb-1">이름</p>
              <p className="text-base font-medium text-neutral-800">
                {currentApplicant.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 mb-1">이메일</p>
              <p className="text-base font-medium text-neutral-800">
                {currentApplicant.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 mb-1">테스트 상태</p>
              <p className="text-base font-medium text-neutral-800">
                {currentApplicant.test_status}
              </p>
            </div>
          </div>
        </div>

        {/* 테스트 결과 카드 (테스트 완료 시) */}
        {currentApplicant.test_result && (
          <div className="bg-white rounded-xl p-6 border border-neutral-200">
            <h2 className="text-xl font-semibold mb-4 text-neutral-800">
              테스트 결과
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">주 직무 유형</p>
                <p className="text-lg font-bold text-primary">
                  {currentApplicant.test_result.primaryWorkType}
                </p>
              </div>
              {/* 추가 분석 내용은 여기에 구현 */}
            </div>
          </div>
        )}

        {/* 테스트 미완료 안내 */}
        {!currentApplicant.test_result && (
          <div className="bg-neutral-50 rounded-xl p-8 border border-neutral-200 text-center">
            <p className="text-neutral-600">
              아직 테스트를 완료하지 않은 지원자입니다.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
