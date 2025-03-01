import {
    SystemInfoType,
    FrameWindowAction,
    SystemInfo,
    FileFilter,
    IpcResponse
} from './src/shared/types/ipc';

type View = 'CPU' | 'RAM' | 'STORAGE';

type EventPayloadMapping = {
    // TODO: add payloads here
};

type UnsubscribeFunction = () => void;

// Extend the Window interface to include our electron API
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