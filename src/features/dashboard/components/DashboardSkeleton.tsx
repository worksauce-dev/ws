import { DashboardLayout } from "@/shared/layouts/DashboardLayout";

const DashboardSkeleton = () => {
  return (
    <DashboardLayout
      title="대시보드"
      description="데이터를 불러오는 중입니다..."
      breadcrumbs={[{ label: "워크소스", href: "/" }, { label: "대시보드" }]}
      creditsLoading={true}
      actions={
        <div className="h-[52px] w-32 bg-neutral-200 rounded-lg animate-pulse" />
      }
    >
      {/* Search and Filter Bar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 h-12 bg-neutral-200 rounded-lg animate-pulse" />
        <div className="flex gap-2">
          <div className="h-12 w-36 bg-neutral-200 rounded-lg animate-pulse" />
          <div className="hidden md:block h-12 w-44 bg-neutral-200 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Summary Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 border border-neutral-200"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg mr-4 bg-neutral-200 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse mb-2" />
                <div className="h-8 w-12 bg-neutral-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Groups Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 border border-neutral-200"
          >
            {/* Header Skeleton */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-6 flex-1 bg-neutral-200 rounded animate-pulse" />
                <div className="h-6 w-16 bg-neutral-200 rounded animate-pulse" />
              </div>
              <div className="h-4 w-full bg-neutral-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-3/4 bg-neutral-200 rounded animate-pulse" />
            </div>

            {/* Progress Skeleton */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
                <div className="h-4 w-10 bg-neutral-200 rounded animate-pulse" />
              </div>
              <div className="w-full h-2 bg-neutral-200 rounded-full animate-pulse" />
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 rounded-lg bg-neutral-50">
                <div className="h-8 w-12 mx-auto bg-neutral-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-16 mx-auto bg-neutral-200 rounded animate-pulse" />
              </div>
              <div className="text-center p-3 rounded-lg bg-neutral-50">
                <div className="h-8 w-12 mx-auto bg-neutral-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-16 mx-auto bg-neutral-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Footer Skeleton */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <div className="h-3 w-32 bg-neutral-200 rounded animate-pulse" />
              <div className="h-4 w-4 bg-neutral-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="h-10 w-16 bg-neutral-200 rounded-lg animate-pulse" />
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-10 w-10 bg-neutral-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
        <div className="h-10 w-16 bg-neutral-200 rounded-lg animate-pulse" />
      </div>
    </DashboardLayout>
  );
};

export default DashboardSkeleton;
