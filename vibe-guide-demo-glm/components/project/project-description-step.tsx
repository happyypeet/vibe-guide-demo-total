'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Lightbulb, FileText } from 'lucide-react'

interface ProjectDescriptionStepProps {
  initialDescription: string
  onComplete: (description: string) => void
  isLoading: boolean
}

export function ProjectDescriptionStep({ 
  initialDescription, 
  onComplete, 
  isLoading 
}: ProjectDescriptionStepProps) {
  const [description, setDescription] = useState(initialDescription)
  const [errors, setErrors] = useState<string[]>([])

  const validateDescription = (text: string): string[] => {
    const errors: string[] = []
    
    if (text.length < 20) {
      errors.push('项目描述至少需要20个字符')
    }
    
    if (text.length > 2000) {
      errors.push('项目描述不能超过2000个字符')
    }
    
    if (!text.trim()) {
      errors.push('项目描述不能为空')
    }
    
    return errors
  }

  const handleSubmit = () => {
    const validationErrors = validateDescription(description)
    setErrors(validationErrors)
    
    if (validationErrors.length === 0) {
      onComplete(description)
    }
  }

  const examples = [
    {
      title: '电商平台',
      description: '开发一个现代化的电商平台，支持用户注册、商品浏览、购物车、订单管理、支付集成等功能。需要包含前端Web应用和后端API服务。'
    },
    {
      title: '任务管理应用',
      description: '创建一个团队协作的任务管理应用，支持项目创建、任务分配、进度跟踪、文件共享、实时通知等功能。采用响应式设计，支持多端访问。'
    },
    {
      title: '社交媒体应用',
      description: '构建一个社交媒体平台，用户可以发布动态、关注其他用户、点赞评论、私信聊天等。需要包含推荐算法、内容审核、数据统计等功能。'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          描述项目
        </CardTitle>
        <CardDescription>
          请详细描述您的项目需求，包括项目目标、功能特性、技术要求等。
          AI将根据您的描述生成专业的开发文档。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            项目描述 *
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="请详细描述您的项目..."
            className="min-h-[200px]"
            disabled={isLoading}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-muted-foreground">
              {description.length} / 2000 字符
            </span>
            {description.length >= 20 && (
              <Badge variant="secondary" className="text-green-600">
                符合要求
              </Badge>
            )}
          </div>
        </div>

        {errors.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
                <span className="text-xs text-destructive-foreground">!</span>
              </div>
              <span className="text-sm font-medium text-destructive">
                请修正以下问题：
              </span>
            </div>
            <ul className="text-sm text-destructive space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Examples */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">示例描述</span>
          </div>
          <div className="space-y-3">
            {examples.map((example, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-3 cursor-pointer hover:bg-muted transition-colors"
                   onClick={() => setDescription(example.description)}>
                <div className="font-medium text-sm mb-1">{example.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {example.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">i</span>
            </div>
            <span className="text-sm font-medium text-blue-800">
              撰写建议
            </span>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 描述项目的核心目标和用户群体</li>
            <li>• 列出主要的功能需求</li>
            <li>• 说明技术栈偏好（如有）</li>
            <li>• 提及项目的特殊要求或约束</li>
          </ul>
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={description.length < 20 || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              处理中...
            </>
          ) : (
            <>
              下一步：深入需求
              <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}