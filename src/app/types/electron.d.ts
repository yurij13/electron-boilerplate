import {
    SystemInfoType,
    FrameWindowAction,
    SystemInfo,
    FileFilter,
    IpcResponse
} from '../../shared/types/ipc.js';

declare global {
    interface Window {
        electron: {
            // System information
            getSystemInfo: (type: SystemInfoType) => Promise<IpcResponse<SystemInfo>>;
            onSystemInfoUpdate: (callback: (info: SystemInfo) => void) => () => void;

            // Window management
            controlWindow: (action: FrameWindowAction) => void;

            // File system
            openFile: (options?: { defaultPath?: string; filters?: FileFilter[] }) =>
                Promise<IpcResponse<string | null>>;
            saveFile: (options: { defaultPath?: string; filters?: FileFilter[]; content: string }) =>
                Promise<IpcResponse<string | null>>;
            readFile: (path: string) => Promise<IpcResponse<string>>;
            writeFile: (path: string, content: string) => Promise<IpcResponse<boolean>>;

            // Settings
            getSettings: () => Promise<IpcResponse<Record<string, unknown>>>;
            setSettings: (settings: Record<string, unknown>) => Promise<IpcResponse<boolean>>;
        };
    }
} 