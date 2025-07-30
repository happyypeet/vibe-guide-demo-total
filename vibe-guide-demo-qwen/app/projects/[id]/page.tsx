import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Eye, FileText } from "lucide-react";
import { createClient } from '@/lib/supabase/server';
import { getProjectById, getDocumentsByProjectId } from '@/lib/db/actions';
import { redirect } from 'next/navigation';

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // 检查用户认证
  if (error || !user) {
    redirect('/auth/login');
  }
  
  // 获取项目数据
  const project = await getProjectById(params.id);
  if (!project) {
    return <div>项目未找到</div>;
  }
  
  // 确保用户有权访问此项目
  if (project.userId !== user.id) {
    redirect('/projects');
  }
  
  // 获取项目文档
  const documents = await getDocumentsByProjectId(params.id);
  
  // 将文档转换为键值对格式
  const documentContents: Record<string, { title: string; content: string }> = {};
  documents.forEach(doc => {
    documentContents[doc.type] = {
      title: doc.title,
      content: doc.content
    };
  });

  const handleDownload = (content: string, filename: string, format: 'md' | 'html') => {
    const blob = new Blob([content], { type: format === 'md' ? 'text/markdown' : 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-gray-600">{project.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              保存项目
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              批量下载
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="user-journey" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="user-journey">用户旅程</TabsTrigger>
          <TabsTrigger value="prd">产品需求</TabsTrigger>
          <TabsTrigger value="frontend">前端设计</TabsTrigger>
          <TabsTrigger value="backend">后端设计</TabsTrigger>
          <TabsTrigger value="database">数据库设计</TabsTrigger>
        </TabsList>
        
        {Object.entries(documentContents).map(([type, doc]) => (
          <TabsContent key={type} value={type}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{doc.title}</CardTitle>
                    <CardDescription>
                      {type === "user-journey" && "描述用户与产品交互的完整过程"}
                      {type === "prd" && "详细的产品功能和需求说明"}
                      {type === "frontend" && "前端技术实现和组件设计"}
                      {type === "backend" && "后端架构和技术实现"}
                      {type === "database" && "数据库结构和关系设计"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownload(doc.content, doc.title, 'md')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      下载MD
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(doc.content, doc.title, 'html')}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      下载HTML
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none border rounded-lg p-6 min-h-[400px]">
                  <pre className="whitespace-pre-wrap">{doc.content}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}