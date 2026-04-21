'use client'

import { useState } from 'react'
import { Plus, ChevronRight, AlertTriangle } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { useBudgetStore, fmtM, BudgetHead } from '@/lib/stores/budgetStore'

const CATEGORIES = ['Recurrent', 'Capital'] as const
const CAT_COLOR = { Recurrent: 'bg-blue-500', Capital: 'bg-purple-500' }
const CAT_LIGHT = { Recurrent: 'bg-blue-50 border-blue-200 text-blue-800', Capital: 'bg-purple-50 border-purple-200 text-purple-800' }

function UtilBar({ pct, danger }: { pct: number; danger: boolean }) {
  return (
    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${danger ? 'bg-red-500' : pct > 60 ? 'bg-amber-400' : 'bg-emerald-500'}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  )
}

function HeadCard({ head, selected, onClick }: { head: BudgetHead; selected: boolean; onClick: () => void }) {
  const used = head.actual + head.committed
  const pct = Math.round((used / head.annualBudget) * 100)
  const danger = pct >= 80
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-all ${selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:bg-muted/40'}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold leading-tight truncate">{head.name}</p>
          <p className="text-[10px] text-muted-foreground truncate">{head.nameLao}</p>
        </div>
        {danger && <AlertTriangle className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />}
      </div>
      <UtilBar pct={pct} danger={danger} />
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-muted-foreground">{head.dept}</span>
        <span className={`text-[10px] font-bold tabular-nums ${danger ? 'text-red-600' : 'text-foreground'}`}>{pct}%</span>
      </div>
    </button>
  )
}

