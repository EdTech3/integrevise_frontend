import { ArrowLeft, BellRing, BookOpen, ChartLine, ClipboardList, LayoutDashboard, Settings } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import Logo from '../shared/Logo';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import NavItem from './NavItem';
import { useEffect } from 'react';

const AppSidebar = () => {
    const pathname = usePathname();
    const params = useParams();
    const isCourseRoute = pathname.includes('/courses') && params.id

    useEffect(() => {
        console.log("Params: ", params)
        console.log("Pathname: ", pathname)
    })

    const mainNavItems = [
        {
            label: 'Overview',
            href: '/dashboard/student',
            icon: <LayoutDashboard size={20} />
        },
        {
            label: 'Courses',
            href: '/dashboard/student/courses',
            icon: <BookOpen size={20} />
        },
        {
            label: 'Resources',
            href: '/dashboard/student/progress',
            icon: <ChartLine size={20} />
        },
        {
            label: 'Settings',
            href: '/dashboard/student/settings',
            icon: <Settings size={20} />
        },
    ];

    const courseNavItems = [
        {
            label: 'Modules',
            href: `${pathname}/modules`,
            icon: <BookOpen size={20} />
        },
        {
            label: 'Assignments',
            href: `${pathname}/assignments`,
            icon: <ClipboardList size={20} />
        },
        {
            label: 'Announcements',
            href: `${pathname}/announcements`,
            icon: <BellRing size={20} />
        },
        {
            label: 'Back to Courses',
            href: '/dashboard/student/courses',
            icon: <ArrowLeft size={20} />
        }
    ];

    return (
        <Sidebar className="max-w-64 bg-white border-r border-gray-200">
            <SidebarHeader className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
                <Logo width={140} height={140} />
            </SidebarHeader>
            <SidebarContent className="p-4">
                {!isCourseRoute &&
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {mainNavItems.map((item) => (
                                    <SidebarMenuItem key={item.label}>
                                        <SidebarMenuButton asChild>
                                            <NavItem
                                                label={item.label}
                                                href={item.href}
                                                icon={item.icon}
                                            />
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                }


                <SidebarGroup>
                    {
                        isCourseRoute && <SidebarGroupContent>
                            <SidebarGroupLabel>
                                2024/25 Academic year
                            </SidebarGroupLabel>
                            <SidebarMenu>
                                {courseNavItems.map((item) => (
                                    <SidebarMenuItem key={item.label}>
                                        <SidebarMenuButton asChild>
                                            <NavItem
                                                label={item.label}
                                                href={item.href}
                                                icon={item.icon}
                                            />
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    }
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
};

export default AppSidebar;
