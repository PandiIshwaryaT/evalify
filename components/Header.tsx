import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Bell, Globe, LogOut, ChevronDown, User as UserIcon, CheckCircle, Info, Settings } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getNotifications, hasUnreadNotifications } from '../services/geminiService';
import { Notification } from '../types';

const Header: React.FC = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [hasUnread, setHasUnread] = useState(false);

    const languages = ['English (US)', 'Español', 'Français'];
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

    const notificationsRef = useRef<HTMLDivElement>(null);
    const languageRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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
    
    const updateUnreadStatus = () => {
        setHasUnread(hasUnreadNotifications());
    };

    useEffect(() => {
        updateUnreadStatus();
        window.addEventListener('notifications-updated', updateUnreadStatus);
        return () => {
            window.removeEventListener('notifications-updated', updateUnreadStatus);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setNotificationsOpen(false);
            }
            if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
                setLanguageOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNotificationToggle = () => {
        if (!notificationsOpen) {
            setNotifications(getNotifications().slice(0, 5));
        }
        setNotificationsOpen(!notificationsOpen);
    };


    return (
        <header className="bg-white shadow-sm h-20 flex-shrink-0">
            <div className="flex items-center justify-end px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center space-x-5">
                    {/* Language Selector */}
                    <div className="relative" ref={languageRef}>
                        <button onClick={() => setLanguageOpen(!languageOpen)} className="flex items-center text-slate-600 hover:text-indigo-600 focus:outline-none text-sm" aria-label="Select language">
                            <Globe className="h-5 w-5" />
                             <span className="hidden md:block ml-2">{selectedLanguage}</span>
                             <ChevronDown className="h-4 w-4 ml-1 text-slate-500" />
                        </button>
                        {languageOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-20">
                                {languages.map(lang => (
                                    <button
                                        key={lang}
                                        onClick={() => {
                                            setSelectedLanguage(lang);
                                            setLanguageOpen(false);
                                        }}
                                        className={`w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 ${selectedLanguage === lang ? 'bg-indigo-50 font-semibold' : ''}`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notification Bell */}
                    <div className="relative" ref={notificationsRef}>
                        <button onClick={handleNotificationToggle} className="flex items-center text-slate-600 hover:text-indigo-600 focus:outline-none" aria-label="View notifications">
                            <Bell className="h-6 w-6" />
                            {hasUnread && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>}
                        </button>
                        {notificationsOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20">
                                <div className="p-3 font-semibold text-slate-800 border-b">Notifications</div>
                                <div className="py-1 max-h-80 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map(notification => (
                                            <div key={notification.id} className="flex items-start px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50">
                                                <div className={`p-2 rounded-full mr-3 mt-1 ${notification.type === 'success' ? 'bg-green-100' : 'bg-blue-100'}`}>
                                                    {notification.type === 'success' ? (
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <Info className="h-4 w-4 text-blue-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{notification.message}</p>
                                                    <p className="text-xs text-slate-500">{timeSince(notification.timestamp)}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                       <p className="text-center text-sm text-slate-500 py-4">No new notifications.</p>
                                    )}
                                </div>
                                <div className="p-2 text-center border-t">
                                    <Link to="/notifications" onClick={() => setNotificationsOpen(false)} className="text-sm text-indigo-600 hover:underline">View all notifications</Link>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="h-8 w-px bg-slate-200"></div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center space-x-3 focus:outline-none" aria-label="Open user menu">
                             {user?.profilePicture ? (
                                <img src={user.profilePicture} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
                             ) : (
                                <div className="p-2 bg-indigo-100 rounded-full">
                                    <UserIcon className="h-6 w-6 text-indigo-600"/>
                                </div>
                             )}
                            <div className="text-left hidden md:block">
                                <p className="text-sm font-medium text-slate-800 truncate">{user?.name || 'Evaluator'}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-slate-500" />
                        </button>
                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20">
                                <button
                                    onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50"
                                >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Profile Settings
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;