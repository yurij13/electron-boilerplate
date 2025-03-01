import { ipcMain, BrowserWindow, dialog } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import { IpcChannels, IpcResponse, SystemInfoType } from '../../shared/types/ipc.js';
import { validateIpcOrigin, validateIpcPayload } from './validator.js';
import { getSystemInfo } from '../main/system.js';
import ElectronStore from 'electron-store';

// Create a store for app settings
const settingsStore = new ElectronStore({
    name: 'settings',
    defaults: {
        theme: 'system',
        language: 'en',
        notifications: true,
        autoUpdate: true,
        hardwareAcceleration: true,
    },
});

/**
 * Set up all IPC handlers
 */
export function setupIpcHandlers(): void {
    // Set up system info handlers
    setupSystemInfoHandlers();

    // Set up window control handlers
    setupWindowHandlers();

    // Set up file system handlers
    setupFileSystemHandlers();

    // Set up settings handlers
    setupSettingsHandlers();
}

/**
 * Set up system info handlers
 */
function setupSystemInfoHandlers(): void {
    // Handle get system info requests
    ipcMain.handle(IpcChannels.GET_SYSTEM_INFO, async (event, type: SystemInfoType) => {
        try {
            // Validate the request origin
            validateIpcOrigin(event);

            // Validate the payload
            validateIpcPayload(type, null);

            // Get the system info
            const info = await getSystemInfo(type);

            // Return the response
            return {
                success: true,
                data: info,
            } as IpcResponse<any>;
        } catch (error) {
            console.error('Error handling get system info request:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            } as IpcResponse<any>;
        }
    });
}

/**
 * Set up window control handlers
 */
function setupWindowHandlers(): void {
    // Handle window control requests
    ipcMain.on(IpcChannels.WINDOW_CONTROL, (event, action) => {
        try {
            // Validate the request origin
            validateIpcOrigin(event);

            // Validate the payload
            validateIpcPayload(action, null);

            // Get the browser window
            const window = BrowserWindow.fromWebContents(event.sender);
            if (!window) {
                throw new Error('Window not found');
            }

            // Perform the action
            switch (action) {
                case 'CLOSE':
                    window.close();
                    break;
                case 'MAXIMIZE':
                    if (window.isMaximized()) {
                        window.unmaximize();
                    } else {
                        window.maximize();
                    }
                    break;
                case 'MINIMIZE':
                    window.minimize();
                    break;
                default:
                    throw new Error(`Invalid window action: ${action}`);
            }
        } catch (error) {
            console.error('Error handling window control request:', error);
        }
    });
}

/**
 * Set up file system handlers
 */
function setupFileSystemHandlers(): void {
    // Handle file open requests
    ipcMain.handle(IpcChannels.FILE_OPEN, async (event, options) => {
        try {
            // Validate the request origin
            validateIpcOrigin(event);

            // Get the browser window
            const window = BrowserWindow.fromWebContents(event.sender);
            if (!window) {
                throw new Error('Window not found');
            }

            // Show the open dialog
            const result = await dialog.showOpenDialog(window, {
                properties: ['openFile'],
                defaultPath: options?.defaultPath,
                filters: options?.filters,
            });

            // Return the selected file path
            if (result.canceled || result.filePaths.length === 0) {
                return {
                    success: true,
                    data: null,
                } as IpcResponse<string | null>;
            }

            return {
                success: true,
                data: result.filePaths[0],
            } as IpcResponse<string | null>;
        } catch (error) {
            console.error('Error opening file dialog:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            } as IpcResponse<string | null>;
        }
    });

    // Save file dialog
    ipcMain.handle(IpcChannels.FILE_SAVE, async (event, options) => {
        try {
            // Validate the request origin
            validateIpcOrigin(event);

            // Get the browser window from the event sender
            const window = BrowserWindow.fromWebContents(event.sender);
            if (!window) {
                throw new Error('Window not found');
            }

            // Show the save file dialog
            const result = await dialog.showSaveDialog(window, {
                defaultPath: options?.defaultPath,
                filters: options?.filters,
            });

            // If the dialog was canceled, return null
            if (result.canceled || !result.filePath) {
                return {
                    success: true,
                    data: null,
                } as IpcResponse<string | null>;
            }

            // Write the content to the file
            await fs.writeFile(result.filePath, options.content, 'utf-8');

            return {
                success: true,
                data: result.filePath,
            } as IpcResponse<string | null>;
        } catch (error) {
            console.error('Error saving file:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            } as IpcResponse<string | null>;
        }
    });

    // Read file
    ipcMain.handle(IpcChannels.FILE_READ, async (event, filePath) => {
        try {
            // Validate the request origin
            validateIpcOrigin(event);

            // Read the file
            const content = await fs.readFile(filePath, 'utf-8');

            return {
                success: true,
                data: content,
            } as IpcResponse<string>;
        } catch (error) {
            console.error('Error reading file:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            } as IpcResponse<string>;
        }
    });

    // Write file
    ipcMain.handle(IpcChannels.FILE_WRITE, async (event, options) => {
        try {
            // Validate the request origin
            validateIpcOrigin(event);

            // Write the content to the file
            await fs.writeFile(options.path, options.content, 'utf-8');

            return {
                success: true,
                data: true,
            } as IpcResponse<boolean>;
        } catch (error) {
            console.error('Error writing file:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            } as IpcResponse<boolean>;
        }
    });
}

/**
 * Set up settings IPC handlers
 */
function setupSettingsHandlers(): void {
    // Get settings
    ipcMain.handle(IpcChannels.GET_SETTINGS, (event) => {
        try {
            // Validate the request origin
            validateIpcOrigin(event);

            // Get all settings
            const settings = settingsStore.store;

            return {
                success: true,
                data: settings,
            } as IpcResponse<Record<string, unknown>>;
        } catch (error) {
            console.error('Error getting settings:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            } as IpcResponse<Record<string, unknown>>;
        }
    });

    // Set settings
    ipcMain.handle(IpcChannels.SET_SETTINGS, (event, settings) => {
        try {
            // Validate the request origin
            validateIpcOrigin(event);

            // Update the settings
            Object.entries(settings).forEach(([key, value]) => {
                settingsStore.set(key, value);
            });

            return {
                success: true,
                data: true,
            } as IpcResponse<boolean>;
        } catch (error) {
            console.error('Error setting settings:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            } as IpcResponse<boolean>;
        }
    });
} 