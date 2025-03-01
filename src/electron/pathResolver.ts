import path from 'path';
import { app } from 'electron';
import { isDev } from './util.js';

export function getPreloadPath() {
    // Use the correct path to the preload script
    const preloadPath = path.join(app.getAppPath(), 'dist-electron', 'electron', 'preload', 'preload.js');
    console.log('Preload path:', preloadPath);
    return preloadPath;
}

export function getUIPath() {
    return path.join(app.getAppPath(), '/dist-react/index.html');
}

export function getAssetPath() {
    return path.join(app.getAppPath(), isDev() ? '.' : '..', '/src/assets');
}