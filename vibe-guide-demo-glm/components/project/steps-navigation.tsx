'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface Step {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
}

interface StepsNavigationProps {
  steps: Step[]
  currentStep: string
  onStepClick: (stepId: string) => void
}

export function StepsNavigation({ steps, currentStep, onStepClick }: StepsNavigationProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep)

  return (
    <div className="flex justify-between">
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex
        const isCurrent = step.id === currentStep
        const canClick = isCompleted || isCurrent

        return (
          <button
            key={step.id}
            onClick={() => canClick && onStepClick(step.id)}
            disabled={!canClick}
            className={cn(
              'flex items-center space-x-3 transition-all',
              canClick ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
            )}
          >
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
              isCompleted 
                ? 'bg-primary border-primary text-primary-foreground' 
                : isCurrent
                ? 'border-primary text-primary'
                : 'border-muted-foreground/30 text-muted-foreground'
            )}>
              {isCompleted ? (
                <span className="text-sm font-bold">✓</span>
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
            <div className="text-left">
              <div className={cn(
                'font-medium text-sm',
                isCurrent ? 'text-primary' : 'text-muted-foreground'
              )}>
                {step.title}
              </div>
              <Badge 
                variant={isCompleted ? 'default' : isCurrent ? 'secondary' : 'outline'}
                className="text-xs mt-1"
              >
                步骤 {index + 1}
              </Badge>
            </div>
          </button>
        )
      })}
    </div>
  )
}