import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onSearch?: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
    ({ onSearch, placeholder = "Search...", className = "", ...props }, ref) => {
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.elements.namedItem('search') as HTMLInputElement;
            onSearch?.(input.value);
        };

        return (
            <form
                onSubmit={handleSubmit}
                className={`relative flex items-center ${className}`}
            >
                <Search
                    size={18}
                    className="absolute left-3 text-gray-400"
                />
                <input
                    {...props}
                    ref={ref}
                    name="search"
                    type="search"
                    placeholder={placeholder}
                    className="h-10 pl-10 pr-4 w-full rounded-lg border border-gray-200 
                             focus:outline-none focus:border-primary-500 focus:ring-1 
                             focus:ring-primary-500 transition-colors"
                />
            </form>
        );
    }
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
