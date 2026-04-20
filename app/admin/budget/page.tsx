'use client'

import { useState } from 'react'
import { Plus, Eye, Edit, Search } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

interface BudgetHead {
  code: string
  name: string
  nameLao: string
  category: string
  annualBudget: number
  committed: number
  actual: number
  dept: string
}

const BUDGET_HEADS: BudgetHead[] = [
  { code: 'BGT-PRS-001', name: 'Personnel Costs',             nameLao: 'ຄ່າຈ້າງ ແລະ ບໍລິຫານ',       category: 'Recurrent', annualBudget: 14900, committed: 0,    actual: 4960, dept: 'All Departments' },
  { code: 'BGT-MED-001', name: 'Medical Supplies',            nameLao: 'ເວດຊະພັນ ແລະ ອຸປະກອນ',       category: 'Recurrent', annualBudget: 1800,  committed: 120, actual: 560,  dept: 'Pharmacy'        },
  { code: 'BGT-MED-002', name: 'Laboratory Reagents',         nameLao: 'ສານ Lab',                    category: 'Recurrent', annualBudget: 680,   committed: 46,  actual: 212,  dept: 'Lab'             },
  { code: 'BGT-OPS-001', name: 'Utilities (Electricity)',     nameLao: 'ໄຟຟ້າ',                       category: 'Recurrent', annualBudget: 480,   committed: 0,   actual: 158,  dept: 'Maintenance'     },
  { code: 'BGT-OPS-002', name: 'Utilities (Water)',           nameLao: 'ນ້ຳ',                          category: 'Recurrent', annualBudget: 120,   committed: 0,   actual: 38,   dept: 'Maintenance'     },
  { code: 'BGT-OPS-003', name: 'Fuel & Transport',            nameLao: 'ນ້ຳມັນ ແລະ ຂົນສົ່ງ',         category: 'Recurrent', annualBudget: 240,   committed: 0,   actual: 82,   dept: 'Administration'  },
  { code: 'BGT-CAP-001', name: 'Medical Equipment Capex',     nameLao: 'ຊື້ອຸປະກອນການແພດ',           category: 'Capital',   annualBudget: 2400,  committed: 850, actual: 0,    dept: 'Radiology'       },
  { code: 'BGT-CAP-002', name: 'Building Renovation',         nameLao: 'ສ້ອມແປງ',                    category: 'Capital',   annualBudget: 600,   committed: 0,   actual: 180,  dept: 'Maintenance'     },
  { code: 'BGT-TRN-001', name: 'Training & Development',      nameLao: 'ຝຶກອົບຮົມ',                  category: 'Recurrent', annualBudget: 280,   committed: 0,   actual: 64,   dept: 'HR'              },
  { code: 'BGT-ICT-001', name: 'IT & Communications',         nameLao: 'ໄອທີ ແລະ ສື່ສານ',             category: 'Recurrent', annualBudget: 320,   committed: 22,  actual: 90,   dept: 'IT'              },
]

const CAT_COLORS: Record<string, string> = {
  Recurrent: 'bg-blue-50 text-blue-700',
  Capital:   'bg-purple-50 text-purple-700',
}

const fmt = (v: number) => `LAK ${v.toLocaleString()}M`

export default function BudgetMasterPage() {
  const [search, setSearch] = useState('')

  const filtered = BUDGET_HEADS.filter(b => {
    const q = search.toLowerCase()
    return !q || b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q)
  })

  const totalBudget = BUDGET_HEADS.reduce((s, b) => s + b.annualBudget, 0)
  const totalActual = BUDGET_HEADS.reduce((s, b) => s + b.actual, 0)

  return (
    <AppShell breadcrumbs={[{ label: 'Budget', href: '/admin/budget' }, { label: 'Master Data' }]}>
      <PageHeader
        title="Budget Master Data"
        titleLao="ຂໍ້ມູນງົບປະມານ"
        description="Annual budget heads, categories, and department allocations · BGT-001"
        primaryAction={{ label: '+ Add Budget Head', icon: <Plus className="w-3.5 h-3.5" /> }}
      />

      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Total FY 2026 Budget', value: `LAK ${totalBudget.toLocaleString()}M`, color: 'text-foreground' },
          { label: 'YTD Actual Spend',     value: `LAK ${totalActual.toLocaleString()}M`, color: 'text-primary'   },
          { label: 'Utilization Rate',     value: `${((totalActual / totalBudget) * 100).toFixed(1)}%`, color: 'text-amber-600' },
          { label: 'Budget Heads',         value: BUDGET_HEADS.length,                   color: 'text-foreground' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input className="pl-8 h-8 text-xs w-64" placeholder="Search budget head..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} heads</span>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Code','Budget Head','Category','Department','Annual Budget','Committed','Actual Spend','Utilization','Actions'].map(h => (
                <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => {
              const utilized = b.actual + b.committed
              const pct = Math.min((utilized / b.annualBudget) * 100, 100)
              const isHigh = pct >= 80
              return (
                <tr key={b.code} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{b.code}</td>
                  <td className="px-3 py-2">
                    <p className="font-medium">{b.name}</p>
                    <p className="text-[10px] text-muted-foreground">{b.nameLao}</p>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${CAT_COLORS[b.category]}`}>
                      {b.category}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{b.dept}</td>
                  <td className="px-3 py-2 tabular-nums font-semibold text-foreground">{fmt(b.annualBudget)}</td>
                  <td className="px-3 py-2 tabular-nums text-amber-600">{b.committed ? fmt(b.committed) : '—'}</td>
                  <td className="px-3 py-2 tabular-nums text-red-600">{fmt(b.actual)}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Progress value={pct} className={`h-1.5 w-16 ${isHigh ? '[&>div]:bg-red-500' : ''}`} />
                      <span className={`tabular-nums text-xs ${isHigh ? 'text-red-600 font-semibold' : 'text-foreground'}`}>{pct.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Edit className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}
