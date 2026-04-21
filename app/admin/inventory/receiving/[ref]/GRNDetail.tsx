'use client'

import Link from 'next/link'
import { ArrowLeft, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { StatusBadge } from '@/components/mis/StatusBadge'

interface GoodsReceipt {
  ref: string
  poRef: string
  supplier: string
  receivedBy: string
  receivedDate: string
  invoiceNo: string
  totalValue: string
  qcStatus: 'Passed' | 'Failed' | 'Pending'
  status: 'Completed' | 'Partial' | 'Pending'
  notes?: string
  lines: { code: string; name: string; unit: string; ordered: number; received: number; qc: 'Passed' | 'Failed' | 'Pending'; remark: string }[]
}

const RECEIPTS: Record<string, GoodsReceipt> = {
  'GRN-2026-0071': {
    ref: 'GRN-2026-0071', poRef: 'PO-2026-0110', supplier: 'Lao Medical Supplies Co.',
    receivedBy: 'Bounmy K.', receivedDate: '19/04/2026', invoiceNo: 'LMS-INV-4421',
    totalValue: 'LAK 26,800,000', qcStatus: 'Passed', status: 'Completed',
    notes: 'All items received in good condition. Delivery on time.',
    lines: [
      { code: 'ITM-MS-0042', name: 'Surgical Gloves (Medium)', unit: 'Box',   ordered: 100, received: 100, qc: 'Passed', remark: '' },
      { code: 'ITM-MS-0015', name: 'Syringe 5ml',              unit: 'Box',   ordered: 50,  received: 50,  qc: 'Passed', remark: '' },
      { code: 'ITM-MS-0055', name: 'IV Tubing Set',             unit: 'Piece', ordered: 200, received: 200, qc: 'Passed', remark: '' },
    ],
  },
  'GRN-2026-0070': {
    ref: 'GRN-2026-0070', poRef: 'PO-2026-0108', supplier: 'BPKP Stationery Ltd.',
    receivedBy: 'Vilay S.', receivedDate: '18/04/2026', invoiceNo: 'BPK-2264',
    totalValue: 'LAK 3,100,000', qcStatus: 'Passed', status: 'Completed',
    lines: [
      { code: 'ITM-OF-0008', name: 'A4 Paper 80gsm', unit: 'Pack', ordered: 80, received: 80, qc: 'Passed', remark: '' },
    ],
  },
  'GRN-2026-0069': {
    ref: 'GRN-2026-0069', poRef: 'PO-2026-0105', supplier: 'DiagnoTech Asia',
    receivedBy: 'Bounmy K.', receivedDate: '15/04/2026', invoiceNo: 'DTA-8890',
    totalValue: 'LAK 43,200,000', qcStatus: 'Passed', status: 'Partial',
    notes: 'Only 85 of 120 kits received. Remaining 35 on backorder — expected 01/05/2026.',
    lines: [
      { code: 'ITM-LB-0012', name: 'Rapid Test Kit — Malaria', unit: 'Kit', ordered: 120, received: 85, qc: 'Passed', remark: 'Partial — 35 on backorder' },
    ],
  },
  'GRN-2026-0067': {
    ref: 'GRN-2026-0067', poRef: 'PO-2026-0100', supplier: 'Lao Medical Supplies Co.',
    receivedBy: 'Bounmy K.', receivedDate: '10/04/2026', invoiceNo: 'LMS-INV-4398',
    totalValue: 'LAK 8,600,000', qcStatus: 'Failed', status: 'Completed',
    notes: 'QC failed — packaging damaged on 12 boxes. Supplier notified for credit note.',
    lines: [
      { code: 'ITM-MS-0033', name: 'Bed Sheet (White)', unit: 'Piece', ordered: 100, received: 100, qc: 'Failed', remark: '12 boxes damaged packaging' },
    ],
  },
}

const QC_CONFIG = {
  Passed:  { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  Failed:  { icon: AlertCircle,  color: 'text-red-600',     bg: 'bg-red-50 border-red-200'         },
  Pending: { icon: Clock,        color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200'     },
}

export default function GRNDetail({ refno }: { refno: string }) {
  const grn = RECEIPTS[decodeURIComponent(refno)]

  if (!grn) {
    return (
      <AppShell breadcrumbs={[{ label: 'Inventory', href: '/admin/inventory' }, { label: 'Goods Receiving', href: '/admin/inventory/receiving' }, { label: refno }]}>
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <p className="text-sm font-medium">Receipt not found</p>
          <Link href="/admin/inventory/receiving" className="text-xs text-primary hover:underline mt-2">← Back to list</Link>
        </div>
      </AppShell>
    )
  }

  const qc = QC_CONFIG[grn.qcStatus]
  const QCIcon = qc.icon
  const completeness = Math.round(
    (grn.lines.reduce((a, l) => a + Math.min(l.received / Math.max(1, l.ordered), 1), 0) / grn.lines.length) * 100
  )

  return (
    <AppShell
      breadcrumbs={[
        { label: 'Inventory', href: '/admin/inventory' },
        { label: 'Goods Receiving', href: '/admin/inventory/receiving' },
        { label: grn.ref },
      ]}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/inventory/receiving" className="p-1.5 rounded-md hover:bg-muted text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold">Goods Receipt</h1>
              <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">{grn.ref}</span>
              <StatusBadge status={grn.status} />
              <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${qc.bg} ${qc.color}`}>
                <QCIcon className="w-3 h-3" />{grn.qcStatus}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Supplier: <span className="font-medium">{grn.supplier}</span> ·
              PO: <span className="font-mono">{grn.poRef}</span> ·
              Received: <span className="font-medium">{grn.receivedDate}</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground uppercase">Completeness</p>
          <p className="text-2xl font-bold tabular-nums text-primary">{completeness}%</p>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Main */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Meta */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 border-b border-border">Receipt Details</h3>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {[
                ['GRN Reference', grn.ref],
                ['PO Reference',  grn.poRef],
                ['Supplier',      grn.supplier],
                ['Invoice No.',   grn.invoiceNo],
                ['Received By',   grn.receivedBy],
                ['Received Date', grn.receivedDate],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-[10px] text-muted-foreground uppercase">{l}</p>
                  <p className="font-medium">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {grn.notes && (
            <div className="bg-muted/40 border border-border rounded-lg px-4 py-2.5">
              <p className="text-[10px] text-muted-foreground uppercase font-medium mb-0.5">Notes</p>
              <p className="text-xs">{grn.notes}</p>
            </div>
          )}

          {/* Line items */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border">
              <p className="text-xs font-semibold uppercase tracking-wide">Line Items — Received &amp; QC</p>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Code', 'Item', 'Unit', 'Ordered', 'Received', 'Variance', 'QC', 'Remark'].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grn.lines.map(line => {
                  const variance = line.received - line.ordered
                  const lineQC = QC_CONFIG[line.qc]
                  const LineQCIcon = lineQC.icon
                  return (
                    <tr key={line.code} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="px-3 py-1.5 font-mono text-[10px]">{line.code}</td>
                      <td className="px-3 py-1.5 font-medium">{line.name}</td>
                      <td className="px-3 py-1.5 text-muted-foreground">{line.unit}</td>
                      <td className="px-3 py-1.5 tabular-nums">{line.ordered}</td>
                      <td className="px-3 py-1.5 tabular-nums font-semibold">{line.received}</td>
                      <td className="px-3 py-1.5 tabular-nums">
                        <span className={variance < 0 ? 'text-amber-600' : variance > 0 ? 'text-destructive' : 'text-muted-foreground'}>
                          {variance > 0 ? `+${variance}` : variance === 0 ? '—' : variance}
                        </span>
                      </td>
                      <td className="px-3 py-1.5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium border ${lineQC.bg} ${lineQC.color}`}>
                          <LineQCIcon className="w-2.5 h-2.5" />{line.qc}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-muted-foreground text-[10px]">{line.remark || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="w-52 shrink-0">
          <div className="bg-card border border-border rounded-lg p-3 space-y-2 text-xs">
            <p className="font-semibold uppercase text-[10px] tracking-wide text-muted-foreground">Summary</p>
            {[
              ['Total Value',   grn.totalValue],
              ['Line Items',    String(grn.lines.length)],
              ['Received By',   grn.receivedBy],
              ['Invoice No.',   grn.invoiceNo],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between">
                <span className="text-muted-foreground">{l}</span>
                <span className="font-medium text-right max-w-[120px] truncate">{v}</span>
              </div>
            ))}
            <div className="flex justify-between pt-1 border-t border-border">
              <span className="text-muted-foreground">Status</span>
              <StatusBadge status={grn.status} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">QC Result</span>
              <span className={`font-medium ${qc.color}`}>{grn.qcStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
