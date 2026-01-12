"use client";

import React, { useState } from 'react';
import {
    Settings,
    Shield,
    Globe,
    Bell,
    Mail,
    CreditCard,
    Database,
    Save,
    RefreshCw,
    Server,
    Lock,
    Users,
    Palette
} from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('platform');
    const [saving, setSaving] = useState(false);

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

    // Email Settings State
    const [emailSettings, setEmailSettings] = useState({
        smtpHost: 'smtp.gmail.com',
        smtpPort: '587',
        smtpUsername: 'noreply@ticketbd.com',
        smtpEncryption: 'TLS',
        fromEmail: 'noreply@ticketbd.com',
        fromName: 'TicketBD',
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        alert(`${section} settings saved successfully!`);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
                <p className="text-slate-500 mt-1">Configure global platform behavior and preferences.</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
                <div className="flex flex-wrap gap-2">
                    <TabButton
                        active={activeTab === 'platform'}
                        onClick={() => setActiveTab('platform')}
                        icon={Globe}
                        label="Platform"
                    />
                    <TabButton
                        active={activeTab === 'security'}
                        onClick={() => setActiveTab('security')}
                        icon={Shield}
                        label="Security"
                    />
                    <TabButton
                        active={activeTab === 'notifications'}
                        onClick={() => setActiveTab('notifications')}
                        icon={Bell}
                        label="Notifications"
                    />
                    <TabButton
                        active={activeTab === 'email'}
                        onClick={() => setActiveTab('email')}
                        icon={Mail}
                        label="Email"
                    />
                    <TabButton
                        active={activeTab === 'payment'}
                        onClick={() => setActiveTab('payment')}
                        icon={CreditCard}
                        label="Payment"
                    />
                    <TabButton
                        active={activeTab === 'system'}
                        onClick={() => setActiveTab('system')}
                        icon={Database}
                        label="System"
                    />
                </div>
            </div>

            {/* Settings Content */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                {/* Platform Settings */}
                {activeTab === 'platform' && (
                    <div className="space-y-6">
                        <SectionHeader icon={Globe} title="Platform Configuration" description="Basic platform information and regional settings" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Platform Name"
                                value={platformSettings.platformName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlatformSettings({ ...platformSettings, platformName: e.target.value })}
                            />
                            <InputField
                                label="Primary Domain"
                                value={platformSettings.primaryDomain}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlatformSettings({ ...platformSettings, primaryDomain: e.target.value })}
                            />
                            <SelectField
                                label="System Language"
                                value={platformSettings.systemLanguage}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPlatformSettings({ ...platformSettings, systemLanguage: e.target.value })}
                                options={['English (BD)', 'Bengali', 'English (US)']}
                            />
                            <SelectField
                                label="Base Currency"
                                value={platformSettings.baseCurrency}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPlatformSettings({ ...platformSettings, baseCurrency: e.target.value })}
                                options={['BDT', 'USD', 'EUR']}
                            />
                            <SelectField
                                label="Timezone"
                                value={platformSettings.timezone}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPlatformSettings({ ...platformSettings, timezone: e.target.value })}
                                options={['Asia/Dhaka', 'UTC', 'Asia/Kolkata']}
                            />
                            <SelectField
                                label="Date Format"
                                value={platformSettings.dateFormat}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPlatformSettings({ ...platformSettings, dateFormat: e.target.value })}
                                options={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']}
                            />
                        </div>

                        <SaveButton onClick={() => handleSave('Platform')} saving={saving} />
                    </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                    <div className="space-y-6">
                        <SectionHeader icon={Shield} title="Security & Access Control" description="Manage authentication and security policies" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Session Timeout (hours)"
                                type="number"
                                value={securitySettings.sessionTimeout}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                            />
                            <SelectField
                                label="Two-Factor Authentication"
                                value={securitySettings.twoFactorAuth}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.value })}
                                options={['disabled', 'optional', 'required']}
                            />
                            <InputField
                                label="Password Min Length"
                                type="number"
                                value={securitySettings.passwordMinLength}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSecuritySettings({ ...securitySettings, passwordMinLength: e.target.value })}
                            />
                            <InputField
                                label="Max Login Attempts"
                                type="number"
                                value={securitySettings.maxLoginAttempts}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4">
                            <ToggleField
                                label="Require Email Verification"
                                description="Users must verify their email before accessing the platform"
                                checked={securitySettings.requireEmailVerification}
                                onChange={(checked: boolean) => setSecuritySettings({ ...securitySettings, requireEmailVerification: checked })}
                            />
                            <ToggleField
                                label="Enable CAPTCHA"
                                description="Show CAPTCHA on login and registration forms"
                                checked={securitySettings.enableCaptcha}
                                onChange={(checked: boolean) => setSecuritySettings({ ...securitySettings, enableCaptcha: checked })}
                            />
                        </div>

                        <SaveButton onClick={() => handleSave('Security')} saving={saving} />
                    </div>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                    <div className="space-y-6">
                        <SectionHeader icon={Bell} title="Notification Preferences" description="Configure system-wide notification settings" />

                        <div className="space-y-4">
                            <ToggleField
                                label="Email Notifications"
                                description="Send notifications via email"
                                checked={notificationSettings.emailNotifications}
                                onChange={(checked: boolean) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
                            />
                            <ToggleField
                                label="SMS Notifications"
                                description="Send notifications via SMS"
                                checked={notificationSettings.smsNotifications}
                                onChange={(checked: boolean) => setNotificationSettings({ ...notificationSettings, smsNotifications: checked })}
                            />
                            <ToggleField
                                label="Push Notifications"
                                description="Send browser push notifications"
                                checked={notificationSettings.pushNotifications}
                                onChange={(checked: boolean) => setNotificationSettings({ ...notificationSettings, pushNotifications: checked })}
                            />
                            <div className="h-px bg-slate-200 my-4"></div>
                            <ToggleField
                                label="Order Confirmations"
                                description="Notify users when orders are placed"
                                checked={notificationSettings.orderConfirmations}
                                onChange={(checked: boolean) => setNotificationSettings({ ...notificationSettings, orderConfirmations: checked })}
                            />
                            <ToggleField
                                label="Payment Alerts"
                                description="Notify admins of payment activities"
                                checked={notificationSettings.paymentAlerts}
                                onChange={(checked: boolean) => setNotificationSettings({ ...notificationSettings, paymentAlerts: checked })}
                            />
                            <ToggleField
                                label="System Alerts"
                                description="Notify admins of system events and errors"
                                checked={notificationSettings.systemAlerts}
                                onChange={(checked: boolean) => setNotificationSettings({ ...notificationSettings, systemAlerts: checked })}
                            />
                        </div>

                        <SaveButton onClick={() => handleSave('Notification')} saving={saving} />
                    </div>
                )}

                {/* Email Settings */}
                {activeTab === 'email' && (
                    <div className="space-y-6">
                        <SectionHeader icon={Mail} title="Email Configuration" description="Configure SMTP settings for outgoing emails" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="SMTP Host"
                                value={emailSettings.smtpHost}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                            />
                            <InputField
                                label="SMTP Port"
                                value={emailSettings.smtpPort}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                            />
                            <InputField
                                label="SMTP Username"
                                value={emailSettings.smtpUsername}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })}
                            />
                            <SelectField
                                label="Encryption"
                                value={emailSettings.smtpEncryption}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEmailSettings({ ...emailSettings, smtpEncryption: e.target.value })}
                                options={['TLS', 'SSL', 'None']}
                            />
                            <InputField
                                label="From Email"
                                type="email"
                                value={emailSettings.fromEmail}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                            />
                            <InputField
                                label="From Name"
                                value={emailSettings.fromName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                            />
                        </div>

                        <SaveButton onClick={() => handleSave('Email')} saving={saving} />
                    </div>
                )}

                {/* Payment Settings */}
                {activeTab === 'payment' && (
                    <div className="space-y-6">
                        <SectionHeader icon={CreditCard} title="Payment Gateway Configuration" description="Manage payment providers and settings" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <SelectField
                                label="Default Gateway"
                                value={paymentSettings.defaultGateway}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentSettings({ ...paymentSettings, defaultGateway: e.target.value })}
                                options={['stripe', 'sslcommerz', 'bkash', 'nagad']}
                            />
                        </div>

                        <div className="space-y-4">
                            <ToggleField
                                label="Stripe"
                                description="Enable Stripe payment gateway"
                                checked={paymentSettings.stripeEnabled}
                                onChange={(checked: boolean) => setPaymentSettings({ ...paymentSettings, stripeEnabled: checked })}
                            />
                            <ToggleField
                                label="SSLCommerz"
                                description="Enable SSLCommerz payment gateway"
                                checked={paymentSettings.sslCommerzEnabled}
                                onChange={(checked: boolean) => setPaymentSettings({ ...paymentSettings, sslCommerzEnabled: checked })}
                            />
                            <ToggleField
                                label="bKash"
                                description="Enable bKash mobile payment"
                                checked={paymentSettings.bkashEnabled}
                                onChange={(checked: boolean) => setPaymentSettings({ ...paymentSettings, bkashEnabled: checked })}
                            />
                            <ToggleField
                                label="Nagad"
                                description="Enable Nagad mobile payment"
                                checked={paymentSettings.nagadEnabled}
                                onChange={(checked: boolean) => setPaymentSettings({ ...paymentSettings, nagadEnabled: checked })}
                            />
                            <div className="h-px bg-slate-200 my-4"></div>
                            <ToggleField
                                label="Test Mode"
                                description="Use sandbox/test environment for payments"
                                checked={paymentSettings.testMode}
                                onChange={(checked: boolean) => setPaymentSettings({ ...paymentSettings, testMode: checked })}
                            />
                            <ToggleField
                                label="Auto Refund"
                                description="Automatically process refunds for cancelled orders"
                                checked={paymentSettings.autoRefund}
                                onChange={(checked: boolean) => setPaymentSettings({ ...paymentSettings, autoRefund: checked })}
                            />
                        </div>

                        <SaveButton onClick={() => handleSave('Payment')} saving={saving} />
                    </div>
                )}

                {/* System Settings */}
                {activeTab === 'system' && (
                    <div className="space-y-6">
                        <SectionHeader icon={Database} title="System Maintenance" description="Database, backups, and system health" />

                        {/* Database Stats */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <Database size={24} />
                                <h3 className="text-lg font-bold">Database Status</h3>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <StatItem label="Storage Used" value="4.2 GB" />
                                <StatItem label="Total Capacity" value="50 GB" />
                                <StatItem label="Last Backup" value="2h ago" />
                                <StatItem label="Health" value="Good" />
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-300">Storage Usage</span>
                                    <span className="font-bold">8.4%</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-[8.4%] bg-emerald-500 rounded-full"></div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-colors">
                                    <Database size={16} />
                                    Run Backup
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-colors">
                                    <RefreshCw size={16} />
                                    Optimize Database
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-colors">
                                    <Server size={16} />
                                    Clear Cache
                                </button>
                            </div>
                        </div>

                        {/* System Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoCard label="Server Status" value="Online" color="emerald" />
                            <InfoCard label="API Version" value="v2.1.0" color="blue" />
                            <InfoCard label="Database Version" value="PostgreSQL 14" color="purple" />
                            <InfoCard label="Node Version" value="v18.17.0" color="amber" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Components
function TabButton({ active, onClick, icon: Icon, label }: any) {
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

function SectionHeader({ icon: Icon, title, description }: any) {
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

function InputField({ label, value, onChange, type = 'text' }: any) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
        </div>
    );
}

function SelectField({ label, value, onChange, options }: any) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">{label}</label>
            <select
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            >
                {options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );
}

function ToggleField({ label, description, checked, onChange }: any) {
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

function SaveButton({ onClick, saving }: any) {
    return (
        <div className="pt-4 border-t border-slate-200">
            <button
                onClick={onClick}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/20 disabled:opacity-50"
            >
                {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    );
}

function StatItem({ label, value }: any) {
    return (
        <div>
            <div className="text-xs text-slate-400 mb-1">{label}</div>
            <div className="text-lg font-bold">{value}</div>
        </div>
    );
}

function InfoCard({ label, value, color }: any) {
    const colors: Record<string, string> = {
        emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-200',
        blue: 'from-blue-500/10 to-blue-600/5 border-blue-200',
        purple: 'from-purple-500/10 to-purple-600/5 border-purple-200',
        amber: 'from-amber-500/10 to-amber-600/5 border-amber-200',
    };

    return (
        <div className={`p-4 rounded-xl border bg-gradient-to-br ${colors[color]}`}>
            <div className="text-xs font-semibold text-slate-600 mb-1">{label}</div>
            <div className="text-lg font-bold text-slate-900">{value}</div>
        </div>
    );
}
