import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { StoreSelector } from '@/components/layout/StoreSelector';
import { NotificationCenter } from '@/components/layout/NotificationCenter';
import { UserMenu } from '@/components/layout/UserMenu';
import { ToastContainer } from '@/components/ui/Toast';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-ink-950">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-3 h-14 px-4 border-b border-ink-700 bg-ink-900 flex-shrink-0">
          <div className="flex items-center gap-3 w-1/3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-ink-300 hover:text-ink-100 p-1.5 rounded-lg hover:bg-ink-800 transition-colors"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <StoreSelector />
          </div>

          <div className="hidden md:flex flex-col items-center justify-center w-1/3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse-dot" />
              <span className="text-[11px] font-semibold text-ink-100 uppercase tracking-wider">AI Monitoring Active</span>
            </div>
            <div className="text-[10px] text-ink-400 mt-0.5">14 / 15 cameras online</div>
          </div>

          <div className="flex items-center justify-end gap-1 w-1/3">
            <NotificationCenter />
            <div className="w-px h-6 bg-ink-700 mx-1.5" />
            <UserMenu />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-4 lg:p-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
