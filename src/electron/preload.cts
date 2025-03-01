const electron = require('electron');

// Define the EventPayloadMapping interface directly
interface EventPayloadMapping {
    'get-system-info': 'CPU' | 'RAM' | 'STORAGE';
    'system-info-update': any;
    'window-control': 'CLOSE' | 'MAXIMIZE' | 'MINIMIZE';
    'file-open': { defaultPath?: string; filters?: any[] };
    'file-save': { defaultPath?: string; filters?: any[]; content: string };
    'file-read': string;
    'file-write': { path: string; content: string };
    'get-settings': undefined;
    'set-settings': Record<string, unknown>;
}

// Augment the Window interface
declare global {
    interface Window {
        electron: any; // Replace with proper type when implementing
    }
}

electron.contextBridge.exposeInMainWorld('electron', {
    // TODO: add methods here
} satisfies Window['electron']);

function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key
): Promise<EventPayloadMapping[Key]> {
    return electron.ipcRenderer.invoke(key);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    callback: (payload: EventPayloadMapping[Key]) => void
) {
    const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
    electron.ipcRenderer.on(key, cb);
    return () => electron.ipcRenderer.off(key, cb);
}

function ipcSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    payload: EventPayloadMapping[Key]
) {
    electron.ipcRenderer.send(key, payload);
}