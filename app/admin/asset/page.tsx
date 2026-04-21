'use client'

import { useState } from 'react'
import { Plus, Search, X, Eye, Edit, QrCode } from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAssetStore, fmtLak } from '@/lib/stores/assetStore'

const CAT_COLORS: Record<string, string> = {
  'Medical Equipment': 'bg-blue-50 text-blue-700',
  'IT Equipment':      'bg-indigo-50 text-indigo-700',
  'Vehicles':          'bg-amber-50 text-amber-700',
  'Facility':          'bg-emerald-50 text-emerald-700',
}

export default function AssetMasterPage() {
  const { assets } = useAssetStore()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = assets.filter(a => {
    const q = search.toLowerCase()
    if (q && !a.name.toLowerCase().includes(q) && !a.code.toLowerCase().includes(q)) return false
    if (catFilter !== 'all' && a.category !== catFilter) return false
    if (statusFilter !== 'all' && a.status !== statusFilter) return false
    return true
  })

  return (
    <AppShell breadcrumbs={[{ label: 'Asset', href: '/admin/asset' }, { label: 'Asset Register' }]}>
      <PageHeader
        title="Asset Register"
        titleLao="ທະບຽນຊັບສິນ"
        description="Register and track all hospital assets with depreciation · AST-001"
        primaryAction={{ label: 'Register Asset', icon: <Plus className="w-3.5 h-3.5" />, href: '/admin/asset/new' }}
      />

      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Total Assets',        value: assets.length,                                              color: 'text-foreground' },
          { label: 'Active',              value: assets.filter(a => a.status === 'Active').length,           color: 'text-emerald-600' },
          { label: 'Under Maintenance',   value: assets.filter(a => a.status === 'Under Maintenance').length, color: 'text-amber-600' },
          { label: 'Total Book Value',    value: fmtLak(assets.reduce((s, a) => s + a.bookValue, 0)),        color: 'text-primary'   },
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
          <Input className="pl-8 h-8 text-xs w-64" placeholder="Search asset name or code..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="h-8 text-xs w-44"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Categories</SelectItem>
            {['Medical Equipment','IT Equipment','Vehicles','Facility'].map(c => (
              <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 text-xs w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Status</SelectItem>
            {['Active','Under Maintenance','Disposed','Lost'].map(s => (
              <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || catFilter !== 'all' || statusFilter !== 'all') && (
          <button className="text-xs text-primary hover:underline flex items-center gap-1" onClick={() => { setSearch(''); setCatFilter('all'); setStatusFilter('all') }}>
            <X className="w-3 h-3" />Clear
          </button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} assets</span>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Asset Code','Name','Category','Brand','Serial No.','Department','Location','Purchase Date','Purchase Cost','Book Value','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.code} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-2 font-mono text-[10px] text-primary">{a.code}</td>
                  <td className="px-3 py-2 min-w-52">
                    <p className="font-medium">{a.name}</p>
                  </td>
                  <td className="px-3 py-2 min-w-32">
                    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${CAT_COLORS[a.category] ?? 'bg-slate-100'}`}>
                      {a.category}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{a.brand}</td>
                  <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{a.serialNo}</td>
                  <td className="px-3 py-2 text-muted-foreground">{a.dept}</td>
                  <td className="px-3 py-2 text-muted-foreground">{a.location}</td>
                  <td className="px-3 py-2 tabular-nums text-muted-foreground">{a.purchaseDate}</td>
                  <td className="px-3 py-2 tabular-nums text-foreground">{fmtLak(a.purchaseCost)}</td>
                  <td className="px-3 py-2 tabular-nums font-semibold text-foreground">{fmtLak(a.bookValue)}</td>
                  <td className="px-3 py-2"><StatusBadge status={a.status} /></td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/asset/${encodeURIComponent(a.code)}`} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary"><Eye className="w-3.5 h-3.5" /></Link>
                      <Link href={`/admin/asset/${encodeURIComponent(a.code)}/edit`} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Edit className="w-3.5 h-3.5" /></Link>
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><QrCode className="w-3.5 h-3.5" /></button>
                    </div>
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
