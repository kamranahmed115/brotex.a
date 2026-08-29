import { mockDB } from './mockdb';
import type { AlertStatus, AIConfiguration } from '@/types';

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  async getStores() {
    await delay(300);
    return [...mockDB.stores];
  },
  async getCameras() {
    await delay(300);
    return [...mockDB.cameras];
  },
  async getAlerts() {
    await delay(300);
    return [...mockDB.alerts];
  },
  async getNotifications() {
    await delay(200);
    return [...mockDB.notifications];
  },
  async getCurrentUser() {
    await delay(200);
    return { ...mockDB.currentUser };
  },
  async updateAlertStatus(alertId: string, status: AlertStatus) {
    await delay(500);
    const updated = mockDB.updateAlertStatus(alertId, status);
    if (!updated) throw new Error('Alert not found');
    return updated;
  },
  async updateCameraConfig(cameraId: string, config: AIConfiguration) {
    await delay(600);
    const updated = mockDB.updateCameraConfig(cameraId, config);
    if (!updated) throw new Error('Camera not found');
    return updated;
  },
  async getUsers() {
    await delay(200);
    return [...mockDB.users];
  },
  async updateUserRole(userId: string, role: any) {
    await delay(300);
    return mockDB.updateUserRole(userId, role);
  },
  async updateUserStatus(userId: string, status: any) {
    await delay(300);
    return mockDB.updateUserStatus(userId, status);
  },
  async updateUserStore(userId: string, storeIds: string[]) {
    await delay(300);
    return mockDB.updateUserStore(userId, storeIds);
  },
  async addUser(user: any) {
    await delay(300);
    return mockDB.addUser(user);
  }
};
