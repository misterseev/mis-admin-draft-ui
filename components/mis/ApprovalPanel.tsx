'use client'

import { CheckCircle2, XCircle, RotateCcw, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ApprovalEntry {
  actor: string
  role: string
  action: 'approved' | 'rejected' | 'returned' | 'pending' | 'submitted'
  date?: string
  comment?: string
}

interface ApprovalPanelProps {
  entries: ApprovalEntry[]
  canAct?: boolean
  onApprove?: () => void
  onReject?: () => void
  onReturn?: () => void
  className?: string
}

const actionConfig = {
  approved:  { icon: CheckCircle2, color: 'text-emerald-600', label: 'Approved' },
  rejected:  { icon: XCircle,      color: 'text-destructive', label: 'Rejected' },
  returned:  { icon: RotateCcw,    color: 'text-amber-600',   label: 'Returned' },
  pending:   { icon: Clock,        color: 'text-muted-foreground', label: 'Pending' },
  submitted: { icon: User,         color: 'text-blue-600',    label: 'Submitted' },
}

export function ApprovalPanel({
  entries,
  canAct,
  onApprove,
  onReject,
  onReturn,
  className,
}: ApprovalPanelProps) {
  return (
    <div className={cn('bg-card border border-border rounded-lg p-3', className)}>
      <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">
        Approval Chain / ສາຍການອະນຸມັດ
      </p>
      <div className="space-y-3">
        {entries.map((entry, i) => {
          const cfg = actionConfig[entry.action]
          const Icon = cfg.icon
          return (
            <div key={i} className="flex gap-2.5">
              <div className="flex flex-col items-center">
                <div className={cn('w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white', entry.action === 'pending' ? 'border-border' : 'border-current')}>
                  <Icon className={cn('w-3 h-3', cfg.color)} />
                </div>
                {i < entries.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
              </div>
              <div className="pb-3 min-w-0">
                <p className="text-xs font-medium text-foreground">{entry.actor}</p>
                <p className="text-[10px] text-muted-foreground">{entry.role}</p>
                <p className={cn('text-[10px] font-medium mt-0.5', cfg.color)}>{cfg.label}</p>
                {entry.date && <p className="text-[10px] text-muted-foreground">{entry.date}</p>}
                {entry.comment && (
                  <p className="text-[10px] text-muted-foreground italic mt-0.5">&quot;{entry.comment}&quot;</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {canAct && (
        <div className="mt-3 pt-3 border-t border-border flex gap-2">
          <Button size="sm" className="flex-1 text-xs h-7" onClick={onApprove}>
            <CheckCircle2 className="w-3 h-3" />Approve
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs h-7 text-destructive border-destructive/30" onClick={onReject}>
            <XCircle className="w-3 h-3" />Reject
          </Button>
          <Button size="sm" variant="outline" className="text-xs h-7 px-2" onClick={onReturn}>
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  )
}
