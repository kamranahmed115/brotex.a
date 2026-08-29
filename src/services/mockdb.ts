import { stores, cameras, rois, alerts, notifications, users, currentUser } from '@/data/mockData';
import type { Alert, Camera, AlertStatus, AIConfiguration } from '@/types';

class MockDatabase {
  public stores = [...stores];
  public cameras = [...cameras];
  public rois = [...rois];
  public alerts = [...alerts];
  public notifications = [...notifications];
  public users = [...users];
  public currentUser = { ...currentUser };

  updateAlertStatus(alertId: string, status: AlertStatus): Alert | undefined {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = status;
      return { ...alert };
    }
    return undefined;
  }

  updateCameraConfig(cameraId: string, config: AIConfiguration): Camera | undefined {
    const camera = this.cameras.find(c => c.id === cameraId);
    if (camera) {
      camera.config = { ...config };
      camera.aiEnabled = config.aiEnabled;
      camera.aiMode = config.aiEnabled ? config.mode : null;
      return { ...camera };
    }
    return undefined;
  }

  updateUserRole(userId: string, role: any) {
    const user = this.users.find(u => u.id === userId);
    if (user) user.role = role;
    return user ? { ...user } : undefined;
  }

  updateUserStatus(userId: string, status: any) {
    const user = this.users.find(u => u.id === userId);
    if (user) user.status = status;
    return user ? { ...user } : undefined;
  }

  updateUserStore(userId: string, storeIds: string[]) {
    const user = this.users.find(u => u.id === userId);
    if (user) user.storeIds = storeIds;
    return user ? { ...user } : undefined;
  }

  addUser(user: any) {
    this.users.push(user);
    return { ...user };
  }
}

export const mockDB = new MockDatabase();
