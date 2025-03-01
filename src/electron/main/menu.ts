import { BrowserWindow, Menu, shell } from 'electron';
import { APP_NAME } from '../../shared/constants/app.js';

/**
 * Set up the application menu
 * 
 * @param mainWindow The main application window
 */
export function setupMenu(mainWindow: BrowserWindow): void {
    const isMac = process.platform === 'darwin';

    const template: Electron.MenuItemConstructorOptions[] = [
        // App menu (macOS only)
        ...(isMac ? [{
            label: APP_NAME,
            submenu: [
                { role: 'about' as const },
                { type: 'separator' as const },
                { role: 'services' as const },
                { type: 'separator' as const },
                { role: 'hide' as const },
                { role: 'hideOthers' as const },
                { role: 'unhide' as const },
                { type: 'separator' as const },
                { role: 'quit' as const }
            ]
        }] : []),

        // File menu
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Window',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        // Create a new window
                        const newWindow = new BrowserWindow({
                            width: mainWindow.getBounds().width,
                            height: mainWindow.getBounds().height,
                            webPreferences: mainWindow.webContents.session.webRequest ? {
                                nodeIntegration: false,
                                contextIsolation: true,
                                preload: mainWindow.webContents.session.getPreloads()[0]
                            } : undefined
                        });

                        // Load the same URL as the main window
                        newWindow.loadURL(mainWindow.webContents.getURL());
                    }
                },
                { type: 'separator' as const },
                isMac ? { role: 'close' as const } : { role: 'quit' as const }
            ]
        },

        // Edit menu
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' as const },
                { role: 'redo' as const },
                { type: 'separator' as const },
                { role: 'cut' as const },
                { role: 'copy' as const },
                { role: 'paste' as const },
                ...(isMac ? [
                    { role: 'pasteAndMatchStyle' as const },
                    { role: 'delete' as const },
                    { role: 'selectAll' as const },
                    { type: 'separator' as const },
                    {
                        label: 'Speech',
                        submenu: [
                            { role: 'startSpeaking' as const },
                            { role: 'stopSpeaking' as const }
                        ]
                    }
                ] : [
                    { role: 'delete' as const },
                    { type: 'separator' as const },
                    { role: 'selectAll' as const }
                ])
            ]
        },

        // View menu
        {
            label: 'View',
            submenu: [
                { role: 'reload' as const },
                { role: 'forceReload' as const },
                { role: 'toggleDevTools' as const },
                { type: 'separator' as const },
                { role: 'resetZoom' as const },
                { role: 'zoomIn' as const },
                { role: 'zoomOut' as const },
                { type: 'separator' as const },
                { role: 'togglefullscreen' as const }
            ]
        },

        // Window menu
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' as const },
                { role: 'zoom' as const },
                ...(isMac ? [
                    { type: 'separator' as const },
                    { role: 'front' as const },
                    { type: 'separator' as const },
                    { role: 'window' as const }
                ] : [
                    { role: 'close' as const }
                ])
            ]
        },

        // Help menu
        {
            role: 'help' as const,
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        await shell.openExternal('https://github.com/yourusername/electron-react-typescript-boilerplate');
                    }
                },
                {
                    label: 'Documentation',
                    click: async () => {
                        await shell.openExternal('https://github.com/yourusername/electron-react-typescript-boilerplate#readme');
                    }
                },
                { type: 'separator' as const },
                {
                    label: 'Report an Issue',
                    click: async () => {
                        await shell.openExternal('https://github.com/yourusername/electron-react-typescript-boilerplate/issues');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
} 