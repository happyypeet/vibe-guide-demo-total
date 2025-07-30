import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Plus, 
  Calendar,
  MoreHorizontal,
  ArrowRight,
  FolderOpen
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default async function ProjectsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const userProjects = await db.query.projects.findMany({
    where: eq(projects.userId, user.id),
    orderBy: [desc(projects.createdAt)]
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">我的项目</h1>
            <p className="text-muted-foreground">
              管理您的所有项目，查看和编辑生成的文档
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/projects/new">
              <Plus className="w-4 h-4 mr-2" />
              新建项目
            </Link>
          </Button>
        </div>

        {/* Projects Grid */}
        {userProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">还没有项目</h2>
            <p className="text-muted-foreground mb-4">
              创建您的第一个项目，让AI为您提供专业的文档支持
            </p>
            <Button asChild>
              <Link href="/dashboard/projects/new">
                <Plus className="w-4 h-4 mr-2" />
                创建新项目
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1 line-clamp-2">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </div>
                    <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                      {project.status === 'completed' ? '已完成' : '草稿'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(project.createdAt), 'yyyy年MM月dd日', { locale: zhCN })}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-blue-500" />
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        5个文档
                      </span>
                    </div>
                    
                    <Button asChild className="w-full">
                      <Link href={`/dashboard/projects/${project.id}`}>
                        查看项目
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}