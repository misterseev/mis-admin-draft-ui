'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, RotateCcw, Clock, ChevronRight, Inbox } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { useBudgetStore, fmtM, BudgetPlan } from '@/lib/stores/budgetStore'

const MY_ROLE = 'Finance Manager'

function ApprovalDot({ status }: { status: string }) {
  if (status === 'Approved') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
  if (status === 'Rejected') return <XCircle className="w-4 h-4 text-red-500" />
  return <Clock className="w-4 h-4 text-muted-foreground" />
}

export default function BudgetApprovalPage() {
  const { plans, approvePlan, rejectPlan } = useBudgetStore()
  const [selectedRef, setSelectedRef] = useState<string | null>(plans.find(p => p.status === 'Pending')?.ref ?? null)
  const [comment, setComment] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'done'>('pending')

  const myQueue = plans.filter(p => {
    const myApproval = p.approvals.find(a => a.role === MY_ROLE)
    if (!myApproval) return false
    if (filterStatus === 'pending') return myApproval.status === 'Pending' && p.status === 'Pending'
    if (filterStatus === 'done') return myApproval.status !== 'Pending'
    return true
  })

  const selected = plans.find(p => p.ref === selectedRef) ?? null
  const myApproval = selected?.approvals.find(a => a.role === MY_ROLE)
  const canAct = myApproval?.status === 'Pending' && selected?.status === 'Pending'
  const pendingCount = plans.filter(p => {
    const a = p.approvals.find(x => x.role === MY_ROLE)
    return a?.status === 'Pending' && p.status === 'Pending'
  }).length

  function handleApprove() {
    if (!selected) return
    approvePlan(selected.ref, MY_ROLE, comment)
    setComment('')
  }
  function handleReject() {
    if (!selected || !comment.trim()) return
    rejectPlan(selected.ref, MY_ROLE, comment)
    setComment('')
  }

  return (
    <AppShell breadcrumbs={[{ label: 'Budget', href: '/admin/budget' }, { label: 'Approval' }]}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold">Budget Approval</h1>
          <p className="text-xs text-muted-foreground">Review and approve department budget plans · BGT-003</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <Inbox className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-medium text-amber-800">{pendingCount} plan{pendingCount > 1 ? 's' : ''} awaiting your review</span>
          </div>
        )}
      </div>

      <div className="flex gap-0 border border-border rounded-xl overflow-hidden bg-card shadow-sm" style={{ minHeight: '560px' }}>
        {/* Left inbox list */}
        <div className="w-72 shrink-0 border-r border-border flex flex-col">
          {/* Filter tabs */}
          <div className="flex border-b border-border">
            {([['pending','Pending'], ['done','Reviewed'], ['all','All']] as const).map(([v, label]) => (
              <button
                key={v}
                onClick={() => setFilterStatus(v)}
                className={`flex-1 text-[11px] font-medium py-2.5 transition-colors ${filterStatus === v ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {myQueue.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                <Inbox className="w-8 h-8 opacity-30" />
                <p className="text-xs">Inbox empty</p>
              </div>
            )}
            {myQueue.map(p => {
              const myA = p.approvals.find(a => a.role === MY_ROLE)
              const isSelected = p.ref === selectedRef
              return (
                <button
                  key={p.ref}
                  onClick={() => setSelectedRef(p.ref)}
                  className={`w-full text-left px-4 py-3 transition-colors ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-muted/30'}`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <p className="text-xs font-semibold leading-snug line-clamp-2">{p.name}</p>
                    <ApprovalDot status={myA?.status ?? 'Pending'} />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{p.dept} · {p.requestedBy}</p>
                  <p className="text-[10px] font-bold tabular-nums mt-1">{fmtM(p.amount)}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right detail panel */}
        {selected ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Plan header */}
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground mb-0.5">{selected.ref}</p>
                  <h2 className="text-base font-bold">{selected.name}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selected.dept} · Requested by <span className="font-medium">{selected.requestedBy}</span> · {selected.submittedDate}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-muted-foreground uppercase">Requested</p>
                  <p className="text-xl font-bold tabular-nums">{fmtM(selected.amount)}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
              {/* Justification */}
              <div>
                <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1.5">Justification</p>
                <p className="text-xs leading-relaxed bg-muted/30 rounded-lg px-4 py-3 border border-border">{selected.justification}</p>
              </div>

              {/* Approval chain */}
              <div>
                <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-2">Approval Chain</p>
                <div className="flex items-stretch gap-0">
                  {selected.approvals.map((a, i) => (
                    <div key={i} className="flex items-center gap-0">
                      <div className={`rounded-lg border px-4 py-3 min-w-[160px] ${
                        a.status === 'Approved' ? 'bg-emerald-50 border-emerald-200' :
                        a.status === 'Rejected' ? 'bg-red-50 border-red-200' :
                        a.role === MY_ROLE ? 'bg-primary/5 border-primary/40' :
                        'bg-muted/30 border-border'
                      }`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <ApprovalDot status={a.status} />
                          <p className="text-[10px] font-semibold">{a.role}</p>
                        </div>
                        <p className="text-xs font-medium">{a.name}</p>
                        {a.date && <p className="text-[10px] text-muted-foreground mt-0.5">{a.date}</p>}
                        {a.comment && <p className="text-[10px] text-muted-foreground mt-1 italic">"{a.comment}"</p>}
                      </div>
                      {i < selected.approvals.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-muted-foreground mx-1 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action area */}
              {canAct ? (
                <div className="border border-border rounded-lg p-4 bg-muted/20">
                  <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-2">Your Decision — {MY_ROLE}</p>
                  <textarea
                    className="w-full h-16 text-xs border border-input rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring bg-background mb-3"
                    placeholder="Add a comment (required for rejection)..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleApprove}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />Approve
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={!comment.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <XCircle className="w-3.5 h-3.5" />Reject
                    </button>
                  </div>
                </div>
              ) : myApproval?.status !== 'Pending' ? (
                <div className={`rounded-lg border px-4 py-3 text-xs font-medium ${myApproval?.status === 'Approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                  You {myApproval?.status === 'Approved' ? 'approved' : 'rejected'} this plan on {myApproval?.date}.
                  {myApproval?.comment && <span className="ml-1 italic">"{myApproval.comment}"</span>}
                </div>
              ) : (
                <div className="bg-muted/30 border border-border rounded-lg px-4 py-3 text-xs text-muted-foreground">
                  Waiting for earlier approvers to complete their review before your turn.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Inbox className="w-10 h-10 opacity-20 mx-auto mb-2" />
              <p className="text-sm">Select a plan to review</p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
