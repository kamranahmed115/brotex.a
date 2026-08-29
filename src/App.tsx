import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AppProvider, useApp } from '@/store/AppContext';
import { Layout } from '@/components/layout/Layout';
import { LoginPage } from '@/pages/LoginPage';
import { OverviewPage } from '@/pages/OverviewPage';
import { AlertsPage } from '@/pages/AlertsPage';
import { AlertDetailsPage } from '@/pages/AlertDetailsPage';
import { CamerasPage } from '@/pages/CamerasPage';
import { LiveMonitoringPage } from '@/pages/LiveMonitoringPage';
import { CameraConfigurePage } from '@/pages/CameraConfigurePage';
import { CameraConfigIndexPage } from '@/pages/CameraConfigIndexPage';
import { StoresPage } from '@/pages/StoresPage';
import { StoreDetailsPage } from '@/pages/StoreDetailsPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { UsersPage } from '@/pages/UsersPage';
import { SettingsPage } from '@/pages/SettingsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppRoutes() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/alerts/review" element={<AlertsPage initialFilter="needs_review" />} />
          <Route path="/alerts/history" element={<AlertsPage initialFilter="history" />} />
          <Route path="/alerts/:id" element={<AlertDetailsPage />} />
          <Route path="/cameras" element={<CamerasPage />} />
          <Route path="/cameras/live" element={<LiveMonitoringPage />} />
          <Route path="/cameras/configure" element={<CameraConfigIndexPage />} />
          <Route path="/cameras/:id/configure" element={<CameraConfigurePage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/stores/:id" element={<StoreDetailsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
