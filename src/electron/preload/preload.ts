import { contextBridge, ipcRenderer } from 'electron';
import {
    IpcChannels,
    IpcInvoke,
    IpcOn,
    IpcSend,
    SystemInfoType,
    FrameWindowAction,
    SystemInfo,
    FileFilter
} from '../../shared/types/ipc.js';

/**
 * Invoke an IPC method and return the result
 * 
 * @param channel The IPC channel to invoke
 * @param payload The payload to send
 * @returns A promise that resolves to the result
 */
const ipcInvoke: IpcInvoke = (channel, payload) => {
    return ipcRenderer.invoke(channel, payload);
};

/**
 * Send an IPC message
 * 
 * @param channel The IPC channel to send to
 * @param payload The payload to send
 */
const ipcSend: IpcSend = (channel, payload) => {
    ipcRenderer.send(channel, payload);
};

/**
 * Listen for IPC messages
 * 
 * @param channel The IPC channel to listen on
 * @param listener The listener function
 * @returns A function to remove the listener
 */
const ipcOn: IpcOn = (channel, listener) => {
    const subscription = (_: Electron.IpcRendererEvent, payload: any) => listener(payload);
    ipcRenderer.on(channel, subscription);

    return () => {
        ipcRenderer.removeListener(channel, subscription);
    };
};

// Expose protected methods that allow the renderer process to use IPC
contextBridge.exposeInMainWorld('electron', {
    // System information
    getSystemInfo: (type: SystemInfoType) => ipcInvoke(IpcChannels.GET_SYSTEM_INFO, type),
    onSystemInfoUpdate: (callback: (info: SystemInfo) => void) => ipcOn(IpcChannels.SYSTEM_INFO_UPDATE, callback),

    // Window management
    controlWindow: (action: FrameWindowAction) => ipcSend(IpcChannels.WINDOW_CONTROL, action),

    // File system
    openFile: (options?: { defaultPath?: string; filters?: FileFilter[] }) =>
        ipcInvoke(IpcChannels.FILE_OPEN, options),
    saveFile: (options: { defaultPath?: string; filters?: FileFilter[]; content: string }) =>
        ipcInvoke(IpcChannels.FILE_SAVE, options),
    readFile: (path: string) => ipcInvoke(IpcChannels.FILE_READ, path),
    writeFile: (path: string, content: string) => ipcInvoke(IpcChannels.FILE_WRITE, { path, content }),

    // Settings
    getSettings: () => ipcInvoke(IpcChannels.GET_SETTINGS),
    setSettings: (settings: Record<string, unknown>) => ipcInvoke(IpcChannels.SET_SETTINGS, settings),
}); 