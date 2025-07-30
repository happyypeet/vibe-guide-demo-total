'use client';

import { Sidebar } from "./sidebar";
import { User } from "@/lib/db/schema";

interface ClientDashboardLayoutProps {
  children: React.ReactNode;
  user?: User;
}

export function DashboardLayout({ children }: ClientDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}