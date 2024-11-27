import React from 'react';
import Image from 'next/image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';

interface ProfileItemProps {
    name: string;
    imageUrl?: string;
    onSignOut?: () => void;
    onProfileClick?: () => void;
    onSettingsClick?: () => void;
}

const ProfileItem = ({
    name,
    imageUrl = "https://avatar.iran.liara.run/public/20",
    onSignOut,
    onProfileClick,
    onSettingsClick
}: ProfileItemProps) => {
    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center outline-none">
                    <div className="flex items-center gap-2 px-3 h-10 rounded-lg border border-gray-200 hover:border-primary-500 transition-colors">
                        <div className="relative w-6 h-6">
                            <Image
                                src={imageUrl}
                                alt={name}
                                fill
                                className="rounded-full object-cover"
                            />
                        </div>
                        <span className="text-sm font-medium hidden md:inline-block">{name}</span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={onProfileClick}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onSettingsClick}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onSignOut} className="text-red-600 hover:!text-red-600 hover:!bg-red-50">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default ProfileItem;
