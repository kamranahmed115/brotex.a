import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, Video, Cpu, Activity, Clock, ShieldCheck, 
  Map, TrendingUp, CheckCircle, XCircle
} from 'lucide-react';
import {
  useApp, useCamerasForSelected, useAlertsForSelected, useSelectedStores,
} from '@/store/AppContext';
import { ALERT_TYPE_META } from '@/types';
import type { Alert } from '@/types';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PriorityBadge, StatusBadge, CameraStatusBadge } from '@/components/ui/Badge';
import { CameraFrame } from '@/components/cameras/CameraFrame';
import { timeAgo, classNames } from '@/lib/format';

import { 
  LineChart, Line, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, CartesianGrid
} from 'recharts';

import { 
  mockAlertTrends, mockDetectionBreakdown, mockAlertSeverity, mockShopliftingIntelligence
} from '@/data/mockAnalytics';

// --- Subcomponents ---

function Sparkline({ data, color }: { data: any[], color: string }) {
  return (
    <div className="h-8 w-16 opacity-70">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatCard({ label, value, sub, icon, accent, sparklineData, onClick }: any) {
  const accents = {
    danger: 'text-danger-400',
    success: 'text-success-400',
    warning: 'text-warning-400',
    steel: 'text-steel-400',
    violet: 'text-steel-400', // Our steel token is violet
  };
  const sparkColors = {
    danger: '#EF4444', success: '#22C55E', warning: '#F59E0B', steel: '#7C5CFF', violet: '#7C5CFF'
  };

  return (
    <Card className={classNames(onClick && 'cursor-pointer hover:bg-ink-800/80 hover:border-ink-600 transition-all group')} onClick={onClick}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11px] font-bold text-ink-400 uppercase tracking-wider group-hover:text-ink-300 transition-colors">{label}</div>
        <div className={classNames(accents[accent as keyof typeof accents])}>{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-white tracking-tight mb-1">{value}</div>
          {sub && <div className="text-xs font-medium text-ink-500">{sub}</div>}
        </div>
        {sparklineData && <Sparkline data={sparklineData} color={sparkColors[accent as keyof typeof sparkColors]} />}
      </div>
    </Card>
  );
}

export function OverviewPage() {
  const navigate = useNavigate();
  const cameras = useCamerasForSelected();
  const alerts = useAlertsForSelected();
  const stores = useSelectedStores();
  const { cameras: allCameras } = useApp();

  const [trendFilter, setTrendFilter] = useState<'24H'|'7D'|'30D'>('7D');

  const activeAlerts = alerts.filter(a => a.status === 'new' || a.status === 'needs_review');
  const onlineCameras = cameras.filter(c => c.status === 'online');
  const offlineCameras = cameras.filter(c => c.status === 'offline');
  const aiCameras = cameras.filter(c => c.aiEnabled && c.status === 'online');
  const recentAlerts = [...alerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

  function cameraName(camId: string) {
    const c = allCameras.find(c => c.id === camId);
    return c ? c.name : 'Unknown';
  }
  function storeShortName(storeId: string) {
    const s = stores.find(s => s.id === storeId);
    return s?.shortName ?? '';
  }

  // Fake sparkline data
  const sparkUp = [{value: 2}, {value: 3}, {value: 2}, {value: 5}, {value: 4}, {value: 7}];
  const sparkDown = [{value: 7}, {value: 6}, {value: 6}, {value: 4}, {value: 2}, {value: 1}];
  const sparkFlat = [{value: 5}, {value: 5}, {value: 4}, {value: 6}, {value: 5}, {value: 5}];

  return (
    <div className="space-y-6">
      {/* 1. KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Active Alerts" value={activeAlerts.length} sub="3 Critical" icon={<AlertTriangle size={16} />} accent="danger" sparklineData={sparkUp} onClick={() => navigate('/alerts')} />
        <StatCard label="Today's Alerts" value="27" sub="+8% vs yesterday" icon={<TrendingUp size={16} />} accent="warning" sparklineData={sparkUp} />
        <StatCard label="Cameras Online" value={`${onlineCameras.length} / ${cameras.length}`} sub="93% operational" icon={<Video size={16} />} accent="success" sparklineData={sparkFlat} />
        <StatCard label="AI Protected" value={`${aiCameras.length} / ${cameras.length}`} sub="80% coverage" icon={<ShieldCheck size={16} />} accent="violet" sparklineData={sparkFlat} onClick={() => navigate('/cameras')} />
        <StatCard label="Incidents Resolved" value="19" sub="Today's resolved alerts" icon={<CheckCircle size={16} />} accent="success" sparklineData={sparkUp} />
        <StatCard label="Avg Response" value="2m 18s" sub="Time to acknowledge" icon={<Clock size={16} />} accent="steel" sparklineData={sparkDown} />
      </div>

      {/* 2. Main Row: Security Activity Chart & Event Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card noPadding className="lg:col-span-2 flex flex-col">
          <CardHeader 
            title="Security Activity" 
            subtitle="Alert trends over time" 
            className="px-5 pt-5 pb-2"
            action={
              <div className="flex bg-ink-900 rounded-lg p-1 border border-ink-800">
                {(['24H', '7D', '30D'] as const).map(f => (
                  <button 
                    key={f}
                    onClick={() => setTrendFilter(f)}
                    className={classNames('px-3 py-1 text-[11px] font-semibold rounded-md transition-colors', trendFilter === f ? 'bg-ink-700 text-white' : 'text-ink-400 hover:text-ink-200')}
                  >
                    {f}
                  </button>
                ))}
              </div>
            }
          />
          <div className="px-5 pb-5 h-[280px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockAlertTrends[trendFilter]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0D1326', borderColor: '#1E293B', fontSize: '12px' }} />
                <Line type="monotone" dataKey="shoplifting" name="Shoplifting" stroke="#7C5CFF" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="loitering" name="Loitering" stroke="#64748B" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="dwell" name="Vehicle Dwell" stroke="#94A3B8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Active Events */}
        <Card noPadding className="flex flex-col">
          <CardHeader 
            title="Active Security Events" 
            subtitle="Require immediate attention"
            icon={<Activity size={16} />}
            className="px-5 pt-5 mb-0"
            action={<Button variant="ghost" size="sm" onClick={() => navigate('/alerts')}>View all</Button>}
          />
          <div className="flex-1 overflow-y-auto max-h-[300px] divide-y divide-ink-800 border-t border-ink-800 mt-3">
            {recentAlerts.map(alert => {
              const meta = ALERT_TYPE_META[alert.type];
              return (
                <div key={alert.id} className="p-4 hover:bg-ink-800/40 transition-colors cursor-pointer group" onClick={() => navigate(`/alerts/${alert.id}`)}>
                  <div className="flex items-center justify-between mb-2">
                    <PriorityBadge priority={alert.priority} size="sm" />
                    <span className="text-[10px] text-ink-500">{timeAgo(alert.timestamp)}</span>
                  </div>
                  <div className="text-sm font-medium text-ink-100 group-hover:text-steel-300 transition-colors">{meta.label}</div>
                  <div className="text-xs text-ink-400 mt-1">{cameraName(alert.cameraId)} — Conf: {alert.confidence}%</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* 3. Analytics Row: Detection Distribution, Alert Severity, Shoplifting Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col h-[320px]">
          <h3 className="text-sm font-semibold text-white mb-6">Detection Activity</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockDetectionBreakdown} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} width={100} />
              <Tooltip cursor={{ fill: '#1E293B' }} contentStyle={{ backgroundColor: '#0D1326', borderColor: '#1E293B', fontSize: '12px' }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {mockDetectionBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="flex flex-col h-[320px]">
          <h3 className="text-sm font-semibold text-white mb-2">Alert Severity</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={mockAlertSeverity} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                {mockAlertSeverity.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0D1326', borderColor: '#1E293B', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {mockAlertSeverity.map(s => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.fill }} />
                <span className="text-[11px] text-ink-300">{s.name}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col h-[320px]">
          <h3 className="text-sm font-semibold text-white mb-1">Shoplifting Intelligence</h3>
          <p className="text-[11px] text-ink-400 mb-6">Concealment category breakdown</p>
          <div className="space-y-4 flex-1">
            {mockShopliftingIntelligence.map(cat => (
              <div key={cat.name}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-ink-200">{cat.name}</span>
                  <span className="font-bold text-steel-400">{cat.count}</span>
                </div>
                <div className="w-full h-1.5 bg-ink-800 rounded-full overflow-hidden">
                  <div className="h-full bg-steel-600 rounded-full" style={{ width: `${(cat.count / 18) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 4. Health Row: Camera Health Table & Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card noPadding className="lg:col-span-2">
          <CardHeader title="Camera Health Dashboard" subtitle="Operational status of video endpoints" className="px-5 pt-5" action={<Button variant="ghost" size="sm" onClick={() => navigate('/cameras')}>Manage</Button>} />
          <div className="overflow-x-auto border-t border-ink-800 mt-2">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-ink-900/50 text-[11px] uppercase tracking-wider text-ink-400 border-b border-ink-800">
                <tr>
                  <th className="px-5 py-3 font-medium">Camera</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Intelligence</th>
                  <th className="px-5 py-3 font-medium text-right">Last Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-800/50">
                {cameras.slice(0, 6).map(cam => (
                  <tr key={cam.id} className="hover:bg-ink-800/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-ink-100">{cam.name}</td>
                    <td className="px-5 py-3 text-ink-400">{cam.location}</td>
                    <td className="px-5 py-3"><CameraStatusBadge status={cam.status} /></td>
                    <td className="px-5 py-3">
                      {cam.aiEnabled ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-steel-400">
                          <Cpu size={14} /> Active
                        </span>
                      ) : (
                        <span className="text-xs text-ink-500">Off</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right text-xs text-ink-500">Just now</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-semibold text-white mb-1">AI Protection Coverage</h3>
            <p className="text-[11px] text-ink-400 mb-5">12 / 15 cameras protected</p>
            
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-ink-200">Shoplifting</span>
                  <span className="text-ink-400">7</span>
                </div>
                <div className="flex h-2 w-full gap-0.5"><div className="h-full bg-steel-500 rounded-sm w-[46%]" /></div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-ink-200">Loitering</span>
                  <span className="text-ink-400">3</span>
                </div>
                <div className="flex h-2 w-full gap-0.5"><div className="h-full bg-steel-500/70 rounded-sm w-[20%]" /></div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-ink-200">Restricted Access</span>
                  <span className="text-ink-400">2</span>
                </div>
                <div className="flex h-2 w-full gap-0.5"><div className="h-full bg-steel-500/40 rounded-sm w-[13%]" /></div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-ink-850 to-ink-900 border-ink-800">
            <h3 className="text-sm font-semibold text-white mb-1">Store Security Score</h3>
            <p className="text-[10px] text-ink-500 mb-4 uppercase tracking-wider">Demo Illustrative Score</p>
            <div className="flex items-center gap-6 mb-5">
              <div className="text-5xl font-bold text-success-400">92</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between gap-4"><span className="text-ink-400">Camera Health</span><span className="text-success-400 font-medium">Excellent</span></div>
                <div className="flex justify-between gap-4"><span className="text-ink-400">AI Coverage</span><span className="text-success-400 font-medium">Good</span></div>
                <div className="flex justify-between gap-4"><span className="text-ink-400">Response Status</span><span className="text-success-400 font-medium">Good</span></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
