import { Header } from '@/components/common/Header';
import { SidebarNav } from '@/components/common/SidebarNav';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <SidebarNav />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8 bg-secondary/50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
