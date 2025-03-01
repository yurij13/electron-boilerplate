import { Maximize2, Minimize2, X } from 'lucide-react';
import { Button } from './ui/button.js';

/**
 * Window controls component for Electron
 * Provides buttons to minimize, maximize, and close the window
 */
export function WindowControls() {
    // Check if we're in Electron
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
            <Button
                variant="ghost"
                size="icon"
                onClick={handleMaximize}
                className="h-8 w-8 hover:bg-accent"
                title="Maximize"
            >
                <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                title="Close"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
} 