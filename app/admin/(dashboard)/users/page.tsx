'use client';

import React, { useEffect, useState } from 'react';
import {
    Users, Shield, Search, Plus, Mail,
    Building2, Edit2, Trash2, MoreVertical,
    Zap, Filter, UserCheck, UserX, Crown
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';

export default function UsersPage() {
    const [activeTab, setActiveTab] = useState<'all' | 'platform_admin' | 'tenant_admin' | 'staff'>('all');
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    useEffect(() => {
        fetchUsers();
    }, [activeTab, searchTerm]);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            let response;
            if (activeTab === 'tenant_admin' || activeTab === 'staff') {
                response = await adminService.getAllTenantUsers({
                    role: activeTab === 'tenant_admin' ? 'TenantAdmin' : 'staff',
                    search: searchTerm
                });
                setUsers(response.data.map((tu: any) => ({
                    id: tu.id,
                    fullName: tu.user.fullName,
                    email: tu.user.email,
                    role: activeTab === 'tenant_admin' ? 'Tenant Admin' : 'Staff',
                    tenantName: tu.tenant.name,
                    status: tu.status,
                    createdAt: tu.createdAt
                })));
            } else {
                const query: any = { search: searchTerm };
                if (activeTab === 'platform_admin') {
                    query.isPlatformAdmin = true;
                }
                response = await adminService.getAllUsers(query);
                setUsers(response.data.map((u: any) => ({
                    id: u.id,
                    fullName: u.fullName,
                    email: u.email,
                    role: u.isPlatformAdmin ? 'Platform Admin' : 'User',
                    status: 'active',
                    createdAt: u.createdAt
                })));
            }
        } catch (error: any) {
            if (error?.response?.status === 403) {
                setError('PERMISSION_DENIED: PLATFORM_ADMIN_ONLY');
            } else {
                console.error("Failed to fetch users", error);
                setError('IO_CONNECTION_FAILED: DATA_RETRIEVAL_ERROR');
            }
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user: any) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleDeleteClick = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            await adminService.deleteUser(userId);
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user', error);
            alert('Failed to delete user');
        }
    };

    // Calculate stats
    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'Platform Admin').length,
        tenantAdmins: users.filter(u => u.role === 'Tenant Admin').length,
        staff: users.filter(u => u.role === 'Staff').length,
        regular: users.filter(u => u.role === 'User').length,
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">

            {/* COMPACT IDENTITY HEADER */}
            <div className="bg-[#022c22] rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Users size={32} />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-widest border border-emerald-500/30">
                            <Shield size={10} fill="currentColor" /> Authorization Hub
                        </div>
                        <h1 className="text-2xl font-black tracking-tight leading-none uppercase">Identity Matrix</h1>
                        <p className="text-emerald-100/60 text-xs font-medium max-w-xl mx-auto md:mx-0">
                            Platform-wide user management. Governing hierarchies, access vectors, and administrative provisioning.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-3 bg-white text-slate-900 px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all hover:-translate-y-1 active:scale-95 group"
                        >
                            <Plus size={16} className="text-emerald-600 group-hover:rotate-90 transition-transform" />
                            Add Identity
                        </button>
                    </div>
                </div>
            </div>

            {/* PERFORMANCE GRID - STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
                <CompactStatCard label="Total Identities" value={stats.total} icon={Users} color="emerald" />
                <CompactStatCard label="Platform Admins" value={stats.admins} icon={Crown} color="slate" />
                <CompactStatCard label="Tenant Executives" value={stats.tenantAdmins} icon={Building2} color="teal" />
                <CompactStatCard label="Org Personnel" value={stats.staff} icon={Filter} color="emerald" />
                <CompactStatCard label="End Users" value={stats.regular} icon={Zap} color="emerald" />
            </div>

            {/* FILTER & SEARCH HUB */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-4 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    {/* Compact Tabs */}
                    <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100 w-full md:w-auto overflow-x-auto no-scrollbar">
                        <ModernTabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')} label="All Users" />
                        <ModernTabButton active={activeTab === 'platform_admin'} onClick={() => setActiveTab('platform_admin')} label="Platform Admins" />
                        <ModernTabButton active={activeTab === 'tenant_admin'} onClick={() => setActiveTab('tenant_admin')} label="Tenant Admins" />
                        <ModernTabButton active={activeTab === 'staff'} onClick={() => setActiveTab('staff')} label="Staff" />
                    </div>

                    {/* Integrated Search */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Scan identities by name, email or vector ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-50 rounded-[2rem] text-[13px] font-bold focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-300"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <div className="h-4 w-px bg-slate-200"></div>
                            <Filter size={14} className="text-slate-300" />
                        </div>
                    </div>
                </div>
            </div>

            {/* IDENTITY MATRIX TABLE */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-[#022c22]"></div>

                {error && (
                    <div className="px-8 py-5 bg-red-50 border-b border-red-100 flex items-center gap-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                            <Shield size={18} />
                        </div>
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-red-700">{error}</p>
                            <p className="text-[10px] text-red-600 font-medium">Please verify your credentials and ensure you have high-level platform authority.</p>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 bg-slate-50/50">
                                <th className="px-8 py-5 text-left">Identity</th>
                                <th className="px-8 py-5 text-left">Classification</th>
                                {(activeTab === 'tenant_admin' || activeTab === 'staff') && <th className="px-8 py-5 text-left">Organization</th>}
                                <th className="px-8 py-5 text-left">Session State</th>
                                <th className="px-8 py-5 text-left">Provisioned</th>
                                <th className="px-8 py-5 text-right">Directives</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} activeTab={activeTab} />)
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-2xl bg-white border border-slate-100 text-emerald-600 flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-110 transition-transform">
                                                    {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 text-sm">{user.fullName || 'Unknown'}</div>
                                                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                                                        <Mail size={12} strokeWidth={2.5} />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <RoleBadge role={user.role} />
                                        </td>
                                        {(activeTab === 'tenant_admin' || activeTab === 'staff') && (
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                                                    <Building2 size={14} className="text-slate-300" />
                                                    {user.tenantName}
                                                </div>
                                            </td>
                                        )}
                                        <td className="px-8 py-6">
                                            <StatusBadge status={user.status} />
                                        </td>
                                        <td className="px-8 py-6 text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
                                            {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="p-2.5 rounded-xl hover:bg-emerald-50 text-slate-300 hover:text-emerald-600 transition-all"
                                                    title="Modify Identity"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(user.id)}
                                                    className="p-2.5 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-600 transition-all"
                                                    title="Purge Identity"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={(activeTab === 'tenant_admin' || activeTab === 'staff') ? 6 : 5} className="px-8 py-20 text-center">
                                        <div className="text-[11px] font-black uppercase text-slate-400 tracking-widest italic">Zero Identities Detected within current scope</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <CreateUserModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={fetchUsers}
            />
            <EditUserModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSuccess={fetchUsers}
                user={selectedUser}
            />
        </div>
    );
}

// COMPACT COMPONENTS

function CompactStatCard({ label, value, icon: Icon, color }: any) {
    const config: any = {
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        teal: "bg-teal-50 text-teal-600 border-teal-100",
        slate: "bg-slate-900 text-white border-slate-800 shadow-xl shadow-slate-900/10",
    };

    return (
        <div className={`rounded-[2rem] p-6 border ${config[color] || config.emerald} group transition-all hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-2xl ${color === 'slate' ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></div>
            </div>
            <div className="text-2xl font-black tracking-tight mb-0.5">{value}</div>
            <div className={`text-[9px] font-black uppercase tracking-[0.2em] ${color === 'slate' ? 'text-slate-400' : 'text-slate-500'}`}>{label}</div>
        </div>
    );
}

function ModernTabButton({ active, onClick, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${active
                ? 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-400 hover:text-emerald-600 hover:bg-white transition-colors'
                }`}
        >
            {label}
        </button>
    );
}

function RoleBadge({ role }: { role: string }) {
    if (role === 'Platform Admin') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-purple-50 text-purple-600 border border-purple-100">
                <Crown size={12} fill="currentColor" /> Platform
            </span>
        );
    }
    if (role === 'Tenant Admin') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">
                <Building2 size={12} /> Executive
            </span>
        );
    }
    if (role === 'Staff') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
                <Users size={12} /> Personnel
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-50 text-slate-500 border border-slate-100">
            End User
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        active: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        inactive: 'text-slate-400 bg-slate-50 border-slate-100',
        suspended: 'text-red-600 bg-red-50 border-red-100',
    };
    const style = styles[status?.toLowerCase()] || styles.active;

    return (
        <span className={`inline-flex items-center px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${style}`}>
            <span className="w-1.5 h-1.5 rounded-full mr-2 bg-current shadow-[0_0_8px_currentColor]"></span>
            {status || 'Active'}
        </span>
    );
}

function SkeletonRow({ activeTab }: any) {
    return (
        <tr className="animate-pulse">
            <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-slate-50"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-slate-50 rounded"></div>
                        <div className="h-3 w-48 bg-slate-50 rounded"></div>
                    </div>
                </div>
            </td>
            <td className="px-8 py-6"><div className="h-6 w-24 bg-slate-50 rounded-full"></div></td>
            {(activeTab === 'tenant_admin' || activeTab === 'staff') && <td className="px-8 py-6"><div className="h-4 w-32 bg-slate-50 rounded"></div></td>}
            <td className="px-8 py-6"><div className="h-6 w-20 bg-slate-50 rounded-full"></div></td>
            <td className="px-8 py-6"><div className="h-3 w-16 bg-slate-50 rounded"></div></td>
            <td className="px-8 py-6"><div className="h-10 w-20 bg-slate-50 rounded ml-auto"></div></td>
        </tr>
    );
}
