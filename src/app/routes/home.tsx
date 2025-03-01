import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.js';
import { SystemInfo } from '../../shared/types/ipc.js';

/**
 * Home page component
 */
export function HomePage() {
    const [cpuInfo, setCpuInfo] = useState<SystemInfo | null>(null);
    const [ramInfo, setRamInfo] = useState<SystemInfo | null>(null);

    // Fetch system information on mount
    useEffect(() => {
        const fetchSystemInfo = async () => {
            try {
                // Check if electron API is available
                if (!window.electron?.getSystemInfo) {
                    console.warn('Electron API not available');
                    return;
                }

                // Fetch CPU info
                const cpuResponse = await window.electron.getSystemInfo('CPU');
                if (cpuResponse.success && cpuResponse.data) {
                    setCpuInfo(cpuResponse.data);
                }

                // Fetch RAM info
                const ramResponse = await window.electron.getSystemInfo('RAM');
                if (ramResponse.success && ramResponse.data) {
                    setRamInfo(ramResponse.data);
                }
            } catch (error) {
                console.error('Error fetching system info:', error);
            }
        };

        // Fetch initial data
        fetchSystemInfo();

        // Set up interval to fetch data every 2 seconds
        const interval = setInterval(fetchSystemInfo, 2000);

        // Clean up interval on unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>CPU Usage</CardTitle>
                        <CardDescription>Current CPU utilization</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {cpuInfo ? `${cpuInfo.value}${cpuInfo.unit}` : 'Loading...'}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Memory Usage</CardTitle>
                        <CardDescription>Current RAM utilization</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {ramInfo ? `${ramInfo.value}${ramInfo.unit}` : 'Loading...'}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Information</CardTitle>
                        <CardDescription>Basic system details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div>
                                <span className="font-medium">Platform: </span>
                                <span>{navigator.platform}</span>
                            </div>
                            <div>
                                <span className="font-medium">User Agent: </span>
                                <span className="text-sm">{navigator.userAgent}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 