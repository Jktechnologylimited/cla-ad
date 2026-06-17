import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Sidebar from '@/components/layout/Sidebar';
import AdminContent from '@/components/layout/AdminContent';
import { SidebarProvider } from '@/components/layout/SidebarContext';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated();
  if (!authed) redirect('/login');

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-ivory flex">
        <Sidebar />
        <AdminContent>{children}</AdminContent>
      </div>
    </SidebarProvider>
  );
}
