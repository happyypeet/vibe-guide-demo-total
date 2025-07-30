'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Zap, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();

  const handleGetStarted = () => {
    // 直接跳转到登录页面，登录成功后会重定向到项目页面
    router.push('/auth/login');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              智能AI开发文档
              <span className="text-blue-600 dark:text-blue-400"> 生成平台</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-300">
              VibeGuide 帮助编程新手快速生成专业的项目开发文档，包括用户旅程地图、产品需求PRD、前后端设计文档等。
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700"
              onClick={handleGetStarted}
            >
              立即开始
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6"
              asChild
            >
              <Link href="#features">了解更多</Link>
            </Button>
          </div>
          
          <div className="flex items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>5种文档类型</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>AI智能生成</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>新手友好</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}