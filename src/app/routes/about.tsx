import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.js';
import { APP_NAME, APP_VERSION } from '../../shared/constants/app.js';

/**
 * About page component
 */
export function AboutPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">About</h1>

            <Card>
                <CardHeader>
                    <CardTitle>{APP_NAME}</CardTitle>
                    <CardDescription>Version {APP_VERSION}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>
                        A secure, type-safe, and well-structured boilerplate for building modern desktop
                        applications using Electron, React, TypeScript, and Vite.
                    </p>

                    <h3 className="text-lg font-semibold mt-4">Features</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Secure by Design: IPC validation, CSP implementation, and proper permission handling</li>
                        <li>Type Safety: Full TypeScript support with strict type checking</li>
                        <li>Modern Routing: React Router with file-based routing structure</li>
                        <li>UI Components: Shadcn/UI components with Tailwind CSS</li>
                        <li>Architecture: Clean architecture with separation of concerns</li>
                        <li>State Management: Zustand for simple and effective state management</li>
                        <li>Testing: Jest and React Testing Library setup</li>
                        <li>Packaging: Electron Builder configuration for all platforms</li>
                    </ul>

                    <div className="pt-4">
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 