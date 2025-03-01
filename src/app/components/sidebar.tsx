import { Home, Settings, Info, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../shared/constants/app.js';
import { cn } from '../lib/utils.js';
import { Button } from './ui/button.js';
import { APP_VERSION } from '../../shared/constants/app.js';

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
}

interface SidebarProps {
    onClose?: () => void;
}

/**
 * Navigation item component
 */
function NavItem({ to, icon, label }: NavItemProps) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                )
            }
        >
            {icon}
            <span>{label}</span>
        </NavLink>
    );
}

/**
 * Sidebar component
 */
export function Sidebar({ onClose }: SidebarProps) {
    return (
        <aside className="h-full flex flex-col bg-background border-r border-border">
            {/* Mobile header with close button */}
            <div className="flex items-center justify-between p-4 md:hidden">
                <h2 className="font-semibold">Menu</h2>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* Navigation items */}
            <div className="flex-1 p-4 overflow-y-auto">
                <nav className="space-y-1">
                    <NavItem to={ROUTES.HOME} icon={<Home className="h-5 w-5" />} label="Home" />
                    <NavItem to={ROUTES.SETTINGS} icon={<Settings className="h-5 w-5" />} label="Settings" />
                    <NavItem to={ROUTES.ABOUT} icon={<Info className="h-5 w-5" />} label="About" />
                </nav>
            </div>

            {/* Version footer */}
            <div className="border-t border-border p-4">
                <div className="text-xs text-muted-foreground">
                    <p>Version: {APP_VERSION}</p>
                </div>
            </div>
        </aside>
    );
} 