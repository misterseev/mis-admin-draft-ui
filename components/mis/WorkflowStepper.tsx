import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Step {
  label: string
  status: 'completed' | 'current' | 'upcoming'
}

interface WorkflowStepperProps {
  steps: Step[]
  className?: string
}

export function WorkflowStepper({ steps, className }: WorkflowStepperProps) {
  return (
    <div className={cn('flex items-center gap-0 w-full', className)}>
      {steps.map((step, i) => (
        <div key={i} className="flex items-center flex-1 min-w-0">
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center border-2 text-xs font-semibold transition-colors',
                step.status === 'completed' && 'bg-primary border-primary text-primary-foreground',
                step.status === 'current' && 'bg-white border-primary text-primary ring-2 ring-primary/20',
                step.status === 'upcoming' && 'bg-white border-border text-muted-foreground'
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
                'text-xs font-medium whitespace-nowrap',
                step.status === 'completed' && 'text-primary',
                step.status === 'current' && 'text-primary font-semibold',
                step.status === 'upcoming' && 'text-muted-foreground'
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                'flex-1 h-0.5 mx-2 mt-[-14px]',
                step.status === 'completed' ? 'bg-primary' : 'bg-border'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
