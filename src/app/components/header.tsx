import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from './ui/button.js';
import { useTheme } from '../providers/theme-provider.js';
import { APP_NAME } from '../../shared/constants/app.js';
import { Dispatch, SetStateAction } from 'react';

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

/**
 * Application header component
 */
export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="border-b border-border h-14 px-4 flex items-center justify-between app-drag-region">
            <div className="flex items-center space-x-3 app-no-drag">
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
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
    );
} 