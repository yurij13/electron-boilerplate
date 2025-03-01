import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/sidebar.js';
import { Header } from '../components/header.js';
import { useState, useEffect } from 'react';

/**
 * Main application layout
 */
export function MainLayout() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile && !sidebarOpen) {
                setSidebarOpen(true);
            } else if (mobile && sidebarOpen) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [sidebarOpen]);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar - fixed for desktop, overlay for mobile */}
            {sidebarOpen && (
                <>
                    {/* Mobile overlay */}
                    {isMobile && (
                        <div
                            className="fixed inset-0 bg-black/50 z-20"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    {/* Sidebar component */}
                    <div className={`${isMobile ? 'fixed left-0 top-0 h-full z-30' : 'relative'} w-64`}>
                        <Sidebar onClose={() => setSidebarOpen(false)} />
                    </div>
                </>
            )}

            {/* Main content area */}
            <div className="flex flex-col flex-1 w-0 overflow-hidden">
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <main className="flex-1 overflow-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
} 