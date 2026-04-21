'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowLeft, CheckCircle2, XCircle, RotateCcw, Edit, Send,
} from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { WorkflowStepper } from '@/components/mis/WorkflowStepper'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { usePRStore, type ApprovalAction } from '@/lib/stores/prStore'

const WORKFLOW_STEPS = ['Draft', 'Authorization', 'Order', 'Inspection', 'Goods Receipt']

const PRIORITY_COLORS: Record<string, string> = {
  Normal:   'bg-slate-100 text-slate-700',
  Urgent:   'bg-amber-50 text-amber-700',
  Critical: 'bg-red-50 text-red-700',
}

type DialogMode = 'approve' | 'reject' | 'return' | null

const DIALOG_META: Record<NonNullable<DialogMode>, { title: string; cta: string; danger: boolean }> = {
  approve: { title: 'Approve Requisition',  cta: 'Approve', danger: false },
  reject:  { title: 'Reject Requisition',   cta: 'Reject',  danger: true  },
  return:  { title: 'Return for Revision',  cta: 'Return',  danger: true  },
}

export default function PRDetail({ refno }: { refno: string }) {
  const { prs, approveStep, rejectStep, returnStep, updatePR } = usePRStore()
  const pr = prs.find(p => p.ref === decodeURIComponent(refno))

  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [actingIdx, setActingIdx]   = useState<number | null>(null)
  const [comment, setComment]       = useState('')

  if (!pr) {
    return (
      <AppShell breadcrumbs={[
        { label: 'Inventory', href: '/admin/inventory' },
        { label: 'Purchasing', href: '/admin/inventory/purchasing' },
        { label: refno },
      ]}>
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <p className="text-sm font-medium">Requisition not found</p>
          <p className="text-xs mt-1">This PR may have been created in another session.</p>
          <Link href="/admin/inventory/purchasing" className="text-xs text-primary hover:underline mt-2">← Back to list</Link>
        </div>
      </AppShell>
    )
  }

  const subtotal   = pr.items.reduce((a, r) => a + r.price * r.qty, 0)
  const pendingIdx = pr.approvers.findIndex(a => a.action === 'pending')
  const canAct     = pr.status === 'Pending' && pendingIdx !== -1

  const openDialog = (mode: DialogMode, idx: number) => {
    setDialogMode(mode); setActingIdx(idx); setComment('')
  }

  const handleConfirm = () => {
    if (actingIdx === null || !dialogMode) return
    if (dialogMode === 'approve') approveStep(pr.ref, actingIdx, comment || undefined)
    if (dialogMode === 'reject')  rejectStep(pr.ref, actingIdx, comment)
    if (dialogMode === 'return')  returnStep(pr.ref, actingIdx, comment)
    setDialogMode(null); setActingIdx(null); setComment('')
  }

  const handleSubmit = () => {
    updatePR(pr.ref, {
      status: 'Pending',
      workflowStep: 1,
      approvers: pr.approvers.map((a, i) =>
        i === 0 ? { ...a, action: 'submitted' as ApprovalAction, date: new Date().toLocaleDateString('en-GB') } : a
      ),
    })
  }

  return (
    <AppShell breadcrumbs={[
      { label: 'Inventory', href: '/admin/inventory' },
      { label: 'Purchasing', href: '/admin/inventory/purchasing' },
      { label: pr.ref },
    ]}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/inventory/purchasing" className="p-1.5 rounded-md hover:bg-muted text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold">{pr.title}</h1>
              <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">{pr.ref}</span>
              <StatusBadge status={pr.status} />
              <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${PRIORITY_COLORS[pr.priority]}`}>
                {pr.priority}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Raised by <span className="font-medium">{pr.requestedBy}</span> · {pr.dept} ·
              Required by <span className="font-medium">{pr.requiredBy}</span>
            </p>
          </div>
        </div>
        {pr.status === 'Draft' && (
          <div className="flex gap-2">
            <Link href="/admin/inventory/purchasing/new">
              <Button variant="outline" size="sm" className="text-xs h-8 gap-1"><Edit className="w-3.5 h-3.5" />Edit</Button>
            </Link>
            <Button size="sm" className="text-xs h-8 gap-1" onClick={handleSubmit}>
              <Send className="w-3.5 h-3.5" />Submit for Authorization
            </Button>
          </div>
        )}
      </div>

      {/* Stepper */}
      <div className="bg-card border border-border rounded-lg p-4 mb-4">
        <WorkflowStepper steps={WORKFLOW_STEPS} currentStep={pr.workflowStep} />
      </div>

      {/* Justification */}
      {pr.purpose && (
        <div className="bg-muted/40 border border-border rounded-lg px-4 py-2.5 mb-4">
          <p className="text-[10px] text-muted-foreground uppercase font-medium mb-0.5">Justification</p>
          <p className="text-xs">{pr.purpose}</p>
        </div>
      )}

      <div className="flex gap-4">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 border-b border-border">Requisition Details</h3>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {[
                ['Department',    pr.dept],
                ['Requester',     pr.requestedBy],
                ['Priority',      pr.priority],
                ['Date Raised',   pr.dateRaised],
                ['Required By',   pr.requiredBy],
                ['Workflow Stage',WORKFLOW_STEPS[pr.workflowStep]],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-[10px] text-muted-foreground uppercase">{l}</p>
                  <p className="font-medium">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Items table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border">
              <p className="text-xs font-semibold uppercase tracking-wide">Items / ລາຍການ</p>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['#','Code','Item','Unit','Unit Price (LAK)','Qty','Total (LAK)','Note'].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pr.items.map((item, i) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-3 py-1.5 text-muted-foreground">{i + 1}</td>
                    <td className="px-3 py-1.5 font-mono text-[10px]">{item.code}</td>
                    <td className="px-3 py-1.5 font-medium">{item.name}</td>
                    <td className="px-3 py-1.5 text-muted-foreground">{item.unit}</td>
                    <td className="px-3 py-1.5 tabular-nums text-right">{item.price.toLocaleString()}</td>
                    <td className="px-3 py-1.5 tabular-nums font-semibold">{item.qty}</td>
                    <td className="px-3 py-1.5 tabular-nums text-right font-medium">{(item.price * item.qty).toLocaleString()}</td>
                    <td className="px-3 py-1.5 text-muted-foreground text-[10px]">{item.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-muted/20 border-t border-border">
                  <td colSpan={6} className="px-4 py-2 text-xs font-semibold text-right">Subtotal</td>
                  <td className="px-3 py-2 tabular-nums font-bold text-right">LAK {subtotal.toLocaleString()}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Approval sidebar */}
        <div className="w-60 shrink-0 space-y-3">
          <div className="bg-card border border-border rounded-lg p-3">
            <p className="text-xs font-semibold uppercase tracking-wide mb-3">Approval Chain</p>
            <div className="space-y-3">
              {pr.approvers.map((a, i) => {
                const isPendingThis = a.action === 'pending' && pendingIdx === i
                const borderCol = a.action === 'approved' ? 'border-emerald-500' : a.action === 'rejected' ? 'border-destructive' : a.action === 'returned' ? 'border-amber-500' : a.action === 'submitted' ? 'border-blue-500' : 'border-border'
                const textCol   = a.action === 'approved' ? 'text-emerald-600' : a.action === 'rejected' ? 'text-destructive' : a.action === 'returned' ? 'text-amber-600' : a.action === 'submitted' ? 'text-blue-600' : 'text-muted-foreground'
                return (
                  <div key={i} className="flex gap-2.5">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white ${borderCol}`}>
                        {a.action === 'approved'  && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {a.action === 'rejected'  && <XCircle      className="w-3 h-3 text-destructive" />}
                        {a.action === 'returned'  && <RotateCcw    className="w-3 h-3 text-amber-600"   />}
                        {a.action === 'submitted' && <Send         className="w-3 h-3 text-blue-600"    />}
                        {a.action === 'pending'   && <span className="text-[9px] font-bold text-muted-foreground">{i + 1}</span>}
                      </div>
                      {i < pr.approvers.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                    </div>
                    <div className="pb-3 min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{a.actor}</p>
                      <p className="text-[10px] text-muted-foreground">{a.role}</p>
                      <p className={`text-[10px] font-medium mt-0.5 capitalize ${textCol}`}>{a.action}</p>
                      {a.date    && <p className="text-[10px] text-muted-foreground">{a.date}</p>}
                      {a.comment && <p className="text-[10px] italic text-muted-foreground mt-0.5">"{a.comment}"</p>}
                      {isPendingThis && canAct && (
                        <div className="flex gap-1 mt-1.5">
                          <button onClick={() => openDialog('approve', i)} className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded px-1.5 py-0.5 flex items-center gap-0.5 transition-colors">
                            <CheckCircle2 className="w-2.5 h-2.5" />Approve
                          </button>
                          <button onClick={() => openDialog('reject', i)} className="text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded px-1.5 py-0.5 flex items-center gap-0.5 transition-colors">
                            <XCircle className="w-2.5 h-2.5" />Reject
                          </button>
                          <button onClick={() => openDialog('return', i)} title="Return for revision" className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded p-0.5 transition-colors">
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-3 text-xs space-y-1.5">
            <p className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wide">Summary</p>
            {[['Total Value', `LAK ${subtotal.toLocaleString()}`], ['Items', String(pr.items.length)]].map(([l, v]) => (
              <div key={l} className="flex justify-between">
                <span className="text-muted-foreground">{l}</span>
                <span className="font-bold">{v}</span>
              </div>
            ))}
            <div className="flex justify-between pt-1 border-t border-border">
              <span className="text-muted-foreground">Status</span>
              <StatusBadge status={pr.status} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stage</span>
              <span className="font-medium">{WORKFLOW_STEPS[pr.workflowStep]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm dialog */}
      <Dialog open={dialogMode !== null} onOpenChange={open => !open && setDialogMode(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">{dialogMode ? DIALOG_META[dialogMode].title : ''}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              {dialogMode === 'approve' ? 'Optionally add a comment.' : 'Please provide a reason (required).'}
            </p>
            <Textarea className="text-xs resize-none h-20" placeholder="Comment…" value={comment} onChange={e => setComment(e.target.value)} autoFocus />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setDialogMode(null)}>Cancel</Button>
            <Button size="sm" className="text-xs"
              variant={dialogMode && DIALOG_META[dialogMode].danger ? 'destructive' : 'default'}
              disabled={dialogMode !== 'approve' && !comment.trim()}
              onClick={handleConfirm}>
              {dialogMode ? DIALOG_META[dialogMode].cta : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
