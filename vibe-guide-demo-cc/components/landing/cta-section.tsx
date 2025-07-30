'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
export function CTASection() {
  const router = useRouter();

  const handleGetStarted = () => {
    // 直接跳转到登录页面，登录成功后会重定向到项目页面
    router.push('/auth/login');
  };

  return (
    <section className="py-20 bg-blue-600 dark:bg-blue-800">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-8 text-white">
          <h2 className="text-3xl md:text-4xl font-bold">
            准备好开始创建您的项目文档了吗？
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            立即注册VibeGuide，体验AI智能生成专业开发文档的强大功能
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100"
              onClick={handleGetStarted}
            >
              立即开始免费体验
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <p className="text-sm text-blue-200">
            注册即可开始使用，无需信用卡
          </p>
        </div>
      </div>
    </section>
  );
}