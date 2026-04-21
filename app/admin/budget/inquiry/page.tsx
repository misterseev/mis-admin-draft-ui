'use client'

import { useState, useMemo } from 'react'
import { Search, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { useBudgetStore, fmtM, BudgetHead } from '@/lib/stores/budgetStore'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type GroupBy = 'category' | 'dept'

function BarH({ pct, danger }: { pct: number; danger: boolean }) {
  return (
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${danger ? 'bg-red-500' : pct > 60 ? 'bg-amber-400' : 'bg-emerald-500'}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  )
}

function HeadRow({ h, rank }: { h: BudgetHead; rank: number }) {
  const used = h.actual + h.committed
  const pct = Math.round((used / h.annualBudget) * 100)
  const danger = pct >= 80
  const remaining = h.annualBudget - used

  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-lg border transition-colors hover:bg-muted/20 ${danger ? 'border-red-200 bg-red-50/30' : 'border-border bg-card'}`}>
      <span className="text-lg font-black tabular-nums text-muted-foreground/30 w-7 shrink-0">{rank}</span>
      <div className="w-36 shrink-0">
        <p className="text-xs font-semibold leading-tight">{h.name}</p>
        <p className="text-[9px] text-muted-foreground">{h.code} · {h.dept}</p>
      </div>
      <div className="flex-1 min-w-0">
        <BarH pct={pct} danger={danger} />
        <div className="flex justify-between mt-1 text-[9px] text-muted-foreground">
          <span>0</span>
          <span className="font-medium">{fmtM(used)} used</span>
          <span>{fmtM(h.annualBudget)}</span>
        </div>
      </div>
      <div className="w-16 text-right shrink-0">
        <p className={`text-sm font-black tabular-nums ${danger ? 'text-red-600' : pct > 60 ? 'text-amber-600' : 'text-emerald-600'}`}>{pct}%</p>
      </div>
      <div className="w-24 text-right shrink-0">
        <p className="text-[10px] text-muted-foreground">Remaining</p>
        <p className={`text-xs font-bold tabular-nums ${remaining < 0 ? 'text-red-700' : 'text-foreground'}`}>{fmtM(remaining)}</p>
      </div>
      <div className="w-24 text-right shrink-0">
        <p className="text-[10px] text-muted-foreground">Committed</p>
        <p className="text-xs font-medium tabular-nums text-amber-600">{h.committed ? fmtM(h.committed) : '—'}</p>
      </div>
    </div>
  )
}

export default function BudgetInquiryPage() {
  const { heads } = useBudgetStore()
  const [search, setSearch] = useState('')
  const [groupBy, setGroupBy] = useState<GroupBy>('category')
  const [sortBy, setSortBy] = useState<'utilization' | 'budget' | 'actual'>('utilization')
  const [catFilter, setCatFilter] = useState('all')

  const filtered = useMemo(() => {
    return heads
      .filter(h => {
        const q = search.toLowerCase()
        if (q && !h.name.toLowerCase().includes(q) && !h.dept.toLowerCase().includes(q)) return false
        if (catFilter !== 'all' && h.category !== catFilter) return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'utilization') return ((b.actual + b.committed) / b.annualBudget) - ((a.actual + a.committed) / a.annualBudget)
        if (sortBy === 'budget') return b.annualBudget - a.annualBudget
        return b.actual - a.actual
      })
  }, [heads, search, sortBy, catFilter])

  const groups = useMemo(() => {
    const map = new Map<string, BudgetHead[]>()
    filtered.forEach(h => {
      const key = groupBy === 'category' ? h.category : h.dept
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(h)
    })
    return Array.from(map.entries())
  }, [filtered, groupBy])

  const totalBudget = heads.reduce((s, h) => s + h.annualBudget, 0)
  const totalActual = heads.reduce((s, h) => s + h.actual, 0)
  const totalCommit = heads.reduce((s, h) => s + h.committed, 0)
  const overallPct = Math.round(((totalActual + totalCommit) / totalBudget) * 100)

  return (
    <AppShell breadcrumbs={[{ label: 'Budget', href: '/admin/budget' }, { label: 'Inquiry' }]}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold">Budget Inquiry</h1>
          <p className="text-xs text-muted-foreground">Drill-down analysis · FY 2026 · BGT-006</p>
        </div>
      </div>

      {/* Big metric row */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        <div className="col-span-2 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground rounded-xl p-5">
          <p className="text-[11px] font-medium opacity-80 uppercase tracking-wide">FY 2026 Budget Utilization</p>
          <div className="flex items-end gap-2 mt-2 mb-3">
            <p className="text-5xl font-black tabular-nums">{overallPct}%</p>
            <p className="text-sm opacity-70 mb-1">of {fmtM(totalBudget)}</p>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${overallPct}%` }} />
          </div>
          <div className="flex justify-between text-[10px] mt-1 opacity-70">
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl px-5 py-4 flex flex-col justify-between">
          <p className="text-[10px] text-muted-foreground uppercase font-medium">Actual Spend</p>
          <div>
            <p className="text-2xl font-bold tabular-nums text-red-600">{fmtM(totalActual)}</p>
            <p className="text-[10px] text-muted-foreground">{((totalActual/totalBudget)*100).toFixed(1)}% of budget</p>
          </div>
          <TrendingDown className="w-5 h-5 text-red-400" />
        </div>

        <div className="bg-card border border-border rounded-xl px-5 py-4 flex flex-col justify-between">
          <p className="text-[10px] text-muted-foreground uppercase font-medium">Committed</p>
          <div>
            <p className="text-2xl font-bold tabular-nums text-amber-600">{fmtM(totalCommit)}</p>
            <p className="text-[10px] text-muted-foreground">Open orders / POs</p>
          </div>
          <TrendingUp className="w-5 h-5 text-amber-400" />
        </div>

        <div className="bg-card border border-border rounded-xl px-5 py-4 flex flex-col justify-between">
          <p className="text-[10px] text-muted-foreground uppercase font-medium">Available</p>
          <div>
            <p className="text-2xl font-bold tabular-nums text-emerald-600">{fmtM(totalBudget - totalActual - totalCommit)}</p>
            <p className="text-[10px] text-muted-foreground">Uncommitted balance</p>
          </div>
          <Minus className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      {/* Filter / sort bar */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input className="pl-8 h-8 text-xs w-56" placeholder="Search budget head or dept..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="h-8 text-xs w-36"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Categories</SelectItem>
            <SelectItem value="Recurrent" className="text-xs">Recurrent</SelectItem>
            <SelectItem value="Capital" className="text-xs">Capital</SelectItem>
          </SelectContent>
        </Select>
        <Select value={groupBy} onValueChange={v => setGroupBy(v as GroupBy)}>
          <SelectTrigger className="h-8 text-xs w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="category" className="text-xs">Group by Category</SelectItem>
            <SelectItem value="dept" className="text-xs">Group by Department</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={v => setSortBy(v as any)}>
          <SelectTrigger className="h-8 text-xs w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="utilization" className="text-xs">Sort: Utilization %</SelectItem>
            <SelectItem value="budget" className="text-xs">Sort: Budget Size</SelectItem>
            <SelectItem value="actual" className="text-xs">Sort: Actual Spend</SelectItem>
          </SelectContent>
        </Select>
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} heads</span>
      </div>

      {/* Grouped rows */}
      <div className="space-y-5">
        {groups.map(([groupKey, groupHeads]) => {
          const gBudget = groupHeads.reduce((s, h) => s + h.annualBudget, 0)
          const gUsed = groupHeads.reduce((s, h) => s + h.actual + h.committed, 0)
          const gPct = Math.round((gUsed / gBudget) * 100)
          return (
            <div key={groupKey}>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wide">{groupKey}</h3>
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] text-muted-foreground">{fmtM(gUsed)} / {fmtM(gBudget)} · {gPct}%</span>
              </div>
              <div className="space-y-1.5">
                {groupHeads.map((h, i) => <HeadRow key={h.code} h={h} rank={i + 1} />)}
              </div>
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}
