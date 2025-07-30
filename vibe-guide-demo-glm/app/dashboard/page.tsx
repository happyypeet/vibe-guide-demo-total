import { getCurrentUser, getUserCredits } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Plus, 
  TrendingUp, 
  Users, 
  Clock,
  ArrowRight,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const credits = await getUserCredits(user.id)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            欢迎回来，{user.name || user.email}
          </h1>
          <p className="text-muted-foreground">
            继续您的项目开发，让AI为您提供专业的文档支持
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                剩余点数
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{credits}</div>
              <p className="text-xs text-muted-foreground">
                可创建项目数
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                总项目数
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                已创建项目
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                本月创建
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                本月新增项目
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                最后活动
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">
                暂无活动记录
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create New Project */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                创建新项目
              </CardTitle>
              <CardDescription>
                使用AI辅助您完成专业的项目需求分析和文档生成
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">1</Badge>
                  <span>描述项目需求和目标</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">2</Badge>
                  <span>AI深入分析并提问</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">3</Badge>
                  <span>生成专业文档</span>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/dashboard/projects/new">
                  立即开始
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Credits Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                点数状态
              </CardTitle>
              <CardDescription>
                管理您的项目点数，确保可以继续创建新项目
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{credits}</div>
                <p className="text-muted-foreground">剩余项目点数</p>
              </div>
              
              {credits === 0 && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-sm text-destructive mb-2">
                    您的点数已用完
                  </p>
                  <Button variant="destructive" asChild className="w-full">
                    <Link href="/pricing">
                      立即充值
                    </Link>
                  </Button>
                </div>
              )}
              
              {credits > 0 && credits <= 5 && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                  <p className="text-sm text-orange-600 mb-2">
                    点数即将用完，建议及时充值
                  </p>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/pricing">
                      充值点数
                    </Link>
                  </Button>
                </div>
              )}
              
              {credits > 5 && (
                <Button variant="outline" asChild className="w-full">
                  <Link href="/pricing">
                    充值点数
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>如何开始</CardTitle>
              <CardDescription>
                如果您是第一次使用VibeGuide，可以按照以下步骤快速上手
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">购买点数</h3>
                  <p className="text-sm text-muted-foreground">
                    选择适合的价格方案，购买项目点数
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">创建项目</h3>
                  <p className="text-sm text-muted-foreground">
                    详细描述您的项目，AI会帮助您分析需求
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">生成文档</h3>
                  <p className="text-sm text-muted-foreground">
                    获得专业的开发文档，导出使用
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}