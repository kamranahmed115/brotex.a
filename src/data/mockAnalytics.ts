export const mockAlertTrends = {
  '24H': [
    { time: '00:00', shoplifting: 1, loitering: 0, restricted: 0, dwell: 1 },
    { time: '04:00', shoplifting: 0, loitering: 2, restricted: 1, dwell: 0 },
    { time: '08:00', shoplifting: 2, loitering: 1, restricted: 0, dwell: 4 },
    { time: '12:00', shoplifting: 5, loitering: 3, restricted: 0, dwell: 2 },
    { time: '16:00', shoplifting: 8, loitering: 4, restricted: 1, dwell: 3 },
    { time: '20:00', shoplifting: 4, loitering: 5, restricted: 2, dwell: 1 },
  ],
  '7D': [
    { time: 'Mon', shoplifting: 12, loitering: 8, restricted: 2, dwell: 5 },
    { time: 'Tue', shoplifting: 9, loitering: 11, restricted: 1, dwell: 6 },
    { time: 'Wed', shoplifting: 15, loitering: 7, restricted: 3, dwell: 8 },
    { time: 'Thu', shoplifting: 11, loitering: 9, restricted: 0, dwell: 4 },
    { time: 'Fri', shoplifting: 22, loitering: 14, restricted: 5, dwell: 12 },
    { time: 'Sat', shoplifting: 28, loitering: 18, restricted: 8, dwell: 15 },
    { time: 'Sun', shoplifting: 19, loitering: 12, restricted: 4, dwell: 9 },
  ],
  '30D': [
    { time: 'Week 1', shoplifting: 85, loitering: 45, restricted: 12, dwell: 30 },
    { time: 'Week 2', shoplifting: 92, loitering: 52, restricted: 15, dwell: 35 },
    { time: 'Week 3', shoplifting: 78, loitering: 40, restricted: 8, dwell: 28 },
    { time: 'Week 4', shoplifting: 95, loitering: 58, restricted: 18, dwell: 42 },
  ]
};

export const mockDetectionBreakdown = [
  { name: 'Shoplifting', count: 124, fill: '#7C5CFF' }, // Violet
  { name: 'Loitering', count: 75, fill: '#64748B' },    // Muted
  { name: 'Vehicle Dwell', count: 42, fill: '#334155' },
  { name: 'Restricted Access', count: 28, fill: '#94A3B8' },
  { name: 'Long-Term Parking', count: 15, fill: '#CBD5E1' },
];

export const mockShopliftingIntelligence = [
  { name: 'Pocket Concealment', count: 18 },
  { name: 'Body Concealment', count: 9 },
  { name: 'Bag Concealment', count: 7 },
  { name: 'Purse / Handbag', count: 5 },
];

export const mockAlertSeverity = [
  { name: 'Critical', value: 3, fill: '#EF4444' }, // Red
  { name: 'High', value: 7, fill: '#F97316' },     // Orange
  { name: 'Medium', value: 11, fill: '#F59E0B' },  // Amber
  { name: 'Low', value: 6, fill: '#64748B' },      // Gray
];

export const mockResponseWorkflow = {
  generated: 27,
  acknowledged: 22,
  resolved: 19,
  needsReview: 3
};

export const mockCameraActivity = [
  { time: '12AM', alerts: 1 },
  { time: '2AM', alerts: 0 },
  { time: '4AM', alerts: 0 },
  { time: '6AM', alerts: 2 },
  { time: '8AM', alerts: 5 },
  { time: '10AM', alerts: 8 },
  { time: '12PM', alerts: 12 },
  { time: '2PM', alerts: 7 },
  { time: '4PM', alerts: 9 },
  { time: '6PM', alerts: 14 },
  { time: '8PM', alerts: 6 },
  { time: '10PM', alerts: 3 },
];

export const mockStoreComparison = [
  { name: 'Highway 17', alerts: 27, resolved: 19 },
  { name: 'Main Street', alerts: 18, resolved: 15 },
  { name: 'Downtown', alerts: 11, resolved: 10 },
];
