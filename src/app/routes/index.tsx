import { Route, Routes } from 'react-router-dom';
import { ROUTES } from '../../shared/constants/app.js';
import { MainLayout } from '../layouts/main-layout.js';
import { HomePage } from './home.js';
import { SettingsPage } from './settings.js';
import { AboutPage } from './about.js';
import { NotFoundPage } from './not-found.js';

/**
 * Application routes
 */
export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                <Route path={ROUTES.ABOUT} element={<AboutPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
} 