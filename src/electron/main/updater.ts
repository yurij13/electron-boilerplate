import { app, autoUpdater, dialog, BrowserWindow } from 'electron';
import { isDev } from '../util.js';

// URL to the update server
const UPDATE_SERVER_URL = 'https://update.electronjs.org';

/**
 * Set up the auto updater
 */
export function setupUpdater(): void {
    // Skip auto updates in development
    if (isDev()) {
        return;
    }

    // Configure the auto updater
    const appName = app.getName();
    const appVersion = app.getVersion();

    // Set the feed URL for the auto updater
    try {
        const platform = process.platform === 'darwin' ? 'osx' : process.platform;
        const feedURL = `${UPDATE_SERVER_URL}/${appName}/${platform}-${process.arch}/${appVersion}`;

        autoUpdater.setFeedURL({ url: feedURL });

        // Check for updates every hour
        setInterval(() => {
            autoUpdater.checkForUpdates();
        }, 60 * 60 * 1000);

        // Check for updates on startup
        autoUpdater.checkForUpdates();

        // Set up event handlers
        setupAutoUpdaterEvents();
    } catch (error) {
        console.error('Error setting up auto updater:', error);
    }
}

/**
 * Set up auto updater event handlers
 */
function setupAutoUpdaterEvents(): void {
    // Update available
    autoUpdater.on('update-available', () => {
        console.log('Update available');
    });

    // Update not available
    autoUpdater.on('update-not-available', () => {
        console.log('No update available');
    });

    // Update downloaded
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        // Show a dialog to the user
        const mainWindow = BrowserWindow.getAllWindows()[0];

        dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Update Ready',
            message: `A new version (${releaseName}) is ready to install.`,
            detail: 'The update will be installed when you restart the application.',
            buttons: ['Restart Now', 'Later'],
            defaultId: 0,
        }).then(({ response }) => {
            if (response === 0) {
                // Restart the app and install the update
                autoUpdater.quitAndInstall();
            }
        });
    });

    // Error
    autoUpdater.on('error', (error) => {
        console.error('Auto updater error:', error);
    });
} 