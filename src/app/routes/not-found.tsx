import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.js';

/**
 * Not found page component
 */
export function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-xl">Page not found</p>
            <p className="text-muted-foreground">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
    );
} 