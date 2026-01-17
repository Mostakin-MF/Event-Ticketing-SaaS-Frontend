'use client';

import React, { useState } from 'react';
import {
    Settings, Shield, Globe, Bell, Mail,
    CreditCard, Database, Save, RefreshCw,
    Server, Lock, CheckCircle2, AlertCircle,
    ChevronRight, Zap
} from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('platform');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Platform Settings State
    const [platformSettings, setPlatformSettings] = useState({
        platformName: 'TicketBD',
        primaryDomain: 'ticketbd.com',
        systemLanguage: 'English (BD)',
        baseCurrency: 'BDT',
        timezone: 'Asia/Dhaka',
        dateFormat: 'DD/MM/YYYY',
    });

    // Security Settings State
    const [securitySettings, setSecuritySettings] = useState({
        sessionTimeout: '24',
        requireEmailVerification: true,
        twoFactorAuth: 'optional',
        passwordMinLength: '8',
        maxLoginAttempts: '5',
        enableCaptcha: true,
    });

    // Notification Settings State
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        orderConfirmations: true,
        paymentAlerts: true,
        systemAlerts: true,
    });

    // Payment Gateway Settings State
    const [paymentSettings, setPaymentSettings] = useState({
        defaultGateway: 'stripe',
        stripeEnabled: true,
        sslCommerzEnabled: true,
        bkashEnabled: false,
        nagadEnabled: false,
        testMode: true,
        autoRefund: true,
    });

    const handleSave = async (section: string) => {
        setSaving(true);
        setMessage(null);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setSaving(false);
        setMessage({ type: 'success', text: `${section} settings updated successfully!` });
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
            {/* COMPACT SYSTEM HEADER */}
            <div className="bg-[#022c22] rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Settings size={32} />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-widest border border-emerald-500/30">
                            <Zap size={10} fill="currentColor" /> System Core
                        </div>
                        <h1 className="text-2xl font-black tracking-tight leading-none uppercase">System Configurations</h1>
                        <p className="text-emerald-100/60 text-xs font-medium max-w-xl mx-auto md:mx-0">
                            Centralized platform governance. Manage domains, security protocols, and operational parameters for TicketBD.
                        </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-3">
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-center backdrop-blur-sm">
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">API V2.1</p>
                            <p className="text-[10px] font-medium text-white/50">Running Smooth</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODERN TAB SYSTEM */}
            <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
                {[
                    { id: 'platform', label: 'Platform', icon: Globe },
                    { id: 'security', label: 'Security', icon: Shield },
                    { id: 'notifications', label: 'Alerts', icon: Bell },
                    { id: 'payment', label: 'Payments', icon: CreditCard },
                    { id: 'system', label: 'Database', icon: Database },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center gap-3 px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shrink-0
                            ${activeTab === tab.id
                                ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20'
                                : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
                            }
                        `}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* SETTINGS CONTENT CONTAINER */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-[#022c22]"></div>

                {message && (
                    <div className="absolute top-6 right-6 z-20 animate-in slide-in-from-right-4 duration-300">
                        <div className={`px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xl border ${message.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-red-600 text-white border-red-500'}`}>
                            {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            <span className="text-[11px] font-black uppercase tracking-widest">{message.text}</span>
                        </div>
                    </div>
                )}

                <div className="p-6 lg:p-10">
                    {/* PLATFORM SECTION */}
                    {activeTab === 'platform' && (
                        <div className="space-y-10">
                            <CompactSectionHeader icon={Globe} title="Regional & Branding" description="Configure core identity and system localization." />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <CompactInput label="Platform Name" value={platformSettings.platformName} onChange={(e: any) => setPlatformSettings({ ...platformSettings, platformName: e.target.value })} />
                                <CompactInput label="Primary Domain" value={platformSettings.primaryDomain} onChange={(e: any) => setPlatformSettings({ ...platformSettings, primaryDomain: e.target.value })} />
                                <CompactSelect label="System Language" value={platformSettings.systemLanguage} onChange={(e: any) => setPlatformSettings({ ...platformSettings, systemLanguage: e.target.value })} options={['English (BD)', 'Bengali', 'English (US)']} />
                                <CompactSelect label="Base Currency" value={platformSettings.baseCurrency} onChange={(e: any) => setPlatformSettings({ ...platformSettings, baseCurrency: e.target.value })} options={['BDT', 'USD', 'EUR']} />
                                <CompactSelect label="Default Timezone" value={platformSettings.timezone} onChange={(e: any) => setPlatformSettings({ ...platformSettings, timezone: e.target.value })} options={['Asia/Dhaka', 'UTC', 'Asia/Kolkata']} />
                                <CompactSelect label="Date Protocol" value={platformSettings.dateFormat} onChange={(e: any) => setPlatformSettings({ ...platformSettings, dateFormat: e.target.value })} options={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']} />
                            </div>
                            <div className="pt-4">
                                <CompactSaveButton onClick={() => handleSave('Platform')} saving={saving} />
                            </div>
                        </div>
                    )}

                    {/* SECURITY SECTION */}
                    {activeTab === 'security' && (
                        <div className="space-y-10">
                            <CompactSectionHeader icon={Shield} title="Security & Access" description="Hardening platform authentication and session control." />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                <div className="space-y-6">
                                    <CompactInput label="Session Expiry (Hours)" type="number" value={securitySettings.sessionTimeout} onChange={(e: any) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })} />
                                    <CompactSelect label="2FA Protocol" value={securitySettings.twoFactorAuth} onChange={(e: any) => setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.value })} options={['disabled', 'optional', 'required']} />
                                </div>
                                <div className="space-y-4">
                                    <CompactToggle label="Email Verification" checked={securitySettings.requireEmailVerification} onChange={(checked: boolean) => setSecuritySettings({ ...securitySettings, requireEmailVerification: checked })} description="Force mandatory identity verification." />
                                    <CompactToggle label="Captcha Shield" checked={securitySettings.enableCaptcha} onChange={(checked: boolean) => setSecuritySettings({ ...securitySettings, enableCaptcha: checked })} description="Protection against automated attacks." />
                                </div>
                            </div>
                            <div className="pt-4">
                                <CompactSaveButton onClick={() => handleSave('Security')} saving={saving} />
                            </div>
                        </div>
                    )}

                    {/* ALERT SECTION */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-10">
                            <CompactSectionHeader icon={Bell} title="Communication Layers" description="Manage global alert delivery systems." />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CompactToggle label="Global Email" checked={notificationSettings.emailNotifications} onChange={(c: boolean) => setNotificationSettings({ ...notificationSettings, emailNotifications: c })} />
                                <CompactToggle label="SMS Gateways" checked={notificationSettings.smsNotifications} onChange={(c: boolean) => setNotificationSettings({ ...notificationSettings, smsNotifications: c })} />
                                <CompactToggle label="Push Events" checked={notificationSettings.pushNotifications} onChange={(c: boolean) => setNotificationSettings({ ...notificationSettings, pushNotifications: c })} />
                                <CompactToggle label="Order Alerts" checked={notificationSettings.orderConfirmations} onChange={(c: boolean) => setNotificationSettings({ ...notificationSettings, orderConfirmations: c })} />
                            </div>
                            <div className="pt-4">
                                <CompactSaveButton onClick={() => handleSave('Alert')} saving={saving} />
                            </div>
                        </div>
                    )}

                    {/* PAYMENT SECTION */}
                    {activeTab === 'payment' && (
                        <div className="space-y-10">
                            <CompactSectionHeader icon={CreditCard} title="Revenue Flows" description="Configure financial gateways and refund protocols." />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <CompactSelect label="Primary Gateway" value={paymentSettings.defaultGateway} onChange={(e: any) => setPaymentSettings({ ...paymentSettings, defaultGateway: e.target.value })} options={['stripe', 'sslcommerz', 'bkash', 'nagad']} />
                                    <CompactToggle label="Automated Refunds" checked={paymentSettings.autoRefund} onChange={(c: boolean) => setPaymentSettings({ ...paymentSettings, autoRefund: c })} description="Enable instant processing for cancellations." />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-4 ml-1 tracking-widest">Active Providers</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <ProviderBadge label="Stripe" enabled={paymentSettings.stripeEnabled} onClick={() => setPaymentSettings({ ...paymentSettings, stripeEnabled: !paymentSettings.stripeEnabled })} />
                                        <ProviderBadge label="SSLComm" enabled={paymentSettings.sslCommerzEnabled} onClick={() => setPaymentSettings({ ...paymentSettings, sslCommerzEnabled: !paymentSettings.sslCommerzEnabled })} />
                                        <ProviderBadge label="bKash" enabled={paymentSettings.bkashEnabled} onClick={() => setPaymentSettings({ ...paymentSettings, bkashEnabled: !paymentSettings.bkashEnabled })} />
                                        <ProviderBadge label="Nagad" enabled={paymentSettings.nagadEnabled} onClick={() => setPaymentSettings({ ...paymentSettings, nagadEnabled: !paymentSettings.nagadEnabled })} />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4">
                                <CompactSaveButton onClick={() => handleSave('Payment')} saving={saving} />
                            </div>
                        </div>
                    )}

                    {/* SYSTEM/DATABASE SECTION */}
                    {activeTab === 'system' && (
                        <div className="space-y-10">
                            <CompactSectionHeader icon={Database} title="System Integrity" description="Monitor database health and execute maintenance tasks." />

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Dashboard View */}
                                <div className="lg:col-span-2 bg-[#022c22] rounded-3xl p-6 text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/10 rounded-xl text-emerald-400">
                                                <Database size={20} />
                                            </div>
                                            <h3 className="text-sm font-black uppercase tracking-widest">Database Node 01</h3>
                                        </div>
                                        <div className="px-3 py-1 bg-emerald-500 text-[#022c22] rounded-full text-[9px] font-black uppercase">Healthy</div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                                        <Metric label="Used" value="4.2 GB" />
                                        <Metric label="Quota" value="50 GB" />
                                        <Metric label="Latency" value="12ms" />
                                        <Metric label="Uptime" value="100%" />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-emerald-100/50">
                                            <span>Storage Load</span>
                                            <span>8.4%</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                            <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: '8.4%' }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Maintenance Sidebar */}
                                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Tasks</p>
                                        <button className="w-full flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all group">
                                            <span className="text-[11px] font-black uppercase text-slate-700">Run Backup</span>
                                            <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                        </button>
                                        <button className="w-full flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all group">
                                            <span className="text-[11px] font-black uppercase text-slate-700">Clear Cache</span>
                                            <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                        </button>
                                    </div>
                                    <div className="pt-6">
                                        <div className="p-3 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
                                            <AlertCircle size={16} className="text-red-500 shrink-0" />
                                            <p className="text-[10px] font-bold text-red-700 leading-tight">Emergency database purge is currently disabled by system policy.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// COMPACT COMPONENTS

