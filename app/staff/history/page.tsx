'use client';

import React, { useEffect, useState } from 'react';
import { History, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface ScanLog {
    id: string;
    timestamp: number;
    status: 'success' | 'warning' | 'error';
    message: string;
    detail?: string;
}

export default function HistoryPage() {
  const [logs, setLogs] = useState<ScanLog[]>([]);

  useEffect(() => {
    // Load logs from local storage
    const storedLogs = localStorage.getItem('staff_scan_history');
    if (storedLogs) {
        try {
            setLogs(JSON.parse(storedLogs));
        } catch (e) {
            console.error("Failed to parse history", e);
        }
    }
  }, []);

  const clearHistory = () => {
      localStorage.removeItem('staff_scan_history');
      setLogs([]);
  };

  const getIcon = (status: string) => {
      switch (status) {
          case 'success': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
          case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
          case 'error': return <XCircle className="w-5 h-5 text-rose-500" />;
          default: return <Clock className="w-5 h-5 text-slate-400" />;
      }
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">History</h1>
            <p className="text-slate-500 mt-1">Local device scan log.</p>
        </div>
        {logs.length > 0 && (
            <button onClick={clearHistory} className="text-xs font-bold text-rose-500 hover:bg-rose-50 px-3 py-2 rounded-full transition-colors">
                Clear
            </button>
        )}
      </header>

      <div className="space-y-4">
        {logs.length === 0 ? (
            <div className="text-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No scans recorded on this device yet.</p>
                <p className="text-xs text-slate-300 mt-2">History clears when you clear browser cache.</p>
            </div>
        ) : (
            logs.map((log) => (
                <div key={log.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm items-start">
                    <div className="mt-1">
                        {getIcon(log.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                             <p className="font-bold text-slate-800 truncate pr-2">{log.message}</p>
                             <span className="text-xs text-slate-400 font-mono whitespace-nowrap">
                                 {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                        </div>
                        {log.detail && (
                            <p className="text-sm text-slate-500 mt-0.5 truncate">{log.detail}</p>
                        )}
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}
