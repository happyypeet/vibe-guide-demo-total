import { notFound } from "next/navigation";
import { getUserWithPoints } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, DownloadIcon } from "lucide-react";
import { format } from "date-fns";
import { zh } from "date-fns/locale";

interface ProjectDetailPageProps {
  params: { id: string };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const user = await getUserWithPoints();
  
  if (!user) {
    return null;
  }

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, params.id))
    .limit(1);

  if (!project || project.userId !== user.id) {
    notFound();
  }

  const documents = project.documents || {};
  const questions = project.aiQuestions || [];
  const answers = project.userAnswers || {};

  // 使用服务端渲染，移除客户端函数

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <p className="text-slate-600 dark:text-slate-400">
            创建时间: {format(new Date(project.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zh })}
          </p>
        </div>
        
        <Button asChild className="flex items-center gap-2">
          <a href={`/api/download/${project.id}`} className="flex items-center gap-2">
            <DownloadIcon className="w-4 h-4" />
            下载全部文档
          </a>
        </Button>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>项目描述</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{project.description}</p>
          </CardContent>
        </Card>
        
        {project.detailedRequirements && (
          <Card>
            <CardHeader>
              <CardTitle>详细需求</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{project.detailedRequirements}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {questions.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>需求问答</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                  <p className="font-medium mb-2">{index + 1}. {question}</p>
                  <p className="text-slate-600 dark:text-slate-400">{answers[question]}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="userJourney" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          {Object.keys(documents).map((key) => (
            <TabsTrigger key={key} value={key}>
              {getDocumentTitle(key)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {Object.entries(documents).map(([key, content]) => (
          <TabsContent key={key} value={key}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{getDocumentTitle(key)}</CardTitle>
                <Button asChild variant="outline" size="sm" className="flex items-center gap-2">
                  <a href={`/api/download/${project.id}/${key}`}>
                    <Download className="w-4 h-4" />
                    下载
                  </a>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap bg-slate-50 dark:bg-slate-800 p-4 rounded-md">{content}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function getDocumentTitle(key: string): string {
  const titles: Record<string, string> = {
    userJourney: "用户旅程地图",
    prd: "产品需求文档",
    frontendDesign: "前端设计文档",
    backendDesign: "后端设计文档",
    databaseDesign: "数据库设计文档",
  };
  return titles[key] || key;
}