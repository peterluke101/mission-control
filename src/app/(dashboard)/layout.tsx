import { Sidebar } from '@/components/sidebar';
import { HeaderBar } from '@/components/header-bar';
import { BottomNav } from '@/components/bottom-nav';
import { ChatDock } from '@/components/chat-dock';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-grid" style={{ backgroundColor: '#0a0b0f' }}>
      <HeaderBar />
      <Sidebar />
      {/* Main content area — offset by header height + sidebar width */}
      <main
        className="flex-1 flex flex-col overflow-hidden mt-11 md:ml-[240px] pb-[calc(60px+env(safe-area-inset-bottom,0px))] md:pb-0"
      >
        {children}
      </main>
      <BottomNav />
      {/* Chat dock — rendered once for every dashboard page. */}
      <ChatDock />
    </div>
  );
}
