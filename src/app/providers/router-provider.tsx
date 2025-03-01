import { ReactNode } from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';

interface RouterProviderProps {
    children: ReactNode;
}

/**
 * Router provider component
 * 
 * Uses HashRouter in production (for Electron) and BrowserRouter in development
 */
export function RouterProvider({ children }: RouterProviderProps) {
    // Check if we're in development mode
    const isDev = import.meta.env.DEV;

    // Use HashRouter in production for Electron (file:// protocol)
    // Use BrowserRouter in development for better dev experience
    if (isDev) {
        return <BrowserRouter>{children}</BrowserRouter>;
    }

    return <HashRouter>{children}</HashRouter>;
} 