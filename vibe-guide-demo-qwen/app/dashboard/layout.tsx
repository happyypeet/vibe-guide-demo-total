import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  User 
} from "lucide-react";
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { signOut } from '@/lib/auth/auth';

const navigation = [
  {
    name: "我的项目",
    href: "/projects",
    icon: LayoutDashboard,
  },
  {
    name: "新建项目",
    href: "/projects/new",
    icon: FileText,
  },
  {
    name: "我的",
    href: "/my",
    icon: User,
  },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // 如果没有认证用户，重定向到登录页面
  if (error || !user) {
    redirect('/auth/login');
  }

  const handleSignOut = async () => {
    'use server';
    await signOut();
    redirect('/auth/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* 侧边栏 */}
      <div className="w-64 border-r bg-gray-50/40">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/projects" className="text-xl font-bold">
              VibeGuide
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100"
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <h1 className="text-lg font-semibold">仪表盘</h1>
          <form action={handleSignOut}>
            <Button variant="outline" size="sm" type="submit">
              退出登录
            </Button>
          </form>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}