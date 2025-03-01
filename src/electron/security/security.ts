import { BrowserWindow, session, WebContents } from 'electron';
import { isDev } from '../util.js';

/**
 * Set up security features for the application
 */
export function setupSecurity(mainWindow: BrowserWindow): void {
    // Set Content Security Policy
    setupCSP(mainWindow.webContents);

    // Set permission handlers
    setupPermissionHandlers();

    // Prevent navigation to disallowed protocols
    preventDisallowedNavigation(mainWindow);

    // Disable certain features
    disableUnsafeFeatures();
}

/**
 * Set up Content Security Policy
 */
function setupCSP(webContents: WebContents): void {
    // Skip CSP in development mode to allow hot reloading
    if (isDev()) return;

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    "default-src 'self';",
                    "script-src 'self';",
                    "style-src 'self' 'unsafe-inline';",
                    "img-src 'self' data:;",
                    "font-src 'self';",
                    "connect-src 'self';",
                    "worker-src 'self';",
                    "frame-src 'none';",
                    "object-src 'none';",
                ].join(' ')
            }
        });
    });
}

/**
 * Set up permission handlers
 */
function setupPermissionHandlers(): void {
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
        const url = webContents.getURL();

        // Allow permissions from our app origin
        if (url.startsWith('file://') || (isDev() && url.startsWith('http://localhost'))) {
            // Allowed permissions
            if (
                permission === 'notifications' ||
                permission === 'clipboard-read' ||
                permission === 'clipboard-sanitized-write' ||
                permission === 'media'
            ) {
                return callback(true);
            }
        }

        // Deny all other permissions
        callback(false);
    });
}

/**
 * Prevent navigation to disallowed protocols
 */
function preventDisallowedNavigation(mainWindow: BrowserWindow): void {
    mainWindow.webContents.on('will-navigate', (event, url) => {
        const allowedOrigins = isDev()
            ? ['http://localhost:5173']
            : ['file://'];

        const { origin } = new URL(url);

        if (!allowedOrigins.includes(origin)) {
            event.preventDefault();
            console.warn(`Navigation to disallowed origin blocked: ${origin}`);
        }
    });
}

/**
 * Disable unsafe features
 */
function disableUnsafeFeatures(): void {
    // Disable navigation to file:// URLs from remote content
    session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
        const url = details.url;

        // Block navigation to file:// URLs from non-file origins
        if (url.startsWith('file://') && details.referrer && !details.referrer.startsWith('file://')) {
            callback({ cancel: true });
            return;
        }

        callback({ cancel: false });
    });
} 