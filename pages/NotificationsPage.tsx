import React, { useState, useEffect } from 'react';
import { Notification } from '../types';
import { getNotifications, markAllNotificationsAsRead } from '../services/geminiService';
import { Bell, CheckCircle, Info, Check } from 'lucide-react';

const timeSince = (dateString: string): string => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    return `${Math.floor(seconds)} seconds ago`;
};

const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        setNotifications(getNotifications());
    }, []);

    const handleMarkAllRead = () => {
        markAllNotificationsAsRead();
        setNotifications(getNotifications());
    };
    
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>
                <button
                    onClick={handleMarkAllRead}
                    disabled={unreadCount === 0}
                    className="flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                >
                    <Check className="h-4 w-4 mr-2" />
                    Mark all as read
                </button>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4 space-y-3">
                    {notifications.length > 0 ? (
                        notifications.map(notification => (
                            <div key={notification.id} className={`flex items-start p-4 rounded-lg transition-colors ${notification.read ? 'bg-slate-50' : 'bg-indigo-50'}`}>
                                <div className={`relative p-2 rounded-full mr-4 mt-1 ${notification.type === 'success' ? 'bg-green-100' : 'bg-blue-100'}`}>
                                    {notification.type === 'success' ? (
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <Info className="h-5 w-5 text-blue-600" />
                                    )}
                                     {!notification.read && <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-indigo-500 ring-2 ring-indigo-50"></span>}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium ${notification.read ? 'text-slate-600' : 'text-slate-800'}`}>{notification.message}</p>
                                    <p className="text-sm text-slate-500">{timeSince(notification.timestamp)}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-slate-500 py-16">
                            <Bell className="h-16 w-16 mb-4 text-slate-300"/>
                            <h3 className="text-xl font-semibold">No Notifications Yet</h3>
                            <p>New notifications about your evaluations will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
