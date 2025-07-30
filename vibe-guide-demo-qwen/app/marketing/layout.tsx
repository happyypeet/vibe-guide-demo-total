import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from '@/lib/supabase/server';

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/marketing" className="text-xl font-bold">
              VibeGuide
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/marketing" className="font-medium">
                首页
              </Link>
              <Link href="/marketing/pricing" className="font-medium">
                价格
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {user ? (
                <Button asChild>
                  <Link href="/projects">控制台</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/auth/login">登录</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/sign-up">注册</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">VibeGuide</h3>
              <p className="text-gray-600">
                智能AI开发文档平台，帮助编程新手快速生成专业项目文档。
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">产品</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/marketing" className="hover:text-foreground">
                    功能
                  </Link>
                </li>
                <li>
                  <Link href="/marketing/pricing" className="hover:text-foreground">
                    价格
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">资源</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    文档
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    博客
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">支持</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    帮助中心
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    联系我们
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-gray-600">
            <p>© 2025 VibeGuide. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}