'use client'

import { useState } from 'react'
import { Plus, Search, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { Input } from '@/components/ui/input'

interface GoodsReceipt {
  ref: string
  poRef: string
  supplier: string
  items: number
  receivedBy: string
  receivedDate: string
  invoiceNo: string
  totalValue: string
  qcStatus: 'Passed' | 'Failed' | 'Pending'
  status: 'Completed' | 'Partial' | 'Pending'
}

const RECEIPTS: GoodsReceipt[] = [
  { ref: 'GRN-2026-0071', poRef: 'PO-2026-0110', supplier: 'Lao Medical Supplies Co.',  items: 14, receivedBy: 'Bounmy K.', receivedDate: '19/04/2026', invoiceNo: 'LMS-INV-4421', totalValue: 'LAK 26,800,000', qcStatus: 'Passed',  status: 'Completed' },
  { ref: 'GRN-2026-0070', poRef: 'PO-2026-0108', supplier: 'BPKP Stationery Ltd.',      items: 8,  receivedBy: 'Vilay S.',  receivedDate: '18/04/2026', invoiceNo: 'BPK-2264',     totalValue: 'LAK 3,100,000',  qcStatus: 'Passed',  status: 'Completed' },
  { ref: 'GRN-2026-0069', poRef: 'PO-2026-0105', supplier: 'DiagnoTech Asia',            items: 20, receivedBy: 'Bounmy K.', receivedDate: '15/04/2026', invoiceNo: 'DTA-8890',     totalValue: 'LAK 43,200,000', qcStatus: 'Passed',  status: 'Partial'   },
  { ref: 'GRN-2026-0068', poRef: 'PO-2026-0103', supplier: 'IT World Lao',              items: 3,  receivedBy: 'Sombath I.',receivedDate: '12/04/2026', invoiceNo: 'ITW-0981',     totalValue: 'LAK 11,900,000', qcStatus: 'Pending', status: 'Pending'   },
  { ref: 'GRN-2026-0067', poRef: 'PO-2026-0100', supplier: 'Lao Medical Supplies Co.',  items: 18, receivedBy: 'Bounmy K.', receivedDate: '10/04/2026', invoiceNo: 'LMS-INV-4398', totalValue: 'LAK 8,600,000',  qcStatus: 'Failed',  status: 'Completed' },
  { ref: 'GRN-2026-0066', poRef: 'PO-2026-0098', supplier: 'Vientiane Hardware Supply', items: 11, receivedBy: 'Vilay S.',  receivedDate: '08/04/2026', invoiceNo: 'VHS-1120',     totalValue: 'LAK 6,200,000',  qcStatus: 'Passed',  status: 'Completed' },
  { ref: 'GRN-2026-0065', poRef: 'PO-2026-0095', supplier: 'CleanPro Lao',              items: 9,  receivedBy: 'Bounmy K.', receivedDate: '05/04/2026', invoiceNo: 'CP-0558',      totalValue: 'LAK 2,050,000',  qcStatus: 'Passed',  status: 'Completed' },
]

const QC_COLORS: Record<string, string> = {
  Passed:  'text-emerald-600 bg-emerald-50',
  Failed:  'text-red-600 bg-red-50',
  Pending: 'text-amber-600 bg-amber-50',
}

export default function ReceivingPage() {
  const [search, setSearch] = useState('')

  const filtered = RECEIPTS.filter(r => {
    const q = search.toLowerCase()
    return !q || r.ref.toLowerCase().includes(q) || r.supplier.toLowerCase().includes(q)
  })

  return (
    <AppShell breadcrumbs={[{ label: 'Inventory', href: '/admin/inventory' }, { label: 'Goods Receiving' }]}>
      <PageHeader
        title="Goods Receiving"
        titleLao="ການຮັບສິນຄ້າ"
        description="Record and quality-check goods received against purchase orders · INV-003"
        primaryAction={{ label: '+ New Receipt', icon: <Plus className="w-3.5 h-3.5" />, href: '/admin/inventory/receiving/new' }}
      />

      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Receipts This Month', value: RECEIPTS.length,                                           color: 'text-foreground' },
          { label: 'QC Passed',           value: RECEIPTS.filter(r => r.qcStatus === 'Passed').length,      color: 'text-emerald-600' },
          { label: 'QC Failed',           value: RECEIPTS.filter(r => r.qcStatus === 'Failed').length,      color: 'text-red-600' },
          { label: 'Total Value Received', value: 'LAK 101.9M',                                            color: 'text-primary' },
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
          <Input className="pl-8 h-8 text-xs w-64" placeholder="Search GRN or supplier..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} receipts</span>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['GRN Ref','PO Reference','Supplier','Items','Received By','Date','Invoice No.','Total Value','QC','Status',''].map(h => (
                <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.ref} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-3 py-2">
                  <Link href={`/admin/inventory/receiving/${encodeURIComponent(row.ref)}`} className="font-mono text-[10px] text-primary hover:underline">
                    {row.ref}
                  </Link>
                </td>
                <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{row.poRef}</td>
                <td className="px-3 py-2 font-medium text-foreground">{row.supplier}</td>
                <td className="px-3 py-2 tabular-nums text-center">{row.items}</td>
                <td className="px-3 py-2 text-muted-foreground">{row.receivedBy}</td>
                <td className="px-3 py-2 tabular-nums text-muted-foreground">{row.receivedDate}</td>
                <td className="px-3 py-2 text-muted-foreground">{row.invoiceNo}</td>
                <td className="px-3 py-2 tabular-nums font-semibold text-foreground">{row.totalValue}</td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${QC_COLORS[row.qcStatus]}`}>
                    {row.qcStatus === 'Passed' && <CheckCircle2 className="w-3 h-3" />}
                    {row.qcStatus === 'Failed' && <AlertCircle className="w-3 h-3" />}
                    {row.qcStatus}
                  </span>
                </td>
                <td className="px-3 py-2"><StatusBadge status={row.status} /></td>
                <td className="px-3 py-2">
                  <Link href={`/admin/inventory/receiving/${encodeURIComponent(row.ref)}`} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary inline-flex">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}
