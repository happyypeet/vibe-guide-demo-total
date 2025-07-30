import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import Link from "next/link";

const pricingPlans = [
  {
    name: "基础版",
    price: "20",
    projectPoints: 10,
    description: "适合个人开发者",
    features: [
      "10个项目点数",
      "完整文档生成",
      "用户旅程地图",
      "产品需求文档",
      "前端设计文档",
      "后端设计文档",
      "数据库设计文档",
      "邮件支持",
      "社区支持"
    ],
    popular: false
  },
  {
    name: "专业版",
    price: "40",
    projectPoints: 30,
    description: "适合小型团队",
    features: [
      "30个项目点数",
      "完整文档生成",
      "用户旅程地图",
      "产品需求文档",
      "前端设计文档",
      "后端设计文档",
      "数据库设计文档",
      "API接口文档",
      "团队协作功能",
      "优先支持",
      "专属客服"
    ],
    popular: true
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
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

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            选择适合您的方案
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            按需付费，用多少付多少，无隐藏费用
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-semibold">最受欢迎</span>
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                
                <div className="mt-6">
                  <span className="text-5xl font-bold text-slate-900 dark:text-white">
                    ¥{plan.price}
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    获得{plan.projectPoints}个项目点数
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="px-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="px-8 pb-8">
                <Button 
                  className="w-full py-6 text-lg" 
                  size="lg"
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href="/auth/login">
                    立即购买 {plan.name}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            需要更多项目点数？
          </p>
          <Button variant="outline" asChild>
            <Link href="mailto:support@vibeguide.com">联系客服</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}