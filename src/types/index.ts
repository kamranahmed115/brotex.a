// VORTEX.AI — Core domain types

export type StoreStatus = 'operational' | 'degraded' | 'offline';

export interface Store {
  id: string;
  name: string;
  shortName: string;
  address: string;
  status: StoreStatus;
  timezone: string;
}

export type CameraStatus = 'online' | 'offline';
export type CameraDomain = 'inside' | 'outside';
export type AIMode = 'shoplifting' | 'restricted_access' | 'loitering';

export interface ROIPoint {
  x: number; // normalized 0..1
  y: number; // normalized 0..1
}

export interface ROI {
  id: string;
  cameraId: string;
  points: ROIPoint[];
  type: 'detection' | 'restricted' | 'entrance' | 'parking' | 'pump' | 'custom';
  label: string;
  active: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleEntry {
  enabled: boolean;
  start: string; // "23:00"
  end: string;   // "06:00"
}

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export type Schedule = Record<DayOfWeek, ScheduleEntry>;

export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';

export interface DwellThreshold {
  value: number;
  unit: 'minutes' | 'hours';
}

export interface AIConfiguration {
  aiEnabled: boolean;
  mode: AIMode;
  // Shoplifting
  detectionCategories: string[];
  // Restricted access
  zoneLabel: string;
  schedule: Schedule;
  // Loitering
  detectionTarget: 'person' | 'vehicle';
  threshold: DwellThreshold;
  // Shared
  priority: AlertPriority;
  enabled: boolean;
}

export interface Camera {
  id: string;
  storeId: string;
  name: string;
  location: string;
  domain: CameraDomain;
  status: CameraStatus;
  lastActive: string;
  aiEnabled: boolean;
  aiMode: AIMode | null;
  config: AIConfiguration;
}

export type AlertStatus = 'new' | 'acknowledged' | 'needs_review' | 'resolved';

export type AlertType =
  | 'pocket_concealment'
  | 'waistband_concealment'
  | 'jacket_concealment'
  | 'bag_concealment'
  | 'after_hours_activity'
  | 'restricted_zone'
  | 'front_entrance_loitering'
  | 'fuel_pump_vehicle_dwell'
  | 'long_term_parking'
  | 'unauthorized_vehicle_presence';

export interface DetectionStep {
  label: string;
  reached: boolean;
}

export interface Alert {
  id: string;
  storeId: string;
  cameraId: string;
  type: AlertType;
  timestamp: string;
  confidence: number; // 0..100
  priority: AlertPriority;
  status: AlertStatus;
  summary: string;
  detectionSequence: DetectionStep[];
  clipDurationSec: number;
  reviewed: boolean;
}

export type UserRole = 'owner' | 'manager' | 'staff';
export type UserStatus = 'active' | 'disabled';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeIds: string[];
  status: UserStatus;
  lastActive: string;
}

export interface NotificationItem {
  id: string;
  alertId: string;
  type: AlertType;
  cameraName: string;
  storeShortName: string;
  timestamp: string;
  read: boolean;
}

// Alert type metadata
export interface AlertTypeMeta {
  type: AlertType;
  label: string;
  domain: CameraDomain;
  shortLabel: string;
}

export const ALERT_TYPE_META: Record<AlertType, AlertTypeMeta> = {
  pocket_concealment: { type: 'pocket_concealment', label: 'Pocket / Pants Concealment', domain: 'inside', shortLabel: 'Pocket Concealment' },
  waistband_concealment: { type: 'waistband_concealment', label: 'Waistband / Lower-Body Concealment', domain: 'inside', shortLabel: 'Waistband Concealment' },
  jacket_concealment: { type: 'jacket_concealment', label: 'Jacket / Hoodie / Shirt Concealment', domain: 'inside', shortLabel: 'Jacket Concealment' },
  bag_concealment: { type: 'bag_concealment', label: 'Bag / Purse / Backpack Concealment', domain: 'inside', shortLabel: 'Bag Concealment' },
  after_hours_activity: { type: 'after_hours_activity', label: 'After-Hours Activity', domain: 'outside', shortLabel: 'After-Hours Activity' },
  restricted_zone: { type: 'restricted_zone', label: 'Restricted Zone', domain: 'outside', shortLabel: 'Restricted Zone' },
  front_entrance_loitering: { type: 'front_entrance_loitering', label: 'Front Entrance Loitering', domain: 'outside', shortLabel: 'Front Entrance Loitering' },
  fuel_pump_vehicle_dwell: { type: 'fuel_pump_vehicle_dwell', label: 'Fuel Pump Vehicle Dwell', domain: 'outside', shortLabel: 'Vehicle Dwell' },
  long_term_parking: { type: 'long_term_parking', label: 'Long-Term Parking', domain: 'outside', shortLabel: 'Long-Term Parking' },
  unauthorized_vehicle_presence: { type: 'unauthorized_vehicle_presence', label: 'Unauthorized Vehicle Presence', domain: 'outside', shortLabel: 'Unauthorized Vehicle' },
};

export const AI_MODE_META: Record<AIMode, { label: string; description: string }> = {
  shoplifting: { label: 'Shoplifting', description: 'Merchandise interaction & concealment detection' },
  restricted_access: { label: 'Restricted Access', description: 'Zone-based access & time-rule violations' },
  loitering: { label: 'Loitering', description: 'Dwell-time monitoring for people & vehicles' },
};

export const PRIORITY_META: Record<AlertPriority, { label: string; color: string; dot: string }> = {
  low: { label: 'Low', color: 'text-ink-300 bg-ink-700/60', dot: 'bg-ink-400' },
  medium: { label: 'Medium', color: 'text-warning-300 bg-warning-500/10 border-warning-500/20', dot: 'bg-warning-400' },
  high: { label: 'High', color: 'text-danger-300 bg-danger-500/10 border-danger-500/20', dot: 'bg-danger-400' },
  critical: { label: 'Critical', color: 'text-white bg-danger-600/80 border-danger-500', dot: 'bg-white' },
};

export const STATUS_META: Record<AlertStatus, { label: string; color: string; dot: string }> = {
  new: { label: 'New', color: 'text-danger-200 bg-danger-500/15 border-danger-500/30', dot: 'bg-danger-400 animate-pulse-dot' },
  acknowledged: { label: 'Acknowledged', color: 'text-steel-200 bg-steel-600/15 border-steel-600/30', dot: 'bg-steel-400' },
  needs_review: { label: 'Needs Review', color: 'text-warning-200 bg-warning-500/15 border-warning-500/30', dot: 'bg-warning-400' },
  resolved: { label: 'Resolved', color: 'text-success-200 bg-success-500/15 border-success-500/30', dot: 'bg-success-400' },
};

export const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
};

export const SHOPIFTING_CATEGORIES = [
  'Body Concealment',
  'Pocket Concealment',
  'Purse / Handbag Concealment',
  'Backpack / Bag Concealment',
];

export const RESTRICTED_ZONES = [
  'Back door',
  'Behind store',
  'Side of building',
  'Dumpster',
  'Loading area',
  'Employee entrance',
  'Restricted rear parking',
  'Other sensitive exterior area',
];
