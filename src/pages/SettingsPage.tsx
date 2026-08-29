import { Card } from '@/components/ui/Card';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Settings</h1>
          <p className="text-sm text-ink-400">Global application settings.</p>
        </div>
      </div>

      <Card>
        <h3 className="text-sm font-medium text-white mb-2">Notifications</h3>
        <p className="text-sm text-ink-400 mb-4">Configure email and push notifications for critical alerts.</p>
        <div className="space-y-3 border-t border-ink-700 pt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="rounded border-ink-600 bg-ink-900 text-steel-500 focus:ring-steel-500" defaultChecked />
            <span className="text-sm text-ink-100">Email alerts for Critical events</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="rounded border-ink-600 bg-ink-900 text-steel-500 focus:ring-steel-500" defaultChecked />
            <span className="text-sm text-ink-100">Push notifications</span>
          </label>
        </div>
      </Card>
      
      <Card>
        <h3 className="text-sm font-medium text-white mb-2">Account</h3>
        <p className="text-sm text-ink-400 mb-4">Manage your profile and authentication methods.</p>
        <button className="text-sm font-medium text-steel-400 hover:text-steel-300 transition-colors">Change Password</button>
      </Card>
    </div>
  );
}
