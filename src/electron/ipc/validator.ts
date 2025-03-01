import { IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import { IS_DEV } from '../../shared/constants/app.js';
import { getUIPath } from '../utils/pathResolver.js';
import { pathToFileURL } from 'url';

/**
 * Validate that an IPC request is coming from a trusted source
 * 
 * @param event The IPC event to validate
 * @throws Error if the event is not from a trusted source
 */
export function validateIpcOrigin(event: IpcMainEvent | IpcMainInvokeEvent): void {
    // Get the sender frame
    const frame = event.senderFrame;

    if (!frame) {
        throw new Error('Invalid IPC request: No sender frame');
    }

    // In development mode, allow requests from localhost
    if (IS_DEV && new URL(frame.url).host === 'localhost:5173') {
        return;
    }

    // In production mode, only allow requests from our app
    const appUrl = pathToFileURL(getUIPath()).toString();
    if (frame.url !== appUrl) {
        throw new Error(`Invalid IPC request: Unauthorized origin ${frame.url}`);
    }
}

/**
 * Validate that an IPC payload matches the expected schema
 * 
 * @param payload The payload to validate
 * @param schema The schema to validate against
 * @returns The validated payload
 * @throws Error if the payload is invalid
 */
export function validateIpcPayload<T>(payload: unknown, schema: any): T {
    try {
        // If we have a schema validator (like Zod), use it
        if (typeof schema?.parse === 'function') {
            return schema.parse(payload) as T;
        }

        // Otherwise, just return the payload as is
        return payload as T;
    } catch (error) {
        throw new Error(`Invalid IPC payload: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
} 