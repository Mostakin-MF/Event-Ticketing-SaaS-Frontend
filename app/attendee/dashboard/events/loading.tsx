export default function EventsLoading() {
  return (
    <div className="space-y-8 animate-pulse pb-20">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-9 bg-slate-800 rounded-lg w-64"></div>
          <div className="h-4 bg-slate-800 rounded w-80"></div>
        </div>
        <div className="h-12 bg-slate-800 rounded-xl w-full md:w-80"></div>
      </div>

      {/* Event Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col">
            {/* Image */}
            <div className="h-48 bg-slate-200"></div>
            
            {/* Card Content */}
            <div className="p-6 flex-1 flex flex-col space-y-4">
              {/* Badge & Title */}
              <div className="space-y-3">
                <div className="h-3 bg-slate-200 rounded w-20"></div>
                <div className="h-6 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
              
              {/* Details */}
              <div className="mt-auto space-y-2 pt-4 border-t border-slate-100">
                <div className="h-4 bg-slate-200 rounded w-32"></div>
                <div className="h-4 bg-slate-200 rounded w-40"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
