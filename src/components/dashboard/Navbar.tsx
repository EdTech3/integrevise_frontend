import React from 'react';
import SearchBar from '../shared/SearchBar';
import ProfileItem from '../shared/ProfileItem';

const Navbar = () => {
    const handleSearch = (value: string) => {
        console.log('Searching for:', value);
        // Implement search logic here
    };

    const handleSignOut = () => {
        console.log('Sign out');
        // Implement sign out logic
    };

    const handleProfile = () => {
        console.log('Profile clicked');
        // Handle profile navigation
    };

    const handleSettings = () => {
        console.log('Settings clicked');
        // Handle settings navigation
    };

    return (
        <nav className="h-16 bg-background border-b flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
                <h1 className="text-lg font-medium">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
                <SearchBar
                    placeholder="Search anything..."
                    className="w-[320px] hidden md:block"
                    onSearch={handleSearch}
                />
                <ProfileItem
                    name="John Doe"
                    onSignOut={handleSignOut}
                    onProfileClick={handleProfile}
                    onSettingsClick={handleSettings}
                />
            </div>
        </nav>
    );
};

export default Navbar;
