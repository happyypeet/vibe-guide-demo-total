import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  ArrowRight, 
  Home, 
  FileText,
  CreditCard,
  Zap
} from 'lucide-react'
import Link from 'next/link'

interface PaymentSuccessPageProps {
  searchParams: {
    payment_id?: string
  }
}

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const { payment_id } = searchParams

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold mb-4">支付成功！</h1>
          <p className="text-xl text-muted-foreground mb-8">
            感谢您的购买，项目点数已成功添加到您的账户
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">点数已充值</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {payment_id ? '已添加' : '待确认'}
                </p>
                <p className="text-sm text-muted-foreground">
                  项目点数
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CreditCard className="w-6 h-6 text-green-500" />
                </div>
                <CardTitle className="text-lg">支付完成</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  ✓
                </p>
                <p className="text-sm text-muted-foreground">
                  支付状态
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <CardTitle className="text-lg">开始使用</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  立即
                </p>
                <p className="text-sm text-muted-foreground">
                  创建项目
                </p>
              </CardContent>
            </Card>
          </div>

          {payment_id && (
            <div className="bg-muted/50 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground mb-2">
                支付订单号：{payment_id}
              </p>
              <p className="text-sm text-muted-foreground">
                如果点数没有立即到账，请稍等几分钟或联系客服
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/dashboard/projects/new">
                <FileText className="w-4 h-4 mr-2" />
                创建新项目
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">
                <Home className="w-4 h-4 mr-2" />
                返回仪表盘
              </Link>
            </Button>
          </div>
        </div>

        {/* Next Steps */}
        <Card className="mt-12 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>接下来您可以：</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">创建新项目</h3>
                  <p className="text-sm text-muted-foreground">
                    使用您的项目点数创建新项目，AI将为您生成专业的开发文档
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">管理项目</h3>
                  <p className="text-sm text-muted-foreground">
                    在项目管理页面查看所有已创建的项目和生成的文档
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">下载文档</h3>
                  <p className="text-sm text-muted-foreground">
                    将生成的文档下载为Markdown格式，方便离线查看和分享
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}