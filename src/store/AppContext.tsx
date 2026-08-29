import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import type { Store, Camera, Alert, NotificationItem, AppUser, ROI } from '@/types';
import { currentUser, ALL_STORES_ID } from '@/data/mockData';
import { api } from '@/services/api';
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
  
  // Loading
  isLoading: boolean;

  // Alert actions
  updateAlertStatus: (alertId: string, status: Alert['status']) => Promise<void>;

  // Notification actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // ROI actions
  saveROI: (roi: ROI) => void;
  deleteROI: (roiId: string) => void;

  // Camera config
  updateCameraConfig: (cameraId: string, config: Camera['config']) => Promise<void>;

  // Users
  addUser: (user: AppUser) => Promise<void>;
  updateUserRole: (userId: string, role: AppUser['role']) => Promise<void>;
  updateUserStatus: (userId: string, status: AppUser['status']) => Promise<void>;
  updateUserStore: (userId: string, storeIds: string[]) => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string>(ALL_STORES_ID);
  
  const [stores, setStores] = useState<Store[]>([]);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [rois, setRois] = useState<ROI[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);

  // Initial fetch
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [fetchedStores, fetchedCameras, fetchedAlerts, fetchedNotifs, fetchedUsers] = await Promise.all([
          api.getStores(),
          api.getCameras(),
          api.getAlerts(),
          api.getNotifications(),
          api.getUsers()
        ]);
        setStores(fetchedStores);
        setCameras(fetchedCameras);
        setAlerts(fetchedAlerts);
        setNotifications(fetchedNotifs);
        setUsers(fetchedUsers);
      } catch (e) {
        console.error("Failed to fetch initial data", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const login = useCallback((email: string, _password: string) => {
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

  const updateAlertStatus = useCallback(async (alertId: string, status: Alert['status']) => {
    try {
      const updated = await api.updateAlertStatus(alertId, status);
      setAlerts(prev => prev.map(a => (a.id === alertId ? { ...updated, reviewed: true } : a)));
    } catch (e) {
      console.error(e);
    }
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

  const updateCameraConfig = useCallback(async (cameraId: string, config: Camera['config']) => {
    try {
      const updated = await api.updateCameraConfig(cameraId, config);
      setCameras(prev => prev.map(c => c.id === cameraId ? updated : c));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const addUser = useCallback(async (u: AppUser) => {
    try {
      const added = await api.addUser(u);
      setUsers(prev => [...prev, added]);
    } catch (e) { console.error(e); }
  }, []);

  const updateUserRole = useCallback(async (userId: string, role: AppUser['role']) => {
    try {
      const updated = await api.updateUserRole(userId, role);
      if (updated) setUsers(prev => prev.map(u => u.id === userId ? updated : u));
    } catch (e) { console.error(e); }
  }, []);

  const updateUserStatus = useCallback(async (userId: string, status: AppUser['status']) => {
    try {
      const updated = await api.updateUserStatus(userId, status);
      if (updated) setUsers(prev => prev.map(u => u.id === userId ? updated : u));
    } catch (e) { console.error(e); }
  }, []);

  const updateUserStore = useCallback(async (userId: string, storeIds: string[]) => {
    try {
      const updated = await api.updateUserStore(userId, storeIds);
      if (updated) setUsers(prev => prev.map(u => u.id === userId ? updated : u));
    } catch (e) { console.error(e); }
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
    isLoading,
    updateAlertStatus,
    markNotificationRead,
    markAllNotificationsRead,
    saveROI,
    deleteROI,
    updateCameraConfig,
    addUser,
    updateUserRole,
    updateUserStatus,
    updateUserStore,
  }), [isAuthenticated, user, login, logout, selectedStoreId, stores, cameras, alerts, notifications, users, rois, isLoading, updateAlertStatus, markNotificationRead, markAllNotificationsRead, saveROI, deleteROI, updateCameraConfig, addUser, updateUserRole, updateUserStatus, updateUserStore]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

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
