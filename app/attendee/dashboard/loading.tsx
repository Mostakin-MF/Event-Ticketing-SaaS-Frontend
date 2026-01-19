export default function AttendeeDashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse pb-20">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-slate-800 rounded-lg w-64"></div>
        <div className="h-4 bg-slate-800 rounded w-96"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-800/50 rounded-2xl p-6 space-y-3">
            <div className="h-4 bg-slate-700 rounded w-24"></div>
            <div className="h-10 bg-slate-700 rounded w-32"></div>
            <div className="h-3 bg-slate-700 rounded w-20"></div>
          </div>
        ))}
      </div>

      {/* Content Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-slate-800/50 rounded-2xl p-6 space-y-4">
            <div className="h-6 bg-slate-700 rounded w-40"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-700 rounded w-full"></div>
              <div className="h-4 bg-slate-700 rounded w-5/6"></div>
              <div className="h-4 bg-slate-700 rounded w-4/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
