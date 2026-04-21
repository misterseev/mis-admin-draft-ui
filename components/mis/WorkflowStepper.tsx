'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Step {
  label: string
  status: 'completed' | 'current' | 'upcoming'
}

type StepperPropsClassic = {
  steps: Step[]
  currentStep?: never
  onStepClick?: (index: number) => void
  canNavigate?: (index: number) => boolean
  className?: string
}

type StepperPropsSimple = {
  steps: string[]
  currentStep: number
  onStepClick?: (index: number) => void
  canNavigate?: (index: number) => boolean
  className?: string
}

type WorkflowStepperProps = StepperPropsClassic | StepperPropsSimple

function normalize(steps: Step[] | string[], currentStep?: number): Step[] {
  if (steps.length === 0) return []
  if (typeof steps[0] === 'string') {
    const idx = currentStep ?? 0
    return (steps as string[]).map((label, i) => ({
      label,
      status: i < idx ? 'completed' : i === idx ? 'current' : 'upcoming',
    }))
  }
  return steps as Step[]
}

export function WorkflowStepper({
  steps,
  currentStep,
  onStepClick,
  canNavigate,
  className,
}: WorkflowStepperProps) {
  const normalized = normalize(steps, currentStep)
  const clickable = !!onStepClick

  return (
    <div className={cn('flex items-center gap-0 w-full', className)}>
      {normalized.map((step, i) => {
        const navigable = clickable && (canNavigate ? canNavigate(i) : step.status !== 'upcoming')
        const NodeTag = navigable ? 'button' : 'div'
        return (
          <div key={i} className="flex items-center flex-1 min-w-0">
            <NodeTag
              type={navigable ? 'button' : undefined}
              onClick={navigable ? () => onStepClick?.(i) : undefined}
              disabled={navigable ? false : undefined}
              className={cn(
                'flex flex-col items-center gap-1 shrink-0',
                navigable && 'cursor-pointer group'
              )}
            >
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center border-2 text-xs font-semibold transition-all',
                  step.status === 'completed' && 'bg-primary border-primary text-primary-foreground',
                  step.status === 'current' && 'bg-white border-primary text-primary ring-2 ring-primary/20',
                  step.status === 'upcoming' && 'bg-white border-border text-muted-foreground',
                  navigable && 'group-hover:scale-105 group-hover:ring-2 group-hover:ring-primary/20'
                )}
              >
                {step.status === 'completed' ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-[11px] font-medium whitespace-nowrap',
                  step.status === 'completed' && 'text-primary',
                  step.status === 'current' && 'text-primary font-semibold',
                  step.status === 'upcoming' && 'text-muted-foreground',
                  navigable && 'group-hover:text-primary'
                )}
              >
                {step.label}
              </span>
            </NodeTag>
            {i < normalized.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 -mt-3.5 transition-colors',
                  step.status === 'completed' ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
