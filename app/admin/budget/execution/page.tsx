'use client'

import { useState } from 'react'
import { Plus, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { useBudgetStore, fmtM } from '@/lib/stores/budgetStore'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function BudgetExecutionPage() {
  const { executions, heads } = useBudgetStore()
  const [headFilter, setHeadFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)

  const filtered = executions.filter(e => {
    if (headFilter !== 'all' && e.budgetHead !== headFilter) return false
    if (typeFilter !== 'all' && e.type !== typeFilter) return false
    return true
  })

  // running balance per head
  const headMap = Object.fromEntries(heads.map(h => [h.code, h]))

  const totalActual = executions.filter(e => e.type === 'Actual').reduce((s, e) => s + e.amount, 0)
  const totalCommit = executions.filter(e => e.type === 'Commitment').reduce((s, e) => s + e.amount, 0)

  return (
    <AppShell breadcrumbs={[{ label: 'Budget', href: '/admin/budget' }, { label: 'Execution' }]}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold">Budget Execution</h1>
          <p className="text-xs text-muted-foreground">General ledger — actual spend and commitments · BGT-005</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="w-3.5 h-3.5" />Post Entry
        </button>
      </div>

      {/* Ledger summary strip */}
      <div className="flex gap-0 mb-5 bg-slate-900 text-white rounded-xl overflow-hidden">
        {[
          { label: 'Total Actual Spend',    value: fmtM(totalActual),  icon: '↓', accent: 'border-r border-white/10' },
          { label: 'Total Commitments',     value: fmtM(totalCommit),  icon: '⏳', accent: 'border-r border-white/10' },
          { label: 'Combined Utilization',  value: fmtM(totalActual + totalCommit), icon: '∑', accent: 'border-r border-white/10' },
          { label: 'Entries This Period',   value: executions.length,  icon: '#', accent: '' },
        ].map(({ label, value, icon, accent }) => (
          <div key={label} className={`flex-1 px-5 py-4 ${accent}`}>
            <p className="text-xl font-bold tabular-nums">{value}</p>
            <p className="text-xs text-white/60 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        <Select value={headFilter} onValueChange={setHeadFilter}>
          <SelectTrigger className="h-8 text-xs w-56"><SelectValue placeholder="Budget Head" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Budget Heads</SelectItem>
            {heads.map(h => <SelectItem key={h.code} value={h.code} className="text-xs">{h.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-8 text-xs w-40"><SelectValue placeholder="Entry Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Types</SelectItem>
            <SelectItem value="Actual" className="text-xs">Actual</SelectItem>
            <SelectItem value="Commitment" className="text-xs">Commitment</SelectItem>
          </SelectContent>
        </Select>
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} entries</span>
      </div>

      {/* Ledger journal */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1.5fr_1fr_1fr] gap-0 border-b border-border bg-muted/30 px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
          <span>Date · Ref</span>
          <span>Description</span>
          <span>Budget Head</span>
          <span>Department</span>
          <span>Vendor / Source</span>
          <span>Type</span>
          <span className="text-right">Amount</span>
        </div>

        {/* Entries */}
        <div className="divide-y divide-border/60">
          {filtered.map((e, i) => {
            const head = headMap[e.budgetHead]
            const isActual = e.type === 'Actual'
            return (
              <div
                key={e.ref}
                className={`grid grid-cols-[1fr_2fr_1fr_1fr_1.5fr_1fr_1fr] gap-0 px-4 py-2.5 items-center hover:bg-muted/20 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/5'}`}
              >
                {/* Date + ref */}
                <div>
                  <p className="text-xs font-medium tabular-nums">{e.date}</p>
                  <p className="text-[9px] font-mono text-muted-foreground">{e.ref}</p>
                </div>

                {/* Description */}
                <div>
                  <p className="text-xs font-medium">{e.description}</p>
                  {(e.poRef || e.invoiceRef) && (
                    <p className="text-[9px] text-muted-foreground font-mono">{e.poRef ?? e.invoiceRef}</p>
                  )}
                </div>

                {/* Budget head */}
                <div>
                  <p className="text-[10px] font-medium leading-tight">{head?.name ?? e.budgetHead}</p>
                  <p className="text-[9px] font-mono text-muted-foreground">{e.budgetHead}</p>
                </div>

                {/* Dept */}
                <p className="text-xs text-muted-foreground">{e.dept}</p>

                {/* Vendor */}
                <p className="text-xs text-muted-foreground truncate">{e.vendor === '—' ? '—' : e.vendor}</p>

                {/* Type badge */}
                <div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                    isActual ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {isActual ? <ArrowDownRight className="w-2.5 h-2.5" /> : <ArrowUpRight className="w-2.5 h-2.5" />}
                    {e.type}
                  </span>
                </div>

                {/* Amount */}
                <p className={`text-xs font-bold tabular-nums text-right ${isActual ? 'text-red-600' : 'text-amber-600'}`}>
                  {isActual ? '−' : '⏳'} {fmtM(e.amount)}
                </p>
              </div>
            )
          })}
        </div>

        {/* Footer totals */}
        <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1.5fr_1fr_1fr] gap-0 px-4 py-3 border-t-2 border-border bg-muted/20">
          <div className="col-span-6 text-xs font-semibold text-muted-foreground">Period Total ({filtered.length} entries)</div>
          <p className="text-xs font-bold tabular-nums text-right text-foreground">
            {fmtM(filtered.reduce((s, e) => s + e.amount, 0))}
          </p>
        </div>
      </div>
    </AppShell>
  )
}
