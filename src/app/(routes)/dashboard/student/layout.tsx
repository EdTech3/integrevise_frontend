"use client"
import React from 'react';

import Navbar from '@/components/dashboard/Navbar';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';

interface Props {
    children: React.ReactNode
}

const DashboardLayout = ({ children }: Props) => {
    return (
        <div className="h-screen flex">
            <SidebarProvider>
                <AppSidebar />
                <div className="flex-grow flex flex-col">
                    <Navbar />
                    <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
                        <SidebarTrigger />
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </div>
    )
}

export default DashboardLayout