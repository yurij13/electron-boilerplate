import { ipcMain } from "electron";

export const isDev = (): boolean => {
    return process.env.NODE_ENV === 'development';
}
export const isProd = (): boolean => {
    return process.env.NODE_ENV === 'production';
}

export const isMac = (): boolean => {
    return process.platform === 'darwin';
}

function ipcHandle<Key extends keyof EventPayloadMapping>(
    key: Key,
    handler: () => EventPayloadMapping[Key]
) {
    ipcMain.handle(key, () => handler());
}
