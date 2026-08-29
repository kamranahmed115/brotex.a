import type {
  Store, Camera, Alert, AppUser, ROI, NotificationItem,
  AIConfiguration, Schedule,
} from '@/types';

export const ALL_STORES_ID = 'all';

export const stores: Store[] = [
  {
    id: 'store_1',
    name: 'Highway 17 — Gas & Convenience',
    shortName: 'Highway 17',
    address: '4820 Highway 17 North, Myrtle Beach, SC 29577',
    status: 'operational',
    timezone: 'America/New_York',
  },
  {
    id: 'store_2',
    name: 'Main Street — Gas & Convenience',
    shortName: 'Main Street',
    address: '215 Main Street, Conway, SC 29526',
    status: 'degraded',
    timezone: 'America/New_York',
  },
  {
    id: 'store_3',
    name: 'Downtown — Gas & Convenience',
    shortName: 'Downtown',
    address: '901 Broadway Street, Myrtle Beach, SC 29577',
    status: 'operational',
    timezone: 'America/New_York',
  },
];

const defaultSchedule: Schedule = {
  mon: { enabled: true, start: '23:00', end: '06:00' },
  tue: { enabled: true, start: '23:00', end: '06:00' },
  wed: { enabled: true, start: '23:00', end: '06:00' },
  thu: { enabled: true, start: '23:00', end: '06:00' },
  fri: { enabled: true, start: '23:00', end: '06:00' },
  sat: { enabled: true, start: '23:00', end: '06:00' },
  sun: { enabled: true, start: '23:00', end: '06:00' },
};

function shopliftingConfig(active: boolean, categories: string[]): AIConfiguration {
  return {
    aiEnabled: active,
    mode: 'shoplifting',
    detectionCategories: categories,
    zoneLabel: '',
    schedule: defaultSchedule,
    detectionTarget: 'person',
    threshold: { value: 30, unit: 'minutes' },
    priority: 'high',
    enabled: true,
  };
}

function restrictedConfig(zone: string, priority: 'high' | 'critical'): AIConfiguration {
  return {
    aiEnabled: true,
    mode: 'restricted_access',
    detectionCategories: [],
    zoneLabel: zone,
    schedule: defaultSchedule,
    detectionTarget: 'person',
    threshold: { value: 0, unit: 'minutes' },
    priority,
    enabled: true,
  };
}

function loiteringConfig(target: 'person' | 'vehicle', value: number, unit: 'minutes' | 'hours'): AIConfiguration {
  return {
    aiEnabled: true,
    mode: 'loitering',
    detectionCategories: [],
    zoneLabel: '',
    schedule: defaultSchedule,
    detectionTarget: target,
    threshold: { value, unit },
    priority: 'medium',
    enabled: true,
  };
}

function disabledConfig(): AIConfiguration {
  return {
    aiEnabled: false,
    mode: 'shoplifting',
    detectionCategories: [],
    zoneLabel: '',
    schedule: defaultSchedule,
    detectionTarget: 'person',
    threshold: { value: 30, unit: 'minutes' },
    priority: 'medium',
    enabled: false,
  };
}

