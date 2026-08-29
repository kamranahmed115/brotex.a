import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Bell, Video, Store, BarChart3, Users, Settings,
  Radio, SlidersHorizontal, AlertCircle, FileClock, X, Shield,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { classNames } from '@/lib/format';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { alerts } = useApp();
  const newAlerts = alerts.filter(a => a.status === 'new').length;
  const reviewAlerts = alerts.filter(a => a.status === 'needs_review').length;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-ink-950/70 backdrop-blur-sm lg:hidden animate-fade-in" onClick={onClose} />
      )}

      <aside className={classNames(
        'fixed lg:static inset-y-0 left-0 z-40 w-60 bg-ink-900 border-r border-ink-700 flex flex-col transition-transform duration-200 lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}>
        {/* Brand */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-ink-700 flex-shrink-0 bg-ink-950/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-steel-500 to-steel-700 flex items-center justify-center shadow-sm">
              <Radio size={16} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-white tracking-widest leading-none">VORTEX.AI</span>
              <span className="text-[9px] font-semibold text-steel-400 tracking-wider mt-1">AI SECURITY</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-ink-400 hover:text-ink-100 p-1">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <NavLink to="/overview" className={({ isActive }) => classNames('nav-link', isActive && 'nav-link-active')}>
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </NavLink>

          {/* Alerts section */}
          <div className="pt-4 pb-1 px-3">
            <span className="text-[10px] font-semibold text-ink-500 uppercase tracking-wider">Alerts</span>
          </div>
          <NavLink to="/alerts" end className={({ isActive }) => classNames('nav-link', isActive && 'nav-link-active')}>
            <Bell size={18} />
            <span>Active</span>
            {newAlerts > 0 && (
              <span className="ml-auto text-[11px] font-semibold text-white bg-danger-600 rounded-full px-1.5 py-0.5 min-w-[20px] text-center">{newAlerts}</span>
            )}
          </NavLink>
          <NavLink to="/alerts/review" className={({ isActive }) => classNames('nav-sub-link', isActive && 'nav-sub-link-active')}>
            <AlertCircle size={15} />
            <span>Needs Review</span>
            {reviewAlerts > 0 && (
              <span className="ml-auto text-[11px] font-semibold text-warning-300 bg-warning-500/15 rounded-full px-1.5 py-0.5 min-w-[18px] text-center">{reviewAlerts}</span>
            )}
          </NavLink>
          <NavLink to="/alerts/history" className={({ isActive }) => classNames('nav-sub-link', isActive && 'nav-sub-link-active')}>
            <FileClock size={15} />
            <span>History</span>
          </NavLink>

          {/* Cameras section */}
          <div className="pt-4 pb-1 px-3">
            <span className="text-[10px] font-semibold text-ink-500 uppercase tracking-wider">Cameras</span>
          </div>
          <NavLink to="/cameras" end className={({ isActive }) => classNames('nav-link', isActive && 'nav-link-active')}>
            <Video size={18} />
            <span>All Cameras</span>
          </NavLink>
          <NavLink to="/cameras/live" className={({ isActive }) => classNames('nav-sub-link', isActive && 'nav-sub-link-active')}>
            <Radio size={15} />
            <span>Live Monitoring</span>
          </NavLink>
          <NavLink to="/cameras/configure" className={({ isActive }) => classNames('nav-sub-link', isActive && 'nav-sub-link-active')}>
            <SlidersHorizontal size={15} />
            <span>Camera Configuration</span>
          </NavLink>

          <NavLink to="/stores" className={({ isActive }) => classNames('nav-link', isActive && 'nav-link-active')}>
            <Store size={18} />
            <span>Stores</span>
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => classNames('nav-link', isActive && 'nav-link-active')}>
            <BarChart3 size={18} />
            <span>Analytics</span>
          </NavLink>

          {/* General / Admin */}
          <div className="pt-6 pb-2 px-3">
            <div className="h-px bg-ink-800 w-full mb-4" />
            <span className="text-[10px] font-semibold text-ink-500 uppercase tracking-wider">Administration</span>
          </div>
          <NavLink to="/users" className={({ isActive }) => classNames('nav-link', isActive && 'nav-link-active')}>
            <Users size={18} />
            <span>Users</span>
          </NavLink>
          <NavLink to="/roles" className={({ isActive }) => classNames('nav-link', isActive && 'nav-link-active')}>
            <Shield size={18} />
            <span>Roles</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => classNames('nav-link', isActive && 'nav-link-active')}>
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* Footer: system status */}
        <div className="p-4 border-t border-ink-800 bg-ink-950/30 flex-shrink-0">
          <div className="text-[10px] font-semibold text-ink-500 uppercase tracking-wider mb-2">System Operational</div>
          <div className="flex items-center gap-2 text-xs text-ink-300 bg-ink-900 border border-ink-700 p-2 rounded">
            <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse-dot" />
            <span>All systems OK</span>
          </div>
        </div>
      </aside>
    </>
  );
}
