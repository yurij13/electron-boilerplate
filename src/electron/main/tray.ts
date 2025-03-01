import { app, BrowserWindow, Menu, Tray, nativeImage } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { APP_NAME } from '../../shared/constants/app.js';
import { getAssetsPath } from '../utils/pathResolver.js';

// Keep a reference to the tray to prevent garbage collection
let tray: Tray | null = null;

/**
 * Set up the system tray
 * 
 * @param mainWindow The main application window
 */
export function setupTray(mainWindow: BrowserWindow): void {
    // Get the tray icon path
    const iconPath = path.join(getAssetsPath(), 'icons', 'tray.png');

    // Create the tray icon
    const icon = nativeImage.createFromPath(iconPath);
    tray = new Tray(icon.resize({ width: 16, height: 16 }));

    // Set the tooltip
    tray.setToolTip(APP_NAME);

    // Create the context menu
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: () => {
                mainWindow.show();
            },
        },
        {
            label: 'Hide App',
            click: () => {
                mainWindow.hide();
            },
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                app.quit();
            },
        },
    ]);

    // Set the context menu
    tray.setContextMenu(contextMenu);

    // Show the app when the tray icon is clicked
    tray.on('click', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
        }
    });
} 