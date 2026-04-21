'use client'

import { AppShell } from '@/components/mis/AppShell'
import { ACCOUNTS, getBalance } from '@/lib/stores/accountingStore'
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react'

const fmtM = (v: number) => `LAK ${Math.abs(v).toLocaleString()}M`
const fmtPct = (v: number) => `${v.toFixed(1)}%`
const fmtX = (v: number) => `${v.toFixed(2)}x`

function trend(current: number, prior: number) {
  const delta = ((current - prior) / Math.abs(prior)) * 100
  if (Math.abs(delta) < 1) return { icon: Minus, color: 'text-muted-foreground', label: 'Flat', delta: 0 }
  return delta > 0
    ? { icon: TrendingUp,   color: 'text-emerald-600', label: `+${delta.toFixed(1)}%`, delta }
    : { icon: TrendingDown, color: 'text-red-600',     label: `${delta.toFixed(1)}%`,  delta }
}

function RatioCard({
  label, value, benchmark, description, prior, format = 'pct', good = 'high',
}: {
  label: string; value: number; benchmark: string; description: string;
  prior: number; format?: 'pct' | 'ratio' | 'money'; good?: 'high' | 'low';
}) {
  const display = format === 'pct' ? fmtPct(value) : format === 'ratio' ? fmtX(value) : fmtM(value)
  const t = trend(value, prior)
  const TIcon = t.icon
  const isGood = good === 'high' ? t.delta >= 0 : t.delta <= 0
  const statusColor = t.delta === 0 ? 'text-muted-foreground' : isGood ? 'text-emerald-600' : 'text-red-600'

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <div className="group relative">
          <Info className="w-3.5 h-3.5 text-muted-foreground/40 cursor-help" />
          <div className="absolute right-0 top-5 z-10 w-48 bg-popover border border-border rounded-lg p-2.5 text-[10px] text-muted-foreground shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
            {description}
          </div>
        </div>
      </div>

      <p className="text-3xl font-black tabular-nums">{display}</p>

      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1 ${statusColor}`}>
          <TIcon className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold">{t.label}</span>
          <span className="text-[10px] text-muted-foreground">vs prior</span>
        </div>
        <span className="text-[10px] text-muted-foreground">Benchmark: <span className="font-medium text-foreground">{benchmark}</span></span>
      </div>
    </div>
  )
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 100 / (data.length - 1)
  const points = data.map((v, i) => `${i * w},${100 - ((v - min) / range) * 100}`).join(' ')
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-12">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TrendSection({ title, rows }: { title: string; rows: { label: string; data: number[]; color: string; unit: string }[] }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <p className="text-xs font-bold uppercase tracking-wide mb-4">{title}</p>
      <div className="space-y-4">
        {rows.map(row => {
          const last = row.data[row.data.length - 1]
          const prev = row.data[row.data.length - 2]
          const delta = ((last - prev) / Math.abs(prev || 1)) * 100
          return (
            <div key={row.label}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium">{row.label}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs tabular-nums font-bold">{row.unit === '%' ? fmtPct(last) : fmtM(last)}</span>
                  <span className={`text-[10px] font-medium ${delta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
                  </span>
                </div>
              </div>
              <Sparkline data={row.data} color={row.color} />
              <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
                {['Jan','Feb','Mar','Apr','May','Jun'].map(m => <span key={m}>{m}</span>)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AccountingStatisticsPage() {
  const cash        = ACCOUNTS.find(a => a.code === '1000')?.balance ?? 0
  const ar          = ACCOUNTS.find(a => a.code === '1100')?.balance ?? 0
  const inventory   = ACCOUNTS.find(a => a.code === '1200')?.balance ?? 0
  const prepaid     = ACCOUNTS.find(a => a.code === '1300')?.balance ?? 0
  const ppe         = ACCOUNTS.find(a => a.code === '1500')?.balance ?? 0
  const accDep      = Math.abs(ACCOUNTS.find(a => a.code === '1510')?.balance ?? 0)
  const ap          = ACCOUNTS.find(a => a.code === '2000')?.balance ?? 0
  const accrued     = ACCOUNTS.find(a => a.code === '2100')?.balance ?? 0
  const deferred    = ACCOUNTS.find(a => a.code === '2200')?.balance ?? 0
  const ltLoan      = ACCOUNTS.find(a => a.code === '2500')?.balance ?? 0
  const govCap      = ACCOUNTS.find(a => a.code === '3000')?.balance ?? 0
  const retained    = ACCOUNTS.find(a => a.code === '3100')?.balance ?? 0
  const totalRev    = getBalance(ACCOUNTS, 'Revenue')
  const totalExp    = getBalance(ACCOUNTS, 'Expense')
  const netIncome   = totalRev - totalExp
  const personnel   = ACCOUNTS.find(a => a.code === '5000')?.balance ?? 0

  const currentAssets = cash + ar + inventory + prepaid
  const currentLiab   = ap + accrued + deferred
  const totalAssets   = currentAssets + (ppe - accDep)
  const totalLiab     = currentLiab + ltLoan
  const totalEquity   = govCap + retained + netIncome

  const currentRatio  = currentLiab > 0 ? currentAssets / currentLiab : 0
  const quickRatio    = currentLiab > 0 ? (cash + ar) / currentLiab : 0
  const debtRatio     = totalAssets > 0 ? (totalLiab / totalAssets) * 100 : 0
  const surplusMargin = totalRev > 0 ? (netIncome / totalRev) * 100 : 0
  const personnelRatio= totalRev > 0 ? (personnel / totalRev) * 100 : 0
  const roaRatio      = totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0

  return (
    <AppShell breadcrumbs={[{ label: 'Accounting', href: '/admin/accounting' }, { label: 'Statistics' }]}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold">Financial Statistics</h1>
          <p className="text-xs text-muted-foreground">Key ratios & performance trends · ACC-005 · FY 2026</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground uppercase">Net Surplus (YTD)</p>
          <p className={`text-2xl font-black tabular-nums ${netIncome >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmtM(netIncome)}</p>
        </div>
      </div>

      {/* Ratio cards */}
      <div className="mb-5">
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide mb-2">Liquidity Ratios</p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <RatioCard
            label="Current Ratio" value={currentRatio} prior={1.8} format="ratio"
            benchmark="≥ 1.5" description="Current Assets ÷ Current Liabilities. Measures short-term solvency." good="high"
          />
          <RatioCard
            label="Quick Ratio" value={quickRatio} prior={1.4} format="ratio"
            benchmark="≥ 1.0" description="(Cash + AR) ÷ Current Liabilities. Excludes inventory." good="high"
          />
          <RatioCard
            label="Cash Position" value={cash} prior={4200} format="money"
            benchmark="3+ months payroll" description="Total cash and cash equivalents on hand." good="high"
          />
        </div>

        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide mb-2">Profitability Ratios</p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <RatioCard
            label="Surplus Margin" value={surplusMargin} prior={18.2} format="pct"
            benchmark="≥ 15%" description="Net Surplus ÷ Total Revenue. Measures overall efficiency." good="high"
          />
          <RatioCard
            label="Personnel Cost Ratio" value={personnelRatio} prior={36} format="pct"
            benchmark="≤ 40%" description="Personnel Costs ÷ Revenue. Hospital benchmark ≤ 40%." good="low"
          />
          <RatioCard
            label="Return on Assets" value={roaRatio} prior={4.2} format="pct"
            benchmark="≥ 4%" description="Net Surplus ÷ Total Assets." good="high"
          />
        </div>

        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide mb-2">Solvency</p>
        <div className="grid grid-cols-3 gap-3">
          <RatioCard
            label="Debt Ratio" value={debtRatio} prior={27.5} format="pct"
            benchmark="≤ 40%" description="Total Liabilities ÷ Total Assets." good="low"
          />
          <RatioCard
            label="Equity Ratio" value={100 - debtRatio} prior={72.5} format="pct"
            benchmark="≥ 60%" description="Total Equity ÷ Total Assets." good="high"
          />
          <RatioCard
            label="Total Liabilities" value={totalLiab} prior={6800} format="money"
            benchmark="Trend down" description="Sum of all current and long-term liabilities." good="low"
          />
        </div>
      </div>

      {/* Trend charts */}
      <div className="grid grid-cols-2 gap-3">
        <TrendSection title="Revenue & Expense Trends" rows={[
          { label: 'Patient Revenue', data: [1820, 2010, 2160, 2640, 0, 0], color: '#10b981', unit: 'M' },
          { label: 'Government Subsidy', data: [1200, 1200, 1300, 1500, 0, 0], color: '#6366f1', unit: 'M' },
          { label: 'Total Expenses', data: [2840, 3100, 3200, 3266, 0, 0], color: '#ef4444', unit: 'M' },
        ]} />
        <TrendSection title="Liquidity & Surplus Margin" rows={[
          { label: 'Cash Balance', data: [3800, 4100, 4500, 4820, 0, 0], color: '#3b82f6', unit: 'M' },
          { label: 'Surplus Margin %', data: [15.2, 17.8, 18.2, surplusMargin, 0, 0].filter(v => v > 0), color: '#f59e0b', unit: '%' },
          { label: 'Current Ratio', data: [1.6, 1.7, 1.8, currentRatio, 0, 0].filter(v => v > 0), color: '#8b5cf6', unit: '%' },
        ]} />
      </div>
    </AppShell>
  )
}
