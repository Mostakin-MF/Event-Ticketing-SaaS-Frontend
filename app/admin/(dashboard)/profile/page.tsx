"use client";

import React, { useState } from 'react';
import {
    User,
    Mail,
    Lock,
    Bell,
    Shield,
    Camera,
    Save,
    Eye,
    EyeOff,
    Calendar,
    MapPin,
    Phone,
    Globe,
    Activity,
    LogOut
} from 'lucide-react';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('personal');
    const [saving, setSaving] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Personal Info State
    const [personalInfo, setPersonalInfo] = useState({
        fullName: 'Super Admin',
        email: 'admin@platform.com',
        phone: '+880 1712-345678',
        role: 'Platform Administrator',
        location: 'Dhaka, Bangladesh',
        timezone: 'Asia/Dhaka',
        language: 'English (BD)',
        bio: 'Platform administrator managing TicketBD operations.',
    });

    // Security State
    const [securitySettings, setSecuritySettings] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: false,
        sessionTimeout: '24',
    });

    // Notification Preferences
    const [notificationPrefs, setNotificationPrefs] = useState({
        emailNotifications: true,
        pushNotifications: true,
        securityAlerts: true,
        systemUpdates: false,
        weeklyReports: true,
        loginAlerts: true,
    });

    // Activity Log (mock data)
    const activityLog = [
        { action: 'Logged in', timestamp: '2 hours ago', ip: '103.92.xxx.xxx' },
        { action: 'Updated user settings', timestamp: '1 day ago', ip: '103.92.xxx.xxx' },
        { action: 'Created new tenant', timestamp: '2 days ago', ip: '103.92.xxx.xxx' },
        { action: 'Modified payment settings', timestamp: '3 days ago', ip: '103.92.xxx.xxx' },
        { action: 'Exported financial report', timestamp: '5 days ago', ip: '103.92.xxx.xxx' },
    ];

    const handleSave = async (section: string) => {
        setSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        alert(`${section} updated successfully!`);
    };

    const handlePasswordChange = async () => {
        if (securitySettings.newPassword !== securitySettings.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        if (securitySettings.newPassword.length < 8) {
            alert('Password must be at least 8 characters!');
            return;
        }
        await handleSave('Password');
        setSecuritySettings({
            ...securitySettings,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header with Profile Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                            SA
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 bg-white text-emerald-600 rounded-full shadow-lg hover:scale-110 transition-transform">
                            <Camera size={16} />
                        </button>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-black mb-1">{personalInfo.fullName}</h1>
                        <p className="text-emerald-100 mb-3">{personalInfo.role}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail size={14} />
                                {personalInfo.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={14} />
                                {personalInfo.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                Member since Jan 2024
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                            <div className="text-2xl font-bold">156</div>
                            <div className="text-xs text-emerald-100">Actions</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                            <div className="text-2xl font-bold">24/7</div>
                            <div className="text-xs text-emerald-100">Active</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
                <div className="flex flex-wrap gap-2">
                    <TabButton
                        active={activeTab === 'personal'}
                        onClick={() => setActiveTab('personal')}
                        icon={User}
                        label="Personal Info"
                    />
                    <TabButton
                        active={activeTab === 'security'}
                        onClick={() => setActiveTab('security')}
                        icon={Lock}
                        label="Security"
                    />
                    <TabButton
                        active={activeTab === 'notifications'}
                        onClick={() => setActiveTab('notifications')}
                        icon={Bell}
                        label="Notifications"
                    />
                    <TabButton
                        active={activeTab === 'activity'}
                        onClick={() => setActiveTab('activity')}
                        icon={Activity}
                        label="Activity Log"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                {/* Personal Information */}
                {activeTab === 'personal' && (
                    <div className="space-y-6">
                        <SectionHeader icon={User} title="Personal Information" description="Update your personal details and preferences" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Full Name"
                                icon={User}
                                value={personalInfo.fullName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                            />
                            <InputField
                                label="Email Address"
                                icon={Mail}
                                type="email"
                                value={personalInfo.email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                            />
                            <InputField
                                label="Phone Number"
                                icon={Phone}
                                value={personalInfo.phone}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                            />
                            <InputField
                                label="Location"
                                icon={MapPin}
                                value={personalInfo.location}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                            />
                            <SelectField
                                label="Timezone"
                                icon={Globe}
                                value={personalInfo.timezone}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPersonalInfo({ ...personalInfo, timezone: e.target.value })}
                                options={['Asia/Dhaka', 'UTC', 'Asia/Kolkata', 'America/New_York']}
                            />
                            <SelectField
                                label="Language"
                                icon={Globe}
                                value={personalInfo.language}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPersonalInfo({ ...personalInfo, language: e.target.value })}
                                options={['English (BD)', 'Bengali', 'English (US)']}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Bio</label>
                            <textarea
                                value={personalInfo.bio}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <SaveButton onClick={() => handleSave('Personal information')} saving={saving} />
                    </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                    <div className="space-y-6">
                        <SectionHeader icon={Lock} title="Security Settings" description="Manage your password and security preferences" />

                        {/* Change Password */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900">Change Password</h3>
                            <PasswordField
                                label="Current Password"
                                value={securitySettings.currentPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
                                show={showCurrentPassword}
                                onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
                            />
                            <PasswordField
                                label="New Password"
                                value={securitySettings.newPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
                                show={showNewPassword}
                                onToggle={() => setShowNewPassword(!showNewPassword)}
                            />
                            <InputField
                                label="Confirm New Password"
                                icon={Lock}
                                type="password"
                                value={securitySettings.confirmPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })}
                            />
                            <button
                                onClick={handlePasswordChange}
                                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                            >
                                Update Password
                            </button>
                        </div>

                        <div className="h-px bg-slate-200"></div>

                        {/* Two-Factor Authentication */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900">Two-Factor Authentication</h3>
                            <ToggleField
                                label="Enable 2FA"
                                description="Add an extra layer of security to your account"
                                checked={securitySettings.twoFactorEnabled}
                                onChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorEnabled: checked })}
                            />
                        </div>

                        <div className="h-px bg-slate-200"></div>

                        {/* Session Settings */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900">Session Management</h3>
                            <SelectField
                                label="Session Timeout (hours)"
                                icon={Shield}
                                value={securitySettings.sessionTimeout}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                                options={['1', '6', '12', '24', '48']}
                            />
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">
                                <LogOut size={18} />
                                Sign Out All Devices
                            </button>
                        </div>
                    </div>
                )}

                {/* Notification Preferences */}
                {activeTab === 'notifications' && (
                    <div className="space-y-6">
                        <SectionHeader icon={Bell} title="Notification Preferences" description="Choose what notifications you want to receive" />

                        <div className="space-y-4">
                            <ToggleField
                                label="Email Notifications"
                                description="Receive notifications via email"
                                checked={notificationPrefs.emailNotifications}
                                onChange={(checked) => setNotificationPrefs({ ...notificationPrefs, emailNotifications: checked })}
                            />
                            <ToggleField
                                label="Push Notifications"
                                description="Receive browser push notifications"
                                checked={notificationPrefs.pushNotifications}
                                onChange={(checked) => setNotificationPrefs({ ...notificationPrefs, pushNotifications: checked })}
                            />
                            <ToggleField
                                label="Security Alerts"
                                description="Get notified about security events"
                                checked={notificationPrefs.securityAlerts}
                                onChange={(checked) => setNotificationPrefs({ ...notificationPrefs, securityAlerts: checked })}
                            />
                            <ToggleField
                                label="System Updates"
                                description="Notifications about system updates and maintenance"
                                checked={notificationPrefs.systemUpdates}
                                onChange={(checked) => setNotificationPrefs({ ...notificationPrefs, systemUpdates: checked })}
                            />
                            <ToggleField
                                label="Weekly Reports"
                                description="Receive weekly activity and performance reports"
                                checked={notificationPrefs.weeklyReports}
                                onChange={(checked) => setNotificationPrefs({ ...notificationPrefs, weeklyReports: checked })}
                            />
                            <ToggleField
                                label="Login Alerts"
                                description="Get notified when someone logs into your account"
                                checked={notificationPrefs.loginAlerts}
                                onChange={(checked) => setNotificationPrefs({ ...notificationPrefs, loginAlerts: checked })}
                            />
                        </div>

                        <SaveButton onClick={() => handleSave('Notification preferences')} saving={saving} />
                    </div>
                )}

                {/* Activity Log */}
                {activeTab === 'activity' && (
                    <div className="space-y-6">
                        <SectionHeader icon={Activity} title="Recent Activity" description="View your recent account activity" />

                        <div className="space-y-3">
                            {activityLog.map((log, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                            <Activity size={18} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900 text-sm">{log.action}</div>
                                            <div className="text-xs text-slate-500">IP: {log.ip}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-500">{log.timestamp}</div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                            Load More Activity
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Components
function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${active
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
        >
            <Icon size={16} />
            {label}
        </button>
    );
}

function SectionHeader({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="flex items-start gap-3 pb-4 border-b border-slate-200">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <Icon size={20} />
            </div>
            <div>
                <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                <p className="text-sm text-slate-500 mt-0.5">{description}</p>
            </div>
        </div>
    );
}

function InputField({ label, icon: Icon, value, onChange, type = 'text' }: { label: string, icon: any, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">{label}</label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icon size={18} />
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
            </div>
        </div>
    );
}

function PasswordField({ label, value, onChange, show, onToggle }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, show: boolean, onToggle: () => void }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">{label}</label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                </div>
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    className="w-full pl-11 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    );
}

function SelectField({ label, icon: Icon, value, onChange, options }: { label: string, icon: any, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[] }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">{label}</label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icon size={18} />
                </div>
                <select
                    value={value}
                    onChange={onChange}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
                >
                    {options.map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

function ToggleField({ label, description, checked, onChange }: { label: string, description: string, checked: boolean, onChange: (checked: boolean) => void }) {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex-1">
                <div className="font-semibold text-slate-900 text-sm">{label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{description}</div>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
            >
                <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${checked ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                ></div>
            </button>
        </div>
    );
}

function SaveButton({ onClick, saving }: { onClick: () => void, saving: boolean }) {
    return (
        <div className="pt-4 border-t border-slate-200">
            <button
                onClick={onClick}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/20 disabled:opacity-50"
            >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    );
}