function CompactSectionHeader({ icon: Icon, title, description }: any) {
    return (
        <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Icon size={20} />
            </div>
            <div>
                <h2 className="text-sm font-black uppercase text-slate-900 tracking-wider">{title}</h2>
                <p className="text-xs text-slate-500 font-medium">{description}</p>
            </div>
        </div>
    );
}

function CompactInput({ label, value, onChange, type = 'text', placeholder }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 px-5 text-[13px] font-bold focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all"
            />
        </div>
    );
}

function CompactSelect({ label, value, onChange, options }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{label}</label>
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 px-5 text-[13px] font-bold focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all appearance-none cursor-pointer"
                >
                    {options.map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronRight size={14} className="rotate-90" />
                </div>
            </div>
        </div>
    );
}

function CompactToggle({ label, checked, onChange, description }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:border-emerald-100 transition-all">
            <div className="flex-1 mr-4">
                <div className="text-[11px] font-black uppercase text-slate-800 tracking-tight">{label}</div>
                {description && <div className="text-[10px] text-slate-400 font-medium">{description}</div>}
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`relative w-12 h-6.5 rounded-full transition-all duration-300 ${checked ? 'bg-emerald-600 shadow-lg shadow-emerald-500/20' : 'bg-slate-200'}`}
            >
                <div className={`absolute top-1 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-all duration-300 ${checked ? 'translate-x-6.5' : 'translate-x-1'}`}></div>
            </button>
        </div>
    );
}

function CompactSaveButton({ onClick, saving }: any) {
    return (
        <button
            onClick={onClick}
            disabled={saving}
            className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
        >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Processing...' : 'Save Configuration'}
        </button>
    );
}

function Metric({ label, value }: any) {
    return (
        <div>
            <p className="text-[9px] font-black text-emerald-100/50 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-black text-white">{value}</p>
        </div>
    );
}

function ProviderBadge({ label, enabled, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`
                px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all text-center
                ${enabled
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                    : 'bg-white text-slate-300 border-slate-100 opacity-60'
                }
            `}
        >
            {label}
        </button>
    );
}
