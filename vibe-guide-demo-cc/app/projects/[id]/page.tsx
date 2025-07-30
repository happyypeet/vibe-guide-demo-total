'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardHeader } from "@/components/dashboard/header";
import { Project } from "@/lib/db/schema";

const docTypes = [
  { key: 'userJourneyMap', label: '用户旅程地图', icon: '🗺️' },
  { key: 'productRequirements', label: '产品需求PRD', icon: '📋' },
  { key: 'frontendDesign', label: '前端设计文档', icon: '🎨' },
  { key: 'backendDesign', label: '后端设计文档', icon: '⚙️' },
  { key: 'databaseDesign', label: '数据库设计', icon: '🗄️' },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'markdown' | 'preview'>('markdown');
  const [activeTab, setActiveTab] = useState('userJourneyMap');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          console.error('Project not found');
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const downloadDoc = (docKey: string, content: string) => {
    const docLabel = docTypes.find(t => t.key === docKey)?.label || docKey;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docLabel}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllDocs = async () => {
    if (!project) return;

    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    docTypes.forEach(({ key, label }) => {
      const content = project[key as keyof Project];
      if (content && typeof content === 'string') {
        zip.file(`${label}.md`, content);
      }
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title}-文档.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderMarkdownAsHTML = (markdown: string) => {
    return markdown
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      .replace(/\n\n/gim, '</p><p class="mb-4">')
      .replace(/\n/gim, '<br>');
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: '草稿',
      completed: '已完成',
      processing: '生成中',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
      completed: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
      processing: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-600';
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">项目未找到</h1>
          <p className="text-gray-600 mb-6">请检查项目ID是否正确</p>
          <Button asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回项目列表
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardHeader 
        title={project.title}
        description={`创建于 ${formatDate(project.createdAt)}`}
      >
        <div className="flex items-center gap-4">
          <Badge className={getStatusColor(project.status)}>
            {getStatusText(project.status)}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentView(currentView === 'markdown' ? 'preview' : 'markdown')}
          >
            {currentView === 'markdown' ? <Eye className="h-4 w-4 mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
            {currentView === 'markdown' ? '预览模式' : 'Markdown'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadAllDocs}
          >
            <Download className="h-4 w-4 mr-2" />
            下载全部
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Link>
          </Button>
        </div>
      </DashboardHeader>

      <div className="p-6">
        {/* 项目描述 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>项目描述</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {project.description}
            </p>
          </CardContent>
        </Card>

        {/* 需求分析 */}
        {project.requirements && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>需求分析</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {project.requirements}
              </p>
            </CardContent>
          </Card>
        )}

        {/* 生成的文档 */}
        <Card>
          <CardHeader>
            <CardTitle>生成的文档</CardTitle>
            <CardDescription>
              您可以切换不同文档类型查看内容，支持Markdown和HTML预览
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                {docTypes.map(({ key, label, icon }) => (
                  <TabsTrigger key={key} value={key} className="text-xs">
                    {icon} {label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {docTypes.map(({ key, label }) => {
                const content = project[key as keyof Project];
                if (!content || typeof content !== 'string') {
                  return (
                    <TabsContent key={key} value={key}>
                      <div className="text-center py-8 text-gray-500">
                        该文档暂未生成
                      </div>
                    </TabsContent>
                  );
                }

                return (
                  <TabsContent key={key} value={key} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{label}</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadDoc(key, content)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        下载
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-800 max-h-96 overflow-auto">
                      {currentView === 'markdown' ? (
                        <pre className="whitespace-pre-wrap text-sm font-mono">
                          {content}
                        </pre>
                      ) : (
                        <div 
                          className="prose dark:prose-invert max-w-none text-sm"
                          dangerouslySetInnerHTML={{ 
                            __html: `<p class="mb-4">${renderMarkdownAsHTML(content)}</p>`
                          }}
                        />
                      )}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}