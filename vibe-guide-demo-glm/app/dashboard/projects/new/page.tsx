'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  MessageSquare, 
  Download,
  Save,
  Loader2
} from 'lucide-react'
import { StepsNavigation } from '@/components/project/steps-navigation'
import { ProjectDescriptionStep } from '@/components/project/project-description-step'
import { DeepRequirementsStep } from '@/components/project/deep-requirements-step'
import { CreateDocumentsStep } from '@/components/project/create-documents-step'

type Step = 'description' | 'requirements' | 'documents'

interface ProjectData {
  description: string
  questions: string[]
  answers: string[]
  documents: Array<{
    type: string
    title: string
    content: string
  }>
}

export default function NewProjectPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('description')
  const [projectData, setProjectData] = useState<ProjectData>({
    description: '',
    questions: [],
    answers: [],
    documents: []
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const steps = [
    { id: 'description', title: '描述项目', icon: FileText },
    { id: 'requirements', title: '深入需求', icon: MessageSquare },
    { id: 'documents', title: '创建文档', icon: FileText },
  ] as const

  const currentStepIndex = steps.findIndex(step => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleStepComplete = (stepData: Partial<ProjectData>) => {
    setProjectData(prev => ({ ...prev, ...stepData }))
    
    if (currentStep === 'description') {
      setCurrentStep('requirements')
    } else if (currentStep === 'requirements') {
      setCurrentStep('documents')
    }
  }

  const handleStepBack = () => {
    if (currentStep === 'requirements') {
      setCurrentStep('description')
    } else if (currentStep === 'documents') {
      setCurrentStep('requirements')
    }
  }

  const handleSaveProject = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: projectData.description.split(' ').slice(0, 8).join(' ') + '...',
          description: projectData.description,
          steps: [
            { step: 'description', content: { description: projectData.description } },
            { step: 'requirements', content: { questions: projectData.questions, answers: projectData.answers } },
            { step: 'documents', content: { documents: projectData.documents } }
          ],
          documents: projectData.documents
        }),
      })

      if (response.ok) {
        const { projectId } = await response.json()
        router.push(`/dashboard/projects/${projectId}`)
      } else {
        console.error('Failed to save project')
      }
    } catch (error) {
      console.error('Error saving project:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回项目列表
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2">创建新项目</h1>
          <p className="text-muted-foreground">
            使用AI Agent辅助您完成专业的项目需求分析
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              步骤 {currentStepIndex + 1} / {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% 完成
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Steps Navigation */}
        <StepsNavigation 
          steps={steps}
          currentStep={currentStep}
          onStepClick={(step) => {
            if (steps.findIndex(s => s.id === step) <= currentStepIndex) {
              setCurrentStep(step)
            }
          }}
        />

        {/* Step Content */}
        <div className="mt-8">
          {currentStep === 'description' && (
            <ProjectDescriptionStep
              initialDescription={projectData.description}
              onComplete={(description) => handleStepComplete({ description })}
              isLoading={isGenerating}
            />
          )}

          {currentStep === 'requirements' && (
            <DeepRequirementsStep
              projectDescription={projectData.description}
              initialQuestions={projectData.questions}
              initialAnswers={projectData.answers}
              onComplete={(questions, answers) => handleStepComplete({ questions, answers })}
              onBack={handleStepBack}
              isLoading={isGenerating}
            />
          )}

          {currentStep === 'documents' && (
            <CreateDocumentsStep
              projectData={projectData}
              onDocumentsGenerated={(documents) => setProjectData(prev => ({ ...prev, documents }))}
              onBack={handleStepBack}
              onSave={handleSaveProject}
              isGenerating={isGenerating}
              isSaving={isSaving}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Client component for Link
function Link({ href, children, className, ...props }: { href: string; children: React.ReactNode; className?: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  )
}