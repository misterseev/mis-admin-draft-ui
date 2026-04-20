'use client'

import { useState } from 'react'
import { FileText, Download, Eye, Plus, Search, X } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type DocType = 'Appointment Letter' | 'Contract' | 'Promotion Letter' | 'Transfer Order' | 'Certificate' | 'ID Card'

interface HRDoc {
  ref: string
  empName: string
  empCode: string
  type: DocType
  issueDate: string
  expiryDate?: string
  issuedBy: string
  pages: number
}

const DOCS: HRDoc[] = [
  { ref: 'DOC-HR-2026-0088', empName: 'Somsak Phommachanh',   empCode: 'EMP-2024-0142', type: 'Appointment Letter', issueDate: '15/03/2019', issuedBy: 'HR Director',  pages: 2 },
  { ref: 'DOC-HR-2026-0087', empName: 'Noy Silavong',         empCode: 'EMP-2023-0098', type: 'Contract',          issueDate: '01/06/2023', expiryDate: '31/05/2026', issuedBy: 'HR Director',  pages: 6 },
  { ref: 'DOC-HR-2026-0086', empName: 'Khamla Boupha',        empCode: 'EMP-2022-0055', type: 'Promotion Letter',  issueDate: '01/01/2024', issuedBy: 'HR Director',  pages: 1 },
  { ref: 'DOC-HR-2026-0085', empName: 'Vilay Sengdara',       empCode: 'EMP-2021-0033', type: 'Transfer Order',    issueDate: '01/04/2026', issuedBy: 'MOH Circular', pages: 3 },
  { ref: 'DOC-HR-2026-0084', empName: 'Phonsa Luangrath',     empCode: 'EMP-2020-0019', type: 'Contract',          issueDate: '01/02/2026', expiryDate: '31/01/2029', issuedBy: 'HR Director',  pages: 5 },
  { ref: 'DOC-HR-2026-0083', empName: 'Bounmy Keovixay',      empCode: 'EMP-2019-0012', type: 'Certificate',       issueDate: '10/03/2026', issuedBy: 'MoH',          pages: 1 },
  { ref: 'DOC-HR-2026-0082', empName: 'Dalavanh Phommavong',  empCode: 'EMP-2018-0008', type: 'ID Card',           issueDate: '01/01/2026', expiryDate: '31/12/2028', issuedBy: 'HR Dept',      pages: 1 },
  { ref: 'DOC-HR-2026-0081', empName: 'Sombath Inthavong',    empCode: 'EMP-2024-0201', type: 'Appointment Letter', issueDate: '05/04/2024', issuedBy: 'HR Director',  pages: 2 },
  { ref: 'DOC-HR-2026-0080', empName: 'Khamthavy Vongsavan',  empCode: 'EMP-2017-0005', type: 'Contract',          issueDate: '01/01/2026', expiryDate: '31/12/2028', issuedBy: 'MOH',          pages: 8 },
  { ref: 'DOC-HR-2026-0079', empName: 'Ladavanh Inthasith',   empCode: 'EMP-2022-0089', type: 'Promotion Letter',  issueDate: '01/04/2026', issuedBy: 'HR Director',  pages: 1 },
]

const TYPE_COLORS: Record<DocType, string> = {
  'Appointment Letter': 'bg-blue-50 text-blue-700',
  'Contract':           'bg-emerald-50 text-emerald-700',
  'Promotion Letter':   'bg-purple-50 text-purple-700',
  'Transfer Order':     'bg-amber-50 text-amber-700',
  'Certificate':        'bg-teal-50 text-teal-700',
  'ID Card':            'bg-slate-100 text-slate-700',
}

export default function HRDocumentsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filtered = DOCS.filter(d => {
    const q = search.toLowerCase()
    if (q && !d.empName.toLowerCase().includes(q) && !d.ref.toLowerCase().includes(q)) return false
    if (typeFilter !== 'all' && d.type !== typeFilter) return false
    return true
  })

  return (
    <AppShell breadcrumbs={[{ label: 'Human Resources', href: '/admin/hr/employees' }, { label: 'Documents' }]}>
      <PageHeader
        title="HR Documents"
        titleLao="ເອກະສານ HR"
        description="Manage employment documents, contracts, and letters · HRM-004"
        primaryAction={{ label: '+ Issue Document', icon: <Plus className="w-3.5 h-3.5" /> }}
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Total Documents',    value: DOCS.length,                                          color: 'text-foreground' },
          { label: 'Contracts Active',   value: DOCS.filter(d => d.type === 'Contract').length,       color: 'text-emerald-600' },
          { label: 'Expiring (90 days)', value: 2,                                                    color: 'text-amber-600' },
          { label: 'Issued This Month',  value: DOCS.filter(d => d.issueDate.includes('2026')).length, color: 'text-primary' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input className="pl-8 h-8 text-xs w-64" placeholder="Search employee or document ref..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-8 text-xs w-44"><SelectValue placeholder="Document Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Types</SelectItem>
            {['Appointment Letter','Contract','Promotion Letter','Transfer Order','Certificate','ID Card'].map(t => (
              <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || typeFilter !== 'all') && (
          <button className="text-xs text-primary hover:underline flex items-center gap-1" onClick={() => { setSearch(''); setTypeFilter('all') }}>
            <X className="w-3 h-3" />Clear
          </button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} documents</span>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Document Ref','Employee','Document Type','Issue Date','Expiry Date','Issued By','Pages','Actions'].map(h => (
                <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(doc => (
              <tr key={doc.ref} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="font-mono text-[10px] text-muted-foreground">{doc.ref}</span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <p className="font-medium">{doc.empName}</p>
                  <p className="text-[10px] text-muted-foreground">{doc.empCode}</p>
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[doc.type]}`}>
                    {doc.type}
                  </span>
                </td>
                <td className="px-3 py-2 tabular-nums text-muted-foreground">{doc.issueDate}</td>
                <td className="px-3 py-2 tabular-nums text-muted-foreground">{doc.expiryDate ?? '—'}</td>
                <td className="px-3 py-2 text-muted-foreground">{doc.issuedBy}</td>
                <td className="px-3 py-2 tabular-nums text-muted-foreground">{doc.pages}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Download className="w-3.5 h-3.5" /></button>
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
