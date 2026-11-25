import React from 'react';
import { ActionModals } from '@/components/organisms/ActionModals/ActionModals';
import { RightSidebar } from '@/components/organisms/RightSidebar';
import { Sidebar } from '@/components/organisms/Sidebar';
import { ToastViewport } from '@/components/organisms/ToastViewport';
import { TopHeader } from '@/components/organisms/TopHeader';
import { useFinance } from '@/store/FinanceContext';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { activeNav } = useFinance();

  return (
    <div className="flex min-h-screen w-full bg-[#F5F5F7] lg:h-screen lg:overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-[#F9F9FB] lg:overflow-hidden">
        <TopHeader />
        <main className="@container flex-1 overflow-y-auto px-3.5 py-3.5 sm:px-6 sm:py-4 lg:px-7 lg:py-5">
          <div key={activeNav} className="animate-kaza-page w-full">
            {children}
          </div>
        </main>
      </div>
      <RightSidebar />
      <ActionModals />
      <ToastViewport />
    </div>
  );
}
