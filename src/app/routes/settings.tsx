import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.js';
import { Label } from '../components/ui/label.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.js';
import { Switch } from '../components/ui/switch.js';
import { useTheme } from '../providers/theme-provider.js';
import { LANGUAGES, THEMES } from '../../shared/constants/app.js';

// Define the Theme type
type Theme = 'light' | 'dark' | 'system';

interface Settings {
    theme: string;
    language: string;
    notifications: boolean;
    autoUpdate: boolean;
    hardwareAcceleration: boolean;
}

/**
 * Settings page component
 */
export function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [settings, setSettings] = useState<Settings>({
        theme,
        language: LANGUAGES.EN,
        notifications: true,
        autoUpdate: true,
        hardwareAcceleration: true,
    });

    // Load settings from electron store on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                // Check if electron API is available
                if (!window.electron?.getSettings) {
                    console.warn('Electron API not available');
                    return;
                }

                // Fetch settings
                const response = await window.electron.getSettings();
                if (response.success && response.data) {
                    const responseData = response.data as Record<string, unknown>;
                    setSettings({
                        ...settings,
                        theme: (responseData.theme as string) || settings.theme,
                        language: (responseData.language as string) || settings.language,
                        notifications: (responseData.notifications as boolean) ?? settings.notifications,
                        autoUpdate: (responseData.autoUpdate as boolean) ?? settings.autoUpdate,
                        hardwareAcceleration: (responseData.hardwareAcceleration as boolean) ?? settings.hardwareAcceleration,
                    });

                    // Update theme if it's different
                    if (responseData.theme && responseData.theme !== theme) {
                        setTheme(responseData.theme as Theme);
                    }
                }
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        };

        loadSettings();
    }, [settings, theme, setTheme]);

    // Save settings when they change
    const saveSettings = async (newSettings: Partial<Settings>) => {
        try {
            // Update local state
            const updatedSettings = { ...settings, ...newSettings };
            setSettings(updatedSettings);

            // Check if electron API is available
            if (!window.electron?.setSettings) {
                console.warn('Electron API not available');
                return;
            }

            // Save settings
            await window.electron.setSettings(updatedSettings);

            // Update theme if it changed
            if (newSettings.theme && newSettings.theme !== theme) {
                setTheme(newSettings.theme as Theme);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Settings</h1>

            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize the application appearance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="theme">Theme</Label>
                            <Select
                                value={settings.theme}
                                onValueChange={(value: string) => saveSettings({ theme: value })}
                            >
                                <SelectTrigger id="theme">
                                    <SelectValue placeholder="Select theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={THEMES.LIGHT}>Light</SelectItem>
                                    <SelectItem value={THEMES.DARK}>Dark</SelectItem>
                                    <SelectItem value={THEMES.SYSTEM}>System</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="language">Language</Label>
                            <Select
                                value={settings.language}
                                onValueChange={(value: string) => saveSettings({ language: value })}
                            >
                                <SelectTrigger id="language">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={LANGUAGES.EN}>English</SelectItem>
                                    <SelectItem value={LANGUAGES.FR}>Français</SelectItem>
                                    <SelectItem value={LANGUAGES.DE}>Deutsch</SelectItem>
                                    <SelectItem value={LANGUAGES.ES}>Español</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Application</CardTitle>
                        <CardDescription>Configure application behavior</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="notifications">Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Enable desktop notifications
                                </p>
                            </div>
                            <Switch
                                id="notifications"
                                checked={settings.notifications}
                                onCheckedChange={(checked: boolean) => saveSettings({ notifications: checked })}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="autoUpdate">Automatic Updates</Label>
                                <p className="text-sm text-muted-foreground">
                                    Automatically check for and install updates
                                </p>
                            </div>
                            <Switch
                                id="autoUpdate"
                                checked={settings.autoUpdate}
                                onCheckedChange={(checked: boolean) => saveSettings({ autoUpdate: checked })}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="hardwareAcceleration">Hardware Acceleration</Label>
                                <p className="text-sm text-muted-foreground">
                                    Use GPU for rendering (requires restart)
                                </p>
                            </div>
                            <Switch
                                id="hardwareAcceleration"
                                checked={settings.hardwareAcceleration}
                                onCheckedChange={(checked: boolean) => saveSettings({ hardwareAcceleration: checked })}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 