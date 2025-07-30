import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from '@/lib/supabase/server';

export default async function MarketingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            智能AI开发文档平台
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl">
            VibeGuide帮助编程新手快速生成专业的项目开发文档，包括用户旅程地图、产品需求文档、前后端设计文档等。
          </p>
          <Button 
            size="lg" 
            asChild
            className="text-lg px-8 py-6 rounded-full"
          >
            {user ? (
              <Link href="/projects">进入控制台</Link>
            ) : (
              <Link href="/auth/login">立即开始</Link>
            )}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-16">核心功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">智能文档生成</h3>
            <p className="text-gray-600">
              基于AI技术，自动生成专业的开发文档，包括PRD、设计文档等。
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI辅助分析</h3>
            <p className="text-gray-600">
              AI深入理解您的项目需求，提出专业问题帮助完善项目规划。
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">一键导出</h3>
            <p className="text-gray-600">
              支持Markdown和HTML格式导出，可单独下载或批量打包。
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">准备好开始您的项目了吗？</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            加入数千名开发者，使用VibeGuide提升开发效率
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            asChild
            className="text-lg px-8 py-6 rounded-full"
          >
            {user ? (
              <Link href="/projects">进入控制台</Link>
            ) : (
              <Link href="/auth/login">立即体验</Link>
            )}
          </Button>
        </div>
      </section>
    </div>
  );
}