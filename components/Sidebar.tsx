import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart, CheckSquare, Clipboard, PieChart, HelpCircle, GitBranch, Bell } from 'lucide-react';


const Sidebar: React.FC = () => {
    const navItems = [
        { name: 'OMR Verifier', path: '/', icon: CheckSquare },
        { name: 'Dashboard', path: '/dashboard', icon: BarChart },
        { name: 'Results', path: '/results', icon: Clipboard },
        { name: 'Analytics', path: '/analytics', icon: PieChart },
        { name: 'Notifications', path: '/notifications', icon: Bell },
        { name: 'Help & FAQ', path: '/help', icon: HelpCircle },
    ];
    
    return (
        <div className="w-64 bg-white shadow-lg flex flex-col flex-shrink-0">
            <div className="flex items-center justify-center h-20 border-b border-slate-200">
                 <GitBranch className="h-8 w-8 text-indigo-600" />
                <h1 className="text-2xl font-bold text-indigo-600 ml-2">Evalify</h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 text-slate-700 rounded-lg transition-colors duration-200 hover:bg-indigo-50 hover:text-indigo-600 ${
                                isActive ? 'bg-indigo-100 text-indigo-600 font-semibold' : ''
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;