'use client'

import { useState } from 'react'
import { Plus, Search, X, Eye, Edit } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { WorkflowStepper } from '@/components/mis/WorkflowStepper'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PurchaseRequisition {
  ref: string
  title: string
  dept: string
  requestedBy: string
  totalAmount: string
  items: number
  dateRaised: string
  requiredBy: string
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Completed'
}

const PRs: PurchaseRequisition[] = [
  { ref: 'PR-2026-0142', title: 'Medical Supplies Q2 2026',        dept: 'Pharmacy',       requestedBy: 'Phonsa L.',   totalAmount: 'LAK 28,500,000',  items: 14, dateRaised: '18/04/2026', requiredBy: '05/05/2026', status: 'Pending'   },
  { ref: 'PR-2026-0141', title: 'Office Stationery — Admin',       dept: 'Administration', requestedBy: 'Vilay S.',    totalAmount: 'LAK 3,200,000',   items: 8,  dateRaised: '17/04/2026', requiredBy: '30/04/2026', status: 'Approved'  },
  { ref: 'PR-2026-0140', title: 'Lab Reagents & Consumables',      dept: 'Lab',            requestedBy: 'Khamphan V.', totalAmount: 'LAK 45,800,000',  items: 22, dateRaised: '15/04/2026', requiredBy: '01/05/2026', status: 'Approved'  },
  { ref: 'PR-2026-0139', title: 'IT Equipment — HP Laptop x3',     dept: 'IT',             requestedBy: 'Ketsana P.',  totalAmount: 'LAK 12,200,000',  items: 3,  dateRaised: '14/04/2026', requiredBy: '30/04/2026', status: 'Pending'   },
  { ref: 'PR-2026-0138', title: 'Nursing Ward Consumables',        dept: 'Nursing',        requestedBy: 'Khamla B.',   totalAmount: 'LAK 8,750,000',   items: 18, dateRaised: '12/04/2026', requiredBy: '25/04/2026', status: 'Completed' },
  { ref: 'PR-2026-0137', title: 'Maintenance Tools & Spare Parts', dept: 'Maintenance',    requestedBy: 'Bounmy K.',   totalAmount: 'LAK 6,400,000',   items: 11, dateRaised: '10/04/2026', requiredBy: '20/04/2026', status: 'Completed' },
  { ref: 'PR-2026-0136', title: 'Cleaning Supplies — Monthly',     dept: 'Maintenance',    requestedBy: 'Somchith P.', totalAmount: 'LAK 2,100,000',   items: 9,  dateRaised: '08/04/2026', requiredBy: '15/04/2026', status: 'Completed' },
  { ref: 'PR-2026-0135', title: 'Surgical Instruments — ICU',      dept: 'Nursing',        requestedBy: 'Khamla B.',   totalAmount: 'LAK 85,600,000',  items: 6,  dateRaised: '05/04/2026', requiredBy: '20/04/2026', status: 'Rejected'  },
  { ref: 'PR-2026-0134', title: 'Printer Ink & Toner (All Depts)', dept: 'Administration', requestedBy: 'Ladavanh I.', totalAmount: 'LAK 4,500,000',   items: 12, dateRaised: '03/04/2026', requiredBy: '15/04/2026', status: 'Draft'     },
]

const WORKFLOW_STEPS = ['Raised', 'Dept. Review', 'Budget Check', 'Director Approval', 'Procurement']

export default function PurchasingPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deptFilter, setDeptFilter] = useState('all')

  const filtered = PRs.filter(pr => {
    const q = search.toLowerCase()
    if (q && !pr.title.toLowerCase().includes(q) && !pr.ref.toLowerCase().includes(q)) return false
    if (statusFilter !== 'all' && pr.status !== statusFilter) return false
    if (deptFilter !== 'all' && pr.dept !== deptFilter) return false
    return true
  })

  return (
    <AppShell breadcrumbs={[{ label: 'Inventory', href: '/admin/inventory' }, { label: 'Purchasing' }]}>
      <PageHeader
        title="Purchase Requisitions"
        titleLao="ໃບຂໍຊື້"
        description="Raise and track purchase requisitions through the approval workflow · INV-002"
        primaryAction={{ label: '+ New Requisition', icon: <Plus className="w-3.5 h-3.5" /> }}
      />

      {/* Workflow */}
      <div className="mb-4">
        <WorkflowStepper steps={WORKFLOW_STEPS} currentStep={2} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Pending Approval', value: PRs.filter(p => p.status === 'Pending').length,   color: 'text-amber-600' },
          { label: 'Approved (Month)', value: PRs.filter(p => p.status === 'Approved').length,  color: 'text-emerald-600' },
          { label: 'Completed (Month)',value: PRs.filter(p => p.status === 'Completed').length, color: 'text-primary' },
          { label: 'Total Value',      value: 'LAK 196.1M',                                     color: 'text-foreground' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input className="pl-8 h-8 text-xs w-64" placeholder="Search title or reference..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="h-8 text-xs w-36"><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Departments</SelectItem>
            {['Pharmacy','Administration','Lab','IT','Nursing','Maintenance'].map(d => (
              <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 text-xs w-32"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All</SelectItem>
            {['Draft','Pending','Approved','Rejected','Completed'].map(s => (
              <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || statusFilter !== 'all' || deptFilter !== 'all') && (
          <button className="text-xs text-primary hover:underline flex items-center gap-1" onClick={() => { setSearch(''); setStatusFilter('all'); setDeptFilter('all') }}>
            <X className="w-3 h-3" />Clear
          </button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} requisitions</span>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Reference','Title','Department','Requested By','Items','Total Amount','Date Raised','Required By','Status','Actions'].map(h => (
                <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(pr => (
              <tr key={pr.ref} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-3 py-2 font-mono text-[10px] text-primary hover:underline cursor-pointer">{pr.ref}</td>
                <td className="px-3 py-2 font-medium text-foreground max-w-[180px] truncate">{pr.title}</td>
                <td className="px-3 py-2 text-muted-foreground">{pr.dept}</td>
                <td className="px-3 py-2 text-muted-foreground">{pr.requestedBy}</td>
                <td className="px-3 py-2 tabular-nums text-center">{pr.items}</td>
                <td className="px-3 py-2 tabular-nums font-semibold text-foreground">{pr.totalAmount}</td>
                <td className="px-3 py-2 tabular-nums text-muted-foreground">{pr.dateRaised}</td>
                <td className="px-3 py-2 tabular-nums text-muted-foreground">{pr.requiredBy}</td>
                <td className="px-3 py-2"><StatusBadge status={pr.status} /></td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary"><Eye className="w-3.5 h-3.5" /></button>
                    {pr.status === 'Draft' && (
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Edit className="w-3.5 h-3.5" /></button>
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
