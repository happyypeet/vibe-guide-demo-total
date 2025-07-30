import { Sidebar } from "@/components/dashboard/sidebar";
import { createServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex h-screen">
      <Sidebar className="w-64 hidden md:block" />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}