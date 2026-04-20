'use client'

import { FileText, Download, Eye, Printer } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'

const DOCS = [
  { ref: 'PAY-DOC-2026-04-001', name: 'April 2026 Payslips',              period: 'April 2026',    type: 'Payslip',            format: 'PDF', generated: '30/04/2026' },
  { ref: 'PAY-DOC-2026-04-002', name: 'April 2026 Social Security Report', period: 'April 2026',    type: 'SS Report',          format: 'PDF', generated: '30/04/2026' },
  { ref: 'PAY-DOC-2026-04-003', name: 'April 2026 PIT Summary',           period: 'April 2026',    type: 'Tax Report',         format: 'Excel', generated: '30/04/2026' },
  { ref: 'PAY-DOC-2026-04-004', name: 'April 2026 Bank Transfer File',    period: 'April 2026',    type: 'Bank File',          format: 'CSV', generated: '30/04/2026' },
  { ref: 'PAY-DOC-2026-03-001', name: 'March 2026 Payslips',              period: 'March 2026',    type: 'Payslip',            format: 'PDF', generated: '31/03/2026' },
  { ref: 'PAY-DOC-2026-03-002', name: 'March 2026 Social Security Report', period: 'March 2026',   type: 'SS Report',          format: 'PDF', generated: '31/03/2026' },
  { ref: 'PAY-DOC-2026-03-003', name: 'March 2026 PIT Summary',           period: 'March 2026',    type: 'Tax Report',         format: 'Excel', generated: '31/03/2026' },
  { ref: 'PAY-DOC-2026-03-004', name: 'March 2026 Bank Transfer File',    period: 'March 2026',    type: 'Bank File',          format: 'CSV', generated: '31/03/2026' },
  { ref: 'PAY-DOC-2026-02-001', name: 'February 2026 Payslips',           period: 'February 2026', type: 'Payslip',            format: 'PDF', generated: '28/02/2026' },
  { ref: 'PAY-DOC-2026-01-001', name: 'Annual PIT Certificate 2025',      period: 'FY 2025',       type: 'Annual Tax Cert',    format: 'PDF', generated: '31/01/2026' },
]

const TYPE_COLORS: Record<string, string> = {
  'Payslip':          'bg-blue-50 text-blue-700',
  'SS Report':        'bg-emerald-50 text-emerald-700',
  'Tax Report':       'bg-red-50 text-red-700',
  'Bank File':        'bg-amber-50 text-amber-700',
  'Annual Tax Cert':  'bg-purple-50 text-purple-700',
}

const FORMAT_COLORS: Record<string, string> = {
  PDF:   'bg-red-50 text-red-600',
  Excel: 'bg-emerald-50 text-emerald-600',
  CSV:   'bg-slate-100 text-slate-600',
}

export default function PayrollDocumentsPage() {
  return (
    <AppShell breadcrumbs={[{ label: 'Payroll', href: '/admin/payroll' }, { label: 'Documents' }]}>
      <PageHeader
        title="Payroll Documents"
        titleLao="ເອກະສານເງິນເດືອນ"
        description="Payslips, tax reports, bank files, and social security reports · PAY-004"
      />

      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Total Documents',   value: DOCS.length,                                         color: 'text-foreground' },
          { label: 'Payslips Issued',   value: DOCS.filter(d => d.type === 'Payslip').length,       color: 'text-primary'   },
          { label: 'Tax Reports',       value: DOCS.filter(d => d.type.includes('Tax')).length,     color: 'text-red-600'   },
          { label: 'Bank Files Ready',  value: DOCS.filter(d => d.type === 'Bank File').length,     color: 'text-amber-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Reference','Document Name','Period','Type','Format','Generated','Actions'].map(h => (
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
                <td className="px-3 py-2 text-muted-foreground">{doc.period}</td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[doc.type] ?? 'bg-slate-100 text-slate-700'}`}>
                    {doc.type}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${FORMAT_COLORS[doc.format] ?? ''}`}>
                    {doc.format}
                  </span>
                </td>
                <td className="px-3 py-2 tabular-nums text-muted-foreground">{doc.generated}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Download className="w-3.5 h-3.5" /></button>
                    <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Printer className="w-3.5 h-3.5" /></button>
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
