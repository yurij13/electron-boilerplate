# IPC Implementation Guide

This document explains how Inter-Process Communication (IPC) is implemented in the Electron React TypeScript Boilerplate.

## Overview

Electron applications consist of two main processes:

1. **Main Process**: Controls the application lifecycle, system integration, and native features
2. **Renderer Process**: Handles the UI and user interactions

IPC (Inter-Process Communication) allows these processes to communicate securely.

## Architecture

Our IPC implementation follows these principles:

- **Type Safety**: All messages are strongly typed
- **Security**: Messages are validated for origin and content
- **Simplicity**: Clear API for both main and renderer processes

## Implementation Details

### 1. Shared Types

All IPC types are defined in `src/shared/types/ipc.ts`:

```typescript
// IPC channel names
export enum IpcChannels {
    GET_SYSTEM_INFO = 'get-system-info',
    WINDOW_CONTROL = 'window-control',
    // ...other channels
}

// IPC payload mapping
export interface IpcPayloadMap {
    [IpcChannels.GET_SYSTEM_INFO]: SystemInfoType;
    [IpcChannels.WINDOW_CONTROL]: FrameWindowAction;
    // ...other payloads
}

// Type for IPC invoke function
export type IpcInvoke = <K extends keyof IpcPayloadMap>(
    channel: K,
    payload?: IpcPayloadMap[K]
) => Promise<IpcResponse<any>>;
```

### 2. Preload Script

The preload script (`src/electron/preload/preload.ts`) exposes a safe API to the renderer:

```typescript
// Expose protected methods that allow the renderer process to use IPC
contextBridge.exposeInMainWorld('electron', {
    // System information
    getSystemInfo: (type: SystemInfoType) => ipcInvoke(IpcChannels.GET_SYSTEM_INFO, type),
    onSystemInfoUpdate: (callback: (info: SystemInfo) => void) => 
        ipcOn(IpcChannels.SYSTEM_INFO_UPDATE, callback),
    
    // Window management
    controlWindow: (action: FrameWindowAction) => 
        ipcSend(IpcChannels.WINDOW_CONTROL, action),
    
    // ...other methods
});
```

### 3. IPC Handlers

IPC handlers in the main process (`src/electron/ipc/handlers.ts`) process incoming requests:

```typescript
export function setupIpcHandlers(): void {
    // Set up system info handlers
    setupSystemInfoHandlers();
    
    // Set up window handlers
    setupWindowHandlers();
    
    // Set up file system handlers
    setupFileSystemHandlers();
    
    // Set up settings handlers
    setupSettingsHandlers();
}
```

### 4. Security Validation

All IPC messages are validated (`src/electron/ipc/validator.ts`):

```typescript
export function validateIpcOrigin(event: IpcMainEvent | IpcMainInvokeEvent): void {
    // Get the sender frame
    const frame = event.senderFrame;

    if (!frame) {
        throw new Error('Invalid IPC request: No sender frame');
    }

    // Validate the origin
    // ...
}

export function validateIpcPayload<T>(payload: unknown, schema: any): T {
    // Validate the payload against a schema
    // ...
}
```

## Usage Examples

### In the Renderer Process

```typescript
// Get system information
const cpuInfo = await window.electron.getSystemInfo('CPU');

// Listen for system info updates
const unsubscribe = window.electron.onSystemInfoUpdate((info) => {
    console.log('New system info:', info);
});

// Control the window
window.electron.controlWindow('MINIMIZE');

// Clean up listeners when component unmounts
useEffect(() => {
    return () => {
        unsubscribe();
    };
}, []);
```

### In the Main Process

```typescript
// Handle system info requests
ipcMain.handle(IpcChannels.GET_SYSTEM_INFO, async (event, type: SystemInfoType) => {
    try {
        // Validate the request
        validateIpcOrigin(event);
        validateIpcPayload(type, systemInfoTypeSchema);
        
        // Process the request
        const info = await getSystemInfo(type);
        
        // Return the result
        return {
            success: true,
            data: info
        };
    } catch (error) {
        // Handle errors
        return {
            success: false,
            error: error.message
        };
    }
});
```

## Best Practices

1. **Always validate IPC messages**: Check both the origin and the payload
2. **Use typed channels and payloads**: Leverage TypeScript for type safety
3. **Handle errors gracefully**: Return proper error responses
4. **Clean up listeners**: Unsubscribe from events when components unmount
5. **Minimize data transfer**: Only send necessary data between processes

## Troubleshooting

Common IPC issues and solutions:

1. **"Electron API not available"**: Check that the preload script is correctly configured
2. **IPC messages not being received**: Verify channel names match exactly
3. **Type errors**: Ensure payload types match between main and renderer
4. **Security errors**: Check that the message origin is properly validated 