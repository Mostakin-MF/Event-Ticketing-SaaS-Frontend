'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { authService } from '@/services/authService';
import { usePathname } from 'next/navigation';

interface Notification {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

interface PusherContextType {
    pusher: Pusher | null;
    history: Notification[];
    unreadCount: number;
    markAllRead: () => void;
    clearHistory: () => void;
}

const PusherContext = React.createContext<PusherContextType>({
    pusher: null,
    history: [],
    unreadCount: 0,
    markAllRead: () => { },
    clearHistory: () => { },
});

export const usePusher = () => React.useContext(PusherContext);

export const PusherProvider = ({ children }: { children: React.ReactNode }) => {
    const [pusher, setPusher] = useState<Pusher | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [history, setHistory] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [currentChannel, setCurrentChannel] = useState<string | null>(null);
    const pathname = usePathname();

    const addNotification = (notif: Notification) => {
        setNotifications(prev => [...prev, notif]);
        setHistory(prev => [notif, ...prev].slice(0, 50)); // Keep last 50
        setUnreadCount(prev => prev + 1);

        // Auto-remove toast after 6 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n !== notif));
        }, 6000);
    };

    const markAllRead = () => setUnreadCount(0);
    const clearHistory = () => setHistory([]);

    // Helper function to bind events based on channel type
    const bindChannelEvents = (channel: any, channelName: string) => {
        channel.unbind_all(); // Clean slate

        if (channelName.startsWith('tenant-')) {
            // Tenant Admin Events
            channel.bind('new-order', (data: any) => {
                console.log('[Pusher] Received new-order event', data);
                addNotification({
                    title: 'New Order Received!',
                    message: `${data.buyerName} just bought tickets for ${data.eventName}`,
                    type: 'success'
                });
            });

            channel.bind('staff-invited', (data: any) => {
                console.log('[Pusher] Received staff-invited event', data);
                addNotification({
                    title: 'Staff Invited',
                    message: `${data.fullName} has been invited as staff.`,
                    type: 'info'
                });
            });

            channel.bind('event-created', (data: any) => {
                console.log('[Pusher] Received event-created event', data);
                addNotification({
                    title: 'New Event Launched!',
                    message: `Event "${data.name}" has been successfully created.`,
                    type: 'success'
                });
            });
        }

        if (channelName.startsWith('private-staff-') || channelName.startsWith('staff-')) {
            // Staff Events
            channel.bind('event-assigned', (data: any) => {
                console.log('[Pusher] Received event-assigned event', data);
                addNotification({
                    title: 'New Event Assignment',
                    message: `You've been assigned to "${data.eventName}"`,
                    type: 'info'
                });
            });

            channel.bind('shift-reminder', (data: any) => {
                console.log('[Pusher] Received shift-reminder event', data);
                addNotification({
                    title: 'Shift Reminder',
                    message: `Your shift starts in ${data.minutesUntil} minutes`,
                    type: 'warning'
                });
            });

            channel.bind('scan-required', (data: any) => {
                console.log('[Pusher] Received scan-required event', data);
                addNotification({
                    title: 'Action Required',
                    message: `Attendee ready for check-in at ${data.eventName}`,
                    type: 'warning'
                });
            });

            channel.bind('incident-reported', (data: any) => {
                console.log('[Pusher] Received incident-reported event', data);
                addNotification({
                    title: 'Security Incident',
                    message: `${data.incidentType} reported at ${data.location}`,
                    type: 'error'
                });
            });
        }

        if (channelName.startsWith('private-attendee-')) {
            // Attendee Events
            channel.bind('ticket-purchased', (data: any) => {
                console.log('[Pusher] Received ticket-purchased event', data);
                addNotification({
                    title: 'Ticket Confirmed!',
                    message: `Your tickets for "${data.eventName}" are ready`,
                    type: 'success'
                });
            });

            channel.bind('event-reminder', (data: any) => {
                console.log('[Pusher] Received event-reminder event', data);
                addNotification({
                    title: 'Event Reminder',
                    message: `"${data.eventName}" starts ${data.timing}`,
                    type: 'info'
                });
            });

            channel.bind('ticket-scanned', (data: any) => {
                console.log('[Pusher] Received ticket-scanned event', data);
                addNotification({
                    title: 'Check-in Successful',
                    message: `Welcome to ${data.eventName}!`,
                    type: 'success'
                });
            });

            channel.bind('event-cancelled', (data: any) => {
                console.log('[Pusher] Received event-cancelled event', data);
                addNotification({
                    title: 'Event Cancelled',
                    message: `${data.eventName} has been cancelled. Refund initiated.`,
                    type: 'error'
                });
            });

            channel.bind('event-updated', (data: any) => {
                console.log('[Pusher] Received event-updated event', data);
                addNotification({
                    title: 'Event Updated',
                    message: `${data.eventName}: ${data.changes}`,
                    type: 'warning'
                });
            });
        }
    };

    // Use a ref to track the current subscriptions to avoid closure staleness issues
    const activeChannelsRef = React.useRef<string[]>([]);

    useEffect(() => {
        const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
        const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        if (!key || !cluster) {
            console.warn('[Pusher] Keys missing in environment variables');
            return;
        }

        // 1. Initialize Pusher Client with auth endpoint for private channels
        let pusherClient = pusher;
        if (!pusherClient) {
            console.log('[Pusher] Initializing client...');
            
            // Get JWT token from localStorage
            const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
            
            pusherClient = new Pusher(key, {
                cluster,
                authEndpoint: `${apiUrl}/auth/pusher/auth`,
                auth: {
                    headers: token ? {
                        'Authorization': `Bearer ${token}`,
                    } : {},
                },
            });
            setPusher(pusherClient);
        }

        let isEffectActive = true;

        // 2. Fetch user and manage subscriptions
        authService.checkAuth().then(user => {
            if (!isEffectActive || !pusherClient) return;

            // Determine channels based on user role
            let channelsToSubscribe: string[] = [];

            if (user?.tenantId) {
                // Tenant admin: subscribe to tenant channel
                channelsToSubscribe.push(`tenant-${user.tenantId}`);
            }

            if (user?.role === 'staff') {
                // Staff: subscribe to private staff channel
                channelsToSubscribe.push(`private-staff-${user.id}`);
                // Optionally subscribe to staff broadcast channel if user has tenantId
                if (user.tenantId) {
                    channelsToSubscribe.push(`staff-${user.tenantId}`);
                }
            }

            if (user?.role === 'attendee') {
                // Attendee: subscribe to private attendee channel
                channelsToSubscribe.push(`private-attendee-${user.id}`);
            }

            // Check if channels have changed
            const channelsChanged = JSON.stringify(activeChannelsRef.current.sort()) !== JSON.stringify(channelsToSubscribe.sort());
            
            if (!channelsChanged) {
                console.log('[Pusher] Channels unchanged, skipping re-subscription');
                return;
            }

            // Unsubscribe from previous channels
            if (activeChannelsRef.current.length > 0) {
                activeChannelsRef.current.forEach(ch => {
                    console.log(`[Pusher] Unsubscribing from ${ch}`);
                    pusherClient.unsubscribe(ch);
                });
            }

            activeChannelsRef.current = channelsToSubscribe;

            // Subscribe to all relevant channels
            if (channelsToSubscribe.length > 0) {
                channelsToSubscribe.forEach(channelName => {
                    console.log(`[Pusher] Subscribing to: ${channelName}`);
                    const channel = pusherClient.subscribe(channelName);

                    // Bind role-specific events
                    bindChannelEvents(channel, channelName);
                });
            } else {
                console.log('[Pusher] No channels to subscribe to.');
            }
        }).catch((err) => {
            console.log('[Pusher] Auth check failed or not logged in.', err);
            if (isEffectActive && activeChannelsRef.current.length > 0) {
                activeChannelsRef.current.forEach(ch => pusherClient?.unsubscribe(ch));
                activeChannelsRef.current = [];
            }
        });

        return () => {
            isEffectActive = false;
        };
    }, [pathname, pusher]); // Re-run on navigation to check auth status changes

    const sendTestNotification = () => {
        addNotification({
            title: 'Test Notification',
            message: 'If you see this, the notification UI is working correctly!',
            type: 'info'
        });
    };

    useEffect(() => {
        return () => {
            if (pusher) {
                console.log('[Pusher] Disconnecting client...');
                pusher.disconnect();
            }
        };
    }, [pusher]);

    return (
        <PusherContext.Provider value={{
            pusher,
            history,
            unreadCount,
            markAllRead,
            clearHistory
        }}>
            {children}

            {/* Diagnostic Button (Hidden unless hover/debug) - Click bottom right corner edge */}
            <div
                className="fixed bottom-0 right-0 w-4 h-4 opacity-0 hover:opacity-10 cursor-help z-[9999]"
                onClick={sendTestNotification}
                title="Send Test Notification"
            ></div>

            {/* Toast Notification Container */}
            <div className="fixed bottom-10 right-10 z-[9999] flex flex-col gap-3 max-w-sm">
                {notifications.map((notif, i) => (
                    <div
                        key={i}
                        className={`
              alert shadow-2xl border flex items-start gap-4 p-4 rounded-2xl animate-in slide-in-from-right duration-500
              ${notif.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                notif.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                    'bg-blue-500/10 border-blue-500/20 text-blue-400'}
            `}
                    >
                        <div className="flex-1">
                            <h4 className="text-[11px] font-black uppercase tracking-widest">{notif.title}</h4>
                            <p className="text-[10px] font-bold opacity-70 leading-relaxed mt-1">{notif.message}</p>
                        </div>
                        <button
                            className="mt-1 p-1 hover:bg-white/5 rounded-lg transition-colors"
                            onClick={() => setNotifications(prev => prev.filter((_, idx) => idx !== i))}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </PusherContext.Provider>
    );
};
