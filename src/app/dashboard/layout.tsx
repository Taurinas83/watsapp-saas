import React from 'react';
import { Navigation } from '@/components/Navigation';
import { ImpersonationBanner } from '@/components/admin/ImpersonationBanner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Sidebar Shell */}
      <Navigation userRole="admin" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ImpersonationBanner />
        <main className="flex-1 pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}
