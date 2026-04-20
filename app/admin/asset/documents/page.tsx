'use client'

import { FileText, Download, Eye } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'

const DOCS = [
  { ref: 'AST-DOC-2026-0031', name: 'Asset Verification Report Q1 2026',  type: 'Verification',      date: '31/03/2026', status: 'Final'   },
  { ref: 'AST-DOC-2026-0030', name: 'Depreciation Schedule FY 2026',      type: 'Depreciation',      date: '01/01/2026', status: 'Final'   },
  { ref: 'AST-DOC-2026-0029', name: 'Maintenance Contract — GE Healthcare',type: 'Service Contract',  date: '01/01/2026', status: 'Active'  },
  { ref: 'AST-DOC-2026-0028', name: 'Asset Transfer Form ATF-2026-0012',  type: 'Transfer',          date: '01/04/2026', status: 'Final'   },
  { ref: 'AST-DOC-2026-0027', name: 'Disposal Certificate AST-2019-0088', type: 'Disposal',          date: '28/03/2026', status: 'Final'   },
  { ref: 'AST-DOC-2026-0026', name: 'Annual Asset Inventory List 2025',   type: 'Inventory',         date: '31/12/2025', status: 'Final'   },
  { ref: 'AST-DOC-2026-0025', name: 'Insurance Policy — Medical Equip.',  type: 'Insurance',         date: '01/04/2026', status: 'Active'  },
]

const TYPE_COLORS: Record<string, string> = {
  'Verification':   'bg-blue-50 text-blue-700',
  'Depreciation':   'bg-purple-50 text-purple-700',
  'Service Contract':'bg-emerald-50 text-emerald-700',
  'Transfer':       'bg-amber-50 text-amber-700',
  'Disposal':       'bg-red-50 text-red-700',
  'Inventory':      'bg-slate-100 text-slate-700',
  'Insurance':      'bg-teal-50 text-teal-700',
}

export default function AssetDocumentsPage() {
  return (
    <AppShell breadcrumbs={[{ label: 'Asset', href: '/admin/asset' }, { label: 'Documents' }]}>
      <PageHeader
        title="Asset Documents"
        titleLao="ເອກະສານຊັບສິນ"
        description="Verification reports, contracts, depreciation schedules, and certificates · AST-003"
      />

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Reference','Document Name','Type','Date','Status','Actions'].map(h => (
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
                    <FileText className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium">{doc.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[doc.type] ?? 'bg-slate-100'}`}>
                    {doc.type}
                  </span>
                </td>
                <td className="px-3 py-2 tabular-nums text-muted-foreground">{doc.date}</td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${doc.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
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
