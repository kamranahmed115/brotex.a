import { useNavigate } from 'react-router-dom';
import { Store as StoreIcon, ArrowRight, Video, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { mockStoreComparison } from '@/data/mockAnalytics';

export function StoresPage() {
  const { stores } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Stores</h1>
          <p className="text-sm text-ink-400">Manage your connected locations and security performance.</p>
        </div>
      </div>
      
      {/* Store Comparison Chart */}
      <Card>
        <CardHeader title="Store Security Performance" subtitle="Alert volume comparison across locations" />
        <div className="h-[250px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockStoreComparison} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} width={80} />
              <Tooltip cursor={{ fill: '#1E293B' }} contentStyle={{ backgroundColor: '#0D1326', borderColor: '#1E293B', fontSize: '12px' }} />
              <Bar dataKey="alerts" name="Total Alerts" fill="#7C5CFF" radius={[0, 4, 4, 0]} barSize={16} />
              <Bar dataKey="resolved" name="Resolved" fill="#22C55E" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Store Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {stores.map((store, i) => {
          // Generate deterministic mock metrics based on index
          const totalCam = 12 + (i * 3);
          const onlineCam = totalCam - (i % 2);
          const aiCam = onlineCam - 2;
          const alertsToday = 15 + (i * 7);
          const activeAlerts = 2 + i;

          return (
            <Card key={store.id} className="hover:border-ink-600 transition-colors bg-ink-900/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-ink-800 border border-ink-700 flex items-center justify-center text-steel-400 shadow-inner">
                    <StoreIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{store.name}</h3>
                    <p className="text-xs text-ink-400 mt-0.5">{store.address}</p>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => navigate(`/stores/${store.id}`)}>
                  Dashboard <ArrowRight size={14} className="ml-1.5" />
                </Button>
              </div>

              {/* Store Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6">
                <div>
                  <div className="text-[10px] font-semibold text-ink-500 uppercase tracking-wide flex items-center gap-1 mb-1"><Video size={12}/> Cameras</div>
                  <div className="text-sm font-bold text-ink-100">{totalCam} Total</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-ink-500 uppercase tracking-wide flex items-center gap-1 mb-1"><Video size={12} className="text-success-400"/> Online</div>
                  <div className="text-sm font-bold text-ink-100">{onlineCam}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-ink-500 uppercase tracking-wide flex items-center gap-1 mb-1"><ShieldCheck size={12} className="text-steel-400"/> AI Protected</div>
                  <div className="text-sm font-bold text-ink-100">{aiCam}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-ink-500 uppercase tracking-wide flex items-center gap-1 mb-1"><AlertTriangle size={12}/> Alerts Today</div>
                  <div className="text-sm font-bold text-ink-100">{alertsToday}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-ink-500 uppercase tracking-wide flex items-center gap-1 mb-1"><AlertTriangle size={12} className="text-danger-400"/> Active</div>
                  <div className="text-sm font-bold text-danger-400">{activeAlerts}</div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-ink-800 flex items-center justify-between text-xs text-ink-400">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${store.status === 'operational' ? 'bg-success-400 animate-pulse-dot' : 'bg-warning-400'}`} />
                  {store.status === 'operational' ? 'System Operational' : 'Degraded Performance'}
                </span>
                <span>{store.timezone}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
