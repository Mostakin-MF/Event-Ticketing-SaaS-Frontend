export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-slate-200 rounded-lg w-64"></div>
        <div className="h-4 bg-slate-200 rounded w-96"></div>
      </div>

      {/* Event Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            {/* Event Image */}
            <div className="h-40 bg-slate-200 rounded-xl"></div>
            
            {/* Event Title */}
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded w-20"></div>
              <div className="h-6 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            </div>

            {/* Event Details */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="h-4 bg-slate-200 rounded w-32"></div>
              <div className="h-4 bg-slate-200 rounded w-40"></div>
            </div>

            {/* Button */}
            <div className="h-10 bg-slate-200 rounded-lg w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
