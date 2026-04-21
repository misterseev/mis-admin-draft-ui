'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Plus, Search, X, Eye } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { WorkflowStepper } from '@/components/mis/WorkflowStepper'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePRStore } from '@/lib/stores/prStore'

const WORKFLOW_STEPS = ['Raised', 'Authorization', 'Budget Check', 'Director Approval', 'Procurement']


export default function PurchasingPage() {
  const { prs } = usePRStore()
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deptFilter, setDeptFilter]   = useState('all')

  const filtered = prs.filter(pr => {
    const q = search.toLowerCase()
    if (q && !pr.title.toLowerCase().includes(q) && !pr.ref.toLowerCase().includes(q)) return false
    if (statusFilter !== 'all' && pr.status !== statusFilter) return false
    if (deptFilter !== 'all' && pr.dept !== deptFilter) return false
    return true
  })

  const departments = [...new Set(prs.map(p => p.dept))].sort()

  return (
    <AppShell breadcrumbs={[{ label: 'Inventory', href: '/admin/inventory' }, { label: 'Purchasing' }]}>
      <PageHeader
        title="Purchase Requisitions"
        titleLao="ໃບຂໍຊື້"
        description="Raise and track purchase requisitions through the approval workflow · INV-002"
        primaryAction={{ label: 'New Requisition', icon: <Plus className="w-3.5 h-3.5" />, href: '/admin/inventory/purchasing/new' }}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Pending Approval', value: prs.filter(p => p.status === 'Pending').length,   color: 'text-amber-600' },
          { label: 'Approved (Month)', value: prs.filter(p => p.status === 'Approved').length,  color: 'text-emerald-600' },
          { label: 'Completed',        value: prs.filter(p => p.status === 'Completed').length, color: 'text-primary' },
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
          <Input className="pl-8 h-8 text-xs w-64" placeholder="Search title or reference…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="h-8 text-xs w-36"><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Departments</SelectItem>
            {departments.map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 text-xs w-32"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All</SelectItem>
            {['Draft', 'Pending', 'Approved', 'Rejected', 'Completed'].map(s => (
              <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || statusFilter !== 'all' || deptFilter !== 'all') && (
          <button className="text-xs text-primary hover:underline flex items-center gap-1"
            onClick={() => { setSearch(''); setStatusFilter('all'); setDeptFilter('all') }}>
            <X className="w-3 h-3" />Clear
          </button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} requisition{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Reference', 'Title', 'Department', 'Requested By', 'Items', 'Total Amount', 'Date Raised', 'Required By', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-center text-muted-foreground">No requisitions found.</td>
              </tr>
            ) : filtered.map(pr => {
              const total = pr.items.reduce((a, i) => a + i.price * i.qty, 0)
              return (
                <tr key={pr.ref} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/inventory/purchasing/${encodeURIComponent(pr.ref)}`}
                      className="font-mono text-[10px] text-primary hover:underline"
                    >
                      {pr.ref}
                    </Link>
                  </td>
                  <td className="px-3 py-2 font-medium text-foreground max-w-45 truncate">{pr.title}</td>
                  <td className="px-3 py-2 text-muted-foreground">{pr.dept}</td>
                  <td className="px-3 py-2 text-muted-foreground">{pr.requestedBy}</td>
                  <td className="px-3 py-2 tabular-nums text-center">{pr.items.length}</td>
                  <td className="px-3 py-2 tabular-nums font-semibold">LAK {total.toLocaleString()}</td>
                  <td className="px-3 py-2 tabular-nums text-muted-foreground">{pr.dateRaised}</td>
                  <td className="px-3 py-2 tabular-nums text-muted-foreground">{pr.requiredBy}</td>
                  <td className="px-3 py-2"><StatusBadge status={pr.status} /></td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/inventory/purchasing/${encodeURIComponent(pr.ref)}`}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary inline-flex"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
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
