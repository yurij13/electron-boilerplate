import { ReactNode } from 'react';
import { RouterProvider } from './router-provider.js';
import { ThemeProvider } from './theme-provider.js';

interface ProvidersProps {
    children: ReactNode;
}

/**
 * Combines all providers into a single component
 */
export function Providers({ children }: ProvidersProps) {
    return (
        <RouterProvider>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </RouterProvider>
    );
} 