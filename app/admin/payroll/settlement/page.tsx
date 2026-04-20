'use client'

import { useState } from 'react'
import { CreditCard, Search, Eye, Download, CheckCircle2 } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const SETTLEMENTS = [
  { ref: 'SET-2026-04', period: 'April 2026',     runDate: '30/04/2026', empCount: 342, grossPay: 'LAK 1,302,450,000', deductions: 'LAK 189,640,000', netPay: 'LAK 1,112,810,000', bankFile: 'BCEL', status: 'Pending'   },
  { ref: 'SET-2026-03', period: 'March 2026',     runDate: '31/03/2026', empCount: 340, grossPay: 'LAK 1,289,100,000', deductions: 'LAK 186,580,000', netPay: 'LAK 1,102,520,000', bankFile: 'BCEL', status: 'Approved'  },
  { ref: 'SET-2026-02', period: 'February 2026',  runDate: '28/02/2026', empCount: 338, grossPay: 'LAK 1,271,880,000', deductions: 'LAK 184,210,000', netPay: 'LAK 1,087,670,000', bankFile: 'BCEL', status: 'Approved'  },
  { ref: 'SET-2026-01', period: 'January 2026',   runDate: '31/01/2026', empCount: 337, grossPay: 'LAK 1,265,700,000', deductions: 'LAK 183,340,000', netPay: 'LAK 1,082,360,000', bankFile: 'BCEL', status: 'Approved'  },
  { ref: 'SET-2025-12', period: 'December 2025',  runDate: '31/12/2025', empCount: 335, grossPay: 'LAK 1,260,800,000', deductions: 'LAK 182,800,000', netPay: 'LAK 1,078,000,000', bankFile: 'BCEL', status: 'Approved'  },
  { ref: 'SET-2025-11', period: 'November 2025',  runDate: '30/11/2025', empCount: 333, grossPay: 'LAK 1,244,600,000', deductions: 'LAK 180,200,000', netPay: 'LAK 1,064,400,000', bankFile: 'BCEL', status: 'Approved'  },
]

export default function PayrollSettlementPage() {
  const [search, setSearch] = useState('')

  const filtered = SETTLEMENTS.filter(s => {
    const q = search.toLowerCase()
    return !q || s.period.toLowerCase().includes(q) || s.ref.toLowerCase().includes(q)
  })

  return (
    <AppShell breadcrumbs={[{ label: 'Payroll', href: '/admin/payroll' }, { label: 'Settlement' }]}>
      <PageHeader
        title="Payroll Settlement"
        titleLao="ການຊໍາລະເງິນເດືອນ"
        description="Bank transfer files and settlement approval by period · PAY-003"
        primaryAction={{ label: 'Generate Bank File', icon: <CreditCard className="w-3.5 h-3.5" /> }}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'April 2026 Net Payroll', value: 'LAK 1,112.8M', sub: 'Pending settlement', color: 'text-amber-600' },
          { label: 'YTD Total Paid',         value: 'LAK 3,272.5M', sub: 'Jan – Mar 2026',     color: 'text-primary'   },
          { label: 'Employees Covered',      value: '342',           sub: 'All active staff',   color: 'text-foreground' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            <p className="text-[10px] text-muted-foreground/60">{sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input className="pl-8 h-8 text-xs w-60" placeholder="Search period or reference..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} periods</span>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Reference','Period','Run Date','Employees','Gross Pay','Deductions','Net Pay','Bank File','Status','Actions'].map(h => (
                <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.ref} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{row.ref}</td>
                <td className="px-3 py-2 font-semibold text-foreground">{row.period}</td>
                <td className="px-3 py-2 tabular-nums text-muted-foreground">{row.runDate}</td>
                <td className="px-3 py-2 tabular-nums text-center">{row.empCount}</td>
                <td className="px-3 py-2 tabular-nums text-foreground">{row.grossPay}</td>
                <td className="px-3 py-2 tabular-nums text-red-600">{row.deductions}</td>
                <td className="px-3 py-2 tabular-nums font-semibold text-primary">{row.netPay}</td>
                <td className="px-3 py-2 text-muted-foreground">{row.bankFile}</td>
                <td className="px-3 py-2"><StatusBadge status={row.status} /></td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary"><Eye className="w-3.5 h-3.5" /></button>
                    {row.status === 'Approved' && (
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Download className="w-3.5 h-3.5" /></button>
                    )}
                    {row.status === 'Pending' && (
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}
