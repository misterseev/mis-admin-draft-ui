'use client'

import { useState } from 'react'
import { Plus, Search, X, Eye, Calendar } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

type LeaveType = 'Annual' | 'Sick' | 'Maternity' | 'Paternity' | 'Unpaid' | 'Study'

interface LeaveRequest {
  ref: string
  empCode: string
  empName: string
  dept: string
  type: LeaveType
  fromDate: string
  toDate: string
  days: number
  reason: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

const LEAVES: LeaveRequest[] = [
  { ref: 'LV-2026-0098', empCode: 'EMP-2016-0003', empName: 'Souliya Phetsomphou',    dept: 'Nursing',        type: 'Sick',      fromDate: '01/03/2026', toDate: '30/04/2026', days: 61, reason: 'Medical treatment', status: 'Approved' },
  { ref: 'LV-2026-0099', empCode: 'EMP-2021-0052', empName: 'Santisouk Luangkhot',    dept: 'Pharmacy',       type: 'Maternity', fromDate: '15/03/2026', toDate: '14/07/2026', days: 122, reason: 'Maternity leave', status: 'Approved' },
  { ref: 'LV-2026-0105', empCode: 'EMP-2023-0098', empName: 'Noy Silavong',           dept: 'HR',             type: 'Annual',    fromDate: '22/04/2026', toDate: '25/04/2026', days: 4, reason: 'Family event', status: 'Approved' },
  { ref: 'LV-2026-0107', empCode: 'EMP-2018-0008', empName: 'Dalavanh Phommavong',    dept: 'Finance',        type: 'Sick',      fromDate: '20/04/2026', toDate: '21/04/2026', days: 2, reason: 'Flu', status: 'Approved' },
  { ref: 'LV-2026-0110', empCode: 'EMP-2024-0201', empName: 'Sombath Inthavong',      dept: 'IT',             type: 'Annual',    fromDate: '28/04/2026', toDate: '02/05/2026', days: 5, reason: 'Personal travel', status: 'Pending' },
  { ref: 'LV-2026-0111', empCode: 'EMP-2022-0077', empName: 'Thongkham Phommasith',   dept: 'Administration', type: 'Annual',    fromDate: '05/05/2026', toDate: '09/05/2026', days: 5, reason: 'Renovation', status: 'Pending' },
  { ref: 'LV-2026-0112', empCode: 'EMP-2019-0025', empName: 'Ketsana Phommasack',     dept: 'IT',             type: 'Study',     fromDate: '10/05/2026', toDate: '20/05/2026', days: 11, reason: 'IT certification', status: 'Pending' },
  { ref: 'LV-2026-0088', empCode: 'EMP-2024-0142', empName: 'Somsak Phommachanh',     dept: 'Finance',        type: 'Annual',    fromDate: '25/04/2026', toDate: '25/04/2026', days: 1, reason: 'Bank visit', status: 'Pending' },
  { ref: 'LV-2026-0078', empCode: 'EMP-2020-0044', empName: 'Sengphet Southida',      dept: 'Nursing',        type: 'Annual',    fromDate: '10/04/2026', toDate: '11/04/2026', days: 2, reason: 'School enrollment', status: 'Rejected' },
  { ref: 'LV-2026-0066', empCode: 'EMP-2021-0060', empName: 'Khamphan Vongkhamphanh', dept: 'Lab',            type: 'Unpaid',    fromDate: '01/04/2026', toDate: '03/04/2026', days: 3, reason: 'Personal', status: 'Rejected' },
]

const TYPE_COLORS: Record<LeaveType, string> = {
  Annual:    'bg-blue-50 text-blue-700',
  Sick:      'bg-red-50 text-red-700',
  Maternity: 'bg-pink-50 text-pink-700',
  Paternity: 'bg-indigo-50 text-indigo-700',
  Unpaid:    'bg-slate-100 text-slate-700',
  Study:     'bg-emerald-50 text-emerald-700',
}

const LEAVE_BALANCES = [
  { name: 'Somsak Phommachanh',   annual: 15, used: 5,  sick: 30, sickUsed: 1  },
  { name: 'Noy Silavong',         annual: 15, used: 4,  sick: 30, sickUsed: 0  },
  { name: 'Khamla Boupha',        annual: 15, used: 12, sick: 30, sickUsed: 0  },
  { name: 'Vilay Sengdara',       annual: 15, used: 3,  sick: 30, sickUsed: 2  },
  { name: 'Phonsa Luangrath',     annual: 15, used: 7,  sick: 30, sickUsed: 3  },
]

export default function LeavePage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tab, setTab] = useState<'requests' | 'balance'>('requests')

  const filtered = LEAVES.filter(l => {
    const q = search.toLowerCase()
    if (q && !l.empName.toLowerCase().includes(q) && !l.ref.toLowerCase().includes(q)) return false
    if (typeFilter !== 'all' && l.type !== typeFilter) return false
    if (statusFilter !== 'all' && l.status !== statusFilter) return false
    return true
  })

  return (
    <AppShell breadcrumbs={[{ label: 'Human Resources', href: '/admin/hr/employees' }, { label: 'Leave Management' }]}>
      <PageHeader
        title="Leave Management"
        titleLao="ການຈັດການການລາ"
        description="Track and approve employee leave requests · HRM-003"
        primaryAction={{ label: '+ New Leave Request', icon: <Plus className="w-3.5 h-3.5" /> }}
      />

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Pending Requests', value: LEAVES.filter(l => l.status === 'Pending').length, color: 'text-amber-600' },
          { label: 'On Leave Today',   value: 3,  color: 'text-blue-600'    },
          { label: 'Approved (YTD)',   value: LEAVES.filter(l => l.status === 'Approved').length, color: 'text-emerald-600' },
          { label: 'Total Leave Days', value: LEAVES.reduce((s, l) => l.status === 'Approved' ? s + l.days : s, 0), color: 'text-foreground' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-3 border-b border-border">
        {(['requests', 'balance'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-medium capitalize border-b-2 transition-colors ${
              tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'requests' ? 'Leave Requests' : 'Leave Balance'}
          </button>
        ))}
      </div>

      {tab === 'requests' ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input className="pl-8 h-8 text-xs w-60" placeholder="Search name or reference..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-8 text-xs w-36"><SelectValue placeholder="Leave Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Types</SelectItem>
                {['Annual','Sick','Maternity','Paternity','Unpaid','Study'].map(t => (
                  <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 text-xs w-28"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All</SelectItem>
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
          <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Reference','Employee','Department','Leave Type','From','To','Days','Reason','Status',''].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => (
                  <tr key={row.ref} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{row.ref}</td>
                    <td className="px-3 py-2">
                      <p className="font-medium">{row.empName}</p>
                      <p className="text-[10px] text-muted-foreground">{row.empCode}</p>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{row.dept}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[row.type]}`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-3 py-2 tabular-nums text-muted-foreground">{row.fromDate}</td>
                    <td className="px-3 py-2 tabular-nums text-muted-foreground">{row.toDate}</td>
                    <td className="px-3 py-2 tabular-nums font-semibold text-foreground">{row.days}</td>
                    <td className="px-3 py-2 text-muted-foreground max-w-[140px] truncate">{row.reason}</td>
                    <td className="px-3 py-2"><StatusBadge status={row.status} /></td>
                    <td className="px-3 py-2">
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary"><Eye className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border">
            <p className="text-xs font-semibold text-foreground">Annual Leave Balance — FY 2026</p>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Employee','Annual Entitlement','Used','Remaining','Sick Entitlement','Sick Used','Sick Remaining'].map(h => (
                  <th key={h} className="text-left px-4 py-2 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LEAVE_BALANCES.map((b, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-4 py-2 font-medium">{b.name}</td>
                  <td className="px-4 py-2 tabular-nums">{b.annual} days</td>
                  <td className="px-4 py-2 tabular-nums text-red-600">{b.used} days</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Progress value={((b.annual - b.used) / b.annual) * 100} className="h-1.5 w-16" />
                      <span className="tabular-nums text-emerald-600 font-medium">{b.annual - b.used}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 tabular-nums">{b.sick} days</td>
                  <td className="px-4 py-2 tabular-nums text-red-600">{b.sickUsed}</td>
                  <td className="px-4 py-2 tabular-nums text-emerald-600 font-medium">{b.sick - b.sickUsed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  )
}
