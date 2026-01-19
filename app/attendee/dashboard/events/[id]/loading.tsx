export default function EventDetailsLoading() {
  return (
    <div className="space-y-8 animate-pulse pb-20">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 bg-slate-800 rounded w-48"></div>

      {/* Hero Section Skeleton */}
      <div className="space-y-6">
        {/* Hero Image */}
        <div className="h-96 bg-slate-800 rounded-3xl"></div>
        
        {/* Title & Info */}
        <div className="space-y-4">
          <div className="h-10 bg-slate-800 rounded-lg w-3/4"></div>
          <div className="h-5 bg-slate-800 rounded w-1/2"></div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Event Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4">
            <div className="h-6 bg-slate-200 rounded w-32"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 rounded w-4/6"></div>
            </div>
          </div>

          {/* Event Info */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4">
            <div className="h-6 bg-slate-200 rounded w-40"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                  <div className="h-5 bg-slate-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Ticket Selection */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6 sticky top-4">
            <div className="h-6 bg-slate-200 rounded w-40"></div>
            
            {/* Ticket Types */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-32"></div>
                  <div className="h-6 bg-slate-200 rounded w-24"></div>
                  <div className="h-10 bg-slate-200 rounded w-full"></div>
                </div>
              ))}
            </div>

            {/* Checkout Button */}
            <div className="h-12 bg-slate-200 rounded-xl w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
