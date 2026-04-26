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

// HokimWatch
import { HokimWatchMap } from './pages/HokimWatch/HokimWatchMap';
import { ProjectDetail } from './pages/HokimWatch/ProjectDetail';
import { ReportForm } from './pages/HokimWatch/ReportForm';
import { HokimWatchStats } from './pages/HokimWatch/Stats';
import { AuditExplorer } from './pages/HokimWatch/AuditExplorer';
import { LandWatch } from './pages/HokimWatch/LandWatch';

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
      
      // HokimWatch Routes
      { path: 'hokimwatch', Component: HokimWatchMap },
      { path: 'hokimwatch/stats', Component: HokimWatchStats },
      { path: 'hokimwatch/explorer', Component: AuditExplorer },
      { path: 'hokimwatch/land', Component: LandWatch },
      { path: 'hokimwatch/:id', Component: ProjectDetail },
      { path: 'hokimwatch/:id/report', Component: ReportForm },
      
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
