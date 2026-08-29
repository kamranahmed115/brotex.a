import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid, AreaChart, Area
} from 'recharts';
import { 
  mockAlertTrends, mockDetectionBreakdown, mockAlertSeverity, mockResponseWorkflow, mockCameraActivity, mockStoreComparison 
} from '@/data/mockAnalytics';
import { useApp } from '@/store/AppContext';
import { classNames } from '@/lib/format';

export function AnalyticsPage() {
  const { stores, cameras } = useApp();
  const [dateRange, setDateRange] = useState('7D');
  const [storeFilter, setStoreFilter] = useState('all');
  const [cameraFilter, setCameraFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Global Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Security Analytics</h1>
          <p className="text-sm text-ink-400 mt-0.5">Comprehensive intelligence and reporting</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-ink-900 p-2 rounded-lg border border-ink-800">
          <div className="w-32">
            <Select 
              value={dateRange} 
              onChange={setDateRange}
              options={[
                { value: '24H', label: 'Last 24 Hours' },
                { value: '7D', label: 'Last 7 Days' },
                { value: '30D', label: 'Last 30 Days' },
              ]}
            />
          </div>
          <div className="w-40">
            <Select 
              value={storeFilter} 
              onChange={setStoreFilter}
              options={[
                { value: 'all', label: 'All Stores' },
                ...stores.map(s => ({ value: s.id, label: s.name }))
              ]}
            />
          </div>
          <div className="w-40">
            <Select 
              value={cameraFilter} 
              onChange={setCameraFilter}
              options={[
                { value: 'all', label: 'All Cameras' },
                ...cameras.map(c => ({ value: c.id, label: c.name }))
              ]}
            />
          </div>
          <div className="w-40">
            <Select 
              value={typeFilter} 
              onChange={setTypeFilter}
              options={[
                { value: 'all', label: 'All Event Types' },
                { value: 'shoplifting', label: 'Shoplifting' },
                { value: 'loitering', label: 'Loitering' },
                { value: 'restricted', label: 'Restricted Access' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* 1. Security Overview (Summary KPIs) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-ink-850 to-ink-900 border-ink-700">
          <div className="text-xs font-semibold text-ink-400 uppercase mb-2">Total Events</div>
          <div className="text-3xl font-bold text-white mb-1">324</div>
          <div className="text-xs text-ink-500">+12% vs previous</div>
        </Card>
        <Card className="bg-gradient-to-br from-ink-850 to-ink-900 border-ink-700">
          <div className="text-xs font-semibold text-ink-400 uppercase mb-2">Avg Resolution Time</div>
          <div className="text-3xl font-bold text-white mb-1">4m 12s</div>
          <div className="text-xs text-success-400">-30s vs previous</div>
        </Card>
        <Card className="bg-gradient-to-br from-ink-850 to-ink-900 border-ink-700">
          <div className="text-xs font-semibold text-ink-400 uppercase mb-2">Critical Incidents</div>
          <div className="text-3xl font-bold text-danger-400 mb-1">14</div>
          <div className="text-xs text-ink-500">Requires immediate review</div>
        </Card>
        <Card className="bg-gradient-to-br from-ink-850 to-ink-900 border-ink-700">
          <div className="text-xs font-semibold text-ink-400 uppercase mb-2">False Positives</div>
          <div className="text-3xl font-bold text-white mb-1">2.1%</div>
          <div className="text-xs text-success-400">Model accuracy improving</div>
        </Card>
      </div>

      {/* 2 & 3. Alert Trends & Resolution Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Alert Trends" subtitle="Event volume over selected time period" />
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockAlertTrends[dateRange as keyof typeof mockAlertTrends]}>
                <defs>
                  <linearGradient id="colorShop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C5CFF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7C5CFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0D1326', borderColor: '#1E293B', fontSize: '12px' }} />
                <Area type="monotone" dataKey="shoplifting" name="Shoplifting" stroke="#7C5CFF" fillOpacity={1} fill="url(#colorShop)" />
                <Line type="monotone" dataKey="loitering" name="Loitering" stroke="#64748B" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Alert Resolution Workflow" subtitle="Status of generated alerts" />
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center justify-between p-3 bg-ink-900 rounded-lg border border-ink-800">
              <span className="text-sm text-ink-200">Generated</span>
              <span className="text-lg font-bold text-white">{mockResponseWorkflow.generated}</span>
            </div>
            <div className="flex justify-center"><div className="w-0.5 h-4 bg-ink-700" /></div>
            <div className="flex items-center justify-between p-3 bg-ink-900 rounded-lg border border-steel-500/30">
              <span className="text-sm text-steel-300">Acknowledged</span>
              <span className="text-lg font-bold text-steel-400">{mockResponseWorkflow.acknowledged}</span>
            </div>
            <div className="flex justify-center"><div className="w-0.5 h-4 bg-ink-700" /></div>
            <div className="flex items-center justify-between p-3 bg-ink-900 rounded-lg border border-success-500/30">
              <span className="text-sm text-success-300">Resolved</span>
              <span className="text-lg font-bold text-success-400">{mockResponseWorkflow.resolved}</span>
            </div>
            
            <div className="mt-4 p-3 bg-warning-500/10 border border-warning-500/20 rounded-lg flex items-center justify-between">
              <span className="text-sm text-warning-400">Needs Review</span>
              <span className="text-lg font-bold text-warning-400">{mockResponseWorkflow.needsReview}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 4, 5, 6. Store Comparison, Top Cameras, Severity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader title="Store Comparison" subtitle="Alerts by location" />
          <div className="h-[250px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockStoreComparison} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} width={80} />
                <Tooltip cursor={{ fill: '#1E293B' }} contentStyle={{ backgroundColor: '#0D1326', borderColor: '#1E293B', fontSize: '12px' }} />
                <Bar dataKey="alerts" name="Total Alerts" fill="#7C5CFF" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="resolved" name="Resolved" fill="#22C55E" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Most Active Cameras" subtitle="Ranked by event volume" />
          <div className="mt-4 space-y-4">
            {[
              { name: 'Store Interior 04', alerts: 124 },
              { name: 'Fuel Pump 02', alerts: 98 },
              { name: 'Front Entrance', alerts: 87 },
              { name: 'Parking Lot', alerts: 54 },
              { name: 'Store Interior 06', alerts: 41 },
            ].map((cam, i) => (
              <div key={cam.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-ink-500 w-4">{i + 1}.</span>
                  <span className="text-sm text-ink-100">{cam.name}</span>
                </div>
                <span className="text-sm font-medium text-steel-400">{cam.alerts} events</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Alert Severity" subtitle="Event criticality distribution" />
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mockAlertSeverity} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                  {mockAlertSeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0D1326', borderColor: '#1E293B', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {mockAlertSeverity.map(s => (
              <div key={s.name} className="flex items-center gap-2 bg-ink-900 p-2 rounded border border-ink-800">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.fill }} />
                <span className="text-xs text-ink-300 flex-1">{s.name}</span>
                <span className="text-xs font-bold text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 7 & 8. Detection Breakdown & Time-based Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Detection Distribution" subtitle="Events by AI category" />
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDetectionBreakdown} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#1E293B' }} contentStyle={{ backgroundColor: '#0D1326', borderColor: '#1E293B', fontSize: '12px' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {mockDetectionBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Time-based Activity" subtitle="24H event distribution" />
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockCameraActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#1E293B' }} contentStyle={{ backgroundColor: '#0D1326', borderColor: '#1E293B', fontSize: '12px' }} />
                <Bar dataKey="alerts" fill="#475569" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
