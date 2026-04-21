'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, Lock, ChevronRight, RefreshCw } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { useAccountingStore, ClosingPeriod } from '@/lib/stores/accountingStore'

const STATUS_META = {
  Open:        { label: 'Open',        color: 'text-muted-foreground', bg: 'bg-muted/30 border-border'        },
  'In Progress':{ label: 'In Progress', color: 'text-amber-700',       bg: 'bg-amber-50 border-amber-300'     },
  Closed:      { label: 'Closed',      color: 'text-emerald-700',      bg: 'bg-emerald-50 border-emerald-300' },
}

function PeriodCard({
  period, active, onClick,
}: { period: ClosingPeriod; active: boolean; onClick: () => void }) {
  const meta = STATUS_META[period.status]
  const done = period.steps.filter(s => s.done).length
  const total = period.steps.length
  const pct = Math.round((done / total) * 100)

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all ${active ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:bg-muted/30'}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-bold">{period.period}</p>
          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${meta.bg} ${meta.color}`}>
            {meta.label}
          </span>
        </div>
        {period.status === 'Closed' ? (
          <Lock className="w-4 h-4 text-emerald-500 mt-0.5" />
        ) : (
          <span className={`text-lg font-black tabular-nums ${pct >= 80 ? 'text-emerald-600' : 'text-foreground'}`}>{pct}%</span>
        )}
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${period.status === 'Closed' ? 'bg-emerald-500' : 'bg-amber-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground mt-1">{done}/{total} steps complete</p>
    </button>
  )
}

export default function ClosingPage() {
  const { closings, completeStep } = useAccountingStore()
  const [activePeriod, setActivePeriod] = useState(closings[1]?.period ?? closings[0]?.period)

  const selected = closings.find(c => c.period === activePeriod)

  return (
    <AppShell breadcrumbs={[{ label: 'Accounting', href: '/admin/accounting' }, { label: 'Period Closing' }]}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold">Period Closing</h1>
          <p className="text-xs text-muted-foreground">Month-end checklist and period lock · ACC-003</p>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Period selector */}
        <div className="w-56 shrink-0 flex flex-col gap-2">
          <p className="text-[10px] uppercase font-semibold text-muted-foreground px-1">Periods</p>
          {closings.map(c => (
            <PeriodCard
              key={c.period}
              period={c}
              active={c.period === activePeriod}
              onClick={() => setActivePeriod(c.period)}
            />
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="flex-1 min-w-0">
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              {/* Period header */}
              <div className={`px-6 py-5 border-b border-border ${STATUS_META[selected.status].bg}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-bold">{selected.period}</h2>
                      {selected.status === 'Closed' && <Lock className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className={`text-sm font-semibold mt-0.5 ${STATUS_META[selected.status].color}`}>
                      {selected.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">Progress</p>
                    <p className="text-3xl font-black tabular-nums">
                      {selected.steps.filter(s => s.done).length}/{selected.steps.length}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="w-full h-2 bg-white/40 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${selected.status === 'Closed' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${(selected.steps.filter(s => s.done).length / selected.steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="px-6 py-5">
                <div className="relative">
                  {/* Connecting line */}
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />

                  <div className="space-y-0">
                    {selected.steps.map((step, i) => {
                      const isPending = !step.done
                      const isNextUp = isPending && selected.steps.slice(0, i).every(s => s.done)
                      const canComplete = isNextUp && selected.status !== 'Closed'

                      return (
                        <div key={step.id} className="flex gap-5 relative">
                          {/* Step icon */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all ${
                            step.done ? 'bg-emerald-500 border-emerald-500' :
                            isNextUp ? 'bg-background border-amber-400 shadow-md shadow-amber-100' :
                            'bg-background border-border'
                          }`}>
                            {step.done ? (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            ) : isNextUp ? (
                              <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-muted-foreground/40" />
                            )}
                          </div>

                          {/* Step content */}
                          <div className={`flex-1 pb-6 ${i === selected.steps.length - 1 ? 'pb-0' : ''}`}>
                            <div className={`rounded-xl border p-4 transition-all ${
                              step.done ? 'border-emerald-200 bg-emerald-50/50' :
                              isNextUp ? 'border-amber-200 bg-amber-50/50 shadow-sm' :
                              'border-border bg-muted/10'
                            }`}>
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className={`text-sm font-semibold ${step.done ? 'text-emerald-800' : isNextUp ? 'text-amber-800' : 'text-muted-foreground'}`}>
                                      {step.label}
                                    </p>
                                    {isNextUp && !step.done && (
                                      <span className="text-[9px] font-bold bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full uppercase">Next</span>
                                    )}
                                  </div>
                                  {step.done && (
                                    <p className="text-[10px] text-emerald-700 mt-0.5">
                                      Completed {step.doneDate} by <span className="font-semibold">{step.doneBy}</span>
                                    </p>
                                  )}
                                </div>
                                {canComplete && (
                                  <button
                                    onClick={() => completeStep(selected.period, step.id)}
                                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />Mark Done
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Footer note */}
              {selected.status === 'Closed' && (
                <div className="px-6 pb-5">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 flex items-center gap-3">
                    <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <p className="text-xs text-emerald-800">
                      This period is locked. No new journal entries can be posted. Contact the Finance Manager to re-open if required.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
