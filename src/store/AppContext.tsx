import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { Store, Camera, Alert, NotificationItem, AppUser, ROI } from '@/types';
import {
  stores as initialStores,
  cameras as initialCameras,
  alerts as initialAlerts,
  notifications as initialNotifications,
  users as initialUsers,
  rois as initialRois,
  currentUser,
  ALL_STORES_ID,
} from '@/data/mockData';
import { ALERT_TYPE_META } from '@/types';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: AppUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Store selection
  selectedStoreId: string;
  setSelectedStoreId: (id: string) => void;

  // Data
  stores: Store[];
  cameras: Camera[];
  alerts: Alert[];
  notifications: NotificationItem[];
  users: AppUser[];
  rois: ROI[];

  // Alert actions
  updateAlertStatus: (alertId: string, status: Alert['status']) => void;

  // Notification actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // ROI actions
  saveROI: (roi: ROI) => void;
  deleteROI: (roiId: string) => void;

  // Camera config
  updateCameraConfig: (cameraId: string, config: Camera['config']) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string>(ALL_STORES_ID);
  const [stores] = useState<Store[]>(initialStores);
  const [cameras, setCameras] = useState<Camera[]>(initialCameras);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [users] = useState<AppUser[]>(initialUsers);
  const [rois, setRois] = useState<ROI[]>(initialRois);

  const login = useCallback((email: string, _password: string) => {
    // Mock auth — accept any non-empty credentials
    if (email.trim().length > 0 && _password.length > 0) {
      setIsAuthenticated(true);
      setUser(currentUser);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const updateAlertStatus = useCallback((alertId: string, status: Alert['status']) => {
    setAlerts(prev => prev.map(a => (a.id === alertId ? { ...a, status, reviewed: true } : a)));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const saveROI = useCallback((roi: ROI) => {
    setRois(prev => {
      const existing = prev.find(r => r.id === roi.id);
      if (existing) return prev.map(r => (r.id === roi.id ? roi : r));
      return [...prev, roi];
    });
  }, []);

  const deleteROI = useCallback((roiId: string) => {
    setRois(prev => prev.filter(r => r.id !== roiId));
  }, []);

  const updateCameraConfig = useCallback((cameraId: string, config: Camera['config']) => {
    setCameras(prev => prev.map(c =>
      c.id === cameraId
        ? { ...c, aiEnabled: config.aiEnabled, aiMode: config.aiEnabled ? config.mode : null, config }
        : c
    ));
  }, []);

  const value = useMemo<AppState>(() => ({
    isAuthenticated,
    user,
    login,
    logout,
    selectedStoreId,
    setSelectedStoreId,
    stores,
    cameras,
    alerts,
    notifications,
    users,
    rois,
    updateAlertStatus,
    markNotificationRead,
    markAllNotificationsRead,
    saveROI,
    deleteROI,
    updateCameraConfig,
  }), [isAuthenticated, user, login, logout, selectedStoreId, stores, cameras, alerts, notifications, users, rois, updateAlertStatus, markNotificationRead, markAllNotificationsRead, saveROI, deleteROI, updateCameraConfig]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// Selector helpers
export function useStoresForSelection(): Store[] {
  const { stores, user } = useApp();
  if (!user || user.role === 'owner') return stores;
  return stores.filter(s => user.storeIds.includes(s.id));
}

export function useSelectedStores(): Store[] {
  const { stores, selectedStoreId } = useApp();
  if (selectedStoreId === ALL_STORES_ID) return stores;
  return stores.filter(s => s.id === selectedStoreId);
}

export function useCamerasForSelected(): Camera[] {
  const { cameras, selectedStoreId } = useApp();
  if (selectedStoreId === ALL_STORES_ID) return cameras;
  return cameras.filter(c => c.storeId === selectedStoreId);
}

export function useAlertsForSelected(): Alert[] {
  const { alerts, selectedStoreId } = useApp();
  if (selectedStoreId === ALL_STORES_ID) return alerts;
  return alerts.filter(a => a.storeId === selectedStoreId);
}

export function useAlertById(id: string | undefined): Alert | undefined {
  const { alerts } = useApp();
  return alerts.find(a => a.id === id);
}

export function useCameraById(id: string | undefined): Camera | undefined {
  const { cameras } = useApp();
  return cameras.find(c => c.id === id);
}

export function useStoreById(id: string | undefined): Store | undefined {
  const { stores } = useApp();
  return stores.find(s => s.id === id);
}

export function useROIsForCamera(cameraId: string | undefined): ROI[] {
  const { rois } = useApp();
  if (!cameraId) return [];
  return rois.filter(r => r.cameraId === cameraId);
}

export function useAlertTypeLabel(type: Alert['type']): string {
  return ALERT_TYPE_META[type].shortLabel;
}