export const cameras: Camera[] = [
  // Store 1 — Highway 17 (15 cameras, 14 online)
  { id: 'cam_01', storeId: 'store_1', name: 'Camera 01', location: 'Front Entrance', domain: 'outside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'loitering', config: loiteringConfig('person', 30, 'minutes') },
  { id: 'cam_02', storeId: 'store_1', name: 'Camera 02', location: 'Fuel Pumps', domain: 'outside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'loitering', config: loiteringConfig('vehicle', 30, 'minutes') },
  { id: 'cam_03', storeId: 'store_1', name: 'Camera 03', location: 'Front Parking', domain: 'outside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'loitering', config: loiteringConfig('vehicle', 5, 'hours') },
  { id: 'cam_04', storeId: 'store_1', name: 'Camera 04', location: 'Aisle 1', domain: 'inside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'shoplifting', config: shopliftingConfig(true, ['Pocket / Pants Concealment', 'Bag / Purse / Backpack Concealment']) },
  { id: 'cam_05', storeId: 'store_1', name: 'Camera 05', location: 'Aisle 2', domain: 'inside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'shoplifting', config: shopliftingConfig(true, ['Waistband / Lower-Body Concealment', 'Jacket / Hoodie / Shirt Concealment']) },
  { id: 'cam_06', storeId: 'store_1', name: 'Camera 06', location: 'Rear Door', domain: 'outside', status: 'offline', lastActive: '2026-08-29T18:12:00Z', aiEnabled: true, aiMode: 'restricted_access', config: restrictedConfig('Back door', 'critical') },
  { id: 'cam_07', storeId: 'store_1', name: 'Camera 07', location: 'Checkout Counter', domain: 'inside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: false, aiMode: null, config: disabledConfig() },
  { id: 'cam_08', storeId: 'store_1', name: 'Camera 08', location: 'Aisle 3', domain: 'inside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'shoplifting', config: shopliftingConfig(true, ['Pocket / Pants Concealment', 'Jacket / Hoodie / Shirt Concealment']) },
  { id: 'cam_09', storeId: 'store_1', name: 'Camera 09', location: 'Aisle 4', domain: 'inside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'shoplifting', config: shopliftingConfig(true, ['Bag / Purse / Backpack Concealment']) },
  { id: 'cam_10', storeId: 'store_1', name: 'Camera 10', location: 'Side of Building', domain: 'outside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'restricted_access', config: restrictedConfig('Side of building', 'high') },
  { id: 'cam_11', storeId: 'store_1', name: 'Camera 11', location: 'Dumpster Area', domain: 'outside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'restricted_access', config: restrictedConfig('Dumpster', 'medium') },
  { id: 'cam_12', storeId: 'store_1', name: 'Camera 12', location: 'Loading Area', domain: 'outside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'restricted_access', config: restrictedConfig('Loading area', 'high') },
  { id: 'cam_13', storeId: 'store_1', name: 'Camera 13', location: 'Aisle 5', domain: 'inside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'shoplifting', config: shopliftingConfig(true, ['Pocket / Pants Concealment', 'Waistband / Lower-Body Concealment']) },
  { id: 'cam_14', storeId: 'store_1', name: 'Camera 14', location: 'Employee Entrance', domain: 'outside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'restricted_access', config: restrictedConfig('Employee entrance', 'high') },
  { id: 'cam_15', storeId: 'store_1', name: 'Camera 15', location: 'Rear Parking', domain: 'outside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'restricted_access', config: restrictedConfig('Restricted rear parking', 'high') },

  // Store 2 — Main Street (8 cameras, 7 online)
  { id: 'cam_21', storeId: 'store_2', name: 'Camera 01', location: 'Front Entrance', domain: 'outside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'loitering', config: loiteringConfig('person', 30, 'minutes') },
  { id: 'cam_22', storeId: 'store_2', name: 'Camera 02', location: 'Fuel Pumps', domain: 'outside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'loitering', config: loiteringConfig('vehicle', 30, 'minutes') },
  { id: 'cam_23', storeId: 'store_2', name: 'Camera 03', location: 'Aisle 1', domain: 'inside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'shoplifting', config: shopliftingConfig(true, ['Pocket / Pants Concealment', 'Bag / Purse / Backpack Concealment']) },
  { id: 'cam_24', storeId: 'store_2', name: 'Camera 04', location: 'Aisle 2', domain: 'inside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'shoplifting', config: shopliftingConfig(true, ['Jacket / Hoodie / Shirt Concealment']) },
  { id: 'cam_25', storeId: 'store_2', name: 'Camera 05', location: 'Rear Door', domain: 'outside', status: 'offline', lastActive: '2026-08-29T15:30:00Z', aiEnabled: true, aiMode: 'restricted_access', config: restrictedConfig('Back door', 'critical') },
  { id: 'cam_26', storeId: 'store_2', name: 'Camera 06', location: 'Parking Lot', domain: 'outside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'loitering', config: loiteringConfig('vehicle', 5, 'hours') },
  { id: 'cam_27', storeId: 'store_2', name: 'Camera 07', location: 'Checkout Counter', domain: 'inside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: false, aiMode: null, config: disabledConfig() },
  { id: 'cam_28', storeId: 'store_2', name: 'Camera 08', location: 'Side of Building', domain: 'outside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'restricted_access', config: restrictedConfig('Side of building', 'high') },

  // Store 3 — Downtown (6 cameras, 6 online)
  { id: 'cam_31', storeId: 'store_3', name: 'Camera 01', location: 'Front Entrance', domain: 'outside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'loitering', config: loiteringConfig('person', 20, 'minutes') },
  { id: 'cam_32', storeId: 'store_3', name: 'Camera 02', location: 'Aisle 1', domain: 'inside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'shoplifting', config: shopliftingConfig(true, ['Pocket / Pants Concealment', 'Waistband / Lower-Body Concealment']) },
  { id: 'cam_33', storeId: 'store_3', name: 'Camera 03', location: 'Aisle 2', domain: 'inside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'shoplifting', config: shopliftingConfig(true, ['Bag / Purse / Backpack Concealment']) },
  { id: 'cam_34', storeId: 'store_3', name: 'Camera 04', location: 'Rear Door', domain: 'outside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'restricted_access', config: restrictedConfig('Back door', 'critical') },
  { id: 'cam_35', storeId: 'store_3', name: 'Camera 05', location: 'Parking Lot', domain: 'outside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: true, aiMode: 'loitering', config: loiteringConfig('vehicle', 4, 'hours') },
  { id: 'cam_36', storeId: 'store_3', name: 'Camera 06', location: 'Fuel Pumps', domain: 'outside', status: 'online', lastActive: '2026-08-29T21:48:00Z', aiEnabled: false, aiMode: null, config: disabledConfig() },
];

export const rois: ROI[] = [
  { id: 'roi_cam_04', cameraId: 'cam_04', points: [{ x: 0.15, y: 0.2 }, { x: 0.82, y: 0.18 }, { x: 0.85, y: 0.78 }, { x: 0.12, y: 0.8 }], type: 'detection', label: 'Aisle 1 Detection Zone', active: true, createdBy: 'Manager', createdAt: '2026-08-20T10:00:00Z', updatedAt: '2026-08-25T14:30:00Z' },
  { id: 'roi_cam_06', cameraId: 'cam_06', points: [{ x: 0.3, y: 0.35 }, { x: 0.7, y: 0.35 }, { x: 0.7, y: 0.75 }, { x: 0.3, y: 0.75 }], type: 'restricted', label: 'Back Door Zone', active: true, createdBy: 'Manager', createdAt: '2026-08-18T09:00:00Z', updatedAt: '2026-08-18T09:00:00Z' },
  { id: 'roi_cam_02', cameraId: 'cam_02', points: [{ x: 0.1, y: 0.3 }, { x: 0.9, y: 0.3 }, { x: 0.9, y: 0.85 }, { x: 0.1, y: 0.85 }], type: 'pump', label: 'Fuel Pump Zone', active: true, createdBy: 'Manager', createdAt: '2026-08-15T11:00:00Z', updatedAt: '2026-08-15T11:00:00Z' },
  { id: 'roi_cam_01', cameraId: 'cam_01', points: [{ x: 0.2, y: 0.25 }, { x: 0.8, y: 0.25 }, { x: 0.8, y: 0.7 }, { x: 0.2, y: 0.7 }], type: 'entrance', label: 'Front Entrance Zone', active: true, createdBy: 'Manager', createdAt: '2026-08-22T08:00:00Z', updatedAt: '2026-08-22T08:00:00Z' },
  { id: 'roi_cam_03', cameraId: 'cam_03', points: [{ x: 0.05, y: 0.15 }, { x: 0.95, y: 0.15 }, { x: 0.95, y: 0.9 }, { x: 0.05, y: 0.9 }], type: 'parking', label: 'Front Parking Zone', active: true, createdBy: 'Manager', createdAt: '2026-08-19T12:00:00Z', updatedAt: '2026-08-19T12:00:00Z' },
];

const concealmentSequence = [
  { label: 'Merchandise interaction', reached: true },
  { label: 'Item pickup', reached: true },
  { label: 'Movement toward pocket', reached: true },
  { label: 'Item disappears from view', reached: true },
  { label: 'Potential concealment', reached: true },
];

const bagSequence = [
  { label: 'Merchandise interaction', reached: true },
  { label: 'Item pickup', reached: true },
  { label: 'Movement toward bag', reached: true },
  { label: 'Item placed into bag', reached: true },
  { label: 'Potential concealment', reached: true },
];

const dwellSequence = [
  { label: 'Vehicle entered zone', reached: true },
  { label: 'Tracking ID assigned', reached: true },
  { label: 'Dwell timer started', reached: true },
  { label: 'Threshold exceeded (30 min)', reached: true },
  { label: 'Alert generated', reached: true },
];

const restrictedSequence = [
  { label: 'Person detected in zone', reached: true },
  { label: 'Access rule evaluated', reached: true },
  { label: 'Time rule violation confirmed', reached: true },
  { label: 'Alert generated', reached: true },
];

const loiteringSequence = [
  { label: 'Person entered zone', reached: true },
  { label: 'Dwell timer started', reached: true },
  { label: 'Threshold exceeded (30 min)', reached: true },
  { label: 'Alert generated', reached: true },
];

export const alerts: Alert[] = [
  { id: 'alert_001', storeId: 'store_1', cameraId: 'cam_04', type: 'pocket_concealment', timestamp: '2026-08-29T21:42:00Z', confidence: 91, priority: 'high', status: 'new', summary: 'Potential merchandise concealment detected — review video.', detectionSequence: concealmentSequence, clipDurationSec: 22, reviewed: false },
  { id: 'alert_002', storeId: 'store_1', cameraId: 'cam_02', type: 'fuel_pump_vehicle_dwell', timestamp: '2026-08-29T21:15:00Z', confidence: 88, priority: 'medium', status: 'new', summary: 'Vehicle exceeded configured dwell threshold at fuel pump.', detectionSequence: dwellSequence, clipDurationSec: 18, reviewed: false },
  { id: 'alert_003', storeId: 'store_1', cameraId: 'cam_06', type: 'restricted_zone', timestamp: '2026-08-29T20:58:00Z', confidence: 95, priority: 'critical', status: 'new', summary: 'Person entered restricted zone during after-hours.', detectionSequence: restrictedSequence, clipDurationSec: 15, reviewed: false },
  { id: 'alert_004', storeId: 'store_1', cameraId: 'cam_09', type: 'bag_concealment', timestamp: '2026-08-29T19:34:00Z', confidence: 84, priority: 'high', status: 'needs_review', summary: 'Potential merchandise concealment detected — review video.', detectionSequence: bagSequence, clipDurationSec: 26, reviewed: false },
  { id: 'alert_005', storeId: 'store_1', cameraId: 'cam_01', type: 'front_entrance_loitering', timestamp: '2026-08-29T18:50:00Z', confidence: 79, priority: 'medium', status: 'acknowledged', summary: 'Person/group remained near front entrance for 30 minutes.', detectionSequence: loiteringSequence, clipDurationSec: 30, reviewed: true },
  { id: 'alert_006', storeId: 'store_1', cameraId: 'cam_05', type: 'jacket_concealment', timestamp: '2026-08-29T17:22:00Z', confidence: 76, priority: 'medium', status: 'needs_review', summary: 'Potential merchandise concealment detected — review video.', detectionSequence: concealmentSequence, clipDurationSec: 24, reviewed: false },
  { id: 'alert_007', storeId: 'store_1', cameraId: 'cam_03', type: 'long_term_parking', timestamp: '2026-08-29T14:10:00Z', confidence: 82, priority: 'low', status: 'acknowledged', summary: 'Vehicle remained in customer parking for 5 hours.', detectionSequence: dwellSequence, clipDurationSec: 20, reviewed: true },
  { id: 'alert_008', storeId: 'store_1', cameraId: 'cam_10', type: 'after_hours_activity', timestamp: '2026-08-29T01:30:00Z', confidence: 93, priority: 'high', status: 'resolved', summary: 'Person detected on side of building during restricted hours.', detectionSequence: restrictedSequence, clipDurationSec: 17, reviewed: true },
  { id: 'alert_009', storeId: 'store_1', cameraId: 'cam_04', type: 'pocket_concealment', timestamp: '2026-08-28T22:15:00Z', confidence: 87, priority: 'high', status: 'resolved', summary: 'Potential merchandise concealment detected — review video.', detectionSequence: concealmentSequence, clipDurationSec: 21, reviewed: true },
  { id: 'alert_010', storeId: 'store_2', cameraId: 'cam_23', type: 'waistband_concealment', timestamp: '2026-08-29T20:05:00Z', confidence: 89, priority: 'high', status: 'new', summary: 'Potential merchandise concealment detected — review video.', detectionSequence: concealmentSequence, clipDurationSec: 23, reviewed: false },
  { id: 'alert_011', storeId: 'store_2', cameraId: 'cam_25', type: 'restricted_zone', timestamp: '2026-08-29T03:45:00Z', confidence: 96, priority: 'critical', status: 'acknowledged', summary: 'Person entered restricted zone during after-hours.', detectionSequence: restrictedSequence, clipDurationSec: 16, reviewed: true },
  { id: 'alert_012', storeId: 'store_3', cameraId: 'cam_32', type: 'pocket_concealment', timestamp: '2026-08-29T19:18:00Z', confidence: 85, priority: 'medium', status: 'needs_review', summary: 'Potential merchandise concealment detected — review video.', detectionSequence: concealmentSequence, clipDurationSec: 19, reviewed: false },
];

export const notifications: NotificationItem[] = [
  { id: 'n1', alertId: 'alert_003', type: 'restricted_zone', cameraName: 'Camera 06', storeShortName: 'Highway 17', timestamp: '2026-08-29T20:58:00Z', read: false },
  { id: 'n2', alertId: 'alert_001', type: 'pocket_concealment', cameraName: 'Camera 04', storeShortName: 'Highway 17', timestamp: '2026-08-29T21:42:00Z', read: false },
  { id: 'n3', alertId: 'alert_002', type: 'fuel_pump_vehicle_dwell', cameraName: 'Camera 02', storeShortName: 'Highway 17', timestamp: '2026-08-29T21:15:00Z', read: false },
  { id: 'n4', alertId: 'alert_010', type: 'waistband_concealment', cameraName: 'Camera 01', storeShortName: 'Main Street', timestamp: '2026-08-29T20:05:00Z', read: false },
  { id: 'n5', alertId: 'alert_004', type: 'bag_concealment', cameraName: 'Camera 09', storeShortName: 'Highway 17', timestamp: '2026-08-29T19:34:00Z', read: true },
];

export const users: AppUser[] = [
  { id: 'u1', name: 'Robert Hayes', email: 'r.hayes@vortexsec.com', role: 'owner', storeIds: ['store_1', 'store_2', 'store_3'], status: 'active', lastActive: '2026-08-29T21:40:00Z' },
  { id: 'u2', name: 'Diane Whitfield', email: 'd.whitfield@vortexsec.com', role: 'manager', storeIds: ['store_1'], status: 'active', lastActive: '2026-08-29T21:15:00Z' },
  { id: 'u3', name: 'Marcus Lee', email: 'm.lee@vortexsec.com', role: 'manager', storeIds: ['store_2', 'store_3'], status: 'active', lastActive: '2026-08-29T18:30:00Z' },
  { id: 'u4', name: 'Priya Nair', email: 'p.nair@vortexsec.com', role: 'staff', storeIds: ['store_1'], status: 'active', lastActive: '2026-08-29T17:00:00Z' },
  { id: 'u5', name: 'Tom Brennan', email: 't.brennan@vortexsec.com', role: 'staff', storeIds: ['store_2'], status: 'disabled', lastActive: '2026-08-20T09:00:00Z' },
];

// Current logged-in user for mock auth
export const currentUser: AppUser = users[0];
