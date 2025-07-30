import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout as ClientDashboardLayout } from "./client-dashboard-layout";

interface ServerDashboardLayoutProps {
  children: React.ReactNode;
}

export async function ServerDashboardLayout({ children }: ServerDashboardLayoutProps) {
  const user = await getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <ClientDashboardLayout user={user}>
      {children}
    </ClientDashboardLayout>
  );
}