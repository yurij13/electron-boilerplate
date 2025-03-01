import path from 'path';
import { fileURLToPath } from 'url';
import { IS_DEV } from '../../shared/constants/app.js';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the path to the preload script
 */
export function getPreloadPath(): string {
    return IS_DEV
        ? path.join(__dirname, '..', 'preload', 'preload.js')
        : path.join(process.resourcesPath, 'app.asar.unpacked', 'dist-electron', 'preload', 'preload.js');
}

/**
 * Get the path to the UI (renderer) files
 */
export function getUIPath(): string {
    return IS_DEV
        ? path.join(__dirname, '..', '..', '..', 'index.html')
        : path.join(process.resourcesPath, 'app.asar.unpacked', 'dist-react', 'index.html');
}

/**
 * Get the path to the application's user data directory
 */
export function getUserDataPath(): string {
    return path.join(process.env.APPDATA || (
        process.platform === 'darwin'
            ? path.join(process.env.HOME || '', 'Library', 'Application Support')
            : path.join(process.env.HOME || '', '.config')
    ), 'electron-react-ts-boilerplate');
}

/**
 * Get the path to a file in the application's user data directory
 */
export function getUserDataFilePath(fileName: string): string {
    return path.join(getUserDataPath(), fileName);
}

/**
 * Get the path to the application's assets directory
 */
export function getAssetsPath(): string {
    return IS_DEV
        ? path.join(__dirname, '..', '..', '..', 'assets')
        : path.join(process.resourcesPath, 'app.asar.unpacked', 'assets');
} 