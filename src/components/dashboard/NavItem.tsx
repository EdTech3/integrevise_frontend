import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface NavItemProps {
    href: string;
    label: string;
    icon?: React.ReactNode;
}

const NavItem = ({ href, label, icon }: NavItemProps) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (

        <Link
            href={href}
            className={`flex items-center p-2 rounded-lg transition-colors
                    ${isActive
                    ? 'bg-gray-100 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
        >
            {icon && <span className="w-5 h-5 mr-3">{icon}</span>}
            <span>{label}</span>
        </Link>

    );
};

export default NavItem;
