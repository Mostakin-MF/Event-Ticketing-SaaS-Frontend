export default function CheckoutLoading() {
  return (
    <div className="space-y-8 animate-pulse pb-20">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 bg-slate-800 rounded-lg w-48"></div>
        <div className="h-4 bg-slate-800 rounded w-96"></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6">
            <div className="h-6 bg-slate-200 rounded w-48"></div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-24"></div>
                <div className="h-12 bg-slate-200 rounded-xl w-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-24"></div>
                <div className="h-12 bg-slate-200 rounded-xl w-full"></div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6">
            <div className="h-6 bg-slate-200 rounded w-40"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
          </div>

          {/* Discount Code */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4">
            <div className="h-6 bg-slate-200 rounded w-36"></div>
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-slate-200 rounded-xl"></div>
              <div className="h-12 bg-slate-200 rounded-xl w-24"></div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6 sticky top-4">
            <div className="h-6 bg-slate-200 rounded w-32"></div>
            
            {/* Items */}
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-5 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-6 bg-slate-200 rounded w-full"></div>
            </div>

            {/* Button */}
            <div className="h-14 bg-slate-200 rounded-xl w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
