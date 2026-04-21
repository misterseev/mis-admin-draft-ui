'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, CheckCircle2, Save, X } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

interface LineItem {
  id: string
  code: string
  name: string
  unit: string
  ordered: number
  received: number
  qc: 'Passed' | 'Failed' | 'Pending'
  remark: string
}

const PO_OPTIONS = [
  { ref: 'PO-2026-0142', supplier: 'Lao Medical Supplies Co.',   lines: [
    { code: 'ITM-MS-0042', name: 'Surgical Gloves (Medium)', unit: 'Box', ordered: 100 },
    { code: 'ITM-MS-0015', name: 'Syringe 5ml',              unit: 'Box', ordered: 50 },
    { code: 'ITM-MS-0055', name: 'IV Tubing Set',             unit: 'Piece', ordered: 200 },
  ]},
  { ref: 'PO-2026-0141', supplier: 'BPKP Stationery Ltd.',       lines: [
    { code: 'ITM-OF-0008', name: 'A4 Paper 80gsm',            unit: 'Pack', ordered: 80 },
  ]},
  { ref: 'PO-2026-0140', supplier: 'DiagnoTech Asia',            lines: [
    { code: 'ITM-LB-0012', name: 'Rapid Test Kit — Malaria',   unit: 'Kit', ordered: 120 },
  ]},
]

const uid = () => Math.random().toString(36).slice(2, 9)

export default function NewGRNPage() {
  const router = useRouter()
  const [poRef, setPoRef] = useState(PO_OPTIONS[0].ref)
  const [invoiceNo, setInvoiceNo] = useState('')
  const [receivedDate, setReceivedDate] = useState('2026-04-21')
  const [receivedBy, setReceivedBy] = useState('Bounmy K.')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<LineItem[]>(
    PO_OPTIONS[0].lines.map(l => ({ id: uid(), ...l, received: l.ordered, qc: 'Pending' as const, remark: '' }))
  )
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const handlePoChange = (ref: string) => {
    setPoRef(ref)
    const po = PO_OPTIONS.find(p => p.ref === ref)
    if (po) setItems(po.lines.map(l => ({ id: uid(), ...l, received: l.ordered, qc: 'Pending' as const, remark: '' })))
  }

  const updateItem = (id: string, patch: Partial<LineItem>) =>
    setItems(list => list.map(i => (i.id === id ? { ...i, ...patch } : i)))

  const supplier = PO_OPTIONS.find(p => p.ref === poRef)?.supplier ?? ''
  const completeness =
    items.length === 0 ? 0 :
    Math.round((items.reduce((a, i) => a + Math.min(i.received / Math.max(1, i.ordered), 1), 0) / items.length) * 100)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setDone(true)
      setTimeout(() => router.push('/admin/inventory/receiving'), 900)
    }, 500)
  }

  if (done) {
    return (
      <AppShell breadcrumbs={[{ label: 'Inventory', href: '/admin/inventory' }, { label: 'Goods Receiving', href: '/admin/inventory/receiving' }, { label: 'New Receipt' }]}>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-lg font-semibold">Goods Receipt Saved</h2>
          <p className="text-xs text-muted-foreground mt-1">Redirecting…</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      breadcrumbs={[
        { label: 'Inventory', href: '/admin/inventory' },
        { label: 'Goods Receiving', href: '/admin/inventory/receiving' },
        { label: 'New Receipt' },
      ]}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/inventory/receiving" className="p-1.5 rounded-md hover:bg-muted text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold">
              New Goods Receipt
              <span className="ml-2 text-sm font-normal text-muted-foreground">ບັນທຶກຮັບສິນຄ້າ</span>
            </h1>
            <p className="text-xs text-muted-foreground">Record receipt against a purchase order and run quality control</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground uppercase">Completeness</p>
          <p className="text-lg font-bold tabular-nums text-primary">{completeness}%</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 border-b border-border">
            Receipt Info / ຂໍ້ມູນການຮັບ
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs mb-1 block">
                Purchase Order <span className="text-destructive">*</span>
              </Label>
              <Select value={poRef} onValueChange={handlePoChange}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PO_OPTIONS.map(p => (
                    <SelectItem key={p.ref} value={p.ref} className="text-xs">
                      <span className="font-mono text-[10px] mr-2">{p.ref}</span>{p.supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-1 block">Supplier</Label>
              <Input className="h-8 text-xs" value={supplier} readOnly />
            </div>
            <div>
              <Label className="text-xs mb-1 block">
                Invoice No. <span className="text-destructive">*</span>
              </Label>
              <Input className="h-8 text-xs" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} placeholder="e.g. LMS-INV-4421" required />
            </div>
            <div>
              <Label className="text-xs mb-1 block">
                Received Date <span className="text-destructive">*</span>
              </Label>
              <Input type="date" className="h-8 text-xs" value={receivedDate} onChange={e => setReceivedDate(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Received By</Label>
              <Input className="h-8 text-xs" value={receivedBy} onChange={e => setReceivedBy(e.target.value)} />
            </div>
            <div />
            <div className="col-span-3">
              <Label className="text-xs mb-1 block">Notes / ໝາຍເຫດ</Label>
              <Textarea className="text-xs h-14 resize-none" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Observations about the delivery, packaging, etc." />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide">Line Items — Receive & QC</p>
            <p className="text-[10px] text-muted-foreground">{items.length} line(s) from {poRef}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Code', 'Item', 'Unit', 'Ordered', 'Received', 'QC Result', 'Remark'].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(r => {
                  const partial = r.received < r.ordered
                  const over = r.received > r.ordered
                  return (
                    <tr key={r.id} className="border-b border-border/50">
                      <td className="px-3 py-1.5 font-mono text-[10px]">{r.code}</td>
                      <td className="px-3 py-1.5">{r.name}</td>
                      <td className="px-3 py-1.5 text-muted-foreground">{r.unit}</td>
                      <td className="px-3 py-1.5 tabular-nums">{r.ordered}</td>
                      <td className="px-3 py-1.5">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            max={r.ordered}
                            className="h-7 text-xs w-20 tabular-nums"
                            value={r.received}
                            onChange={e => updateItem(r.id, { received: Math.max(0, Number(e.target.value) || 0) })}
                          />
                          {partial && <span className="text-[10px] text-amber-600">Partial</span>}
                          {over && <span className="text-[10px] text-destructive">Over</span>}
                        </div>
                      </td>
                      <td className="px-3 py-1.5">
                        <Select value={r.qc} onValueChange={v => updateItem(r.id, { qc: v as LineItem['qc'] })}>
                          <SelectTrigger className="h-7 text-xs w-28"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {['Passed', 'Failed', 'Pending'].map(q => (
                              <SelectItem key={q} value={q} className="text-xs">{q}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-3 py-1.5">
                        <Input
                          className="h-7 text-xs"
                          placeholder="Optional"
                          value={r.remark}
                          onChange={e => updateItem(r.id, { remark: e.target.value })}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
          <Link href="/admin/inventory/receiving">
            <Button type="button" variant="ghost" size="sm" className="text-xs h-8 gap-1">
              <X className="w-3.5 h-3.5" />Cancel
            </Button>
          </Link>
          <Button type="button" variant="outline" size="sm" className="text-xs h-8">Save Draft</Button>
          <Button type="submit" size="sm" className="text-xs h-8 gap-1" disabled={saving || !invoiceNo}>
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving…' : 'Post Receipt'}
          </Button>
        </div>
      </form>
    </AppShell>
  )
}
