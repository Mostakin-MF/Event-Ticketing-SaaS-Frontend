export default function AttendeeLoading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Spinner with Glow Effect */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 border-4 border-emerald-900/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin shadow-lg shadow-emerald-500/50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Loading TicketBD</p>
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
