import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { projects, projectSteps, projectDocuments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Calendar,
  Edit,
  MessageSquare,
  Save,
  FileDown
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface ProjectDetailPageProps {
  params: {
    id: string
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, params.id),
    with: {
      steps: true,
      documents: true
    }
  })

  if (!project || project.userId !== user.id) {
    notFound()
  }

  // Organize steps by type
  const descriptionStep = project.steps.find(step => step.step === 'description')
  const requirementsStep = project.steps.find(step => step.step === 'requirements')
  const documentsStep = project.steps.find(step => step.step === 'documents')

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回项目列表
            </Link>
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
              <p className="text-muted-foreground mb-4">{project.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  创建于 {format(new Date(project.createdAt), 'yyyy年MM月dd日', { locale: zhCN })}
                </div>
                <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                  {project.status === 'completed' ? '已完成' : '草稿'}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/dashboard/projects/${project.id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  编辑项目
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Project Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">项目信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">项目状态</div>
                  <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                    {project.status === 'completed' ? '已完成' : '草稿'}
                  </Badge>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">文档数量</div>
                  <div className="font-medium">{project.documents.length} 个文档</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">创建时间</div>
                  <div className="font-medium">
                    {format(new Date(project.createdAt), 'yyyy/MM/dd', { locale: zhCN })}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">更新时间</div>
                  <div className="font-medium">
                    {format(new Date(project.updatedAt), 'yyyy/MM/dd', { locale: zhCN })}
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/dashboard/projects/${project.id}/export`}>
                    <FileDown className="w-4 h-4 mr-2" />
                    导出所有文档
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">项目概览</TabsTrigger>
                <TabsTrigger value="process">创建过程</TabsTrigger>
                <TabsTrigger value="documents">生成文档</TabsTrigger>
                <TabsTrigger value="export">导出下载</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>项目概览</CardTitle>
                    <CardDescription>
                      查看项目的基本信息和创建过程
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-2">项目描述</h3>
                        <p className="text-muted-foreground">
                          {descriptionStep?.content?.description || project.description}
                        </p>
                      </div>
                      
                      {requirementsStep?.content && (
                        <div>
                          <h3 className="font-semibold mb-2">需求分析</h3>
                          <div className="space-y-3">
                            {requirementsStep.content.questions?.map((question: string, index: number) => (
                              <div key={index} className="border-l-2 border-primary/20 pl-4">
                                <div className="font-medium text-sm mb-1">
                                  Q{index + 1}: {question}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  A: {requirementsStep.content.answers?.[index] || '暂无回答'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="process" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>创建过程</CardTitle>
                    <CardDescription>
                      查看项目的创建步骤和过程
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">1</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">项目描述</h3>
                          <p className="text-sm text-muted-foreground">
                            {descriptionStep ? '已完成' : '未完成'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">2</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">深入需求</h3>
                          <p className="text-sm text-muted-foreground">
                            {requirementsStep ? '已完成' : '未完成'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">3</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">生成文档</h3>
                          <p className="text-sm text-muted-foreground">
                            {project.documents.length > 0 ? '已完成' : '未完成'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                {project.documents.length > 0 ? (
                  <div className="space-y-4">
                    {project.documents.map((doc) => {
                      const docType = {
                        user_journey: { title: '用户旅程地图', icon: '🗺️' },
                        prd: { title: '产品需求PRD', icon: '📋' },
                        frontend_design: { title: '前端设计文档', icon: '🎨' },
                        backend_design: { title: '后端设计文档', icon: '⚙️' },
                        database_design: { title: '数据库设计', icon: '🗄️' },
                      }[doc.type] || { title: doc.title, icon: '📄' }

                      return (
                        <Card key={doc.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{docType.icon}</span>
                                <CardTitle className="text-lg">{docType.title}</CardTitle>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const blob = new Blob([doc.content], { type: 'text/markdown' })
                                  const url = URL.createObjectURL(blob)
                                  const a = document.createElement('a')
                                  a.href = url
                                  a.download = `${docType.title}.md`
                                  document.body.appendChild(a)
                                  a.click()
                                  document.body.removeChild(a)
                                  URL.revokeObjectURL(url)
                                }}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                下载
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="border border-border rounded-lg">
                              <div className="border-b border-border p-3 bg-muted/50">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">Markdown</Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {doc.content.length} 字符
                                  </span>
                                </div>
                              </div>
                              <div className="p-4">
                                <pre className="whitespace-pre-wrap text-sm bg-background p-4 rounded border border-border overflow-auto max-h-96">
                                  {doc.content}
                                </pre>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">暂无文档</h3>
                        <p className="text-muted-foreground mb-4">
                          该项目还没有生成任何文档
                        </p>
                        <Button asChild>
                          <Link href={`/dashboard/projects/${project.id}/edit`}>
                            <Edit className="w-4 h-4 mr-2" />
                            编辑项目
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="export" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>导出选项</CardTitle>
                    <CardDescription>
                      选择导出格式和下载方式
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="h-20 flex-col">
                          <FileDown className="w-6 h-6 mb-2" />
                          <span>下载单个文档</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col">
                          <FileDown className="w-6 h-6 mb-2" />
                          <span>批量下载 (ZIP)</span>
                        </Button>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">导出说明</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• 所有文档都以Markdown格式导出</li>
                          <li>• 支持单个文档下载和批量下载</li>
                          <li>• 导出的文档可以自由编辑和分享</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}