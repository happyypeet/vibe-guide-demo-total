import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <nav className="w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-900/95 dark:supports-[backdrop-filter]:bg-slate-900/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            VibeGuide
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/pricing">
              <Button variant="ghost">定价</Button>
            </Link>
            <Link href="/auth/login">
              <Button>登录</Button>
            </Link>
          </div>
        </div>
      </nav>
      
      <Hero />
      <Features />
      <Pricing />
      
      <footer className="bg-slate-50 dark:bg-slate-900 py-8 border-t">
        <div className="container mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
          <p>© 2024 VibeGuide. 让项目开发更简单。</p>
        </div>
      </footer>
    </div>
  );
}
