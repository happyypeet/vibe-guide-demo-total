'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, FileText, Download, Save, Loader2, Eye, Code, FileDown } from 'lucide-react'

interface CreateDocumentsStepProps {
  projectData: {
    description: string
    questions: string[]
    answers: string[]
    documents: Array<{
      type: string
      title: string
      content: string
    }>
  }
  onDocumentsGenerated: (documents: Array<{ type: string; title: string; content: string }>) => void
  onBack: () => void
  onSave: () => void
  isGenerating: boolean
  isSaving: boolean
}

const documentTypes = [
  { id: 'user_journey', title: '用户旅程地图', icon: '🗺️' },
  { id: 'prd', title: '产品需求PRD', icon: '📋' },
  { id: 'frontend_design', title: '前端设计文档', icon: '🎨' },
  { id: 'backend_design', title: '后端设计文档', icon: '⚙️' },
  { id: 'database_design', title: '数据库设计', icon: '🗄️' },
]

export function CreateDocumentsStep({
  projectData,
  onDocumentsGenerated,
  onBack,
  onSave,
  isGenerating,
  isSaving
}: CreateDocumentsStepProps) {
  const [documents, setDocuments] = useState(projectData.documents)
  const [selectedTab, setSelectedTab] = useState('preview')
  const [isGeneratingDocs, setIsGeneratingDocs] = useState(false)

  useEffect(() => {
    if (projectData.documents.length === 0) {
      generateDocuments()
    }
  }, [projectData])

  const generateDocuments = async () => {
    setIsGeneratingDocs(true)
    try {
      const response = await fetch('/api/ai/generate-documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: projectData.description,
          questions: projectData.questions,
          answers: projectData.answers
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents)
        onDocumentsGenerated(data.documents)
      } else {
        console.error('Failed to generate documents')
      }
    } catch (error) {
      console.error('Error generating documents:', error)
    } finally {
      setIsGeneratingDocs(false)
    }
  }

  const downloadDocument = (document: { type: string; title: string; content: string }) => {
    const blob = new Blob([document.content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${document.title}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAllDocuments = () => {
    // In a real implementation, you would create a ZIP file
    documents.forEach(doc => downloadDocument(doc))
  }

  const getDocumentType = (type: string) => {
    return documentTypes.find(dt => dt.id === type) || documentTypes[0]
  }

  if (isGeneratingDocs) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            创建文档
          </CardTitle>
          <CardDescription>
            AI正在根据您的项目需求生成专业文档...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">
                正在生成专业文档，请稍候...
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                这可能需要1-2分钟时间
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            创建文档
          </CardTitle>
          <CardDescription>
            AI已为您的项目生成了以下专业文档，您可以预览、编辑和下载。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-5">
              {documents.map((doc, index) => {
                const docType = getDocumentType(doc.type)
                return (
                  <TabsTrigger key={doc.type} value={doc.type} className="text-xs">
                    <span className="mr-1">{docType.icon}</span>
                    {docType.title}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {documents.map((doc) => {
              const docType = getDocumentType(doc.type)
              return (
                <TabsContent key={doc.type} value={doc.type} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{docType.icon}</span>
                      <h3 className="text-lg font-semibold">{doc.title}</h3>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadDocument(doc)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      下载
                    </Button>
                  </div>

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
                </TabsContent>
              )
            })}
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>文档操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={downloadAllDocuments}
              className="w-full"
            >
              <FileDown className="w-4 h-4 mr-2" />
              批量下载所有文档
            </Button>
            
            <Button
              onClick={onSave}
              disabled={isSaving || documents.length === 0}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  保存项目
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} disabled={isSaving}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          上一步
        </Button>
      </div>
    </div>
  )
}