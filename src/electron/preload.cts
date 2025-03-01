const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
    // IPC Renderer functions here

} satisfies Window['electron']);

