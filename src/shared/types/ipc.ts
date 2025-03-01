/**
 * Shared IPC types between main and renderer processes
 */

// Window frame control actions
export type FrameWindowAction = 'CLOSE' | 'MAXIMIZE' | 'MINIMIZE';

// System information types
export type SystemInfoType = 'CPU' | 'RAM' | 'STORAGE';

// File system access types
export type FileAccessPermission = 'read' | 'write' | 'readWrite';

// IPC channel names
export enum IpcChannels {
    // System
    GET_SYSTEM_INFO = 'get-system-info',
    SYSTEM_INFO_UPDATE = 'system-info-update',

    // Window management
    WINDOW_CONTROL = 'window-control',

    // File system
    FILE_OPEN = 'file-open',
    FILE_SAVE = 'file-save',
    FILE_READ = 'file-read',
    FILE_WRITE = 'file-write',

    // App settings
    GET_SETTINGS = 'get-settings',
    SET_SETTINGS = 'set-settings',
}

// IPC payload mapping
export interface IpcPayloadMap {
    [IpcChannels.GET_SYSTEM_INFO]: SystemInfoType;
    [IpcChannels.SYSTEM_INFO_UPDATE]: SystemInfo;
    [IpcChannels.WINDOW_CONTROL]: FrameWindowAction;
    [IpcChannels.FILE_OPEN]: { defaultPath?: string; filters?: FileFilter[] };
    [IpcChannels.FILE_SAVE]: { defaultPath?: string; filters?: FileFilter[]; content: string };
    [IpcChannels.FILE_READ]: string; // file path
    [IpcChannels.FILE_WRITE]: { path: string; content: string };
    [IpcChannels.GET_SETTINGS]: undefined;
    [IpcChannels.SET_SETTINGS]: Record<string, unknown>;
}

// System information interface
export interface SystemInfo {
    type: SystemInfoType;
    value: number;
    unit: string;
    timestamp: number;
}

// File filter interface for open/save dialogs
export interface FileFilter {
    name: string;
    extensions: string[];
}

// Response types
export interface IpcResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Type for IPC invoke function
export type IpcInvoke = <K extends keyof IpcPayloadMap>(
    channel: K,
    payload?: IpcPayloadMap[K]
) => Promise<IpcResponse<any>>;

// Type for IPC send function
export type IpcSend = <K extends keyof IpcPayloadMap>(
    channel: K,
    payload?: IpcPayloadMap[K]
) => void;

// Type for IPC on function
export type IpcOn = <K extends keyof IpcPayloadMap>(
    channel: K,
    listener: (payload: IpcPayloadMap[K]) => void
) => () => void; 