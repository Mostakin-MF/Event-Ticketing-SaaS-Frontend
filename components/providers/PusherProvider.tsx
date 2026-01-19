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

    // Use a ref to track the current subscription to avoid closure staleness issues
    const activeChannelRef = React.useRef<string | null>(null);

    useEffect(() => {
        const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
        const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

        if (!key || !cluster) {
            console.warn('[Pusher] Keys missing in environment variables');
            return;
        }

        // 1. Initialize Pusher Client if not exists
        let pusherClient = pusher;
        if (!pusherClient) {
            console.log('[Pusher] Initializing client...');
            pusherClient = new Pusher(key, { cluster });
            setPusher(pusherClient);
        }

        let isEffectActive = true;

        // 2. Fetch user and manage subscription
        authService.checkAuth().then(user => {
            if (!isEffectActive || !pusherClient) return;

            const targetChannelName = user?.tenantId ? `tenant-${user.tenantId}` : null;

            // If channel hasn't changed, do nothing
            if (activeChannelRef.current === targetChannelName) {
                return;
            }

            // Unsubscribe from previous channel if any
            if (activeChannelRef.current) {
                console.log(`[Pusher] Unsubscribing from ${activeChannelRef.current}`);
                pusherClient.unsubscribe(activeChannelRef.current);
            }

            activeChannelRef.current = targetChannelName;

            if (targetChannelName) {
                console.log(`[Pusher] Subscribing to: ${targetChannelName}`);
                const channel = pusherClient.subscribe(targetChannelName);

                // Ensure we unbind if there were any previous ghost listeners on this channel object
                channel.unbind_all();

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
            } else {
                console.log('[Pusher] No tenantId found, ensuring no active subscriptions.');
            }
        }).catch((err) => {
            console.log('[Pusher] Auth check failed or not logged in.', err);
            if (isEffectActive && activeChannelRef.current) {
                pusherClient?.unsubscribe(activeChannelRef.current);
                activeChannelRef.current = null;
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
