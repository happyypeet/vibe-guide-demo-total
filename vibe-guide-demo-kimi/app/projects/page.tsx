import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getUserWithPoints } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { format } from "date-fns";
import { zh } from "date-fns/locale";

export default async function ProjectsPage() {
  const user = await getUserWithPoints();
  
  if (!user) {
    return null;
  }

  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, user.id))
    .orderBy(projects.createdAt);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">我的项目</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            剩余项目点数: {user.projectPoints}
          </p>
        </div>
        
        <Button asChild>
          <Link href="/projects/new" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            新建项目
          </Link>
        </Button>
      </div>

      {userProjects.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-slate-500 dark:text-slate-400">
              <Plus className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium mb-2">暂无项目</h3>
              <p className="mb-4">开始创建您的第一个项目吧！</p>
              <Button asChild>
                <Link href="/projects/new">立即创建</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <p>状态: {project.isCompleted ? '已完成' : '进行中'}</p>
                  <p>创建时间: {format(new Date(project.createdAt), 'yyyy年MM月dd日', { locale: zh })}</p>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/projects/${project.id}`}>
                    查看详情
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}