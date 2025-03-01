import os from 'os';
import osUtils from 'os-utils';
import { SystemInfo, SystemInfoType } from '../../shared/types/ipc.js';

/**
 * Get system information based on the requested type
 * 
 * @param type The type of system information to get
 * @returns A promise that resolves to the system information
 */
export async function getSystemInfo(type: SystemInfoType): Promise<SystemInfo> {
    const timestamp = Date.now();

    switch (type) {
        case 'CPU':
            return getCpuInfo(timestamp);
        case 'RAM':
            return getRamInfo(timestamp);
        case 'STORAGE':
            return getStorageInfo(timestamp);
        default:
            throw new Error(`Invalid system info type: ${type}`);
    }
}

/**
 * Get CPU usage information
 * 
 * @param timestamp The timestamp of the request
 * @returns A promise that resolves to the CPU information
 */
async function getCpuInfo(timestamp: number): Promise<SystemInfo> {
    return new Promise((resolve) => {
        osUtils.cpuUsage((value) => {
            resolve({
                type: 'CPU',
                value: Math.round(value * 100),
                unit: '%',
                timestamp,
            });
        });
    });
}

/**
 * Get RAM usage information
 * 
 * @param timestamp The timestamp of the request
 * @returns The RAM information
 */
function getRamInfo(timestamp: number): SystemInfo {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const percentUsed = (usedMemory / totalMemory) * 100;

    return {
        type: 'RAM',
        value: Math.round(percentUsed),
        unit: '%',
        timestamp,
    };
}

/**
 * Get storage information
 * 
 * @param timestamp The timestamp of the request
 * @returns The storage information
 */
function getStorageInfo(timestamp: number): SystemInfo {
    // This is a placeholder as getting disk usage requires additional libraries
    // In a real application, you would use a library like 'diskusage' or 'node-disk-info'
    return {
        type: 'STORAGE',
        value: 50, // Placeholder value
        unit: '%',
        timestamp,
    };
} 