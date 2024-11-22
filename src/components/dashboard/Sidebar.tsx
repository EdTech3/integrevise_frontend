import React from 'react';
import { LayoutDashboard, BookOpen, ChartLine, Settings } from 'lucide-react';
import NavItem from './NavItem';
import Logo from '../shared/Logo';

const Sidebar = () => {
    const navItems = [
        {
            label: 'Overview',
            href: '/student/dashboard',
            icon: <LayoutDashboard size={20} />
        },
        {
            label: 'Courses',
            href: '/student/dashboard/courses',
            icon: <BookOpen size={20} />
        },
        {
            label: 'Resources',
            href: '/student/dashboard/progress',
            icon: <ChartLine size={20} />
        },
        {
            label: 'Settings',
            href: '/student/dashboard/settings',
            icon: <Settings size={20} />
        },
    ];

    return (
        <aside className="max-w-64 bg-white border-r border-gray-200">
            <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
                <Logo width={150} height={150} />
            </div>
            <nav className="p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.label}
                            href={item.href}
                            label={item.label}
                            icon={item.icon}
                        />
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
