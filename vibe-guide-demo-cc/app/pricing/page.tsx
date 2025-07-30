'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Check, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const pricingPlans = [
  {
    id: 'basic',
    name: "基础版",
    price: "20",
    description: "适合个人开发者",
    projects: "10",
    credits: 10,
    features: [
      "10个项目点数",
      "AI文档生成",
      "5种文档类型",
      "Markdown/HTML导出",
      "基础技术支持"
    ]
  },
  {
    id: 'pro',
    name: "专业版",
    price: "40",
    description: "适合团队协作",
    projects: "30",
    credits: 30,
    features: [
      "30个项目点数",
      "AI文档生成",
      "5种文档类型",
      "Markdown/HTML导出",
      "批量ZIP下载",
      "优先技术支持"
    ],
    popular: true
  }
];

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (planId: string) => {
    setLoading(planId);
    
    try {
      const plan = pricingPlans.find(p => p.id === planId);
      if (!plan) return;

      // 创建支付订单
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseInt(plan.price),
          credits: plan.credits,
          planName: plan.name,
        }),
      });

      if (!response.ok) {
        throw new Error('创建订单失败');
      }

      const { paymentUrl } = await response.json();
      
      // 跳转到支付页面
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('支付失败:', error);
      alert('支付失败，请重试');
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
          </div>
          
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold">
              选择适合您的<span className="text-blue-600">价格方案</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              简单透明的定价，按项目点数付费，无隐藏费用
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? 'border-blue-500 border-2 shadow-lg' : 'border-gray-200 shadow-md'} bg-white dark:bg-gray-800`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      推荐
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="mt-6">
                    <span className="text-5xl font-bold">¥{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-300 text-lg">/{plan.projects}个项目</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full text-lg py-6 mt-8 ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handlePurchase(plan.id)}
                    disabled={loading === plan.id}
                  >
                    {loading === plan.id ? '处理中...' : '立即购买'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto shadow-md">
              <h3 className="text-xl font-semibold mb-4">购买说明</h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-left">
                <li>• 支持支付宝和微信支付</li>
                <li>• 购买后点数立即到账</li>
                <li>• 每创建一个完整项目消耗1个点数</li>
                <li>• 点数永久有效，无过期时间</li>
                <li>• 如有问题，请联系客服支持</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}