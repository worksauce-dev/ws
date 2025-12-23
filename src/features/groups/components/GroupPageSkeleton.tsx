export const GroupPageSkeleton = () => {
  return (
    <>
      {/* Summary Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="h-full bg-white rounded-xl p-6 border border-neutral-200"
          >
            <div className="flex items-center h-full">
              <div className="p-3 rounded-lg mr-4 bg-neutral-200 animate-pulse">
                <div className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse mb-2" />
                <div className="h-8 w-20 bg-neutral-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-neutral-200 mb-6 overflow-hidden">
            {/* Tabs and Search Skeleton */}
            <div className="p-6 border-b border-neutral-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-2">
                  <div className="h-10 w-20 bg-neutral-200 rounded-lg animate-pulse" />
                  <div className="h-10 w-20 bg-neutral-200 rounded-lg animate-pulse" />
                </div>
                <div className="h-10 w-48 bg-neutral-200 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Applicant List Skeleton */}
            <div className="divide-y divide-neutral-200">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-6 h-6 bg-neutral-200 rounded animate-pulse" />
                        <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse" />
                        <div className="h-6 w-16 bg-neutral-200 rounded-md animate-pulse" />
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="h-4 w-40 bg-neutral-200 rounded animate-pulse" />
                        <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="h-5 w-20 bg-neutral-200 rounded animate-pulse" />
                        <div className="h-5 w-28 bg-neutral-200 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="lg:col-span-1">
          {/* Group Info Skeleton */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
            <div className="h-6 w-24 bg-neutral-200 rounded animate-pulse mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-neutral-200 rounded animate-pulse mt-0.5" />
                  <div className="flex-1">
                    <div className="h-3 w-16 bg-neutral-200 rounded animate-pulse mb-1" />
                    <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-neutral-100">
                <div className="h-3 w-24 bg-neutral-200 rounded animate-pulse mb-2" />
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-20 bg-neutral-200 rounded-full animate-pulse" />
                  <div className="h-6 w-24 bg-neutral-200 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Work Type Distribution Skeleton */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="h-6 w-40 bg-neutral-200 rounded animate-pulse mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse" />
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div className="h-2 w-3/4 bg-neutral-200 rounded-full animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