export default function BudgetMasterPage() {
  const { heads } = useBudgetStore()
  const [activeCategory, setActiveCategory] = useState<'Recurrent' | 'Capital'>('Recurrent')
  const [selected, setSelected] = useState<BudgetHead | null>(null)

  const grouped = heads.filter(h => h.category === activeCategory)
  const totalBudget = heads.reduce((s, h) => s + h.annualBudget, 0)
  const totalActual = heads.reduce((s, h) => s + h.actual, 0)
  const totalCommitted = heads.reduce((s, h) => s + h.committed, 0)
  const detail = selected ?? grouped[0]

  const detailUsed = detail ? detail.actual + detail.committed : 0
  const detailPct = detail ? Math.round((detailUsed / detail.annualBudget) * 100) : 0
  const detailRemaining = detail ? detail.annualBudget - detailUsed : 0
  const detailDanger = detailPct >= 80

  return (
    <AppShell breadcrumbs={[{ label: 'Budget', href: '/admin/budget' }, { label: 'Master Data' }]}>
      {/* Top strip */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold">Budget Master Data</h1>
          <p className="text-xs text-muted-foreground">FY 2026 · Hospital Budget Allocation · BGT-001</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          <Plus className="w-3.5 h-3.5" />Add Budget Head
        </button>
      </div>

      {/* FY Summary ribbon */}
      <div className="grid grid-cols-4 gap-0 mb-5 bg-card border border-border rounded-xl overflow-hidden">
        {[
          { label: 'Total FY 2026 Budget', value: fmtM(totalBudget), sub: 'Approved allocation', accent: 'border-l-4 border-l-primary' },
          { label: 'YTD Actual Spend',     value: fmtM(totalActual), sub: `${((totalActual/totalBudget)*100).toFixed(1)}% of budget`, accent: 'border-l-4 border-l-emerald-500' },
          { label: 'Committed',            value: fmtM(totalCommitted), sub: 'Open orders / POs', accent: 'border-l-4 border-l-amber-400' },
          { label: 'Available Balance',    value: fmtM(totalBudget - totalActual - totalCommitted), sub: 'Uncommitted remaining', accent: 'border-l-4 border-l-blue-400' },
        ].map(({ label, value, sub, accent }) => (
          <div key={label} className={`px-5 py-4 ${accent}`}>
            <p className="text-base font-bold tabular-nums">{value}</p>
            <p className="text-[11px] font-medium text-foreground/80 mt-0.5">{label}</p>
            <p className="text-[10px] text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      {/* Split layout */}
      <div className="flex gap-4 min-h-[500px]">
        {/* Left: category tabs + card list */}
        <div className="w-72 shrink-0 flex flex-col gap-3">
          {/* Category switcher */}
          <div className="flex rounded-lg border border-border overflow-hidden bg-muted/30">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => { setActiveCategory(c); setSelected(null) }}
                className={`flex-1 text-xs font-medium py-2 transition-colors ${activeCategory === c ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Category totals */}
          <div className={`rounded-lg border px-4 py-3 text-xs ${CAT_LIGHT[activeCategory]}`}>
            <p className="font-semibold mb-1">{activeCategory} Budget</p>
            <p className="tabular-nums font-bold text-sm">{fmtM(grouped.reduce((s,h) => s+h.annualBudget, 0))}</p>
            <p className="text-[10px] mt-0.5">{grouped.length} budget heads</p>
          </div>

          {/* Head cards */}
          <div className="flex flex-col gap-2 overflow-y-auto">
            {grouped.map(h => (
              <HeadCard
                key={h.code}
                head={h}
                selected={(selected ?? grouped[0])?.code === h.code}
                onClick={() => setSelected(h)}
              />
            ))}
          </div>
        </div>

        {/* Right: detail panel */}
        {detail && (
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Header */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-block w-2.5 h-2.5 rounded-sm ${CAT_COLOR[detail.category]}`} />
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{detail.category} · {detail.code}</span>
                  </div>
                  <h2 className="text-lg font-bold">{detail.name}</h2>
                  <p className="text-sm text-muted-foreground">{detail.nameLao} · {detail.dept}</p>
                </div>
                {detailDanger && (
                  <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-xs font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />Over 80% utilized
                  </div>
                )}
              </div>

              {/* Big utilization bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Budget utilization</span>
                  <span className={`font-bold tabular-nums ${detailDanger ? 'text-red-600' : 'text-foreground'}`}>{detailPct}%</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden flex gap-0.5">
                  <div className="h-full bg-red-500 rounded-l-full" style={{ width: `${(detail.actual / detail.annualBudget) * 100}%` }} />
                  <div className="h-full bg-amber-400" style={{ width: `${(detail.committed / detail.annualBudget) * 100}%` }} />
                </div>
                <div className="flex gap-4 mt-1.5">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><span className="w-2 h-2 rounded-sm bg-red-500 inline-block" />Actual</span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><span className="w-2 h-2 rounded-sm bg-amber-400 inline-block" />Committed</span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><span className="w-2 h-2 rounded-sm bg-muted-foreground/30 inline-block" />Available</span>
                </div>
              </div>

              {/* Amount breakdown */}
              <div className="grid grid-cols-4 gap-3 pt-3 border-t border-border">
                {[
                  { label: 'Annual Budget', value: fmtM(detail.annualBudget), color: 'text-foreground' },
                  { label: 'Actual Spend',  value: fmtM(detail.actual),       color: 'text-red-600' },
                  { label: 'Committed',     value: fmtM(detail.committed),     color: 'text-amber-600' },
                  { label: 'Remaining',     value: fmtM(detailRemaining),      color: detailRemaining < 0 ? 'text-red-700 font-bold' : 'text-emerald-600' },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <p className="text-[10px] text-muted-foreground uppercase">{label}</p>
                    <p className={`text-sm font-bold tabular-nums mt-0.5 ${color}`}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly burn placeholder */}
            <div className="bg-card border border-border rounded-xl p-5 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">Monthly Spend — FY 2026</p>
              <div className="flex items-end gap-2 h-28">
                {[4960, 4820, 5100, 4650, 4890, 5020, 4760, 4980, 0, 0, 0, 0].map((v, i) => {
                  const h = v > 0 ? Math.round((v / 5100) * 100) : 0
                  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex items-end justify-center" style={{ height: '96px' }}>
                        <div
                          className={`w-full rounded-t-sm ${v > 0 ? 'bg-primary/70 hover:bg-primary' : 'bg-muted'} transition-colors`}
                          style={{ height: `${h}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-muted-foreground">{months[i]}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
