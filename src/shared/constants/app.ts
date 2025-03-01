/**
 * Application constants shared between main and renderer processes
 */

// Application information
export const APP_NAME = 'Electron React TS Boilerplate';
export const APP_VERSION = '1.0.0';

// Window dimensions
export const DEFAULT_WINDOW_WIDTH = 1200;
export const DEFAULT_WINDOW_HEIGHT = 800;
export const MIN_WINDOW_WIDTH = 1024;
export const MIN_WINDOW_HEIGHT = 768;

// Development mode
export const IS_DEV = process.env.NODE_ENV === 'development';

// File paths
export const CONFIG_FILE_NAME = 'config.json';

// Routes
export const ROUTES = {
    HOME: '/',
    SETTINGS: '/settings',
    ABOUT: '/about',
};

// Local storage keys
export const STORAGE_KEYS = {
    THEME: 'app-theme',
    LANGUAGE: 'app-language',
    USER_SETTINGS: 'user-settings',
};

// Themes
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
};

// Languages
export const LANGUAGES = {
    EN: 'en',
    FR: 'fr',
    DE: 'de',
    ES: 'es',
};

// Default settings
export const DEFAULT_SETTINGS = {
    theme: THEMES.SYSTEM,
    language: LANGUAGES.EN,
    notifications: true,
    autoUpdate: true,
    hardwareAcceleration: true,
};

// Timeouts
export const TIMEOUTS = {
    NOTIFICATION: 5000,
    DEBOUNCE: 300,
    THROTTLE: 500,
};

// API endpoints (if applicable)
export const API = {
    BASE_URL: 'https://api.example.com',
    TIMEOUT: 10000,
}; 