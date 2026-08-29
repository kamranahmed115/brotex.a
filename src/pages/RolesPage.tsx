import { Shield, Check, Users } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { useApp } from '@/store/AppContext';
import { classNames } from '@/lib/format';

export function RolesPage() {
  const { users } = useApp();
  
  const ownerCount = users.filter(u => u.role === 'owner').length;
  const managerCount = users.filter(u => u.role === 'manager').length;
  const staffCount = users.filter(u => u.role === 'staff').length;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-white">Roles & Permissions</h1>
        <p className="text-sm text-ink-400">View access levels and capabilities for each organizational role.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Owner Role */}
        <RoleCard 
          title="Owner"
          description="Full organization access."
          count={ownerCount}
          accent="bg-steel-500/20 text-steel-400 border-steel-500/30"
          permissions={[
            { label: 'View Dashboard', has: true },
            { label: 'View Alerts', has: true },
            { label: 'Manage Alerts', has: true },
            { label: 'View Cameras', has: true },
            { label: 'Configure Cameras', has: true },
            { label: 'View Analytics', has: true },
            { label: 'Manage Users', has: true },
            { label: 'Store Settings', has: true },
          ]}
        />

        {/* Manager Role */}
        <RoleCard 
          title="Manager"
          description="Can manage cameras, AI configuration, alerts, and store operations."
          count={managerCount}
          accent="bg-ink-700/50 text-ink-300 border-ink-600"
          permissions={[
            { label: 'View Dashboard', has: true },
            { label: 'View Alerts', has: true },
            { label: 'Manage Alerts', has: true },
            { label: 'View Cameras', has: true },
            { label: 'Configure Cameras', has: true },
            { label: 'View Analytics', has: true },
            { label: 'Manage Users', has: false },
            { label: 'Store Settings', has: false },
          ]}
        />

        {/* Staff Role */}
        <RoleCard 
          title="Staff"
          description="Can view and manage assigned alerts but has limited configuration access."
          count={staffCount}
          accent="bg-ink-800 text-ink-400 border-ink-700"
          permissions={[
            { label: 'View Dashboard', has: true },
            { label: 'View Alerts', has: true },
            { label: 'Manage Alerts', has: true },
            { label: 'View Cameras', has: true },
            { label: 'Configure Cameras', has: false },
            { label: 'View Analytics', has: false },
            { label: 'Manage Users', has: false },
            { label: 'Store Settings', has: false },
          ]}
        />
      </div>
    </div>
  );
}

function RoleCard({ title, description, count, permissions, accent }: { title: string, description: string, count: number, permissions: {label: string, has: boolean}[], accent: string }) {
  return (
    <Card className="flex flex-col h-full bg-ink-900 border-ink-800">
      <div className="flex items-start justify-between mb-4">
        <div className={classNames('w-12 h-12 rounded-xl border flex items-center justify-center mb-2', accent)}>
          <Shield size={24} />
        </div>
        <div className="flex items-center gap-1.5 bg-ink-950 border border-ink-800 px-2.5 py-1 rounded text-xs font-semibold text-ink-300">
          <Users size={14} className="text-ink-500" /> {count} Users
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-sm text-ink-400 mt-2 flex-grow">{description}</p>
      
      <div className="mt-8 pt-6 border-t border-ink-800">
        <h4 className="text-[10px] font-bold text-ink-500 uppercase tracking-widest mb-4">Permissions</h4>
        <div className="space-y-3">
          {permissions.map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={classNames('w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold', p.has ? 'bg-steel-500/20 text-steel-400' : 'bg-ink-800 text-ink-600')}>
                {p.has ? '✓' : '—'}
              </div>
              <span className={classNames('text-sm', p.has ? 'text-ink-200' : 'text-ink-600')}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
