import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { LandingPage } from './pages/LandingPage';
import { MapPage } from './pages/MapPage';
import { StatsPage } from './pages/StatsPage';
import { ReportFormPage } from './pages/ReportFormPage';
import { TelegramBotPage } from './pages/TelegramBotPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: 'map', Component: MapPage },
      { path: 'stats', Component: StatsPage },
      { path: 'report', Component: ReportFormPage },
      { path: 'telegram', Component: TelegramBotPage },
      { path: 'admin', Component: AdminPage },
      { path: 'login', Component: LoginPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
