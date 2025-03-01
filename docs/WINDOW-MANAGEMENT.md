# Window Management Guide

This document explains how window management is implemented in the Electron Boilerplate.

## Overview

Proper window management is crucial for a good user experience in desktop applications. This includes:

- Window creation and configuration
- Draggable regions for frameless windows
- Platform-specific behaviors
- Window state persistence

## Window Configuration

### Basic Configuration

The main window is created in `src/electron/main.ts` with platform-specific settings:

```typescript
function createMainWindow() {
    const isMac = process.platform === 'darwin';
    
    mainWindow = new BrowserWindow({
        width: DEFAULT_WINDOW_WIDTH,
        height: DEFAULT_WINDOW_HEIGHT,
        minWidth: MIN_WINDOW_WIDTH,
        minHeight: MIN_WINDOW_HEIGHT,
        // macOS-specific settings
        titleBarStyle: isMac ? 'hiddenInset' : 'default',
        trafficLightPosition: { x: 10, y: 10 },
        // General settings
        show: false,
        backgroundColor: '#ffffff',
        frame: true,
        webPreferences: {
            preload: preloadPath,
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
        },
    });
}
```

### Platform-Specific Settings

Different platforms have different window behaviors:

- **macOS**: Uses `titleBarStyle: 'hiddenInset'` for a native look with traffic lights
- **Windows/Linux**: Uses `frame: true` for standard window decorations

## Draggable Regions

For custom window frames or frameless windows, we need to define draggable regions:

### CSS Classes

In `src/app/App.css`:

```css
.app-drag-region {
  -webkit-app-region: drag;
  app-region: drag;
}

.app-no-drag {
  -webkit-app-region: no-drag;
  app-region: no-drag;
}
```

### Application in Components

The header component uses these classes:

```tsx
<header className="border-b border-border h-14 px-4 flex items-center justify-between app-drag-region">
    <div className="flex items-center space-x-3 app-no-drag">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">{APP_NAME}</h1>
    </div>
    
    <div className="flex items-center space-x-2 app-no-drag">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
    </div>
</header>
```

## Window Controls

### IPC Communication

Window controls (minimize, maximize, close) are handled through IPC:

```typescript
// In preload.ts
contextBridge.exposeInMainWorld('electron', {
    // Window management
    controlWindow: (action: FrameWindowAction) => ipcSend(IpcChannels.WINDOW_CONTROL, action),
    // ...other methods
});

// In handlers.ts
function setupWindowHandlers(): void {
    ipcMain.on(IpcChannels.WINDOW_CONTROL, (event, action: FrameWindowAction) => {
        validateIpcOrigin(event);
        validateIpcPayload(action, frameWindowActionSchema);
        
        const window = BrowserWindow.fromWebContents(event.sender);
        if (!window) return;
        
        switch (action) {
            case 'MINIMIZE':
                window.minimize();
                break;
            case 'MAXIMIZE':
                if (window.isMaximized()) {
                    window.unmaximize();
                } else {
                    window.maximize();
                }
                break;
            case 'CLOSE':
                window.close();
                break;
        }
    });
}
```

### Custom Window Controls Component

For custom window controls, we use the `WindowControls` component:

```tsx
export function WindowControls() {
    const isElectron = window.electron !== undefined;

    if (!isElectron) {
        return null;
    }

    const handleMinimize = () => {
        window.electron.controlWindow('MINIMIZE');
    };

    const handleMaximize = () => {
        window.electron.controlWindow('MAXIMIZE');
    };

    const handleClose = () => {
        window.electron.controlWindow('CLOSE');
    };

    return (
        <div className="flex items-center space-x-1">
            <Button
                variant="ghost"
                size="icon"
                onClick={handleMinimize}
                className="h-8 w-8 hover:bg-accent"
                title="Minimize"
            >
                <Minimize2 className="h-4 w-4" />
            </Button>
            {/* Other buttons */}
        </div>
    );
}
```

## Window Events

### Ready-to-Show

We show the window only when it's ready to avoid flashing:

```typescript
mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    mainWindow?.focus();
});
```

### Close Behavior

Custom close behavior is implemented to hide the window instead of closing it on macOS:

```typescript
function handleWindowCloseEvents(window: BrowserWindow) {
    let willQuitApp = false;

    app.on('before-quit', () => {
        willQuitApp = true;
    });

    window.on('close', (event) => {
        if (!willQuitApp) {
            event.preventDefault();
            window.hide();
            
            if (process.platform === 'darwin' && app.dock) {
                app.dock.hide();
            }
            return;
        }
    });
}
```

## Window State Persistence

To persist window position and size between sessions, we can use the `electron-window-state` package:

```typescript
import windowStateKeeper from 'electron-window-state';

function createMainWindow() {
    // Load the previous state with fallback to defaults
    const mainWindowState = windowStateKeeper({
        defaultWidth: DEFAULT_WINDOW_WIDTH,
        defaultHeight: DEFAULT_WINDOW_HEIGHT
    });
    
    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        // ...other options
    });
    
    // Register listeners on the window to update state
    mainWindowState.manage(mainWindow);
}
```

## Best Practices

1. **Always use `show: false` and `ready-to-show`**: This prevents visual flashing when the app starts
2. **Set minimum window dimensions**: Prevents UI layout issues with too-small windows
3. **Use platform-specific settings**: Respect each platform's UI conventions
4. **Make interactive elements non-draggable**: Apply `app-no-drag` to buttons and inputs
5. **Persist window state**: Save and restore window position and size
6. **Handle external links properly**: Open external URLs in the default browser

## Troubleshooting

Common window management issues:

1. **Window not draggable**: Check that draggable regions are properly set up
2. **Window flashing on startup**: Use `show: false` and the `ready-to-show` event
3. **Window controls not working**: Verify IPC communication for window control actions
4. **Window size issues**: Ensure minimum dimensions are set and respected 