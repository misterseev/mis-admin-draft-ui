import { type LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  labelLao?: string
  value: string | number
  icon: LucideIcon
  delta?: string
  deltaType?: 'up' | 'down' | 'neutral'
  deltaLabel?: string
  trend?: 'positive' | 'negative' | 'neutral'
  alert?: boolean
  children?: React.ReactNode
  className?: string
}

export function StatCard({
  label,
  labelLao,
  value,
  icon: Icon,
  delta,
  deltaType = 'neutral',
  deltaLabel,
  alert,
  children,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-lg p-4 shadow-sm flex flex-col gap-2',
        alert && 'border-destructive/40 bg-red-50/50',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          {labelLao && <p className="text-[10px] text-muted-foreground/70">{labelLao}</p>}
        </div>
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            alert ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-end justify-between gap-2">
        <p
          className={cn(
            'text-xl font-bold tabular-nums leading-none',
            alert && 'text-destructive'
          )}
        >
          {value}
        </p>
        {delta && (
          <div
            className={cn(
              'flex items-center gap-0.5 text-xs font-medium',
              deltaType === 'up' && 'text-emerald-600',
              deltaType === 'down' && 'text-destructive',
              deltaType === 'neutral' && 'text-muted-foreground'
            )}
          >
            {deltaType === 'up' && <TrendingUp className="w-3 h-3" />}
            {deltaType === 'down' && <TrendingDown className="w-3 h-3" />}
            {deltaType === 'neutral' && <Minus className="w-3 h-3" />}
            <span>{delta}</span>
          </div>
        )}
      </div>
      {deltaLabel && (
        <p className="text-[10px] text-muted-foreground">{deltaLabel}</p>
      )}
      {children}
    </div>
  )
}
