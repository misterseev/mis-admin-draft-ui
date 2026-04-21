'use client'

import { useState } from 'react'
import { AlertTriangle, TrendingUp, Shield } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { useBudgetStore, fmtM, BudgetHead } from '@/lib/stores/budgetStore'

const DEPTS = ['Pharmacy', 'Lab', 'Radiology', 'Nursing', 'Administration', 'Maintenance', 'HR', 'IT', 'All Departments']

function pct(head: BudgetHead) {
  return Math.round(((head.actual + head.committed) / head.annualBudget) * 100)
}

function cellColor(p: number, hasData: boolean) {
  if (!hasData) return 'bg-muted/20 text-muted-foreground/30'
  if (p >= 90) return 'bg-red-500 text-white font-bold'
  if (p >= 80) return 'bg-red-100 text-red-800 font-semibold'
  if (p >= 60) return 'bg-amber-100 text-amber-800'
  if (p >= 30) return 'bg-emerald-50 text-emerald-800'
  return 'bg-blue-50 text-blue-700'
}

export default function BudgetControlPage() {
  const { heads } = useBudgetStore()
  const [highlight, setHighlight] = useState<string | null>(null)

  const categories = ['Recurrent', 'Capital']
  const alerts = heads.filter(h => pct(h) >= 80).sort((a, b) => pct(b) - pct(a))
  const totalBudget = heads.reduce((s, h) => s + h.annualBudget, 0)
  const totalUsed = heads.reduce((s, h) => s + h.actual + h.committed, 0)
  const overallPct = Math.round((totalUsed / totalBudget) * 100)

  return (
    <AppShell breadcrumbs={[{ label: 'Budget', href: '/admin/budget' }, { label: 'Control' }]}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold">Budget Control</h1>
          <p className="text-xs text-muted-foreground">Real-time utilization heatmap across departments · BGT-004</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {[
            ['bg-blue-50 border border-blue-200', '0–30%'],
            ['bg-emerald-50 border border-emerald-200', '30–60%'],
            ['bg-amber-100 border border-amber-200', '60–80%'],
            ['bg-red-100 border border-red-200', '80–90%'],
            ['bg-red-500', '≥90%'],
          ].map(([cls, label]) => (
            <div key={label} className="flex items-center gap-1">
              <div className={`w-4 h-4 rounded-sm ${cls}`} />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/30" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3"
                className={overallPct >= 80 ? 'text-red-500' : overallPct >= 60 ? 'text-amber-400' : 'text-emerald-500'}
                strokeDasharray={`${overallPct * 0.942} 94.2`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-[11px] font-bold ${overallPct >= 80 ? 'text-red-600' : 'text-foreground'}`}>{overallPct}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Overall Utilization</p>
            <p className="text-sm font-bold">{fmtM(totalUsed)}</p>
            <p className="text-[10px] text-muted-foreground">of {fmtM(totalBudget)}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <p className="text-xs font-semibold text-red-700">Over-threshold Heads</p>
          </div>
          <p className="text-2xl font-bold text-red-600">{alerts.length}</p>
          <p className="text-[10px] text-muted-foreground">budget heads at ≥80% utilization</p>
        </div>

        <div className="bg-card border border-border rounded-xl px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <p className="text-xs font-semibold">Available Balance</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{fmtM(totalBudget - totalUsed)}</p>
          <p className="text-[10px] text-muted-foreground">uncommitted budget remaining</p>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Heatmap */}
        <div className="flex-1 min-w-0">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border">
              <p className="text-xs font-semibold uppercase tracking-wide">Utilization Heatmap — by Department &amp; Category</p>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-xs border-separate border-spacing-1">
                <thead>
                  <tr>
                    <th className="text-left text-[10px] text-muted-foreground font-medium pb-1 w-36">Department</th>
                    {heads.map(h => (
                      <th
                        key={h.code}
                        className={`text-center text-[9px] font-medium pb-1 whitespace-nowrap cursor-pointer transition-opacity ${highlight && highlight !== h.code ? 'opacity-30' : ''}`}
                        onMouseEnter={() => setHighlight(h.code)}
                        onMouseLeave={() => setHighlight(null)}
                      >
                        <div className="writing-mode-vertical" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', maxHeight: '80px' }}>
                          {h.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEPTS.map(dept => (
                    <tr key={dept}>
                      <td className="text-[10px] font-medium text-muted-foreground pr-2 py-0.5">{dept}</td>
                      {heads.map(h => {
                        const belongs = h.dept === dept || h.dept === 'All Departments' && dept === 'All Departments'
                        const p = belongs ? pct(h) : 0
                        const hasData = belongs
                        return (
                          <td
                            key={h.code}
                            className={`text-center rounded text-[10px] tabular-nums transition-all cursor-default ${cellColor(p, hasData)} ${highlight === h.code ? 'ring-2 ring-primary' : ''}`}
                            style={{ width: '64px', height: '32px' }}
                            title={hasData ? `${h.name} → ${h.dept}: ${p}%` : undefined}
                          >
                            {hasData ? `${p}%` : '—'}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Alert list */}
        <div className="w-56 shrink-0">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              <p className="text-xs font-semibold">Alerts</p>
            </div>
            {alerts.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">No alerts</p>
            ) : (
              <div className="divide-y divide-border">
                {alerts.map(h => {
                  const p = pct(h)
                  return (
                    <div key={h.code} className="px-4 py-3">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs font-medium leading-snug flex-1">{h.name}</p>
                        <span className={`text-[10px] font-bold ml-1 shrink-0 ${p >= 90 ? 'text-red-600' : 'text-amber-600'}`}>{p}%</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{h.dept}</p>
                      <div className="w-full h-1 bg-muted rounded-full mt-1.5 overflow-hidden">
                        <div className={`h-full rounded-full ${p >= 90 ? 'bg-red-500' : 'bg-amber-400'}`} style={{ width: `${Math.min(p, 100)}%` }} />
                      </div>
                      <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
                        <span>{fmtM(h.actual + h.committed)} used</span>
                        <span>{fmtM(h.annualBudget)} total</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
