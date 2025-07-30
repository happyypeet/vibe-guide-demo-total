import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { createClient } from '@/lib/supabase/server';
import { getProjectsByUserId } from '@/lib/db/actions';
import { redirect } from 'next/navigation';

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // 检查用户认证
  if (error || !user) {
    redirect('/auth/login');
  }
  
  // 获取用户项目
  const projects = await getProjectsByUserId(user.id);

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">我的项目</h1>
          <p className="text-gray-600">管理您的所有项目文档</p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            新建项目
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">还没有项目</h3>
            <p className="text-gray-600 mb-6">开始创建您的第一个项目文档</p>
            <Button asChild>
              <Link href="/projects/new">创建项目</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    创建于 {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/projects/${project.id}`}>查看</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}