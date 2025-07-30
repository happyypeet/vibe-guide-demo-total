'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, FileText, Users, Zap, ArrowRight, Loader2 } from "lucide-react"
import { useState } from "react"

export default function PricingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const plans = [
    {
      id: 'basic',
      name: "基础版",
      price: "¥20",
      projects: 10,
      description: "适合个人开发者和小型项目",
      features: [
        "生成10个项目文档",
        "用户旅程地图",
        "产品需求PRD",
        "前端设计文档",
        "后端设计文档",
        "数据库设计",
        "Markdown格式导出",
        "邮件支持"
      ],
      popular: false
    },
    {
      id: 'pro',
      name: "专业版",
      price: "¥40",
      projects: 30,
      description: "适合团队和复杂项目",
      features: [
        "生成30个项目文档",
        "用户旅程地图",
        "产品需求PRD",
        "前端设计文档",
        "后端设计文档",
        "数据库设计",
        "Markdown格式导出",
        "批量下载ZIP包",
        "优先技术支持",
        "文档版本管理"
      ],
      popular: true
    }
  ]

  const handlePurchase = async (planId: string) => {
    setIsLoading(planId)
    
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: planId }),
      })

      if (response.ok) {
        const data = await response.json()
        // Redirect to payment page
        window.location.href = data.paymentUrl
      } else {
        const error = await response.json()
        console.error('Payment creation failed:', error)
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
          router.push('/auth/login')
          return
        }
        
        alert('支付创建失败，请稍后重试')
      }
    } catch (error) {
      console.error('Error creating payment:', error)
      alert('支付创建失败，请稍后重试')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="w-full border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">VibeGuide</span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                首页
              </Link>
              <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">
                登录
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            价格方案
          </Badge>
          <h1 className="text-4xl font-bold mb-6">
            选择适合您的方案
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            根据您的项目需求选择合适的套餐，让AI为您的项目生成专业文档
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary shadow-lg' : 'border-border'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      最受欢迎
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground"> / {plan.projects}个项目</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-6" 
                    size="lg"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handlePurchase(plan.id)}
                    disabled={isLoading === plan.id}
                  >
                    {isLoading === plan.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        处理中...
                      </>
                    ) : (
                      <>
                        立即购买
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">功能对比</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              详细了解各个方案的功能差异
            </p>
          </div>

          <div className="bg-background rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <div className="p-6 border-b border-border md:border-b-0 md:border-r">
                <h3 className="font-semibold mb-4">功能特性</h3>
              </div>
              <div className="p-6 border-b border-border md:border-b-0 md:border-r text-center">
                <h3 className="font-semibold mb-4">基础版</h3>
                <Badge variant="secondary">¥20 / 10个项目</Badge>
              </div>
              <div className="p-6 text-center">
                <h3 className="font-semibold mb-4">专业版</h3>
                <Badge className="bg-primary text-primary-foreground">¥40 / 30个项目</Badge>
              </div>
            </div>

            {[
              { feature: "项目文档生成", basic: "10个", pro: "30个" },
              { feature: "用户旅程地图", basic: "✓", pro: "✓" },
              { feature: "产品需求PRD", basic: "✓", pro: "✓" },
              { feature: "前端设计文档", basic: "✓", pro: "✓" },
              { feature: "后端设计文档", basic: "✓", pro: "✓" },
              { feature: "数据库设计", basic: "✓", pro: "✓" },
              { feature: "Markdown导出", basic: "✓", pro: "✓" },
              { feature: "批量下载", basic: "✗", pro: "✓" },
              { feature: "技术支持", basic: "邮件", pro: "优先" },
              { feature: "版本管理", basic: "✗", pro: "✓" }
            ].map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-border">
                <div className="p-6 border-b border-border md:border-b-0 md:border-r">
                  <span className="text-sm">{item.feature}</span>
                </div>
                <div className="p-6 border-b border-border md:border-b-0 md:border-r text-center">
                  <span className={`text-sm ${item.basic === '✗' ? 'text-muted-foreground' : ''}`}>
                    {item.basic}
                  </span>
                </div>
                <div className="p-6 text-center">
                  <span className="text-sm">{item.pro}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">常见问题</h2>
            <p className="text-muted-foreground">
              关于价格和使用的常见问题解答
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "项目点数如何计算？",
                answer: "每次创建新项目并生成文档会消耗1个点数。您可以随时查看剩余点数并充值。"
              },
              {
                question: "生成的文档可以重复使用吗？",
                answer: "是的，生成的文档属于您，可以自由使用、修改和分享。"
              },
              {
                question: "是否支持团队协作？",
                answer: "目前主要面向个人开发者，专业版支持更多的项目数量，适合小型团队使用。"
              },
              {
                question: "技术支持包含哪些内容？",
                answer: "基础版提供邮件支持，专业版提供优先技术支持，响应时间更短。"
              },
              {
                question: "是否支持退款？",
                answer: "由于是数字化产品，一旦购买成功不支持退款。建议先购买基础版体验。"
              }
            ].map((faq, index) => (
              <Card key={index} className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-primary-foreground">
            准备开始了吗？
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            选择适合您的方案，让AI为您的项目生成专业文档
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/login">
                立即注册
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">返回首页</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold">VibeGuide</span>
            </div>
            <div className="text-muted-foreground text-sm">
              © 2024 VibeGuide. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}