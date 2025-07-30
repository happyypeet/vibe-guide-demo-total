'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Save, Loader2, FileText, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface Step3GenerateProps {
  description: string;
  requirements: string;
  onPrevious: () => void;
}

interface GeneratedDocs {
  userJourneyMap: string;
  productRequirements: string;
  frontendDesign: string;
  backendDesign: string;
  databaseDesign: string;
}

const docTypes = [
  { key: 'userJourneyMap', label: '用户旅程地图', icon: '🗺️' },
  { key: 'productRequirements', label: '产品需求PRD', icon: '📋' },
  { key: 'frontendDesign', label: '前端设计文档', icon: '🎨' },
  { key: 'backendDesign', label: '后端设计文档', icon: '⚙️' },
  { key: 'databaseDesign', label: '数据库设计', icon: '🗄️' },
];

export function Step3Generate({ description, requirements, onPrevious }: Step3GenerateProps) {
  const router = useRouter();
  const [docs, setDocs] = useState<GeneratedDocs | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentView, setCurrentView] = useState<'markdown' | 'preview'>('markdown');
  const [activeTab, setActiveTab] = useState('userJourneyMap');

  useEffect(() => {
    generateDocs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateDocs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, requirements }),
      });

      if (!response.ok) {
        throw new Error('生成文档失败');
      }

      const generatedDocs = await response.json();
      setDocs(generatedDocs);
    } catch (error) {
      console.error('Failed to generate docs:', error);
      alert('生成文档失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async () => {
    if (!docs) return;

    setSaving(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: extractProjectTitle(description),
          description,
          requirements,
          ...docs,
          status: 'completed'
        }),
      });

      if (!response.ok) {
        throw new Error('保存项目失败');
      }

      const project = await response.json();
      router.push(`/projects/${project.id}`);
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('保存项目失败，请重试');
    } finally {
      setSaving(false);
    }
  };

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
    if (!docs) return;

    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    docTypes.forEach(({ key, label }) => {
      const content = docs[key as keyof GeneratedDocs];
      if (content) {
        zip.file(`${label}.md`, content);
      }
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '项目文档.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const extractProjectTitle = (desc: string): string => {
    const lines = desc.split('\n');
    const firstLine = lines[0].trim();
    return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
  };

  const renderMarkdownAsHTML = (markdown: string) => {
    // 简单的 Markdown 到 HTML 转换
    return markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n/gim, '<br>');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI正在生成您的项目文档</h3>
              <p className="text-gray-600 dark:text-gray-300">
                这可能需要1-2分钟，请耐心等待...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!docs) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="text-center py-20">
            <p className="text-red-600">生成文档失败，请重试</p>
            <Button onClick={generateDocs} className="mt-4">
              重新生成
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">项目文档已生成</CardTitle>
              <CardDescription>
                您可以切换不同文档类型查看内容，支持Markdown和HTML预览
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView(currentView === 'markdown' ? 'preview' : 'markdown')}
              >
                {currentView === 'markdown' ? <Eye className="h-4 w-4 mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
                {currentView === 'markdown' ? '预览模式' : 'Markdown'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              {docTypes.map(({ key, label, icon }) => (
                <TabsTrigger key={key} value={key} className="text-xs">
                  {icon} {label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {docTypes.map(({ key, label }) => (
              <TabsContent key={key} value={key} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{label}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadDoc(key, docs[key as keyof GeneratedDocs])}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    下载
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 max-h-96 overflow-auto">
                  {currentView === 'markdown' ? (
                    <pre className="whitespace-pre-wrap text-sm">
                      {docs[key as keyof GeneratedDocs]}
                    </pre>
                  ) : (
                    <div 
                      className="prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: renderMarkdownAsHTML(docs[key as keyof GeneratedDocs]) 
                      }}
                    />
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex gap-4 pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={onPrevious}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              上一步
            </Button>
            
            <Button 
              variant="outline"
              onClick={downloadAllDocs}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              下载全部文档
            </Button>
            
            <Button 
              onClick={saveProject}
              disabled={saving}
              className="flex-1"
              size="lg"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {saving ? '保存中...' : '保存项目'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}