'use client'

import { FileText, Download, Eye } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'

const DOCS = [
  { ref: 'INV-DOC-2026-0041', name: 'Purchase Order PO-2026-0142',   type: 'Purchase Order',  date: '18/04/2026', value: 'LAK 28,500,000',  status: 'Pending'   },
  { ref: 'INV-DOC-2026-0040', name: 'Goods Receipt GRN-2026-0071',   type: 'Goods Receipt',   date: '19/04/2026', value: 'LAK 26,800,000',  status: 'Completed' },
  { ref: 'INV-DOC-2026-0039', name: 'Stock Adjustment ADJ-2026-009', type: 'Adjustment',      date: '17/04/2026', value: '— ',               status: 'Completed' },
  { ref: 'INV-DOC-2026-0038', name: 'Purchase Order PO-2026-0140',   type: 'Purchase Order',  date: '15/04/2026', value: 'LAK 45,800,000',  status: 'Approved'  },
  { ref: 'INV-DOC-2026-0037', name: 'Goods Receipt GRN-2026-0069',   type: 'Goods Receipt',   date: '15/04/2026', value: 'LAK 43,200,000',  status: 'Partial'   },
  { ref: 'INV-DOC-2026-0036', name: 'Purchase Order PO-2026-0139',   type: 'Purchase Order',  date: '14/04/2026', value: 'LAK 12,200,000',  status: 'Pending'   },
  { ref: 'INV-DOC-2026-0035', name: 'Quarterly Inventory Report Q1', type: 'Inventory Report',date: '31/03/2026', value: '—',                status: 'Completed' },
  { ref: 'INV-DOC-2026-0034', name: 'Stock Count Sheet — March',     type: 'Stock Count',     date: '28/03/2026', value: '—',                status: 'Completed' },
]

const TYPE_COLORS: Record<string, string> = {
  'Purchase Order':  'bg-blue-50 text-blue-700',
  'Goods Receipt':   'bg-emerald-50 text-emerald-700',
  'Adjustment':      'bg-amber-50 text-amber-700',
  'Inventory Report':'bg-purple-50 text-purple-700',
  'Stock Count':     'bg-slate-100 text-slate-700',
}
const STATUS_COLORS: Record<string, string> = {
  Pending:   'bg-amber-50 text-amber-700',
  Approved:  'bg-blue-50 text-blue-700',
  Completed: 'bg-emerald-50 text-emerald-700',
  Partial:   'bg-orange-50 text-orange-700',
}

export default function InventoryDocumentsPage() {
  return (
    <AppShell breadcrumbs={[{ label: 'Inventory', href: '/admin/inventory' }, { label: 'Documents' }]}>
      <PageHeader
        title="Inventory Documents"
        titleLao="ເອກະສານສາງ"
        description="Purchase orders, goods receipts, adjustments, and reports · INV-005"
      />

      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Total Documents',    value: DOCS.length,                                                color: 'text-foreground' },
          { label: 'Purchase Orders',    value: DOCS.filter(d => d.type === 'Purchase Order').length,       color: 'text-blue-600'   },
          { label: 'Goods Receipts',     value: DOCS.filter(d => d.type === 'Goods Receipt').length,       color: 'text-emerald-600'},
          { label: 'Pending Action',     value: DOCS.filter(d => d.status === 'Pending').length,           color: 'text-amber-600'  },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Reference','Document Name','Type','Date','Value','Status','Actions'].map(h => (
                <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DOCS.map(doc => (
              <tr key={doc.ref} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{doc.ref}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="font-medium">{doc.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[doc.type] ?? 'bg-slate-100'}`}>
                    {doc.type}
                  </span>
                </td>
                <td className="px-3 py-2 tabular-nums text-muted-foreground">{doc.date}</td>
                <td className="px-3 py-2 tabular-nums text-foreground">{doc.value}</td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${STATUS_COLORS[doc.status] ?? 'bg-slate-100'}`}>
                    {doc.status}
                  </span>
                </td>
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
