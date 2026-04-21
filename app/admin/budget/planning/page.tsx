'use client'

import { useState } from 'react'
import { Plus, MoreHorizontal, Send, Edit, ChevronRight } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { useBudgetStore, fmtM, BudgetPlan, PlanStatus } from '@/lib/stores/budgetStore'

const COLUMNS: { status: PlanStatus; label: string; color: string; bg: string }[] = [
  { status: 'Draft',    label: 'Draft',          color: 'text-slate-600',   bg: 'bg-slate-100'   },
  { status: 'Pending',  label: 'Under Review',   color: 'text-amber-700',   bg: 'bg-amber-50'    },
  { status: 'Approved', label: 'Approved',        color: 'text-emerald-700', bg: 'bg-emerald-50'  },
  { status: 'Rejected', label: 'Rejected',        color: 'text-red-700',     bg: 'bg-red-50'      },
]

function PlanCard({ plan }: { plan: BudgetPlan }) {
  const approvedCount = plan.approvals.filter(a => a.status === 'Approved').length
  const totalApprovers = plan.approvals.length
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-xs font-semibold leading-snug">{plan.name}</p>
        <button className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-muted transition-opacity">
          <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground mb-3 line-clamp-2">{plan.justification}</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-muted-foreground">{plan.dept}</p>
          <p className="text-xs font-bold tabular-nums text-foreground">{fmtM(plan.amount)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground">Approvals</p>
          <p className="text-[10px] font-medium">{approvedCount}/{totalApprovers}</p>
        </div>
      </div>
      {/* Approval mini dots */}
      <div className="flex gap-1 mt-2.5 pt-2.5 border-t border-border">
        {plan.approvals.map((a, i) => (
          <div key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-2.5 h-2.5 text-muted-foreground/40" />}
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${
              a.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
              a.status === 'Rejected' ? 'bg-red-100 text-red-700' :
              'bg-muted text-muted-foreground'
            }`}>
              {a.name.split(' ')[0][0]}{a.name.split(' ')[1]?.[0] ?? ''}
            </div>
          </div>
        ))}
        <span className="ml-auto text-[9px] text-muted-foreground font-mono">{plan.ref.split('-').slice(-1)[0]}</span>
      </div>
    </div>
  )
}

export default function BudgetPlanningPage() {
  const { plans } = useBudgetStore()

  const totalRequested = plans.reduce((s, p) => s + p.amount, 0)
  const approvedAmount = plans.filter(p => p.status === 'Approved').reduce((s, p) => s + p.amount, 0)

  return (
    <AppShell breadcrumbs={[{ label: 'Budget', href: '/admin/budget' }, { label: 'Planning' }]}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold">Budget Planning</h1>
          <p className="text-xs text-muted-foreground">FY 2027 department budget requests · BGT-002</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right mr-2">
            <p className="text-[10px] text-muted-foreground uppercase">Total Requested</p>
            <p className="text-sm font-bold tabular-nums">{fmtM(totalRequested)}</p>
          </div>
          <div className="text-right mr-3 pl-3 border-l border-border">
            <p className="text-[10px] text-muted-foreground uppercase">Approved</p>
            <p className="text-sm font-bold tabular-nums text-emerald-600">{fmtM(approvedAmount)}</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            <Plus className="w-3.5 h-3.5" />New Budget Plan
          </button>
        </div>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-4 gap-3 min-h-96">
        {COLUMNS.map(col => {
          const colPlans = plans.filter(p => p.status === col.status)
          const colTotal = colPlans.reduce((s, p) => s + p.amount, 0)
          return (
            <div key={col.status} className="flex flex-col gap-2">
              {/* Column header */}
              <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${col.bg}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${col.color}`}>{col.label}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/60 ${col.color}`}>{colPlans.length}</span>
                </div>
                <span className={`text-[10px] font-medium tabular-nums ${col.color}`}>{fmtM(colTotal)}</span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 flex-1">
                {colPlans.map(p => <PlanCard key={p.ref} plan={p} />)}
                {colPlans.length === 0 && (
                  <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                    No plans
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}
