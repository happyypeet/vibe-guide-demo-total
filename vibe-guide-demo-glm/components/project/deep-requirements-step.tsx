'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, MessageSquare, Loader2, CheckCircle } from 'lucide-react'

interface DeepRequirementsStepProps {
  projectDescription: string
  initialQuestions: string[]
  initialAnswers: string[]
  onComplete: (questions: string[], answers: string[]) => void
  onBack: () => void
  isLoading: boolean
}

interface Question {
  question: string
  type: 'technical' | 'business' | 'user_experience'
}

export function DeepRequirementsStep({
  projectDescription,
  initialQuestions,
  initialAnswers,
  onComplete,
  onBack,
  isLoading
}: DeepRequirementsStepProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<string[]>(initialAnswers)
  const [isGenerating, setIsGenerating] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (initialQuestions.length === 0) {
      generateQuestions()
    } else {
      // Convert initial questions to Question format
      setQuestions(initialQuestions.map(q => ({
        question: q,
        type: 'business' as const
      })))
    }
  }, [projectDescription])

  const generateQuestions = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectDescription
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions)
        setAnswers(new Array(data.questions.length).fill(''))
      } else {
        console.error('Failed to generate questions')
      }
    } catch (error) {
      console.error('Error generating questions:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnswerChange = (index: number, answer: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = answer
    setAnswers(newAnswers)
  }

  const validateAnswers = (): string[] => {
    const errors: string[] = []
    
    questions.forEach((question, index) => {
      if (!answers[index] || answers[index].trim().length < 10) {
        errors.push(`问题 ${index + 1} 的回答至少需要10个字符`)
      }
    })
    
    return errors
  }

  const handleSubmit = () => {
    const validationErrors = validateAnswers()
    setErrors(validationErrors)
    
    if (validationErrors.length === 0) {
      const questionTexts = questions.map(q => q.question)
      onComplete(questionTexts, answers)
    }
  }

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'technical':
        return '💻'
      case 'business':
        return '💼'
      case 'user_experience':
        return '👥'
      default:
        return '❓'
    }
  }

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'technical':
        return '技术问题'
      case 'business':
        return '业务问题'
      case 'user_experience':
        return '用户体验'
      default:
        return '其他问题'
    }
  }

  if (isGenerating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            深入需求
          </CardTitle>
          <CardDescription>
            AI正在分析您的项目，生成相关问题...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">
                正在分析项目需求，请稍候...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          深入需求
        </CardTitle>
        <CardDescription>
          AI已经根据您的项目描述生成了以下问题，请详细回答以帮助我们更好地理解您的需求。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">i</span>
            </div>
            <span className="text-sm font-medium text-blue-800">
              回答建议
            </span>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 详细回答每个问题，这将帮助AI生成更精准的文档</li>
            <li>• 包含具体的技术要求、业务规则或用户场景</li>
            <li>• 如有相关的设计思路或参考案例，请一并提供</li>
          </ul>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getQuestionTypeIcon(question.type)}</span>
                  <Badge variant="secondary" className="text-xs">
                    {getQuestionTypeLabel(question.type)}
                  </Badge>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1">
                    问题 {index + 1}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {question.question}
                  </div>
                </div>
              </div>
              
              <Textarea
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder={`请回答问题 ${index + 1}...`}
                className="min-h-[100px]"
                disabled={isLoading}
              />
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">
                  {answers[index]?.length || 0} 字符
                </span>
                {answers[index]?.length >= 10 && (
                  <Badge variant="secondary" className="text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    已完成
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {errors.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
                <span className="text-xs text-destructive-foreground">!</span>
              </div>
              <span className="text-sm font-medium text-destructive">
                请完成所有问题回答：
              </span>
            </div>
            <ul className="text-sm text-destructive space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} disabled={isLoading}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            上一步
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={questions.some((_, index) => !answers[index] || answers[index].length < 10) || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                处理中...
              </>
            ) : (
              <>
                下一步：创建文档
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}