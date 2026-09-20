import React from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const metadata = {
  title: 'Zapella | Super Admin (God Mode)',
  description: 'Painel Central de Gestão e Operações da Plataforma Zapella',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen flex bg-[#F0F2F5] text-[#111B21] font-sans">
        {/* Left Sidebar (240px) */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header (64px) */}
          <AdminHeader />

          {/* Page Content (p-6) */}
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
