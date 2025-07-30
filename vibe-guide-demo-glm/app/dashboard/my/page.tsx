import { getCurrentUser, getUserCredits } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  Calendar, 
  Zap, 
  CreditCard,
  TrendingUp,
  FileText,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default async function MyPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const credits = await getUserCredits(user.id)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">我的账户</h1>
          <p className="text-muted-foreground">
            管理您的账户信息和项目点数
          </p>
        </div>

        {/* User Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              个人信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">邮箱地址</div>
                    <div className="font-medium">{user.email}</div>
                  </div>
                </div>
                
                {user.name && (
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">姓名</div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">注册时间</div>
                    <div className="font-medium">
                      {format(new Date(user.createdAt), 'yyyy年MM月dd日', { locale: zhCN })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credits Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              项目点数
            </CardTitle>
            <CardDescription>
              管理您的项目点数，确保可以继续创建新项目
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-5xl font-bold mb-2">{credits}</div>
              <p className="text-muted-foreground">剩余项目点数</p>
            </div>

            {credits === 0 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-destructive rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-destructive-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-destructive mb-2">
                  点数已用完
                </h3>
                <p className="text-muted-foreground mb-4">
                  您的项目点数已用完，请购买更多点数以继续创建新项目
                </p>
                <Button variant="destructive" asChild>
                  <Link href="/pricing">
                    <CreditCard className="w-4 h-4 mr-2" />
                    立即充值
                  </Link>
                </Button>
              </div>
            )}

            {credits > 0 && credits <= 5 && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-orange-100" />
                </div>
                <h3 className="text-lg font-semibold text-orange-700 mb-2">
                  点数即将用完
                </h3>
                <p className="text-muted-foreground mb-4">
                  您还剩 {credits} 个项目点数，建议及时充值以避免影响使用
                </p>
                <Button asChild>
                  <Link href="/pricing">
                    <CreditCard className="w-4 h-4 mr-2" />
                    充值点数
                  </Link>
                </Button>
              </div>
            )}

            {credits > 5 && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-green-100" />
                </div>
                <h3 className="text-lg font-semibold text-green-700 mb-2">
                  点数充足
                </h3>
                <p className="text-muted-foreground mb-4">
                  您有充足的项目点数，可以继续创建新项目
                </p>
                <Button variant="outline" asChild>
                  <Link href="/pricing">
                    <CreditCard className="w-4 h-4 mr-2" />
                    充值点数
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                项目管理
              </CardTitle>
              <CardDescription>
                查看和管理您的所有项目
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/dashboard/projects">
                  查看我的项目
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                购买点数
              </CardTitle>
              <CardDescription>
                选择适合的价格方案购买项目点数
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/pricing">
                  查看价格方案
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              使用统计
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">0</div>
                <div className="text-sm text-muted-foreground">总项目数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">0</div>
                <div className="text-sm text-muted-foreground">本月创建</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">0</div>
                <div className="text-sm text-muted-foreground">文档生成</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}