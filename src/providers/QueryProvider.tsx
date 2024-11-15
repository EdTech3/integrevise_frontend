'use client';

import { errorToast } from '@/lib/toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute
                gcTime: 5 * 60 * 1000, // 5 minutes
                retry: (failureCount, error) => {
                    if (error instanceof Error && error.message === 'Unauthorized') {
                        return false;
                    }
                    return failureCount < 3;
                },
                refetchOnWindowFocus: false,
            },
            mutations: {
                retry: 2,
                onError: (error) => {
                    if (error instanceof Error) {
                        errorToast(error.message);
                    }
                },
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
