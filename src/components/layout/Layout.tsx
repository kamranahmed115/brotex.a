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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-ink-300 hover:text-ink-100 p-1.5 rounded-lg hover:bg-ink-800 transition-colors"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <StoreSelector />
          </div>
          <div className="flex items-center gap-1">
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
