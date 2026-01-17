'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';
import { staffService } from '@/services/staffService';
import { authService } from '@/services/authService';

export default function IncidentsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLog, setNewLog] = useState({ type: 'ISSUE', description: '' });
    const [submitting, setSubmitting] = useState(false);
    
    useEffect(() => {
        loadLogs();
    }, []);
  
    const loadLogs = async () => {
        try {
            setLoading(true);
            const res = await staffService.getIncidents();
            // Backend returns { data: [], total: ... }
            if(res.data) setLogs(res.data);
        } catch (e) {
            console.error("Failed to load incidents", e);
        } finally {
            setLoading(false);
        }
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await staffService.reportIncident(newLog);
            setNewLog({ type: 'ISSUE', description: '' });
            setIsModalOpen(false);
            loadLogs();
        } catch (e) {
            console.error("Failed to report incident", e);
        } finally {
            setSubmitting(false);
        }
    };
  
    return (
      <div className="space-y-6 pb-20">
        <header className="flex items-center justify-between">
          <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Incidents</h1>
              <p className="text-slate-500 mt-1">Log & track on-site issues.</p>
          </div>
          <button 
              onClick={() => setIsModalOpen(true)}
              className="btn bg-rose-600 hover:bg-rose-700 text-white border-none rounded-full shadow-lg gap-2"
          >
              <Plus className="w-5 h-5"/> Report
          </button>
        </header>
  
        {/* Log List */}
        <div className="space-y-4">
            {loading ? (
                <div className="text-center py-10"><span className="loading loading-dots text-emerald-500"></span></div>
            ) : logs.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-400">No incidents reported yet.</p>
                </div>
            ) : (
                logs.map((log: any) => (
                    <div key={log.id} className="card bg-white border border-slate-100 shadow-sm p-4 flex-row gap-4 items-start">
                        <div className={`p-3 rounded-full ${log.type?.includes('ISSUE') || log.type?.includes('SECURITY') ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-slate-800">{(() => {
                                            const type = log.type;
                                            if (!type) return 'Unspecified Incident';
                                            if (type === 'ISSUE') return 'General Issue';
                                            if (type === 'SECURITY') return 'Security Alert';
                                            if (type === 'LOST_ITEM') return 'Lost Item';
                                            if (type === 'MEDICAL') return 'Medical Emergency';
                                            return type; 
                                        })()}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                            log.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-600' : 
                                            log.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-600' : 
                                            log.status === 'OPEN' ? 'bg-amber-100 text-amber-600' :
                                            'bg-slate-100 text-slate-500'
                                        }`}>
                                            {log.status || 'PENDING'}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-mono italic">{log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : 'Recently'}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-400 block">Reported by</span>
                                    <span className="text-xs font-bold text-slate-600">{log.actor?.fullName || 'Me'}</span>
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm mt-3 leading-relaxed">{log.description || 'No description provided'}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
  
        {/* Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                    <h2 className="text-xl font-bold mb-4">Report Incident</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">Type</label>
                            <select 
                               className="select select-bordered w-full rounded-xl bg-slate-50 text-slate-900 border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                               value={newLog.type}
                               onChange={(e) => setNewLog({...newLog, type: e.target.value})}
                            >
                                <option value="ISSUE">General Issue</option>
                                <option value="SECURITY">Security Alert</option>
                                <option value="LOST_ITEM">Lost Item</option>
                                <option value="MEDICAL">Medical Emergency</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-500 uppercase">Description</label>
                            <textarea 
                               className="textarea textarea-bordered w-full rounded-xl bg-slate-50 text-slate-900 border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20" 
                               placeholder="Describe what happened..."
                               rows={3}
                               required
                               value={newLog.description}
                               onChange={(e) => setNewLog({...newLog, description: e.target.value})}
                            ></textarea>
                        </div>
                        <div className="modal-action">
                            <button type="button" className="btn btn-ghost rounded-full text-slate-500 hover:bg-slate-100" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="btn bg-rose-600 hover:bg-rose-700 text-white border-none rounded-full px-6" disabled={submitting}>
                                {submitting ? (
                                    <span className="flex items-center gap-2">
                                        <span className="loading loading-spinner loading-xs"></span>
                                        Reporting...
                                    </span>
                                ) : 'Report Incident'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
      </div>
    );
  }
