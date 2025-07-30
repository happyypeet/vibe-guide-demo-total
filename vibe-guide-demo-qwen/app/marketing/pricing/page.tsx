"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();

  const handlePurchase = (plan: 'basic' | 'pro') => {
    // 根据选择的套餐跳转到支付页面
    router.push(`/checkout?plan=${plan}`);
  };

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">简单透明的价格</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            选择适合您的套餐，随时可以升级或降级
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* 基础套餐 */}
          <div className="border rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">基础套餐</h2>
            <div className="mb-6">
              <span className="text-4xl font-bold">¥20</span>
              <span className="text-gray-600">/一次性</span>
            </div>
            <ul className="space-y-4 mb-8 text-left">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>生成10个项目点数</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>所有文档类型支持</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Markdown和HTML导出</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>项目保存和管理</span>
              </li>
            </ul>
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => handlePurchase('basic')}
            >
              立即购买
            </Button>
          </div>

          {/* 专业套餐 */}
          <div className="border-2 border-blue-500 rounded-2xl p-8 text-center relative">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg">
              热门
            </div>
            <h2 className="text-2xl font-bold mb-4">专业套餐</h2>
            <div className="mb-6">
              <span className="text-4xl font-bold">¥40</span>
              <span className="text-gray-600">/一次性</span>
            </div>
            <ul className="space-y-4 mb-8 text-left">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>生成30个项目点数</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>所有基础套餐功能</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>优先生成队列</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>批量下载支持</span>
              </li>
            </ul>
            <Button 
              size="lg" 
              className="w-full bg-blue-500 hover:bg-blue-600"
              onClick={() => handlePurchase('pro')}
            >
              立即购买
            </Button>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6">常见问题</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">项目点数是什么？</h4>
              <p className="text-gray-600">
                每生成一个项目文档需要消耗1个点数。点数用完后需要重新购买套餐。
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">文档可以修改吗？</h4>
              <p className="text-gray-600">
                可以，生成的文档可以随时编辑和保存，我们会保存您的修改历史。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}