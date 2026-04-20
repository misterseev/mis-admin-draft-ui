'use client'

import { useState } from 'react'
import { Plus, Search, X, Eye, Check, Clock, AlertCircle } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type ChangeType = 'Transfer' | 'Promotion' | 'Title Change' | 'Salary Adjustment' | 'Contract Renewal'
type ChangeStatus = 'Pending' | 'Approved' | 'Rejected'

interface PersonnelChange {
  ref: string
  empCode: string
  empName: string
  type: ChangeType
  fromVal: string
  toVal: string
  effectiveDate: string
  requestedBy: string
  status: ChangeStatus
}

const CHANGES: PersonnelChange[] = [
  { ref: 'CHG-2026-0041', empCode: 'EMP-2024-0142', empName: 'Somsak Phommachanh',   type: 'Promotion',         fromVal: 'P3 · Senior Accountant',    toVal: 'P4 · Chief Accountant',       effectiveDate: '01/05/2026', requestedBy: 'Khamthavy V.', status: 'Pending'  },
  { ref: 'CHG-2026-0040', empCode: 'EMP-2022-0055', empName: 'Khamla Boupha',         type: 'Transfer',          fromVal: 'Nursing Dept',               toVal: 'ICU Unit',                    effectiveDate: '01/04/2026', requestedBy: 'HR Director',  status: 'Approved' },
  { ref: 'CHG-2026-0039', empCode: 'EMP-2021-0033', empName: 'Vilay Sengdara',        type: 'Salary Adjustment', fromVal: 'LAK 3,800,000/month',         toVal: 'LAK 4,200,000/month',         effectiveDate: '01/04/2026', requestedBy: 'Khamthavy V.', status: 'Approved' },
  { ref: 'CHG-2026-0038', empCode: 'EMP-2020-0019', empName: 'Phonsa Luangrath',      type: 'Title Change',      fromVal: 'Pharmacist',                  toVal: 'Senior Pharmacist',           effectiveDate: '15/03/2026', requestedBy: 'HR Director',  status: 'Approved' },
  { ref: 'CHG-2026-0037', empCode: 'EMP-2019-0012', empName: 'Bounmy Keovixay',       type: 'Contract Renewal',  fromVal: '2-Year Fixed Term (Expired)', toVal: '3-Year Fixed Term',           effectiveDate: '01/03/2026', requestedBy: 'Noy S.',       status: 'Approved' },
  { ref: 'CHG-2026-0036', empCode: 'EMP-2024-0201', empName: 'Sombath Inthavong',     type: 'Transfer',          fromVal: 'IT Support Unit',             toVal: 'Finance IT Integration',     effectiveDate: '01/05/2026', requestedBy: 'Ketsana P.',   status: 'Pending'  },
  { ref: 'CHG-2026-0035', empCode: 'EMP-2023-0115', empName: 'Bouavanh Douangchanh',  type: 'Promotion',         fromVal: 'P2 · Finance Officer',        toVal: 'P3 · Senior Finance Officer', effectiveDate: '01/05/2026', requestedBy: 'Khamthavy V.', status: 'Pending'  },
  { ref: 'CHG-2026-0034', empCode: 'EMP-2016-0003', empName: 'Souliya Phetsomphou',   type: 'Contract Renewal',  fromVal: 'On Leave (Medical)',          toVal: 'Active — Full Return',        effectiveDate: '15/04/2026', requestedBy: 'Noy S.',       status: 'Rejected' },
  { ref: 'CHG-2026-0033', empCode: 'EMP-2022-0089', empName: 'Ladavanh Inthasith',    type: 'Salary Adjustment', fromVal: 'LAK 2,600,000/month',         toVal: 'LAK 2,900,000/month',         effectiveDate: '01/06/2026', requestedBy: 'HR Director',  status: 'Pending'  },
  { ref: 'CHG-2026-0032', empCode: 'EMP-2021-0060', empName: 'Khamphan Vongkhamphanh',type: 'Title Change',      fromVal: 'Lab Manager',                 toVal: 'Head of Diagnostics',        effectiveDate: '01/04/2026', requestedBy: 'Khamthavy V.', status: 'Approved' },
]

const TYPE_COLORS: Record<ChangeType, string> = {
  'Transfer':          'bg-blue-50 text-blue-700',
  'Promotion':         'bg-emerald-50 text-emerald-700',
  'Title Change':      'bg-purple-50 text-purple-700',
  'Salary Adjustment': 'bg-amber-50 text-amber-700',
  'Contract Renewal':  'bg-slate-100 text-slate-700',
}

export default function PersonnelChangesPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = CHANGES.filter(c => {
    const q = search.toLowerCase()
    if (q && !c.empName.toLowerCase().includes(q) && !c.ref.toLowerCase().includes(q)) return false
    if (typeFilter !== 'all' && c.type !== typeFilter) return false
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    return true
  })

  const counts = {
    pending:  CHANGES.filter(c => c.status === 'Pending').length,
    approved: CHANGES.filter(c => c.status === 'Approved').length,
    rejected: CHANGES.filter(c => c.status === 'Rejected').length,
  }

  return (
    <AppShell breadcrumbs={[{ label: 'Human Resources', href: '/admin/hr/employees' }, { label: 'Personnel Changes' }]}>
      <PageHeader
        title="Personnel Changes"
        description="Track transfers, promotions, salary adjustments, and contract renewals · HRM-002"
        primaryAction={{ label: 'New Change Request', icon: <Plus className="w-3.5 h-3.5" /> }}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Pending Review', count: counts.pending,  icon: Clock,        color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200' },
          { label: 'Approved',       count: counts.approved, icon: Check,        color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'Rejected',       count: counts.rejected, icon: AlertCircle,  color: 'text-red-600',     bg: 'bg-red-50 border-red-200' },
        ].map(({ label, count, icon: Icon, color, bg }) => (
          <div key={label} className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${bg}`}>
            <Icon className={`w-5 h-5 flex-shrink-0 ${color}`} />
            <div>
              <p className="text-xl font-bold text-foreground">{count}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input className="pl-8 h-8 text-xs w-64" placeholder="Search name or reference..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-8 text-xs w-44"><SelectValue placeholder="Change Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Types</SelectItem>
            {['Transfer','Promotion','Title Change','Salary Adjustment','Contract Renewal'].map(t => (
              <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 text-xs w-32"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Status</SelectItem>
            {['Pending','Approved','Rejected'].map(s => (
              <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || typeFilter !== 'all' || statusFilter !== 'all') && (
          <button className="text-xs text-primary hover:underline flex items-center gap-1" onClick={() => { setSearch(''); setTypeFilter('all'); setStatusFilter('all') }}>
            <X className="w-3 h-3" />Clear
          </button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} records</span>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Reference', 'Employee', 'Change Type', 'From', 'To', 'Effective Date', 'Requested By', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.ref} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{row.ref}</td>
                  <td className="px-3 py-2">
                    <p className="font-medium text-foreground">{row.empName}</p>
                    <p className="text-[10px] text-muted-foreground">{row.empCode}</p>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[row.type]}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground max-w-[140px] truncate" title={row.fromVal}>{row.fromVal}</td>
                  <td className="px-3 py-2 text-foreground font-medium max-w-[140px] truncate" title={row.toVal}>{row.toVal}</td>
                  <td className="px-3 py-2 tabular-nums text-muted-foreground">{row.effectiveDate}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row.requestedBy}</td>
                  <td className="px-3 py-2"><StatusBadge status={row.status} /></td>
                  <td className="px-3 py-2">
                    <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary"><Eye className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  )
}
