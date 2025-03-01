import { app, BrowserWindow, shell } from 'electron';
import { setupIpcHandlers } from './ipc/handlers.js';
import { createTray } from './tray.js';
import { setupMenu } from './main/menu.js';
import { setupUpdater } from './main/updater.js';
import { setupSecurity } from './security/security.js';
import { getPreloadPath, getUIPath } from './pathResolver.js';
import { isDev } from './util.js';

import {
    DEFAULT_WINDOW_WIDTH,
    DEFAULT_WINDOW_HEIGHT,
    MIN_WINDOW_WIDTH,
    MIN_WINDOW_HEIGHT
} from '../shared/constants/app.js';

// Keep a global reference of the window object to avoid garbage collection
let mainWindow: BrowserWindow | null = null;

/**
 * Create the main application window
 */
function createMainWindow() {
    // Create the browser window with a macOS-friendly configuration
    const preloadPath = getPreloadPath();
    console.log('Using preload path:', preloadPath);

    // Create window with platform-specific settings
    const isMac = process.platform === 'darwin';

    mainWindow = new BrowserWindow({
        width: DEFAULT_WINDOW_WIDTH,
        height: DEFAULT_WINDOW_HEIGHT,
        minWidth: MIN_WINDOW_WIDTH,
        minHeight: MIN_WINDOW_HEIGHT,
        // macOS-specific settings
        titleBarStyle: isMac ? 'hiddenInset' : 'default', // 'hiddenInset' gives native controls on macOS
        trafficLightPosition: { x: 10, y: 10 },
        // General settings
        show: false, // Don't show until ready
        backgroundColor: '#ffffff',
        frame: true, // Use native window frame
        webPreferences: {
            preload: preloadPath,
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false, // Disable sandbox for testing
        },
    });

    // Load the app
    if (isDev()) {
        // In development, load from the dev server
        mainWindow.loadURL('http://localhost:5173');

        // Open DevTools in development
        mainWindow.webContents.openDevTools();
    } else {
        // In production, load from the built files
        mainWindow.loadFile(getUIPath());
    }

    // Show window when ready to avoid flashing
    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
        mainWindow?.focus();
    });

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        // Open external URLs in the default browser
        if (url.startsWith('http:') || url.startsWith('https:')) {
            shell.openExternal(url);
        }
        return { action: 'deny' };
    });

    // Handle window close events
    handleWindowCloseEvents(mainWindow);

    return mainWindow;
}

/**
 * Handle window close events
 */
function handleWindowCloseEvents(window: BrowserWindow) {
    let willQuitApp = false;

    // Handle app quit event
    app.on('before-quit', () => {
        willQuitApp = true;
    });

    // Handle window close event
    window.on('close', (event) => {
        // If not quitting the app, just hide the window
        if (!willQuitApp) {
            event.preventDefault();
            window.hide();

            // On macOS, hide the dock icon when all windows are closed
            if (process.platform === 'darwin' && app.dock) {
                app.dock.hide();
            }
            return;
        }
    });

    // Show dock icon when window is shown (macOS)
    window.on('show', () => {
        if (process.platform === 'darwin' && app.dock) {
            app.dock.show();
        }
    });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
    // Set up IPC handlers
    setupIpcHandlers();

    // Create the main window
    createMainWindow();

    // Set up the system tray
    if (mainWindow) {
        createTray(mainWindow);
    }

    // Set up the application menu
    if (mainWindow) {
        setupMenu(mainWindow);
    }

    // Set up the auto updater
    setupUpdater();

    // On macOS, recreate window when dock icon is clicked
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        } else {
            mainWindow?.show();
        }
    });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
});